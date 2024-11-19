import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page after successful signup
    } catch (err) {
      setError(err.message); // Display error to user
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
        <h2 className='text-center mb-4'>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label small'>
              Email
            </label>
            <input
              id='email'
              type='email'
              className='form-control border-bottom'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ border: 'none', borderRadius: 0, paddingLeft: 0 }}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label small'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className='form-control border-bottom'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ border: 'none', borderRadius: 0, paddingLeft: 0 }}
            />
          </div>
          {error && <p className='text-danger small'>{error}</p>}
          <button
            type='submit'
            className='btn btn-primary w-100 mt-3'
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;