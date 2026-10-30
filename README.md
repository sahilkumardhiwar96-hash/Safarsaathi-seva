# MMS — Migrant and Seasonal-Worker Children: Childcare, Schooling and Protection Continuity

## 1. Problem Statement & Mission
Seasonal and migrant workers in India (e.g. brick kiln workers, construction laborers, seasonal agricultural harvesters) move frequently across district and state borders with their children. This movement leads to four severe systemic gaps:
1. **Childcare Gap**: While parents work long hours, young children (under 6) are left unsupervised or taken to hazardous worksites because no creches or daycares are registered near the destination worksite.
2. **Schooling Gap**: Children drop out or fall behind because academic and attendance records do not travel with them, transfer certificates (TCs) are never issued, and no school seat is reserved at the destination.
3. **Protection Gap**: Vulnerable children with open protection cases (child labor, neglect, abuse, high vulnerability) become untracked when they migrate. Cases get lost between origin and destination Child Welfare Committees (CWCs) / District Child Protection Units (DCPUs).
4. **Continuity Gap**: Education, health/nutrition (ICDS/Poshan), and child protection function in strict departmental silos. Nobody has a single, portable record that follows the child across borders.

**MMS** provides **one unified, portable digital record per child** that follows the family when they move, with inter-district handoffs, worksite childcare discovery, school transfer certificate tracking, and automated protection alerts.

---

## 2. Architecture & Directory Structure
The platform is organized by domain features with clean boundaries:

```
src/
├── app/                  # Application core
│   ├── App.tsx           # Router with declarative paths
│   ├── Layout.tsx        # Responsive navigation shell & language switcher
│   └── routes.tsx        # Centralized route definitions
├── features/             # Domain modules (components, hooks, api.ts, types.ts)
│   ├── auth/             # Supabase Authentication & role guard
│   ├── dashboard/        # Executive overview & lost-case alerts
│   ├── children/         # Child registry, profiles, and cross-department journey
│   ├── families/         # Family ties, guardians, and inter-district movement history
│   ├── handoffs/         # Institutional handoffs between centers & districts
│   ├── centers/          # Childcare institutions, shelters, and childcare finder
│   ├── schooling/        # RTE enrollment, grade level, and school transfer tracking
│   ├── childcare/        # Creche, daycare, and anganwadi directory
│   ├── protection/       # Case notes, vulnerability tracking, CWC investigations
│   ├── health/           # Growth monitoring, MUAC, malnutrition, and immunization
│   ├── consents/         # Legal & parental consents (medical, data-sharing, etc.)
│   └── offline/          # Offline queue safeguarding pending actions
├── shared/               # Shared cross-cutting components & utilities
│   ├── ui/               # Atomic UI kit (Card, Badge, Button, Modal, Form, etc.)
│   ├── constants/        # Application labels, colors, and status maps
│   └── utils/            # Age calculation, date formatting, styling utilities
├── lib/
│   ├── supabase.ts       # Supabase client initializer (with offline/demo detection)
│   └── mockSupabase.ts   # In-memory Demo Mode database with seed data
└── i18n/
    └── languages.ts      # Multi-lingual catalogs (EN, HI, OR, BN, TA, TE)
```

---

## 3. Environment Variables & Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Populate `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```
> **Security Rule**: Never expose `service_role` keys in client-side Vite environment variables. If Supabase credentials are not provided or are placeholders, MMS automatically operates in **Demo & Offline Mode** using in-memory localStorage persistence.

---

## 4. Scripts & Quality Commands
- `npm run dev` — Starts the local Vite development server with hot-module reloading.
- `npm run typecheck` — Runs TypeScript compiler checks without emitting code.
- `npm run lint` — Runs ESLint across all TypeScript and React files.
- `npm test` — Runs the automated test suite.
- `npm run build` — Generates the optimized production build in `dist/`.

---

## 5. Applying Migrations
Apply migrations in sequence using Supabase CLI or the Supabase SQL Editor:
1. `supabase/migrations/20261028161217_create_child_welfare_schema.sql` (Base schema)
2. `supabase/migrations/20261028190000_security_and_missing_features.sql` (Family, migration, schooling tables)
3. `supabase/migrations/20261029_gap_features.sql` (Creche directory, school transfer tracking, case transfer flag)

---

## 6. End-to-End Demo Script
1. **Login & Dashboard**:
   - Access the platform at `/` or `/login`. Use credentials: `surksha21@gmail.com` / `Surksha@`.
   - The dashboard alerts staff about high-risk children who recently moved without a case transfer.
2. **Childcare Finder (`/centers`)**:
   - Switch to the **Childcare Finder** tab.
   - Filter by district (`Bargarh`, `Bolangir`) or select `Creche` to locate worksite care for migrant families.
3. **Child Profile & School Transfer (`/children/:id`)**:
   - Navigate to child **Pooja Das**.
   - Open the **Education** tab: view school transfer status and click **Request Transfer Certificate**.
4. **Protection Transfer (`Family & Migration Tab`)**:
   - Open the **Family & Migration** tab.
   - Click **Mark Case Transferred**, enter destination receiving officer (e.g. `Khurda DCPO`). The case is formally accepted and the dashboard alert clears.
5. **Unified Child Journey (`Journey Tab`)**:
   - View the chronological timeline uniting health assessments, protection notes, movements, and schooling across districts.
