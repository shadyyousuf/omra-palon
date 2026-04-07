This is a more professional, scalable approach. **TanStack Start** (the new full-stack framework from TanStack) combined with **Supabase** gives you incredible speed and type safety.

Since you want a **mobile-only UI**, we will build a responsive web app that is constrained to a mobile width on desktop screens.

---

### Phase 1: Database & Backend (Supabase)
**Task 1.1: Create Supabase Project**
*   Initialize a new project in the Supabase dashboard.

**Task 1.2: Define the Schema (SQL)**
Create the following tables:
*   `profiles`: `id (uuid, PK)`, `full_name (text)`, `role (text: 'admin' | 'member')`, `avatar_url (text)`.
*   `payments`: `id (uuid, PK)`, `user_id (references profiles)`, `amount (numeric)`, `month (int)`, `year (int)`, `status (text: 'paid' | 'pending')`, `created_at (timestamp)`.

**Task 1.3: Set up Row Level Security (RLS)**
*   **Profiles:** Everyone can read all profiles (for transparency), but only the user can update their own.
*   **Payments:** Everyone can read all payments (transparency). Only `admins` can Insert/Update payment records.

---

### Phase 2: Frontend Setup (TanStack Start)
**Task 2.1: Initialize Project**
*   Scaffold using TanStack Start (standard template).
*   Install dependencies: `lucide-react` (icons), `shadcn/ui` (components), `tailwind-merge`, `@supabase/supabase-js`, `@tanstack/react-query`.

**Task 2.2: Mobile-First Layout Wrapper**
*   Create a `DefaultLayout` component.
*   **Task:** Use a wrapper `div` with `max-w-md mx-auto min-h-screen bg-slate-50` to force the app to look like a mobile app even on a desktop browser.

**Task 2.3: Supabase Client Integration**
*   Create a utility file to initialize the Supabase client with environment variables.

---

### Phase 3: Authentication & Authorization
**Task 3.1: Login Page**
*   Build a simple Magic Link or Password login page.
*   Redirect users to the `/dashboard` upon successful login.

**Task 3.2: Auth Middleware/Loaders**
*   Use TanStack Start loaders to check if a user is authenticated before rendering the Dashboard.
*   Protect Admin routes using a check against the `profiles.role` column.

---

### Phase 4: The Dashboard (Mobile UI)
**Task 4.1: Summary Cards (Top Section)**
*   **Component:** `TotalFundCard` — Fetch sum of all 'paid' records.
*   **Component:** `MonthlyProgressBar` — Calculate `(paid_count / total_members) * 100`.

**Task 4.2: Payment Status List (Main Section)**
*   Fetch all members and their payment status for the **current month**.
*   **UI:** Use a list of avatars. Show a green checkmark ✅ for paid and a grey clock ⏳ for pending.

**Task 4.3: Personal History Tab**
*   A "My Contributions" section showing a vertical timeline of every month the logged-in user has paid.

---

### Phase 5: Admin Features
**Task 5.1: "Mark as Paid" Mutation**
*   Create a **TanStack Server Function** to handle the payment logic.
*   **UI:** Admin clicks a "Pending" user $\rightarrow$ Opens a Bottom Sheet (Drawer) $\rightarrow$ Click "Confirm 3000 BDT".
*   Trigger `invalidateQueries` to refresh the dashboard instantly.

**Task 5.2: Month/Year Selector**
*   Add a dropdown to view data from previous months (e.g., "September 2023").

---

### Phase 6: Mobile UX Enhancements
**Task 6.1: Bottom Navigation Bar**
*   Create a sticky bottom nav with three buttons: `Dashboard`, `Members`, and `Settings`.

**Task 6.2: Pull-to-Refresh**
*   Implement standard mobile behavior to refresh the payment list.

**Task 6.3: PWA Setup (Progressive Web App)**
*   Configure `manifest.json` and a service worker so friends can "Install" the website as an app on their phone home screen (removing the browser URL bar).

---

### Phase 7: Deployment
**Task 7.1: Environment Variables**
*   Set up `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your hosting provider (Vercel or Netlify).

**Task 7.2: Build and Deploy**
*   Run `npm run build` and deploy.

---

### Technical Stack Summary:
*   **Framework:** TanStack Start (SSR, Routing, Server Functions).
*   **Database/Auth:** Supabase.
*   **State Management:** TanStack Query (built into Start).
*   **Styling:** Tailwind CSS + Shadcn/UI.
*   **Icons:** Lucide React.

### Why this is better than Glide for a developer:
1.  **Zero Cost:** Supabase and Vercel have generous free tiers that will easily handle a group of friends for free forever.
2.  **Real-time:** You can enable Supabase Realtime so if the Admin marks someone as paid, the dashboard updates on everyone's phone instantly without refreshing.