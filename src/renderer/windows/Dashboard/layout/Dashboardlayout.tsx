// Import Modules
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'renderer/components/Navbar/navbar';

// Import Styles
import { DashboardlayoutWrapper } from './Dashboardlayout.styles';

const { Header, Content, Sider } = Layout;

const items2: MenuProps['items'] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const Dashboardlayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <DashboardlayoutWrapper>
      <Layout style={{ height: '100vh' }}>
        <Header className="header">
          <div className="logo" />
          <Navbar />
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              items={items2}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {location.pathname
                .split('/')
                .splice(1)
                .reduce<
                  {
                    pathname: string;
                    label: string;
                  }[]
                >((prev, curr) => {
                  const n = [...prev];
                  n.push({
                    pathname:
                      prev.length > 0
                        ? prev[prev.length - 1].pathname + `/${curr}`
                        : `/${curr}`,
                    label: curr,
                  });
                  return n;
                }, [])
                .map(({ pathname, label }) => (
                  <Breadcrumb.Item key={label}>
                    <a
                      href={pathname}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(pathname);
                      }}
                    >
                      {label}
                    </a>
                  </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </DashboardlayoutWrapper>
  );
};

export default Dashboardlayout;
