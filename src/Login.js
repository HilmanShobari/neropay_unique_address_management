import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from './Axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State untuk status loading
  const navigate = useNavigate();

  useEffect(() => {
    const merchantID = localStorage.getItem('merchantID');
    if (!!merchantID) {
      navigate('/');
      return;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mengatur loading menjadi true saat mulai submit form
    try {
      const response = await login(email, password);
      console.log('Login successful:', response);
      // Arahkan ke halaman home setelah login berhasil
      navigate('/');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } finally {
      setLoading(false); // Mengatur loading kembali menjadi false setelah selesai submit form
    }
  };

  return (
    <div className="LoginForm">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {loading && <p>Loading...</p>}{' '}
        {/* Tampilkan pesan loading jika loading === true */}
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" disabled={loading}>
          Login
        </button>{' '}
        {/* Tambahkan disabled saat loading */}
      </form>
    </div>
  );
}

function Login() {
  return (
    <div className="Login">
      <LoginForm />
    </div>
  );
}

export default Login;
