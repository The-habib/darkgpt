import urllib.request
import urllib.error
import json
import time
import sys
import os

print("==================================================")
print("     DARKGPT SYSTEM VERIFICATION SUITE           ")
print("==================================================")

PASSED = 0
FAILED = 0

def assert_test(condition, name, details=""):
    global PASSED, FAILED
    if condition:
        print(f" [PASS] {name}")
        PASSED += 1
    else:
        print(f" [FAIL] {name}: {details}")
        FAILED += 1

# TEST 1: Model Server Health (Private Upstream via Local Proxy)
print("\n--- 1. Upstream Model Verification ---")
try:
    req = urllib.request.urlopen("http://localhost:8000/health", timeout=5)
    data = json.loads(req.read().decode("utf-8"))
    assert_test(data.get("status") == "healthy", "Upstream server reports healthy", f"status={data.get('status')}")
    assert_test("model" in data, "Upstream exposes model name", str(data))
except Exception as e:
    assert_test(False, "Upstream health check reachable", str(e))

# TEST 2: Direct Model Chat Completion
print("\n--- 2. Upstream Reasoning Verification ---")
try:
    payload = json.dumps({
        "messages": [{"role": "user", "content": "Respond with the word verified."}],
        "max_tokens": 10,
        "temperature": 0.1
    }).encode("utf-8")
    req = urllib.request.Request(
        "http://localhost:8000/v1/chat/completions",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req, timeout=15)
    body = json.loads(res.read().decode("utf-8"))
    choice = body.get("choices", [{}])[0].get("message", {}).get("content", "")
    assert_test(len(choice) > 0, "Model generated valid completion tokens", f"Choice: {choice}")
except Exception as e:
    assert_test(False, "Model completion execution", str(e))

# TEST 3: Static Security & Confidentiality Audit
print("\n--- 3. Confidentiality & Zero-Leak Audit ---")
FORBIDDEN_PATTERNS = [
    "molab", "coreweave", "rtx pro 6000", "blackwell", "marimo"
]

files_to_scan = [
    "README.md",
    "public/robots.txt",
    "public/sitemap.xml",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/components/Header.tsx",
    "src/components/Footer.tsx",
    "src/components/LandingHero.tsx",
    "src/components/ProductPreview.tsx",
    "src/components/FeatureGrid.tsx",
    "docs/architecture.md",
    "docs/model-adapter.md",
]

leak_found = False
for fpath in files_to_scan:
    full_path = os.path.join("/data/data/com.termux/files/home/darkgpt", fpath)
    if os.path.exists(full_path):
        content = open(full_path, "r", encoding="utf-8", errors="ignore").read().lower()
        for pat in FORBIDDEN_PATTERNS:
            if pat in content:
                print(f" [!] POTENTIAL LEAK DETECTED in {fpath}: '{pat}'")
                leak_found = True

assert_test(not leak_found, "Public files and client code are free of infrastructure disclosures")

# TEST 4: Firebase Configuration Sanity
print("\n--- 4. Firebase Configuration Audit ---")
rules_path = "/data/data/com.termux/files/home/darkgpt/firestore.rules"
if os.path.exists(rules_path):
    rules = open(rules_path).read()
    assert_test("allow read, write: if true" not in rules, "No publicly writable rules exist")
    assert_test("request.auth != null" in rules, "Authentication required for private access")
    assert_test("request.auth.uid == userId" in rules, "UID-scoped data boundary enforced")
else:
    assert_test(False, "firestore.rules exists")

print("\n==================================================")
print(f"SUMMARY: {PASSED} Passed, {FAILED} Failed")
print("==================================================")

if FAILED > 0:
    sys.exit(1)
