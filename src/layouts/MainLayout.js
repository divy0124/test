import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

import Header from 'components/layout/Header';
import Sidebar from 'components/layout/Sidebar';

import './mainLayout.less';

function MainLayout() {
  return (
    <Layout className="main-layout">
      <Sidebar />
      <Layout className="main-content-layout">
        <Header />
        <Content className="p-25 bg-white-100">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
