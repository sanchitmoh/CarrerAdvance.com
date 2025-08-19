# CareerAdvance.com Frontend

A modern React-based frontend for CareerAdvance.com - a comprehensive career development platform connecting students, teachers, job seekers, companies, and employers.

## Features

- **Multi-Role Authentication**: Separate login/register/forgot password flows for:
  - Teachers
  - Students  
  - Drivers
  - Employers
  - Companies
  - Job Seekers

- **Public Pages**:
  - Landing page with hero section and job search
  - Courses catalog with filtering
  - Career blog with articles
  - Job listings with search functionality

- **Modern UI/UX**:
  - Responsive design with Tailwind CSS
  - shadcn/ui components
  - Toast notifications
  - Form validation
  - Loading states

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Form Handling**: Built-in React hooks with validation

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
careeradvance-frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── courses/           # Courses section
│   ├── blogs/             # Blog section
│   ├── jobs/              # Job listings
│   ├── teachers/          # Teacher auth pages
│   ├── students/          # Student auth pages
│   ├── drivers/           # Driver auth pages
│   ├── employers/         # Employer auth pages
│   ├── companies/         # Company auth pages
│   └── job-seekers/       # Job seeker auth pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx        # Navigation component
│   ├── Footer.tsx        # Footer component
│   ├── Hero.tsx          # Landing page hero
│   ├── AuthForm.tsx      # Authentication form
│   ├── CourseCard.tsx    # Course display card
│   ├── BlogCard.tsx      # Blog article card
│   └── JobCard.tsx       # Job listing card
└── lib/                  # Utility functions
\`\`\`

## Authentication Routes

Each user role has dedicated authentication pages:

- `/teachers/login` - Teacher login
- `/teachers/register` - Teacher registration  
- `/teachers/forgot-password` - Teacher password reset
- `/students/login` - Student login
- `/students/register` - Student registration
- `/students/forgot-password` - Student password reset
- And similar patterns for other roles...

## API Integration

The frontend is designed to work with a CodeIgniter backend. API integration points are prepared in the components and can be easily connected when the backend is ready.

Key integration areas:
- Authentication endpoints
- Course data fetching
- Blog content management
- Job listings and search
- User profile management

## Customization

The design uses a consistent emerald green color scheme that can be easily customized in the Tailwind configuration. The component structure is modular and allows for easy modifications and extensions.

## Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new components
3. Ensure responsive design for all new features
4. Test authentication flows for all user roles
5. Maintain consistent styling with the design system

## License

This project is proprietary to CareerAdvance.com.
