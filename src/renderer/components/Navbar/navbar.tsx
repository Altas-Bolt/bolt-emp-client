import { Menu } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getIpAddress } from 'utils/helperFunctions';
import { NavbarStylesLayout } from './navbar.styles';

const navItems = [
  {
    key: '/dashboard',
    label: 'dashboard',
  },
  {
    key: '/dashboard/minion',
    label: 'minion',
  },
  {
    key: '/dashboard/cmd',
    label: 'cmd',
  },
];

const Navbar: React.FC = ({}) => {
  const navigate = useNavigate();

  return (
    <NavbarStylesLayout>
      <p className="ip-text">The IP of this device is {getIpAddress()}</p>{' '}
    </NavbarStylesLayout>
  );
};

export default Navbar;
