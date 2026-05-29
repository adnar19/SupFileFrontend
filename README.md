# 📁 SupFile - Frontend

Welcome to the frontend of **SupFile**, a cloud storage application (similar to Google Drive) that provides seamless file and folder management with secure authentication.

This project is built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Features

### 🔐 Authentication
- **Email & Password Login** - Traditional authentication method
- **Google OAuth Integration** - Secure sign-in via Firebase
- **User Registration** - Create new accounts with email verification
- **Session Management** - JWT tokens stored in secure HttpOnly cookies
- **Protected Routes** - Private route guards for authenticated users

### 📂 File & Folder Management
- **Upload Files** - Support for various file types with quota management
- **Organize Folders** - Create, rename, and manage folder hierarchy
- **Breadcrumb Navigation** - Easy navigation through folder structure
- **Drag & Drop** - Intuitive file organization (client-side support)
- **Delete & Restore** - Soft delete with trash/recycle bin functionality
- **Download Files** - Individual files or complete folders as ZIP

### 📊 Dashboard
- **Storage Statistics** - View your usage and remaining quota
- **File Type Distribution** - Visual charts for Images, Videos, Documents
- **Recent Files** - Quick access to recently viewed or modified files

### 🔍 Search & Filter
- **Advanced Search** - Find files by name with case-insensitive matching
- **File Type Filters** - Filter by document type, creation date, etc.

### 🎨 User Experience
- **Theme Support** - Light/Dark mode toggle
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Loading States** - Smooth spinners and loading indicators
- **Toast Notifications** - Real-time feedback for user actions
- **Accessibility** - Built with semantic HTML and keyboard navigation

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | ~5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool & dev server |
| Tailwind CSS | 3.4.19 | Utility-first styling |
| React Router | 7.12.0 | Client-side routing |
| Firebase | 12.8.0 | Authentication & OAuth |
| Axios | 1.13.4 | HTTP client |
| Lucide React | 0.562.0 | Icon library |
| React Toastify | 11.0.5 | Toast notifications |
| React Spinners | 0.17.0 | Loading indicators |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm 9+ (or yarn/pnpm)
- Firebase project setup

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SupFileFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file** (`.env.local`)
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (default Vite port)

---

## 📝 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── GoogleIcon.tsx   # Google OAuth icon component
│   └── PrivateRoute.tsx # Route protection component
├── pages/              # Page components (full screens)
│   ├── home.tsx        # Home/dashboard page
│   ├── Login/          # Authentication pages
│   │   ├── login.tsx
│   │   └── sign_up.tsx
│   └── not-found.tsx   # 404 page
├── contexts/           # React context for global state
│   └── ThemeContext.tsx # Theme (light/dark mode) management
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── services/           # API services & external integrations
├── utils/              # Utility functions and helpers
├── assets/             # Static assets (images, fonts, etc.)
├── App.tsx             # Root component with toast container
├── Router.tsx          # Route definitions
├── main.tsx            # Application entry point
├── index.css           # Global styles
├── App.css             # App-specific styles
└── vite-env.d.ts       # Vite environment type definitions
```

---

## 🔗 API Integration

The frontend communicates with the backend API via Axios. Ensure the backend is running on the configured `VITE_API_BASE_URL` (default: `http://localhost:5000`).

### Key API Endpoints Used:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/files` - Fetch files and folders
- `POST /api/files/upload` - Upload files
- `DELETE /api/files/:id` - Delete files
- `GET /api/search` - Search files

---

## 🔐 Authentication Flow

1. **Firebase Integration**: User authenticates via Firebase (email or Google OAuth)
2. **Backend Verification**: Frontend sends Firebase token to backend
3. **JWT Token**: Backend returns JWT token stored in HttpOnly cookie
4. **Protected Routes**: Subsequent requests include JWT for authorization
5. **Session**: User remains logged in until logout or token expiration

---

## 🎨 Styling

The project uses **Tailwind CSS** for styling with custom configuration:
- Utility-first approach for rapid development
- Custom color schemes for light/dark themes
- Responsive design patterns
- PostCSS for vendor prefixing

### Key Configuration Files:
- `tailwind.config.js` - Tailwind customization
- `postcss.config.js` - PostCSS plugins
- `index.css` - Global styles and Tailwind imports

---

## 🚀 Development Workflow

### Hot Module Replacement (HMR)
Vite provides fast HMR during development. Changes are reflected instantly in the browser without full page reload.

### TypeScript Type Checking
```bash
npx tsc --noEmit
```

### ESLint
```bash
npm run lint
```

---

## 🏗️ Building for Production

```bash
npm run build
```

This command:
1. Runs TypeScript compiler for type checking
2. Bundles the application with Vite
3. Outputs optimized files to `dist/` folder
4. Ready for deployment to static hosting (Vercel, Netlify, etc.)

### Preview Build Locally
```bash
npm run preview
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS plugins |
| `eslint.config.js` | ESLint rules |
| `.env.local` | Environment variables (not in git) |

---

## 🌐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically use the next available port.

### Environment Variables Not Loading
- Ensure `.env.local` file exists in the project root
- Restart dev server after creating/modifying `.env.local`
- Variables must start with `VITE_` prefix to be accessible in the app

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase Authentication Issues
- Verify Firebase credentials in `.env.local`
- Check Firebase project security rules
- Ensure backend is running and accessible

---

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 🤝 Contributing

1. Create a new branch for your feature: `git checkout -b feature/my-feature`
2. Make your changes and commit: `git commit -m 'Add my feature'`
3. Push to the branch: `git push origin feature/my-feature`
4. Open a Pull Request

---

## 📄 License

This project is part of the SupFile application. All rights reserved.

---

## 📧 Support

For issues or questions, please reach out to the development team or open an issue in the repository.

---

**Happy Coding! 🚀**
