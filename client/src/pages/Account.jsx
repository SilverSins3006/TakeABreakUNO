import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();

  // If already authenticated, redirect them away from the login page automatically
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="card"><h2>Loading...</h2></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to Challenge App</h2>
        <p style={{ margin: '1rem 0', color: '#666' }}>
          Please log in or create an account to track your core challenges and settings.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            className="btn-accent" 
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
          
          <button 
            className="btn-accent" 
            style={{ backgroundColor: 'transparent', border: '1px solid currentColor' }}
            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}