# ResolveX Project Guide

## Overview
ResolveX is a complaint management web app built with React, Vite, TypeScript, Tailwind CSS, and Firebase. It lets users sign in, submit complaints, track their own complaints, and edit them. Admins can view the full complaint queue and update complaint status.

The app also sends complaint confirmation emails through EmailJS after a complaint is created.

## Core Goals
- Give users a simple way to file complaints with supporting details.
- Keep complaint status visible in real time.
- Separate regular users from admins.
- Use Firebase for authentication and Firestore for persistence.
- Keep the UI responsive and animated without making the app feel heavy.

## Main Features
- Email/password authentication through Firebase Auth
- User dashboard for creating and editing complaints
- Admin dashboard for viewing all complaints
- Complaint status management
- Real-time Firestore listeners
- Complaint confirmation email via EmailJS
- Animated login and dashboard backgrounds
- Reusable UI primitives built in a shadcn-style pattern

## Tech Stack
- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- Firebase Auth
- Firestore
- EmailJS
- Framer Motion
- Radix UI primitives
- Lucide icons
- react-router-dom

## Application Flow
1. The app boots from `src/main.tsx`.
2. `src/App.tsx` sets up routing, global auth state, and the page background.
3. Firebase auth state is tracked in `src/context/AuthContext.tsx`.
4. Complaint data is loaded and updated through `src/hooks/useComplaints.ts`.
5. Users land on the login page and are routed to the correct dashboard after sign-in.

## Routes
Defined in `src/App.tsx`:
- `/` -> `src/pages/login.tsx`
- `/dashboard` -> `src/pages/dashboard.tsx` for admins only
- `/user-dashboard` -> `src/pages/UserDashboard.tsx` for authenticated users

## Authentication Model
Authentication is handled by Firebase Auth.

`src/context/AuthContext.tsx`:
- Watches auth changes with `onAuthStateChanged`
- Stores the current user
- Exposes `loading` and `isAdmin`
- Marks a user as admin when their email is in the allowlist

Admin access is currently controlled by a hardcoded email allowlist:
- `santhoshkkumarsan@gmail.com`

`src/components/ProtectedRoute.tsx` uses this state to:
- redirect unauthenticated users back to `/`
- redirect non-admin users away from `/dashboard`

## Complaint Data Model
Complaints are stored in the Firestore `complaints` collection.

Typical fields:
- `title`
- `category`
- `description`
- `priority` (`low`, `medium`, `high`)
- `status` (`open`, `in_progress`, `resolved`, `closed`)
- `createdAt`
- `userId`
- `userEmail`
- `mobile` optional

## Complaint Workflows
### User workflow
`src/pages/UserDashboard.tsx` lets a signed-in user:
- view only their own complaints
- create a new complaint
- edit an existing complaint

### Admin workflow
`src/pages/dashboard.tsx` lets an admin:
- view all complaints
- search and filter complaints
- update complaint status
- inspect complaint details

## Data Access Layer
`src/hooks/useComplaints.ts` is the main Firestore hook.

It provides:
- `complaints`
- `loading`
- `error`
- `addComplaint`
- `updateComplaintStatus`
- `updateComplaint`
- `deleteComplaint`

It supports two read modes:
- user-specific complaints when a `userId` is supplied
- all complaints when `fetchAll` is `true`

It also sorts complaints by newest first and normalizes Firestore errors into more useful messages.

## Email Confirmation Flow
`src/services/mailer.ts` sends a confirmation email after a complaint is written to Firestore.

The flow is:
1. User submits a complaint.
2. Firestore stores the complaint.
3. EmailJS sends a confirmation message to the complainant.

If the email fails, the complaint still remains saved. The email step is treated as best-effort.

Required EmailJS environment variables:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_REPLY_TO`

## Firebase Setup
`src/services/firebase.ts` initializes:
- Firebase app
- Firebase Auth
- Firestore

Required Firebase environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

`src/services/env.ts` validates that required variables exist and throws or warns with a clear message when they do not.

## UI Structure
### Pages
- `src/pages/login.tsx`
- `src/pages/dashboard.tsx`
- `src/pages/UserDashboard.tsx`

### Feature components
- `src/components/AddComplaintDialog.tsx`
- `src/components/EditComplaintDialog.tsx`
- `src/components/ComplaintDetail.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/components/ComplaintRow.tsx`
- `src/components/StatCard.tsx`
- `src/components/RocketModel.tsx`

### Shared UI primitives
Most base components live in `src/components/ui/` and include:
- buttons
- dialogs
- inputs
- selects
- textareas
- tabs
- tables
- tooltips
- animated backgrounds

## Visual Design
The app uses layered, animated backgrounds:
- `shader-background.tsx` on the login page
- `gradient-background.tsx` on non-login routes
- `beams-background.tsx` on dashboard pages

The layout uses Tailwind utilities and custom motion effects to keep the UI polished without a large component library footprint.

## Validation Rules
Important validation is enforced in the complaint dialogs and hook layer.

Examples:
- required fields must be filled
- mobile number input is validated
- title and description limits are enforced
- submission is disabled while a request is in flight

## File Structure
```text
src/
  App.tsx
  main.tsx
  context/
  hooks/
  pages/
  components/
  services/
  lib/
  assets/
public/
```

## Build And Run
Scripts from `package.json`:
- `npm.cmd run dev` starts the Vite dev server
- `npm.cmd run build` creates a production build in `dist/`
- `npm.cmd run preview` previews the build locally
- `npm.cmd run lint` runs ESLint

## Deployment
The repo is set up for static deployment.

Supported deployment targets:
- Firebase Hosting
- Docker with Nginx

`vite.config.ts` also includes a development proxy for `/api` to `http://localhost:3001`, which is useful if a local backend is running alongside the frontend.

## Important Notes
- Admin access is based on a hardcoded email allowlist, not Firestore roles.
- Complaint confirmation emails are optional from the app's point of view.
- The app expects environment variables at build time, not just at runtime.
- `ComplaintRow.tsx`, `StatCard.tsx`, and `RocketModel.tsx` exist in the codebase but are not central to the main user flow.

## Best Files To Read First
- `src/App.tsx`
- `src/context/AuthContext.tsx`
- `src/hooks/useComplaints.ts`
- `src/pages/login.tsx`
- `src/pages/dashboard.tsx`
- `src/pages/UserDashboard.tsx`
- `src/services/firebase.ts`
- `src/services/mailer.ts`

