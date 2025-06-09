# KDrive - Google Drive Clone

A toy Google-Drive-style app built with React + TypeScript, Vite, Supabase, Prisma, Tailwind CSS and PostHog.  
Users can browse nested folders, upload files, and persist everything in your own Supabase-hosted PostgreSQL.

---

## 🚀 Tech Stack

- **Frontend**: Vite → React 18, TypeScript, Tailwind CSS v3, shadcn/ui, lucide-react  
- **Backend / DB**: Supabase (Postgres), Prisma ORM  
- **Auth & Storage**: Supabase Auth (magic links/OAuth) & Storage (presigned uploads)  
- **Analytics**: PostHog via React SDK + `/ingest` proxy  
- **Deploy & CI**: Vercel (auto-deploy) + GitHub Actions (typecheck + lint)

---

## Getting Started

1. **Install dependencies**
   ```bash
   cd frontend
   yarn install
   ```

2. **Run the development server**
   ```bash
   yarn dev
   ```

3. **Build for production**
   ```bash
   yarn build
   ```

4. **Configure Supabase**
   1. Create a new project at [Supabase](https://supabase.com) and copy the project URL and anon key.
   2. Copy `.env.example` to `.env` inside the `frontend` directory and fill in your credentials:
      ```bash
      cp frontend/.env.example frontend/.env
      ```
      Then edit `frontend/.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
