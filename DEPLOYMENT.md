# Mi Tierra — Deployment Guide

Full walkthrough: Firebase project → Authentication → Firestore → Storage → live URL.

---

## Prerequisites

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Log in
firebase login

# Verify
firebase --version   # should be 13+
```

---

## Step 1 — Create a Firebase Project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Add project"**
3. Name it `mi-tierra` (or your preferred name)
4. Disable Google Analytics for now (you can enable later)
5. Click **"Create project"** — wait ~30 seconds

---

## Step 2 — Register a Web App

1. In your new project, click the **`</>`** (Web) icon on the overview page
2. App nickname: `mi-tierra-web`
3. Check **"Also set up Firebase Hosting"** ✓
4. Click **"Register app"**
5. **Copy the `firebaseConfig` object** — you'll need these values next

---

## Step 3 — Enable Authentication

1. Sidebar → **Build → Authentication → Get started**
2. **Sign-in method** tab → enable:
   - **Google** → toggle ON → set support email → Save
   - **Email/Password** → toggle ON → Save
3. **Authorized domains** tab → your production domain will be added automatically by App Hosting

---

## Step 4 — Create Firestore Database

1. Sidebar → **Build → Firestore Database → Create database**
2. Select **"Start in production mode"** (rules are deployed via CLI — see Step 8)
3. Choose the closest region to Ecuador:
   - Recommended: **`us-central1`** (Iowa) or **`southamerica-east1`** (São Paulo)
4. Click **"Done"**

---

## Step 5 — Create Storage Bucket

1. Sidebar → **Build → Storage → Get started**
2. **"Start in production mode"** → Next
3. Choose same region as Firestore → **Done**

---

## Step 6 — Fill in Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

### Client SDK keys (`NEXT_PUBLIC_FIREBASE_*`)

> Firebase Console → ⚙️ Project Settings → **General** tab → scroll to **"Your apps"** → **SDK setup and configuration** → select **Config**

Copy each value:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` field |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` field |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` field |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` field |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` field |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` field |

### Admin SDK keys (`FIREBASE_ADMIN_*`)

> Firebase Console → ⚙️ Project Settings → **Service accounts** tab → **"Generate new private key"** → Download JSON

Open the downloaded JSON file and map:

| Variable | JSON field |
|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | `project_id` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `client_email` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `private_key` (paste the full value including `-----BEGIN...-----`) |

> **Important:** The private key contains literal `\n` characters. Paste it as-is into `.env.local` — the app handles unescaping automatically.

---

## Step 7 — Update `.firebaserc`

Open `.firebaserc` and replace the placeholder with your actual project ID:

```json
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"   ← replace this
  }
}
```

Your project ID is shown in **Firebase Console → Project Settings → General → Project ID**.

---

## Step 8 — Deploy Firestore Rules & Indexes

```bash
# Deploy security rules and indexes to Firebase
firebase deploy --only firestore
firebase deploy --only storage
```

This uploads `firestore.rules`, `firestore.indexes.json`, and `storage.rules`.

---

## Step 9 — Deploy the App

### Option A: Firebase App Hosting ✅ Recommended

Firebase App Hosting runs Next.js natively on Cloud Run — no Dockerfile needed.

**One-time setup:**

```bash
firebase init apphosting
```

- Select your project
- Choose a region (`us-central1` recommended)
- Connect your GitHub repo when prompted
- Firebase will auto-deploy on every push to `main`

**Add secrets to Secret Manager** (so App Hosting can read them):

```bash
# For each variable in apphosting.yaml, create a secret:
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-firebase-api-key --data-file=-
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-firebase-auth-domain --data-file=-
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-firebase-project-id --data-file=-
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-firebase-storage-bucket --data-file=-
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-firebase-messaging-sender-id --data-file=-
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-firebase-app-id --data-file=-
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-admin-project-id --data-file=-
echo -n "YOUR_VALUE" | gcloud secrets create mi-tierra-admin-client-email --data-file=-

# Private key needs special handling due to newlines:
printf '%s' "$(cat your-service-account.json | python3 -c "import sys,json; print(json.load(sys.stdin)['private_key'])")" \
  | gcloud secrets create mi-tierra-admin-private-key --data-file=-
```

**Grant App Hosting access to the secrets:**

```bash
# Get your App Hosting service account email from:
# Firebase Console → App Hosting → your backend → Settings
SA_EMAIL="firebase-app-hosting-compute@YOUR_PROJECT_ID.iam.gserviceaccount.com"

for SECRET in mi-tierra-firebase-api-key mi-tierra-firebase-auth-domain \
  mi-tierra-firebase-project-id mi-tierra-firebase-storage-bucket \
  mi-tierra-firebase-messaging-sender-id mi-tierra-firebase-app-id \
  mi-tierra-admin-project-id mi-tierra-admin-client-email mi-tierra-admin-private-key; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor"
done
```

**Deploy:**
```bash
git push origin main   # App Hosting auto-builds and deploys
```

---

### Option B: Cloud Run (manual, more control)

```bash
# 1. Build the Next.js app with standalone output
# Add to next.config.ts first:
#   output: 'standalone'
npm run build

# 2. Build and push Docker image
PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
IMAGE=gcr.io/$PROJECT_ID/mi-tierra

docker build -t $IMAGE .
docker push $IMAGE

# 3. Deploy to Cloud Run
gcloud run deploy mi-tierra \
  --image $IMAGE \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_VALUE,..." \
  --port 3000

# 4. (Optional) Point your custom domain via Firebase Hosting
firebase hosting:channel:deploy production
```

---

## Step 10 — Add Authorized Domain for Auth

After deployment, Firebase Auth needs to trust your production domain:

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **"Add domain"**
3. Enter your App Hosting URL (e.g. `mi-tierra-abc123.web.app`) or custom domain

---

## Step 11 — Enable Google Sign-In OAuth Consent (if needed)

If Google Sign-In shows an "unverified app" warning:

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)** → select your project
2. **APIs & Services → OAuth consent screen**
3. Fill in app name, support email, developer contact
4. Add your domain under **"Authorized domains"**
5. For production, submit for verification (takes ~a week for public apps)

---

## File Reference

| File | Purpose |
|---|---|
| `.env.local` | Local development secrets (git-ignored) |
| `.env.local.example` | Template — commit this, not `.env.local` |
| `firebase.json` | Firebase CLI config (rules, hosting) |
| `.firebaserc` | Links repo to your Firebase project |
| `apphosting.yaml` | Firebase App Hosting runtime config + secret refs |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Composite indexes for product/order queries |
| `storage.rules` | Firebase Storage security rules |

---

## Quick Reference — Useful Commands

```bash
# Run locally
npm run dev

# Type check
npx tsc --noEmit

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only indexes
firebase deploy --only firestore:indexes

# Deploy storage rules
firebase deploy --only storage

# Deploy everything (rules + hosting)
firebase deploy

# View live logs (App Hosting / Cloud Run)
gcloud run services logs read mi-tierra --region us-central1

# Open Firebase Console
firebase open
```
