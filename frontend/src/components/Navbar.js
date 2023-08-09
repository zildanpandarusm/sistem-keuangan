import React, { useState, useEffect } from 'react';
import { Logout, reset } from '../features/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './css/style.css';

const Navbar = (props) => {
  const [isActive, setIsActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasil = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(Logout());
    dispatch(reset());
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const logoutNavbarElement = document.querySelector('.logoutNavbar');
      const profileNavbarElement = document.querySelector('.profile');

      if (!logoutNavbarElement.contains(event.target) && !profileNavbarElement.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNavbar = () => {
    setIsActive(!isActive);
  };

  return (
    <div>
      <nav className="navbar">
        <h1 className="judul">{props.judul}</h1>
        <div className={`profile ${isActive ? 'active' : ''}`} onClick={toggleNavbar}>
          {hasil && hasil.user && (
            <>
              <h4>{hasil.user.role}</h4>
              <img src={hasil.user.url} alt="Profile" />
            </>
          )}
        </div>
        <div className={`logoutNavbar ${isActive ? 'active' : ''}`}>
          <button onClick={handleLogout}>
            <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
