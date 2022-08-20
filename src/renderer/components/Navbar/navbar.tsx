import { Menu } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <Menu
      onClick={(item) => {
        navigate(item.key);
      }}
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['2']}
      items={navItems}
    />
  );
};

export default Navbar;
