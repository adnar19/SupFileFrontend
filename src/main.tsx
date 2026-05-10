import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import AppRouter from "./Router";
import { FileSystemProvider } from './contexts/FileSystemContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <FileSystemProvider>
        <App />
        <AppRouter />
      </FileSystemProvider>
    </ThemeProvider>
  </StrictMode>,
)
