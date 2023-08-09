import Layout from './Layout';
import Karyawan from '../components/Karyawan';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Me } from '../features/Auth';

const KaryawanPages = () => {
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
        <Layout judul="Karyawan">
          <Karyawan />
        </Layout>
      )}
    </div>
  );
};

export default KaryawanPages;
