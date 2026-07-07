import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();

  // If the user lands here but is already logged in, bounce them straight to the dashboard
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