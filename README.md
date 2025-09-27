<div align="center">
  <img src="/public/readme_banner.png" alt="Darasa Banner" width="100%" />
</div>

<div align="center">

# 🎯 Darasa - AI-Powered Job Preparation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub stars](https://img.shields.io/github/stars/TanvirAnjumApurbo/darasa?style=social)](https://github.com/TanvirAnjumApurbo/darasa/stargazers) [![GitHub forks](https://img.shields.io/github/forks/TanvirAnjumApurbo/darasa?style=social)](https://github.com/TanvirAnjumApurbo/darasa/network) [![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/TanvirAnjumApurbo/darasa/actions)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/) [![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/) [![Arcjet](https://img.shields.io/badge/Arcjet-Security-FF6B6B?logo=shield&logoColor=white)](https://arcjet.com/) [![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/) [![Hume AI](https://img.shields.io/badge/Hume-AI-FF4081?logo=brain&logoColor=white)](https://hume.ai/)
[![Neon DB](https://img.shields.io/badge/Neon-Database-00D9FF?logo=postgresql&logoColor=white)](https://neon.tech/) [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=database&logoColor=black)](https://orm.drizzle.team/) [![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

**Transform your job search with AI-powered interview practice, resume optimization, and technical question preparation. Land your dream job faster with confidence.**

[🚀 Get Started](https://darasa-lake.vercel.app/) • [📖 Documentation](https://github.com/TanvirAnjumApurbo/darasa/tree/main/.qoder/repowiki/en/content) • [💬 Support](https://github.com/TanvirAnjumApurbo/darasa/issues)

</div>

---

## 📋 Table of Contents

- [🎯 About](#-about)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Environment Variables](#-environment-variables)
- [💡 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [🗺️ Roadmap](#️-roadmap)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🎯 About

**Darasa** is a comprehensive AI-powered job preparation platform that I built to help professionals ace their interviews and land their dream jobs. This personal project combines cutting-edge artificial intelligence with proven interview strategies to provide personalized preparation experiences.

### 🎯 What Problem I Solve

- **Interview Anxiety**: Practice with realistic AI interviews to build confidence
- **Resume Optimization**: Get ATS-friendly resumes that pass initial screenings
- **Technical Preparation**: Master the topics with answer feedback

### 🌟 Why Choose Darasa?

- Real-time AI feedback and adaptive learning
- Industry-specific questions and realistic role scenarios
- Parallel preparation for multiple target job positions (e.g., Frontend Engineer, Data Analyst, Product Manager) with dedicated, role-specific tracks you can switch between

---

## ✨ Features

### 🤖 **AI Interview Practice**

- Real-time voice interaction with advanced AI interviewer
- Behavioral, technical, and case study question scenarios
- Personalized feedback on communication style and content

### 📝 **Smart Resume Analysis**

- ATS compatibility scoring and optimization suggestions
- Job description matching analysis
- Industry-specific keyword recommendations
- Before/after impact measurement

### 💻 **Technical Question Mastery**

- Company-specific interview patterns and question types
- Adaptive difficulty tiers (Easy/Medium/Hard) auto-generated from your job profile and recent performance
- Detailed post-question feedback

### 🎨 **Modern User Experience**

- Beautiful, responsive design with dark/light mode support
- Intuitive interface with smooth animations
- Mobile-first approach for practice anywhere
- Accessibility-focused design principles

---

## 🛠️ Tech Stack

### **Frontend & UI**

- **Next.js 15** - React framework with App Router
- **React 19** - Modern React with concurrent features
- **TailwindCSS v4** - Utility-first styling framework
- **shadcn/ui** - Beautiful and accessible UI components
- **TypeScript** - Type-safe development
- **Lucide React** - Beautiful icon library

### **Database & ORM**

- **Neon Database** - Serverless PostgreSQL platform
- **Drizzle ORM** - Type-safe database toolkit
- **Zod** - Schema validation library

### **Authentication & Security**

- **Clerk** - Complete authentication solution
- **Arcjet** - Security and rate limiting
- **Middleware** - Route protection and security

### **AI & APIs**

- **Gemini AI** - Google's advanced language model
- **Hume AI** - Emotion and voice analysis
- **AI SDK** - Unified AI integration toolkit

### **DevOps & Infrastructure**

- **Docker** - Containerization and deployment
- **Vercel** - Deployment and hosting platform
- **ESLint** - Code linting and formatting
- **Turbopack** - Fast build tool

---

## 📁 Project Structure

```
darasa/
├── 📁 public/                    # Static assets and images
│   ├── favicon.ico
│   ├── logo.png
│   └── readme_banner.png
├── 📁 src/
│   ├── 📁 app/                   # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout component
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Global styles and CSS variables
│   │   ├── 📁 api/               # API routes
│   │   │   ├── 📁 ai/            # AI-related endpoints
│   │   │   ├── 📁 arcjet/        # Security endpoints
│   │   │   └── 📁 webhooks/      # External service webhooks
│   │   ├── 📁 app/               # Main application pages
│   │   │   ├── 📁 job-infos/     # Job information management
│   │   │   └── 📁 upgrade/       # Subscription and billing
│   │   ├── 📁 onboarding/        # User onboarding flow
│   │   └── 📁 sign-in/           # Authentication pages
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/                # Base UI components (buttons, cards, etc.)
│   │   └── *.tsx                 # Feature-specific components
│   ├── 📁 data/                  # Data access and environment config
│   │   └── 📁 env/               # Environment variable schemas
│   ├── 📁 drizzle/               # Database schema and migrations
│   │   ├── schema.ts             # Database schema definitions
│   │   ├── db.ts                 # Database connection
│   │   └── 📁 migrations/        # Database migration files
│   ├── 📁 features/              # Feature-specific business logic
│   │   ├── 📁 interviews/        # Interview practice features
│   │   ├── 📁 jobInfos/          # Job information features
│   │   ├── 📁 questions/         # Technical questions features
│   │   └── 📁 users/             # User management features
│   ├── 📁 lib/                   # Utility functions and helpers
│   └── 📁 services/              # External service integrations
│       ├── 📁 ai/                # AI service providers
│       ├── 📁 arcjet/            # Security services
│       ├── 📁 clerk/             # Authentication services
│       └── 📁 hume/              # Voice/emotion AI services
├── 📄 docker-compose.yml         # Local development containers
├── 📄 drizzle.config.ts          # Database ORM configuration
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tailwind.config.ts         # TailwindCSS configuration
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 package.json               # Dependencies and scripts
```

---

## 🚀 Getting Started

### **Prerequisites**

Make sure you have the following installed on your system:

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Docker** (optional, for containerized development)
- **Git**

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/TanvirAnjumApurbo/darasa.git
   cd darasa
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env` and add your API keys (see [Environment Variables](#-environment-variables))

4. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### **Using Docker (Optional)**

For a containerized development environment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

# Arcjet
ARCJET_KEY=

# Database Configuration (Using Neon - DB_* vars kept as fallback)
# DB_HOST=
# DB_PORT=
# DB_USER=
# DB_PASSWORD=
# DB_NAME=

# Hume AI Configuration
HUME_API_KEY=
HUME_SECRET_KEY=
NEXT_PUBLIC_HUME_CONFIG_ID=

# Gemini AI Configuration
GEMINI_API_KEY=

DATABASE_URL=
```

### **Required API Keys**

1. **Database**: Sign up at [Neon](https://neon.com/) or use local PostgreSQL
2. **Authentication**: Create account at [Clerk](https://clerk.com/)
3. **AI Services**: Get keys from [Gemini](https://ai.google.dev/) and [Google AI Studio](https://aistudio.google.com)
4. **Voice AI**: Register at [Hume AI](https://www.hume.ai/)
5. **Security**: Set up at [Arcjet](https://arcjet.com/)

---

## 💡 Usage

### **For Job Seekers**

1. **Sign Up**: Create your account and complete the onboarding process
2. **Practice Interviews**: Start with AI-powered mock interviews
3. **Optimize Resume**: Upload and get personalized optimization suggestions
4. **Technical Prep**: Solve problems and see the feedback

### **Key Commands**

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint checks

# Database
npm run db:generate      # Generate database migrations
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run pending migrations
npm run db:studio        # Open Drizzle Studio (database GUI)
```

### **API Endpoints**

- `GET /api/ai/interview` - Start AI interview session
- `POST /api/ai/resume` - Analyze resume
- `GET /api/ai/questions` - Get technical questions
- `POST /api/webhooks/clerk` - Handle authentication webhooks

---

## 🤝 Contributing

This is a personal project, but I welcome contributions and feedback from the community! Here's how you can contribute:

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Contribution Guidelines**

- Follow the existing code style and conventions
- Write clear commit messages
- Include tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 🗺️ Roadmap

### **Completed ✅**

- [x] AI interview practice with voice interaction
- [x] Resume analysis and optimization
- [x] Technical question practice platform
- [x] User authentication and profiles
- [x] Responsive design with dark/light themes

### **Planned 🎯**

- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Advanced Analytics** - Detailed performance insights and recommendations
- [ ] **Video Interview Practice** - Record and analyze video interview sessions
- [ ] **Interview Scheduling** - Integration with calendar and scheduling tools
- [ ] **Skills Assessment** - Comprehensive technical and soft skills evaluation
- [ ] **Multi-language Support** - Support for interviews in different languages

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Ready to transform your career?** 🚀

[![Get Started](https://img.shields.io/badge/Get%20Started-Now-blue?style=for-the-badge&logo=rocket)](https://darasa-lake.vercel.app/)
[![Star on GitHub](https://img.shields.io/badge/Star%20on-GitHub-yellow?style=for-the-badge&logo=github)](https://github.com/TanvirAnjumApurbo/darasa)

---

**Made with ❤️ by Tanvir Anjum Apurbo**

[Website](https://darasa-lake.vercel.app/) • [GitHub](https://github.com/TanvirAnjumApurbo/darasa) • [Support](mailto:anjumtanvir667@gmail.com)

</div>
