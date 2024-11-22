/* eslint-disable */
import { useState } from 'react';

function Login({ username }) {
  const a =        'test';
  const [userInput, setUserInput] = useState('');

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  // Test Comment

  const a = (a, b) => {
    a + b;
  };

  // const a = 1;

  const test = () => {
    console.log('🚀 ~ Login ~ test:', test);
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

// Login.prototype = {
//   username: string,
// };

export default Login;
