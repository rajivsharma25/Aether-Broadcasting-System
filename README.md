# AETHER - Content Broadcasting System

A premium, role-based education platform designed for teachers to upload subject-based content and principals to moderate it for live broadcasting.

## 🚀 Features

### 👤 Authentication & Security
- **Role-Based Access Control (RBAC)**: Specialized dashboards with strict route guards for Teachers and Principals.
- **Secure Mock Auth**: JWT-simulated flow with localized session persistence.
- **Demo Accounts**:
  - **Teacher**: `teacher@test.com` / `password`
  - **Principal**: `principal@test.com` / `password`

### 🍎 Teacher Dashboard
- **Content Upload**: Professional form with drag-and-drop support and real-time image preview.
- **Scheduling Intelligence**: Set specific start/end times and rotation durations. 
- **Status Badges**: Real-time status tracking (**Pending**, **Approved**, **Rejected**) with live scheduling indicators (**Active**, **Scheduled**, **Expired**).
- **Analytics**: Quick overview of upload performance and status metrics.

### 🏛️ Principal Dashboard
- **Moderation Workflow**: Dedicated interface to review, approve, or reject pending content with mandatory feedback.
- **Institution Insights**: Global view of all content with advanced filtering (Status + Search).
- **System Health Monitor**: Real-time operational status and active teacher metrics.

### 📺 Live Broadcast (Student View)
- **Public URL**: `/live/[teacherId]`
- **Smart Rotation**: Auto-rotates active content based on teacher-defined durations.
- **Auto-Refresh**: 10s polling ensures the broadcast stays in sync with approvals without page reloads.
- **Responsive Player**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: Framer Motion (Fluid transitions & Micro-interactions)
- **Icons**: Lucide React
- **Data Persistence**: **IndexedDB** (Used to reliably handle 10MB+ file uploads in a mock environment)
- **Service Layer**: Pure Service-Layer Pattern (Axios-ready abstraction)

## 📁 Project Structure

```text
src/
├── app/            # File-based routing (Pages & App Logic)
├── components/     # Atomic UI components (UI, Common, Dashboard, Forms)
├── context/        # Global State Management (AuthContext)
├── hooks/          # Custom hooks for clean business logic
├── layouts/        # DashboardLayout with Role-based guards
├── services/       # Service Layer (Auth, Content, Approval)
└── utils/          # Formatting helpers and validation logic
```

## 📋 Technical Highlights

- **Scalable Architecture**: Strict separation of concerns between UI and business logic.
- **Advanced Mock Storage**: Implemented **IndexedDB** instead of localStorage to fulfill the 10MB file requirement which exceeds standard browser quotas.
- **Clean Code**: Zero lint errors or warnings.
- **User Experience**: Integrated skeleton loaders, professional toast notifications, and custom modals.

## 🏁 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### Installation & Setup

**1. Clone the repository:**
```bash
git clone <your-repo-url>
cd grubpac-assignment
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev
```

**4. Open in your browser:**
```
http://localhost:3000
```

---

### 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Teacher | `teacher@test.com` | `password` |
| 🏛️ Principal | `principal@test.com` | `password` |

> **Note**: All data is stored in the browser's **IndexedDB**. Content uploaded in one session persists across page refreshes but is local to your browser.

---

### 📺 Public Live Page (No Login Required)

Access the public broadcast page for any teacher directly:
```
http://localhost:3000/live/teacher-1
```

---

Built with ❤️ for the Technical Assignment.
