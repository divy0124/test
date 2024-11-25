import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // SQL Injection vulnerability: User input is sent directly to the backend without sanitization
    const body = JSON.stringify({ username, password });

    try {
      // CSRF vulnerability: No token or protection mechanism is used
      const response = await fetch('http://example.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        alert('Login successful!');
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          onChange={(e) => setUsername(e.target.value)} // No validation or sanitization
          type="text"
          value={username}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          onChange={(e) => setPassword(e.target.value)} // No validation or sanitization
          type="password"
          value={password}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
