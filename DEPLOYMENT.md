# 🚀 Deployment Guide - Rishat, I'm Here

This guide will walk you through deploying your romantic web service to production.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] Firebase project created and configured
- [ ] Vercel account
- [ ] All environment variables ready
- [ ] Admin user created in Firebase Auth

## Step-by-Step Deployment

### Part 1: Prepare Your Code

#### 1. Initialize Git Repository

```bash
cd rishat-im-here
git init
git add .
git commit -m "Initial commit: Rishat I'm Here romantic web service"
```

#### 2. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g., `rishat-im-here`)
3. Choose "Private" for privacy
4. Do NOT initialize with README (we already have one)
5. Click "Create repository"

#### 3. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/rishat-im-here.git
git branch -M main
git push -u origin main
```

### Part 2: Configure Firebase for Production

#### 1. Set Up Firestore Security Rules

1. Go to Firebase Console → Your Project
2. Navigate to Firestore Database → Rules
3. Replace with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'YOUR_ADMIN_EMAIL@example.com';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update, delete: if isAdmin();
    }
    
    // All content collections - read for authenticated users, write for admin only
    match /letters/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /reasons/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /feelings/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /timeline/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /future/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /surprises/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /secretRoom/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /rituals/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /distance/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /crisis/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /finalLetter/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /dailyQuotes/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

**Important**: Replace `YOUR_ADMIN_EMAIL@example.com` with your actual admin email!

4. Click "Publish"

#### 2. Set Up Storage Security Rules

1. Go to Storage → Rules
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow authenticated users to read any file
      allow read: if request.auth != null;
      
      // Only admin can write/delete files
      allow write, delete: if request.auth != null && 
                              request.auth.token.email == 'YOUR_ADMIN_EMAIL@example.com';
    }
  }
}
```

**Important**: Replace `YOUR_ADMIN_EMAIL@example.com` with your actual admin email!

3. Click "Publish"

#### 3. Create Admin User in Firebase Auth

1. Go to Authentication → Users
2. Click "Add user"
3. Enter:
   - Email: Your admin email (must match NEXT_PUBLIC_ADMIN_EMAIL)
   - Password: Create a strong password
4. Click "Add user"
5. **Save these credentials securely!**

#### 4. Set Up Authorized Domains

1. Go to Authentication → Settings → Authorized domains
2. Domains should include:
   - `localhost` (for development)
   - Your custom domain (if you have one)
   - Vercel will be added automatically after deployment

### Part 3: Deploy to Vercel

#### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "Add New..." → "Project"
4. Click "Import Git Repository"
5. Select your GitHub repository

#### 2. Configure Project Settings

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

#### 3. Add Environment Variables

Click "Environment Variables" and add ALL of these:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com
NEXT_PUBLIC_SECRET_ROOM_PASSWORD=your_secret_password

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_here
-----END PRIVATE KEY-----"
```

**Important Notes**:
- Copy values from your `.env.local`
- For `FIREBASE_ADMIN_PRIVATE_KEY`, include the quotes and preserve line breaks
- Make sure there are no trailing spaces
- Apply to: Production, Preview, and Development

#### 4. Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. You'll get a URL like: `https://your-project.vercel.app`

#### 5. Update Firebase Authorized Domains

1. Copy your Vercel deployment URL
2. Go back to Firebase Console
3. Navigate to Authentication → Settings → Authorized domains
4. Click "Add domain"
5. Paste your Vercel URL (without `https://`)
6. Click "Add"

### Part 4: Post-Deployment Configuration

#### 1. Test Your Deployment

1. Visit your Vercel URL
2. Try to login with admin credentials
3. Check that you can access:
   - [ ] Login page
   - [ ] Home page after login
   - [ ] Admin dashboard
   - [ ] All main sections
   - [ ] Navigation works

#### 2. Add Initial Content

1. Login as admin
2. Go to Admin Dashboard
3. Add initial content:
   - [ ] Daily quote
   - [ ] At least one letter in each category
   - [ ] A few "Why You Matter" reasons
   - [ ] Timeline events
   - [ ] Crisis support messages

#### 3. Create User Account for Rishat

1. Go to Firebase Console → Authentication
2. Add a new user with:
   - Email: Rishat's email
   - Password: Create a password
3. Send credentials to Rishat securely

#### 4. Test User Experience

1. Logout from admin account
2. Login with Rishat's credentials
3. Verify:
   - [ ] Can access all sections
   - [ ] Cannot see admin panel
   - [ ] Content displays correctly
   - [ ] Navigation works smoothly

### Part 5: Custom Domain (Optional)

#### 1. Purchase Domain

Buy a domain from:
- Namecheap
- GoDaddy
- Google Domains
- Any registrar

#### 2. Configure in Vercel

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Click "Add"
4. Enter your domain (e.g., `rishatimhere.com`)
5. Follow Vercel's instructions to:
   - Add DNS records to your domain registrar
   - Wait for DNS propagation (can take 24-48 hours)

#### 3. Update Firebase

1. Add your custom domain to Firebase Authorized Domains
2. Update NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN if needed

### Part 6: Ongoing Maintenance

#### Updating Content

1. Login as admin
2. Use admin dashboard to update any section
3. Changes are instant (no redeployment needed)

#### Updating Code

```bash
# Make changes to code
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically redeploy!

#### Monitoring

1. **Vercel Analytics**: 
   - Go to your project → Analytics
   - View page views, performance, etc.

2. **Firebase Console**:
   - Monitor authentication
   - Check Firestore usage
   - Review Storage usage

#### Backups

Regularly backup your Firestore data:

1. Go to Firestore Database
2. Click on the three dots menu
3. Select "Export data"
4. Choose a Cloud Storage bucket
5. Export all collections

### Troubleshooting Common Issues

#### "Firebase Error: unauthorized-domain"

**Solution**: 
- Add your Vercel domain to Firebase Authorized Domains
- Wait a few minutes for changes to propagate

#### "Permission denied" in Firestore

**Solution**:
- Check Firestore security rules
- Verify user is logged in
- Ensure admin email is correct in rules

#### Images not loading

**Solution**:
- Check Storage security rules
- Verify image URLs in Firestore
- Ensure images were uploaded through admin panel

#### Environment variable not working

**Solution**:
- Go to Vercel → Settings → Environment Variables
- Verify all variables are set
- Check for typos or trailing spaces
- Redeploy after fixing

#### Build fails on Vercel

**Solution**:
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build`

### Security Checklist

Before going live, verify:

- [ ] Firebase security rules are configured
- [ ] Storage rules restrict uploads to admin only
- [ ] Environment variables are not exposed in code
- [ ] Admin password is strong and secure
- [ ] `.env.local` is in `.gitignore`
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Secret room password is secure
- [ ] Only authorized domains in Firebase Auth

### Performance Optimization

#### Enable Vercel Analytics

1. Go to project settings in Vercel
2. Enable Analytics
3. Monitor page load times

#### Optimize Images

When uploading through admin:
- Use appropriate image sizes
- Consider using .webp format
- Compress images before upload

#### Monitor Firebase Usage

1. Check Firebase Console monthly
2. Review Firestore reads/writes
3. Monitor Storage usage
4. Adjust if approaching limits

### Support and Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## Quick Command Reference

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Deploy to Vercel (if using Vercel CLI)
vercel --prod

# Git commands
git status
git add .
git commit -m "your message"
git push origin main
```

---

## Need Help?

If you encounter issues:
1. Check browser console (F12)
2. Review Vercel deployment logs
3. Check Firebase console for errors
4. Verify environment variables
5. Review this guide's troubleshooting section

---

**Congratulations!** 🎉 Your romantic web service is now live and ready to provide love and support to Rishat!

Made with ❤️
