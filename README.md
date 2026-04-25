# Business Cards Management System

A modern, responsive web application for managing business cards built with Next.js, TypeScript, Material-UI, and Firebase.

## 🚀 Features

- **Responsive Design**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Business Card Management**: Add, view, edit, and delete business cards
- **Search & Filter**: Search by name, title, or company
- **Data Grid**: Interactive table with sorting and pagination
- **Firebase Integration**: Real-time data storage with Firestore
- **Modern UI**: Clean, professional interface with Material-UI components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **State Management**: React Hooks
- **Icons**: Material-UI Icons

## 📱 Mobile-First Design

The application is designed with a mobile-first approach:

- Full-screen modals on mobile devices
- Responsive data grid with horizontal scrolling
- Touch-friendly buttons and interactions
- Optimized typography and spacing for small screens

## 🏗️ Project Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── CustomDataGrid.tsx      # Styled DataGrid wrapper
│   │   ├── ProfileModal.tsx        # Add/Edit/View modal
│   │   └── DataGridList/
│   │       └── ProfilesDataList.tsx # Main data display component
│   ├── hooks/
│   │   └── useProfiles.tsx         # Custom hook for profile management
│   ├── lib/
│   │   └── services/
│   │       └── profilesService.tsx # Firebase service layer
│   ├── types/
│   │   └── profile.tsx             # TypeScript type definitions
│   ├── layout.tsx                  # Root layout component
│   ├── page.tsx                    # Home page
│   ├── providers.tsx               # Context providers
│   └── theme.tsx                   # Material-UI theme configuration
├── firebaseConfig.ts               # Firebase configuration
└── globals.css                     # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager (see [YARN_SETUP.md](./YARN_SETUP.md) for setup instructions)
- Firebase project

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd business-cards
```

2. Install dependencies:

```bash
yarn install
```

3. Set up Firebase:

   - Create a Firebase project
   - Enable Firestore Database
   - Copy your Firebase config to `firebaseConfig.ts`

4. Run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Model

Each business card profile includes:

- **Customer Information**: Name, Customer ID, Job Title, Company Name
- **Contact Details**: Phone numbers, Email
- **Social Media**: Facebook, Instagram, Twitter, TikTok, LinkedIn, YouTube
- **Website**: Website URL, Description

## 🎨 Customization

### Theme

Modify `src/app/theme.tsx` to customize colors, typography, and component styles.

### Styling

Global styles can be updated in `src/app/globals.css`. Component-specific styles use Material-UI's `sx` prop.

### Responsive Breakpoints

- `xs`: 0px - 600px (Mobile)
- `sm`: 600px - 900px (Tablet)
- `md`: 900px - 1200px (Small Desktop)
- `lg`: 1200px+ (Large Desktop)

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn install-deps` - Install dependencies
- `yarn clean` - Clean yarn cache
- `yarn type-check` - Run TypeScript type checking

## 📱 Mobile Optimization

The application includes several mobile-specific optimizations:

- **Full-screen modals** on mobile devices
- **Responsive data grid** with horizontal scrolling
- **Touch-friendly buttons** with appropriate sizing
- **Optimized typography** for readability on small screens
- **Flexible layouts** that adapt to different screen sizes

## 🚀 Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Firebase Hosting**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.