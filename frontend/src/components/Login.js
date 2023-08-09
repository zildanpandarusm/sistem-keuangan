import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './css/style.css';
import { LoginUser, reset } from '../features/Auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className="login">
      <div className="box">
        <h1>LOGIN</h1>
        <form onSubmit={Auth}>
          <div className="formInput">
            <label for="email">Email</label>
            <input type="email" placeholder="Masukkan email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="formInput">
            <label for="password">Password</label>
            <input type="password" placeholder="Masukkan password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="formInput">{isLoading ? <button disabled>Loading...</button> : <button type="submit">Login</button>}</div>
          {isError && <h3 className="msg">{message}</h3>}
        </form>
        <div className="kotak"></div>
      </div>
    </div>
  );
};

export default Login;
