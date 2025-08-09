import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes';
import './styles/style.css';
import './styles/global.css';
import './styles/transitions.css';
import './styles/portal.css';

// Define your Google client ID
const googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID

/**
 * Main App component
 * Wraps the entire application with necessary providers and layout components
 */
function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <HelmetProvider>
        <div className="app">
          <Header />
          <main className="main-content page-transition">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
}

export default App;