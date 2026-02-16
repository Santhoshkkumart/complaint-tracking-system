# 🚀 ResolveX – Smart Complaint Management System

A modern web-based complaint management system that allows users to submit, track, and manage complaints efficiently. Built using React, Tailwind CSS, and Firebase, this platform provides a seamless and real-time experience for both users and administrators.

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

### 3️⃣ Run development server

```bash
npm run dev
```

Project will run on: **http://localhost:5173**

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
│   ├── App.jsx
│   └── main.jsx
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

