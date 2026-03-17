# Project Continuation Hook - ResolveX

## Project Overview
ResolveX is a React/TypeScript frontend application built with Vite, Firebase (Auth, Firestore, Hosting), and Tailwind CSS. It's a Complaint Management System.

## Recent Work Accomplished
*   **Containerization:** Full Docker setup completed (`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `.dockerignore` corrected).
*   **Environment Variables:** Configured `VITE_FIREBASE_` environment variables for Firebase credentials in `src/services/firebase.ts` (using `import.meta.env`).
*   **CI/CD Integration:** Updated GitHub Actions workflows (`firebase-hosting-merge.yml`, `firebase-hosting-pull-request.yml`) to pass `VITE_FIREBASE_` secrets to the `npm run build` step for Firebase Hosting deployments.
*   **Local Docker Fix:** Resolved issue where `.env` was excluded from Docker build context.
*   **Security Discussion:** Investigated a Content Security Policy (CSP) error (`blocks the use of 'eval'`) and discussed potential fixes and security implications.

## Current State / Next Steps
The project is functional and deployed to Firebase Hosting via GitHub Actions. Local Docker containerization is also operational. The last active discussion revolved around modifying the Content Security Policy to allow `unsafe-eval`. I am currently awaiting user confirmation on which file to modify (`firebase.json` or `nginx.conf`) and explicit acknowledgment of the associated security risks before proceeding with that change.