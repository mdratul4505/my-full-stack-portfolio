# Md. Ratul Hasan — Premium Full-Stack Portfolio & Admin Dashboard

A production-ready, dark-themed personal developer portfolio for **Md. Ratul Hasan**, engineered with **Next.js (App Router), TypeScript, PostgreSQL, and Prisma ORM**, featuring dynamic content management through a secure, authenticated Admin Panel.

---

## 🎨 Design System & Color Palette

This application follows a minimal, dark theme with exactly one accent color:

- **Main Background**: `#111111`
- **Card Background**: `#1A1A1A`
- **Card Hover Background**: `#242424`
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#A3A3A3`
- **Border Color**: `#303030`
- **Only Accent Color**: **Lime Green `#84CC16`** (Used for buttons, active navigation, icons, highlights, links, and selected borders)

---

## 🚀 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) (Migrations, type safety, seeders)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Hero text reveals, staggered skill cards, scroll triggers, respecting `prefers-reduced-motion`)
- **Icons**: [Lucide React](https://lucide.dev/) & Custom SVG Brand Icons
- **Validation**: [Zod](https://zod.dev/) (Strict client-side and server-side schemas)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with `@hookform/resolvers`
- **Authentication**: Secure HTTP-only cookies + JWT session management via `jose` and `bcryptjs`
- **Email Service**: [Resend](https://resend.com/) with robust error handling and database persistence fallback

---

## 🌟 Key Features

### 1. Public Portfolio (`/`)
- **Navbar**: Sticky header with smooth scrolling, active section indicators, responsive mobile drawer, and resume download link.
- **Hero Section**: Animated role switcher cycling between *Frontend Developer*, *React Developer*, and *Aspiring Full-Stack Developer*; profile showcase; verified GitHub and email links; call-to-action buttons.
- **About Section**: Comprehensive narrative highlighting Md. Ratul Hasan's education in **Computer Science & Technology (CST)** at **Satkhira Polytechnic Institute**, architectural principles, and learning milestones.
- **Skills Section**: Staggered cards categorized into four distinct groups:
  1. *Frontend Development* (HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS, DaisyUI)
  2. *Backend Development* (Node.js, Express.js, REST API)
  3. *Database* (MongoDB, PostgreSQL, Prisma)
  4. *Tools & Version Control* (VS Code, Git, GitHub, Postman, Vercel, Netlify)
  - Interactive category filter tabs, hover lifts, and proficiency badges.
- **Education Section**: Clean qualification timeline showing **Satkhira Polytechnic Institute**, department, semester, years, and optional CGPA.
- **Projects Section**: Showcases real project records:
  - **Artora** (Live: `https://artora-d8ed5.web.app`)
  - **SkillSwap** (GitHub: `https://github.com/mdratul4505/skill-swap-client`)
  - **StyleDecor** (Live: `https://style-decor-client-sepia.vercel.app/`)
  - **RentNest** (Configurable fields)
- **Contact Section**: Secure form with client and server validation, spam rate limiting, automatic persistence into PostgreSQL, and optional Resend notification dispatch.
- **Footer**: Dynamic copyright year, quick links, and discreet admin entrance.

### 2. Secure Admin Dashboard (`/admin`)
- **Authentication (`/admin/login`)**:
  - Secure bcrypt password hashing
  - Server-side JWT session cookies (`HttpOnly`, `SameSite=Lax`, `Secure` in production)
  - In-memory IP rate limiting to prevent brute-force attacks
  - Generic authentication errors to prevent user enumeration
  - Protected Next.js middleware guard (`src/middleware.ts`)
- **Dashboard Overview (`/admin/dashboard`)**:
  - Real-time database metrics (total skills, total projects, published projects, unread messages)
  - Recent message preview and quick-action shortcuts
- **Skill Management (`/admin/skills`)**:
  - Full CRUD (Create, Read, Update, Delete)
  - Category selector, icon identifier, proficiency label, display order, publish toggle
  - Instant synchronization with the public portfolio
- **Project Management (`/admin/projects`)**:
  - Full CRUD with slug verification, live demo URLs, GitHub repository URLs, and tech tag lists
  - Featured badge toggle and publish status toggle
  - Built-in secure file upload handler (`/api/upload`)
- **Education Management (`/admin/education`)**:
  - Configurable semester, start/end years, institution, and optional CGPA
- **About & Bio Management (`/admin/about`)**:
  - Live editing of hero title, short bio, detailed narrative, and profile photo
- **Messages Inbox (`/admin/messages`)**:
  - Protected inbox for viewing visitor submissions
  - Mark as read/unread, inspect sender metadata, and delete with confirmation
- **Settings (`/admin/settings`)**:
  - Social profile URLs (GitHub, LinkedIn, Twitter/X), resume link, and notification email address

---

## 🛠️ Step-by-Step Local Setup Guide

### 1. Prerequisites
- **Node.js** v20.x or higher (Node v24 recommended)
- **PostgreSQL** database (Local instance or cloud provider like Supabase/Neon/Railway)

### 2. Clone and Install Dependencies
```bash
git clone <repository-url>
cd full-stuck-portfolio
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```env
# Database connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/portfolio_db?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5433/portfolio_db?schema=public"

# 32+ character random secret for JWT encryption
AUTH_SECRET="your-super-secret-jwt-key-min-32-chars-long"

# Initial admin credentials
ADMIN_INITIAL_EMAIL="admin@ratulhasan.dev"
ADMIN_INITIAL_PASSWORD="AdminPassword2026!"
ADMIN_INITIAL_NAME="Md. Ratul Hasan"

# (Optional) Resend email notifications
RESEND_API_KEY=""
CONTACT_RECEIVER_EMAIL="md.ratulhasan.dev@gmail.com"
CONTACT_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Prisma Migrations
Apply the database schema to your PostgreSQL database:
```bash
npx prisma migrate dev --name init
```

### 5. Seed Starter Content & Admin User
Populate the database with all 20 skills, 4 projects, education history, portfolio settings, and the initial admin account:
```bash
npm run db:seed
```

*(Optional)* To create or reset the admin password from the CLI:
```bash
npm run db:admin -- --email admin@ratulhasan.dev --password MyNewSecurePassword123! --name "Md. Ratul Hasan"
```

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public portfolio, or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in to the Admin Dashboard.

### 7. Build for Production
```bash
npm run build
npm run start
```

---

## 🚢 Production Deployment (e.g. Vercel + Supabase / Neon)

1. **Database**: Create a PostgreSQL database on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. **Environment Variables**: In your Vercel Project Settings, add:
   - `DATABASE_URL` (Connection pooler URL with `?pgbouncer=true` if using Supabase)
   - `DIRECT_URL` (Direct connection URL)
   - `AUTH_SECRET` (A strong random string, e.g. `openssl rand -base64 32`)
   - `RESEND_API_KEY` (Your Resend API key for outbound contact emails)
   - `CONTACT_RECEIVER_EMAIL` (Your personal inbox address)
   - `NEXT_PUBLIC_APP_URL` (Your production domain, e.g. `https://ratulhasan.dev`)
3. **Database Deploy**:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
4. **Deploy Application**: Connect your GitHub repository to Vercel and deploy with zero extra configuration.

---

## 🔒 Security Best Practices Implemented

- **Password Security**: Passwords are encrypted using salted `bcryptjs` rounds; plain text passwords are never stored.
- **Session Tokens**: JWT tokens are signed using HMAC SHA-256 and stored in `HttpOnly`, `SameSite=Lax` cookies, immune to JavaScript XSS access.
- **Server-Side Authorization**: Every Server Action and admin route validates the active session before performing mutations.
- **Strict Input Validation**: All user and admin inputs are validated server-side using Zod before database queries.
- **Rate Limiting**: IP-based rate limiting on `/admin/login` and `/api/contact` mitigates brute-force attacks and contact spam.
- **Zero Secret Leakage**: Database URLs and email keys remain strictly on the server and are excluded from client bundles and git commits.
