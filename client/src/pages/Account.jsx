import { useState } from 'react';

/* ROADMAP: CURRENT FOCUS - MILESTONE 2 (Core Challenge + Settings) */

// TODO [WBS-1.0] [Phase: M2] - Integrate API call to Express /auth/login or /auth/signup
// TODO [WBS-1.0] [Phase: M2] - Implement JWT/Session handling after successful authentication
// TODO [WBS-1.2] [Phase: M2] - Add form validation (email format, password length)

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);

  return (
   <div className="container">
  <div className="card">
    <h2>
      {isLogin ? "Welcome Back" : "Create Account"}
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="email" placeholder="Email" className="input-field" />
      <input type="password" placeholder="Password" className="input-field" />
      {!isLogin && (
        <input type="password" placeholder="Confirm Password" className="input-field" />
      )}
    </div>

    <button className="btn-accent" style={{ marginTop: '1.5rem' }}>
      {isLogin ? "Log_In" : "Sign_Up"}
    </button>

    <p className="form-toggle" onClick={() => setIsLogin(!isLogin)}>
      {isLogin ? "Need an account? Sign up." : "Already have an account? Log in."}
    </p>
  </div>
</div>
  );
}