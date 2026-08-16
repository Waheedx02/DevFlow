# ⚡ DevFlow — Modern Code Snippet Manager

<p align="center">
  <b>A secure, full-stack developer tool designed to store, organize, and manage private code snippets with ease.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" />
</p>

---

## ✨ Key Features

* **Secure Private Vault:** All saved code snippets are strictly private and bound securely to your authenticated account.
* **Modern Developer Dashboard:** Explore popular snippets or manage your personal collection with dedicated routes (`/dashboard` and `/dashboard/my-snippets`).
* **Multi-Language Support:** Syntax highlighting and dedicated tags for JavaScript, TypeScript, Python, SQL, YAML, JSON, and more.
* **Robust Authentication:** Custom-styled sign-in and sign-up flows powered by **Clerk**, featuring Google OAuth integration and intelligent error redirection (e.g., prompting unregistered Google profiles straight to sign-up).
* **Sleek Dark Theme:** Carefully engineered developer-first UI built with Tailwind CSS, featuring smooth transitions, monospace blocks, and responsive layouts.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Library:** [React](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Auth:** [Clerk](https://clerk.com/)
* **Database & ORM:** PostgreSQL & Prisma

---

## 📁 Project Page Architecture

| Route | Description |
| :--- | :--- |
| `[ / ]` | Landing page / Root view |
| `[ /dashboard ]` | Explore feed displaying public/community snippets |
| `[ /dashboard/my-snippets ]` | Personal gallery showing only your saved private snippets |
| `[ /dashboard/add ]` | Clean creation form with title, description, language selector, and code block |
| `[ /dashboard/snippet/[id] ]` | Dynamic view page for inspecting, copying, and managing individual snippets |

---

## 🚀 Getting Started Locally

Follow these steps to set up and run DevFlow on your local machine:

### 1. Clone the Repository
```bash
git clone [https://github.com/Waheedx02/DevFlow.git](https://github.com/Waheedx02/DevFlow.git)
cd DevFlow
