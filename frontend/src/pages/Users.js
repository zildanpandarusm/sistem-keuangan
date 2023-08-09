import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Me } from '../features/Auth';
import Layout from './Layout';
import Pengguna from '../components/Users';

const PenggunaPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(Me());
    if (isError) {
      navigate('/login');
    }
  }, [dispatch, isError, navigate]);
  return (
    <div>
      {user && (
        <Layout judul="Pengguna">
          <Pengguna />
        </Layout>
      )}
    </div>
  );
};

export default PenggunaPages;
