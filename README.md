# DarkGPT

> Direct, private, unrestricted machine intelligence with minimal interference between you and the model.

DarkGPT is an enterprise-grade consumer AI chat platform built for systems engineers, security researchers, and builders who require unfiltered technical reasoning without patronizing lectures or arbitrary guardrails.

---

## 🌟 Key Features

- **Direct Reasoning Pipeline**: Pure prompt-to-model token generation without moralizing system preambles or evasive refusal loops.
- **Low-Latency Streaming**: Real-time SSE token stream directly rendered with syntax-highlighted code blocks, inline execution formats, and 1-click clipboard integration.
- **Client-Scoped Privacy**: Document-level boundaries backed by Cloud Firestore with strict user UID authorization rules.
- **Resilient Offline Cache**: Instant local state replication ensuring zero message loss during intermittent connectivity.
- **OLED Dark Aesthetic**: Editorial typography, titanium dividers, and obsidian surfaces engineered for distraction-free focus.
- **Frictionless Onboarding**: 1-click Anonymous Guest access with optional Email/Password authentication.

---

## 🏗️ Architecture

```
Browser Viewport
     ↓
DarkGPT Frontend (Next.js 15 + React 19 + Tailwind CSS)
     ↓
DarkGPT Application API (/api/chat, /api/health)
     ↓
Firebase Platform (Authentication & Firestore)
     ↓
Server-Side Model Adapter
     ↓
AI Reasoning Engine
```

All upstream inference endpoints and credentials remain strictly server-side. The client browser communicates solely with DarkGPT's own same-origin API routes.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x+ or 20.x+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/darkgpt.git
   cd darkgpt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Launch development server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` to interact with DarkGPT.

---

## 📖 Documentation

- [Architecture Overview](docs/architecture.md)
- [Model Adapter Layer](docs/model-adapter.md)
- [Deployment Guide](docs/deployment.md)
- [Security Specifications](docs/security.md)

---

## 📄 License

Proprietary & Confidential. Copyright © 2026 DarkGPT Platform. All rights reserved.
