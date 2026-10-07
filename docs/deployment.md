# DarkGPT Deployment Guide

This guide describes deploying DarkGPT to production environments using Vercel and Firebase.

---

## 1. Firebase Deployment

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login and initialize:
   ```bash
   firebase login
   firebase use <project-id>
   ```

3. Deploy Firestore rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

---

## 2. Vercel Deployment

1. Connect the repository or use the Vercel CLI:
   ```bash
   vercel deploy --prod
   ```

2. Configure environment variables in the Vercel Project Settings:
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `MODEL_API_URL`
   - `MODEL_API_KEY`

3. Verify production deployment health at `/api/health`.
