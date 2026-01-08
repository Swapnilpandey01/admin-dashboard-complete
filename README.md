
## Admin Dashboard – Role-Based User Management

### Tech Stack
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Context API** for auth and users

### What This App Does
- Simple login where you choose a role: **Admin** or **Viewer**.
- Shows a **dashboard** page with basic user stats (total, active, inactive, role distribution, user activity).
- Shows a **users** page with a table of users:
  - Search by name or email.
  - Filter by role and status.
  - Paginate through the list.
- Data comes from a small **mock API** in memory (no real backend).

### Roles
- **Admin**: Can change user roles and toggle user status.
- **Viewer**: Can only view data (no editing).

### How to Run
```bash
npm install
npm run dev
```