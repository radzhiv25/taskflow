import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const response = await axios.post(`http://localhost:5001${endpoint}`, { email, password });

      if (isRegister) {
        alert('Registration successful! Please log in.');
        setIsRegister(false);
      } else {
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-lg font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p
          className="mt-4 text-sm text-center text-blue-500 cursor-pointer"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? 'Already have an account? Login here.'
            : "Don't have an account? Register here."}
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;