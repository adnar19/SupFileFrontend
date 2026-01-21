import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import SignIn from './components/pages/Login/sign_in';
import SignUp from './components/pages/Login/sign_up';
import Home from './components/pages/Login/home';
import FileManager from './components/pages/cloud/file_manager';
import Recent from './components/pages/cloud/recent';
import Favorites from './components/pages/cloud/favorites';
import Trash from './components/pages/cloud/trash';
import AccountSettings from './components/pages/cloud/account_settings';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/file-manager" element={<FileManager />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
