import React from 'react';
import { Logout, reset } from '../features/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faWallet, faMoneyBillWave, faPeopleGroup, faFileInvoiceDollar, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasil = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(Logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <aside>
      <div className="logo">
        <img src="logo192.png" alt="logo" />
      </div>
      <ul>
        <Link to="/" className="menu">
          <FontAwesomeIcon className="icon" icon={faHouse} />
          <p>Dashboard</p>
        </Link>
        <Link to="/pendapatan" className="menu">
          <FontAwesomeIcon className="icon" icon={faWallet} />
          <p>Pendapatan</p>
        </Link>
        <Link to="/pengeluaran" className="menu">
          <FontAwesomeIcon className="icon" icon={faMoneyBillWave} />
          <p>Pengeluaran</p>
        </Link>
        <Link to="/karyawan" className="menu">
          <FontAwesomeIcon className="icon" icon={faPeopleGroup} />
          <p>Karyawan</p>
        </Link>
        <Link to="/hutang" className="menu">
          <FontAwesomeIcon className="icon" icon={faFileInvoiceDollar} />
          <p>Hutang</p>
        </Link>
        {hasil.user && hasil.user.role === 'admin' && (
          <Link to="/users" className="menu">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <p>Pengguna</p>
          </Link>
        )}
      </ul>
      <div className="logoutSidebar">
        <button onClick={handleLogout}>
          <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
