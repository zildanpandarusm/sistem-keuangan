import Utama from '../components/HalamanUtama';
import Layout from './Layout';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Me } from '../features/Auth';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(Me());
    if (isError) {
      navigate('/login');
    }
  }, [dispatch, isError, navigate]);
  return (
    <div>
      <Layout judul="Dashboard">
        <Utama />
      </Layout>
    </div>
  );
};

export default Dashboard;
