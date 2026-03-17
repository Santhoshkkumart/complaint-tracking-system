# Project: ResolveX – Smart Complaint Management System

## Project Overview

ResolveX is a modern web-based complaint management system designed for efficient complaint submission, tracking, and management. It provides a seamless and real-time experience for both users and administrators. Key features include user authentication, real-time complaint tracking, an administrative dashboard, and a responsive UI.

## Tech Stack

### Frontend:
- **React.js (Vite):** For building the user interface.
- **Tailwind CSS:** For modern and responsive styling.

### Backend & Database:
- **Firebase Authentication:** For user authentication.
- **Firebase Firestore:** As the cloud-based NoSQL database for storing complaint data.
- **Firebase Hosting:** For deploying the web application.

### Tools & Deployment:
- **Git & GitHub:** For version control and collaboration.
- **GitHub Actions:** For Continuous Integration/Continuous Deployment (CI/CD).

## Building and Running

### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/resolvex.git
cd resolvex
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Run the development server:

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### 4. Build for deployment:

```bash
npm run build
```

### 5. Deploy to Firebase (requires Firebase CLI and project setup):

```bash
firebase deploy
```

## Development Conventions

-   Source code is organized within the `src/` directory.
-   UI components are found in `src/components/`.
-   Application pages are located in `src/pages/`.
-   Service integrations (e.g., Firebase) are managed in `src/services/`.
-   CI/CD workflows are defined in `.github/workflows/`.
-   **Security Note:** Firebase configuration with actual credentials should not be committed to version control; environment variables should be used instead.
