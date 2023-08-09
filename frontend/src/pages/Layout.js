import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../components/css/style.css';

const Layout = ({ children, judul }) => {
  return (
    <div>
      <Navbar judul={judul} />
      <Sidebar />
      <div className="kontenLayout">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
