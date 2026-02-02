# Rishat, I'm Here 💕

A private romantic web service built with Next.js, Firebase, and love. This application provides emotional support, connection, and love through various interactive sections.

## 🎯 Features

- **Authentication System**: Secure login with role-based access (Admin/User)
- **10+ Content Sections**: Letters, reasons, timeline, future plans, surprises, and more
- **Admin Dashboard**: Full CRUD operations for all content
- **Responsive Design**: Beautiful on all devices
- **Real-time Updates**: Powered by Firebase Firestore
- **Media Storage**: Firebase Storage for images and videos
- **Animated UI**: Smooth transitions with Framer Motion

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Start in test mode (we'll add rules later)
5. Enable Storage:
   - Go to Storage
   - Get started with default settings
6. Get your config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the config values

### 3. Environment Variables

Create `.env.local` file in the root directory:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com

# Secret Room Password
NEXT_PUBLIC_SECRET_ROOM_PASSWORD=your_secret_password

# Firebase Admin SDK (for server-side operations)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Firebase Admin SDK Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the values to your `.env.local`:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` (keep the quotes and \n)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Create Admin User

1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter your email (must match `NEXT_PUBLIC_ADMIN_EMAIL`)
4. Set a password
5. Save

### 7. Add Firestore Security Rules

Go to Firestore Database → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // All content collections - read for authenticated, write for admin
    match /{collection}/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

### 8. Add Storage Security Rules

Go to Storage → Rules and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'YOUR_ADMIN_EMAIL@example.com';
    }
  }
}
```

Replace `YOUR_ADMIN_EMAIL@example.com` with your actual admin email.

## 📁 Project Structure

```
rishat-im-here/
├── src/
│   ├── app/
│   │   ├── (main)/          # Protected main pages
│   │   │   ├── page.tsx     # Home
│   │   │   ├── letters/     # Letters section
│   │   │   ├── why-you-matter/
│   │   │   ├── my-feelings/
│   │   │   ├── our-story/
│   │   │   ├── our-future/
│   │   │   ├── surprises/
│   │   │   ├── secret-room/
│   │   │   ├── rituals/
│   │   │   ├── apart/
│   │   │   ├── crisis/
│   │   │   └── final-letter/
│   │   ├── admin/           # Admin dashboard
│   │   │   ├── page.tsx
│   │   │   ├── letters/
│   │   │   ├── reasons/
│   │   │   └── ... (admin pages for each section)
│   │   ├── auth/
│   │   │   └── login/       # Login page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Navigation.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/
│   │   ├── firebase.ts      # Firebase client config
│   │   ├── firebase-admin.ts # Firebase admin config
│   │   └── utils.ts         # Utility functions
│   └── types/
│       └── index.ts         # TypeScript types
├── public/
├── .env.local               # Environment variables (not in git)
├── .env.example            # Example env file
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🗄️ Firestore Collections Structure

### users
```typescript
{
  uid: string,
  email: string,
  role: 'admin' | 'user',
  displayName?: string,
  createdAt: Timestamp
}
```

### letters
```typescript
{
  category: 'sad' | 'doubt' | 'distance' | 'argument' | 'happy',
  title: string,
  content: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### reasons
```typescript
{
  title: string,
  description: string,
  order: number,
  createdAt: Timestamp
}
```

### feelings
```typescript
{
  title: string,
  content: string,
  emotionType: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### timeline
```typescript
{
  date: string,
  title: string,
  description: string,
  imageUrl?: string,
  order: number,
  createdAt: Timestamp
}
```

### future
```typescript
{
  title: string,
  description: string,
  category: string,
  imageUrl?: string,
  order: number,
  createdAt: Timestamp
}
```

### surprises
```typescript
{
  title: string,
  content: string,
  imageUrl?: string,
  videoUrl?: string,
  unlockDate?: Timestamp,
  isUnlocked: boolean,
  clickCount?: number,
  clicksToUnlock?: number,
  createdAt: Timestamp
}
```

### secretRoom
```typescript
{
  title: string,
  content: string,
  mediaUrls: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### rituals
```typescript
{
  title: string,
  description: string,
  type: 'joke' | 'phrase' | 'tradition',
  createdAt: Timestamp
}
```

### distance
```typescript
{
  title: string,
  content: string,
  order: number,
  createdAt: Timestamp
}
```

### crisis
```typescript
{
  title: string,
  content: string,
  severity: 'mild' | 'moderate' | 'severe',
  order: number,
  createdAt: Timestamp
}
```

### finalLetter
```typescript
{
  content: string,
  lastUpdated: Timestamp
}
```

### dailyQuotes
```typescript
{
  quote: string,
  author?: string,
  isActive: boolean,
  createdAt: Timestamp
}
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  rose: { ... },
  cream: { ... },
  peach: { ... },
  lavender: { ... },
}
```

### Fonts
Edit `src/app/globals.css` to change fonts:

```css
@import url('your-google-font-url');
```

## 🚢 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - Copy all variables from `.env.local`
   - Paste them in Vercel's Environment Variables section
5. Click "Deploy"

### 3. Update Firebase Auth Domain

After deployment:
1. Copy your Vercel domain (e.g., `your-app.vercel.app`)
2. Go to Firebase Console → Authentication → Settings
3. Add your Vercel domain to "Authorized domains"

## 🔒 Security Checklist

- ✅ Firebase security rules configured
- ✅ Environment variables set
- ✅ Admin email configured
- ✅ Storage rules configured
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Auth domains whitelisted

## 📱 Usage

### As Admin:
1. Login with admin email
2. Access Admin Dashboard from navigation
3. Create and manage content in each section
4. Upload images directly in admin panels
5. Preview content as user would see it

### As User (Rishat):
1. Login with user credentials
2. Browse all sections
3. Read letters based on mood/situation
4. Unlock surprises
5. Access secret room with password

## 🛠️ Development Tips

### Adding a New Section

1. Create page in `src/app/(main)/new-section/page.tsx`
2. Add to navigation in `src/components/Navigation.tsx`
3. Create admin page in `src/app/admin/new-section/page.tsx`
4. Add Firestore collection type in `src/types/index.ts`
5. Update Firestore security rules if needed

### Uploading Images

Use Firebase Storage in admin panels:

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const handleUpload = async (file: File) => {
  const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

## 🐛 Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Firebase Auth authorized domains

### "Permission denied" errors in Firestore
- Check your Firestore security rules
- Ensure user is authenticated
- Verify admin role is set correctly

### Images not loading
- Check Storage security rules
- Verify image URLs in Firestore
- Check CORS settings in Firebase Storage

## 📧 Support

For issues or questions, check:
- Firebase Console for backend issues
- Vercel Dashboard for deployment issues
- Browser console for frontend errors

## 💝 Built With Love

- [Next.js 14](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/)

---

Made with ❤️ for Rishat
