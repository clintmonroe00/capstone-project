import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div
      className='d-flex justify-content-center bg-light min-vh-100'
      style={{ paddingTop: '100px' }}
    >
      <div
        className='card p-4'
        style={{
          width: '400px',
          maxWidth: '90%',
          alignSelf: 'flex-start', // Prevent card from stretching
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 className='text-center mb-4'>Login</h2>
        <form onSubmit={handleLogin}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label small'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='form-control border-bottom'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: 'none', borderRadius: 0, paddingLeft: 0 }}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label small'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='form-control border-bottom'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: 'none', borderRadius: 0, paddingLeft: 0 }}
            />
          </div>
          <button
            type='submit'
            className='btn btn-primary w-100 mt-3'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;