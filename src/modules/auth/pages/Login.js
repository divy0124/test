import { useState } from 'react';

function Login({ username }) {
  const [userInput, setUserInput] = useState('');

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <textarea
        onChange={handleChange}
        placeholder="Type something here..."
        value={userInput}
      />
      <p>Output:</p>
      {/* This is vulnerable to XSS attacks */}
      <div dangerouslySetInnerHTML={{ __html: userInput }} />
    </div>
  );
}

export default Login;
