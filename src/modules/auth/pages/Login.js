import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Generate a unique token for each user to prevent CSRF
  const csrfToken = Math.random().toString(36).substr(2);

  function handleLogin(e) {
    e.preventDefault();

    try {
      // Use parameterized queries with prepared statements to prevent SQL injection
      fetch('http://example.com/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'X-CSRF-Token': csrfToken,  // Add the token in the header for CSRF protection
        },
        body: JSON.stringify({
          username,
          password,
          csrftoken: csrfToken,   // Send the token with each request to prevent CSRF attacks
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Login successful!');
          } else {
            alert('Login failed!');
          }
        })
        .catch(error => console.error('Error logging in:', error));
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          onChange={(e) => setUsername(e.target.value)} 
          type="text"
          value={username}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          onChange={(e) => setPassword(e.target.value)} 
          type="password"
          value={password}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
