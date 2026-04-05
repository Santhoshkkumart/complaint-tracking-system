# 🚀 ResolveX – Smart Complaint Management System

A modern web-based complaint management system that allows users to submit, track, and manage complaints efficiently. Built using React, Tailwind CSS, and Firebase, this platform provides a seamless and real-time experience for both users and administrators.

## Local Helper Files

Some AI/workflow helper files are intentionally kept out of Git so they stay local to your machine:

- `GEMINI.md`
- `GEMINI_template.md`
- `CONTINUE_PROJECT_HOOK.md`
- `project.md`

They are listed in `.gitignore`, so they will not be included when you push the repo.

## 📌 Features

- 📝 Submit complaints with detailed description
- 📂 Track complaint status in real-time
- 🔐 User authentication (Firebase Auth)
- ☁️ Cloud database (Firebase Firestore)
- 🎨 Modern responsive UI with Tailwind CSS
- 📊 Admin dashboard for managing complaints
- 🚀 CI/CD enabled with GitHub Actions
- 🌍 Live deployment using Firebase Hosting

## 🛠️ Tech Stack

### Frontend:
- React.js (Vite)
- Tailwind CSS

### Backend & Database:
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

### Tools & Deployment:
- Git & GitHub
- GitHub Actions (CI/CD)
- Firebase Hosting

## 📸 Project Preview

> Add screenshots here after UI completion

```
📱 Homepage
📊 Complaint Dashboard
⚙️ Admin Panel
```

## ⚙️ Installation & Setup

### 1️⃣ Clone repository

```bash
git clone https://github.com/yourusername/resolvex.git
cd resolvex
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 2.1️⃣ Create environment file

Create a `.env` file in the project root and fill in every `VITE_*` value before running or deploying the app.

### 3️⃣ Run development server

```bash
npm run dev
```

Project will run on: **http://localhost:5173**

## EmailJS Configuration

Set these variables in your local `.env` file before sending complaint confirmation emails:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_REPLY_TO=santhoshkkumarsan@gmail.com
```

Recommended EmailJS template fields:

- `To Email`: `{{to_email}}`
- `Reply-To`: `{{reply_to}}`
- `Subject`: `Complaint Received: {{title}}`

Use an inbox you actually monitor for `Reply-To`. Do not set `Reply-To` to `{{to_email}}`, or replies will go back to the user instead of the admin/support inbox.

## Production Deployment Notes

If the app works on `localhost` but fails after you push/deploy it, the usual cause is missing environment variables in the production build.

- Vite only injects `VITE_*` values at build time.
- Your local `.env` file is ignored by Git and is not uploaded with the repo.
- If a hosting platform or CI job builds the app after push, you must add the same `VITE_*` values there and redeploy.

Required variables for this project:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_REPLY_TO=your_support_inbox@example.com
```

If you deploy from your own machine with Firebase Hosting, make sure `.env` exists before running:

```bash
npm run build
firebase deploy
```

If you deploy from GitHub Actions, add the same `VITE_*` values to your repository environment before pushing:

- `Settings -> Secrets and variables -> Actions -> Variables` for `main` deploys
- `Settings -> Secrets and variables -> Actions -> Secrets` for PR preview deploys

The deploy workflows expect both the Firebase keys and the EmailJS keys listed above.

## 🔥 Firebase Setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Add Firebase config in your project

### Example Configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
```

> ⚠️ **Important:** Never commit your Firebase config with actual credentials to GitHub. Use environment variables instead.

## 🚀 Deployment (Firebase Hosting)

### Build project:

```bash
npm run build
```

### Deploy:

```bash
firebase deploy
```

## 🤖 CI/CD Pipeline

This project uses **GitHub Actions** for automatic deployment.

Whenever code is pushed to GitHub:
- ✅ Project builds automatically
- ✅ Deploys to Firebase hosting
- ✅ Live site updates instantly

## 🎯 Future Enhancements

- [ ] Admin analytics dashboard
- [ ] AI chatbot for complaint assistance
- [ ] Email/SMS notifications
- [ ] Role-based access control
- [ ] Mobile responsive optimization

## 📂 Project Structure

```
resolvex/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
├── .github/
│   └── workflows/
├── firebase.json
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/resolvex/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Santhoshkkumar**  
*Aspiring Full Stack Developer*

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

⭐ **If you found this project helpful, please give it a star!**
