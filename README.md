# SupFileFrontend

A modern file management system built with React, TypeScript, and Firebase. This application provides a cloud-based file storage solution with features like file sharing, favorites, trash management, and user authentication.

## 🚀 Features

- **User Authentication** - Secure login, signup, and email verification with password reset functionality
- **File Management** - Upload, download, delete, and organize files
- **Folder Operations** - Create and manage folders with drag-and-drop support
- **Sharing** - Share files with other users with customizable permissions
- **Favorites** - Mark important files and access them quickly
- **Trash/Recycle Bin** - Temporarily store deleted files with restore capability
- **Search & Browse** - Search files and browse with multiple view options
- **File Preview** - Preview files before opening them
- **Dark Mode** - Theme switching between light and dark modes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Recent Files** - Quick access to recently accessed files
- **Statistics** - View storage usage and file statistics

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router
- **Authentication**: Firebase Auth with social login (Google, Microsoft)
- **Code Quality**: ESLint

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn package manager
- Firebase project configured

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SupFileFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 🚀 Getting Started

### Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Breadcrumbs.tsx
│   ├── FileExplorer.tsx
│   ├── Modal.tsx
│   └── ...
├── contexts/            # React Context for global state
│   ├── FileSystemContext.tsx
│   └── ThemeContext.tsx
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Main dashboard pages
│   └── layouts/        # Layout components
├── services/           # API and external service calls
│   ├── auth.ts
│   ├── file.ts
│   ├── firebase.ts
│   └── ...
├── utils/              # Utility functions and helpers
│   ├── cn.ts
│   └── fileUtils.tsx
├── App.tsx             # Main App component
├── Router.tsx          # Route configuration
└── main.tsx            # Application entry point
```

## 🔐 Authentication

The application supports multiple authentication methods:
- Email/Password authentication
- Google Sign-In
- Microsoft Sign-In
- Email verification
- Password reset functionality

## 🗂️ Key Features Details

### File Management
- Upload multiple files
- Create and manage folders
- Move files and folders
- Copy file sharing links
- Delete and restore files

### Sharing
- Share files with specific users
- Generate public sharing links
- Set expiration dates for shared files
- Control read/write permissions

### Dashboard Views
- **My Drive** - Your personal file storage
- **Shared with Me** - Files shared by others
- **Recent** - Recently accessed files
- **Favorites** - Your marked favorite files
- **Stats** - Storage statistics and usage
- **Trash** - Deleted files (recoverable)

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

## 📦 Deployment

The project includes a `Dockerfile` for containerization and `vercel.json` for Vercel deployment.

### Deploy to Vercel

```bash
vercel deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

## 🗺️ Roadmap

- [ ] Advanced search filters
- [ ] Batch operations
- [ ] Custom file tags
- [ ] Activity log
- [ ] Version history for files
- [ ] Collaboration features