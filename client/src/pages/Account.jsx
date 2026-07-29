/**
 * @file Account page. Landing page for unauthenticated users, offering
 * Auth0 log in / sign up. Redirects straight to the dashboard if the
 * user is already authenticated.
 */

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

/**
 * Auth0-backed login/signup landing page. Shows a loading state while
 * Auth0 determines auth status, redirects authenticated users to
 * /dashboard, and otherwise renders Log In / Sign Up buttons.
 * @returns {JSX.Element} The rendered account page.
 */
export default function Account() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();

  /**
   * Redirects to /dashboard once Auth0 confirms the user is already
   * authenticated, so logged-in users don't see the login screen.
   */
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Checking Status...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to Take_A_Break_Uno</h2>
        <p style={{ margin: '1rem 0', color: 'var(--text-muted, #666)', fontSize: '0.95rem', lineHeight: '1.4' }}>
          Log in or create an account to start tracking your core challenges, managing your customized timers, and saving your user settings securely.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
          {/* Triggers Auth0 Login Screen */}
          <button 
            className="btn-accent" 
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
          
          {/* Triggers Auth0 Signup Screen Directly */}
          <button 
            className="btn-accent" 
            style={{ backgroundColor: 'transparent', border: '2px solid currentColor' }}
            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}