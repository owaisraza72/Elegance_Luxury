# 🚀 E-Commerce Project (ÉLÉGANCE LUXURY)

A high-performance, full-stack E-Commerce platform built with a focus on modern UI/UX, robust security, and scalable architecture.

## 🛠️ Tech Stack & Features

### **Frontend (Client)**
- **Framework:** React 19 + Vite
- **State Management:** Redux Toolkit (RTK)
- **Data Fetching:** RTK Query (Efficient caching & synchronization)
- **Styling:** Tailwind CSS v4 (Modern UT framework)
- **Animations:** Framer Motion (Smooth page transitions & interactive modals)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Architecture:** Feature-based folder structure

### **Backend (Server)**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Security:**
  - JWT (JSON Web Tokens) with HTTP-only cookie storage.
  - Password hashing via Bcrypt (Single-pass hashing mechanism).
  - CORS with credentials support.
  - Whitelist-based validation for profile updates.

---

## 💎 Recent Developer-Mode Enhancements

### **1. Advanced Authentication Flow**
- **Fixed Double Hashing:** Resolved a critical bug where passwords were being double-hashed (Route + Pre-save hook), which previously caused valid logins to fail.
- **Case-Insensitive Login:** Implemented `email.toLowerCase()` across signup and login routes to ensure case-insensitive matching in the database.
- **Cookie Security:** JWT tokens are stored in HTTP-only cookies to prevent XSS attacks while ensuring `sameSite: "lax"` for cross-origin security.

### **2. Profile Management Module**
- **Edit Profile Popup (UI/UX):** Implemented a premium modal-based editing experience in `Profile.jsx`. It features:
  - **Framer Motion Animations:** Smooth scale-up and fade-in effects.
  - **Input Validation:** Real-time feedback and whitelisted fields.
  - **Dynamic Updates:** Form state is pre-filled with current user data.
- **Backend PATCH API:** Created a new endpoint `/auth/profile/edit` that allows users to securely update:
  - Full Name (Min 3 chars validation)
  - Gender (Enum: male, female, other)
  - Age (Min 18 validation)
  - About/Bio
  - Profile Photo URL
- **Field Whitelisting:** Implemented a security layer in `lib/utils.js` that strictly rejects any attempt to update sensitive fields like `user.role` or `user.email` via the standard profile edit.

### **3. Optimized Developer Experience**
- **Mongoose Hook Optimization:** Fixed the `next is not a function` error in the `pre-save` hook by upgrading to the modern `async/await` pattern (no callback required).
- **Global Auth Synchronization:** Integrated `useGetProfileQuery` in `App.jsx` to ensure that any profile changes auto-trigger a Redux state refresh across the entire application instantly.

---

## 🏃 How to Run Development Environment

### **Backend**
1. Navigate to `/server`.
2. Install dependencies: `npm install`
3. Configure `.env` (check `.env.example`).
4. Start dev server: `npm run dev`

### **Frontend**
1. Navigate to `/client`.
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

---

## 🔒 Security Summary
- **No Sensitive Data Leaks:** Password fields are explicitly removed (deleted) from MongoDB documents before sending user objects to the client.
- **Middleware Protected:** All sensitive routes (`/profile`, `/orders`, `/admin`, etc.) are guarded by `authMiddleware`, `adminMiddleware`, and `sellerMiddleware`.

---

**Developed with ❤️ and Precision.**
