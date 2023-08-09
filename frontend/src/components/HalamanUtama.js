import React from 'react';
import PendapatanChart from './charts/PendapatanChart';
import './css/style.css';
import PengeluaranChart from './charts/PengeluaranChart';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const hasil = useSelector((state) => state.auth);
  return (
    <div className="dashboard">
      {hasil.user && (
        <>
          <h2>
            Selamat Datang <span>{hasil.user.nama}</span>
          </h2>
          <p>Aplikasi ini digunakan untuk memanajemen keuangan di perusahaan.</p>
          <div className="dashChart">
            <div className="chart">
              <h4>Pendapatan Seminggu Terakhir</h4>
              <PendapatanChart />
            </div>
            <div className="chart">
              <h4>Pengeluaran Seminggu Terakhir</h4>
              <PengeluaranChart />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
