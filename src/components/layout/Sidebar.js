import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AnalyticsIcon,
  ConfigureIcon,
  ContestHistoryIcon,
  ContestIcon,
  DashboardIcon,
  MenuIcon,
  TouchdownIcon,
} from 'components/core/Icons';

import TopPropsFullLogo from '../../assets/images/topprops-full-logo.svg';

const menuItems = [
  {
    name: 'Touchdown',
    key: 'touchdown',
    icon: <TouchdownIcon />,
    subMenu: [
      {
        name: 'Dashboard',
        path: '/touchdown/dashboard',
        key: 'dashboard',
        icon: <DashboardIcon />,
      },
      {
        name: 'Contest',
        path: '/touchdown/contest',
        key: 'contest',
        icon: <ContestIcon />,
      },
      {
        name: 'Contest History',
        path: '/touchdown/contest-history',
        key: 'contest-history',
        icon: <ContestHistoryIcon />,
      },
      {
        name: 'Analytics',
        path: '/touchdown/analytics',
        key: 'analytics',
        icon: <AnalyticsIcon />,
      },
      {
        name: 'Configure',
        path: '/touchdown/configure',
        key: 'configure',
        icon: <ConfigureIcon />,
      },
    ],
  },
];

function Sidebar() {
  const { Sider } = Layout;
  const { SubMenu, Item } = Menu;
  const [activeKey, setActiveKey] = useState('dashboard');

  return (
    <Sider className="admin-sidebar-main bg-white" width="236px">
      <div className="nav-logo-img d-flex">
        <div className="menu-icon">
          <MenuIcon />
        </div>
        <img
          alt="Topprops logo"
          height="40px"
          src={TopPropsFullLogo}
          width="110px"
        />
      </div>
      <Menu className="menu-items" mode="inline">
        {menuItems?.map((item) => (
          <SubMenu
            key={item.key}
            icon={item.icon}
            id={item.key}
            title={item.name}
          >
            {item.subMenu.map(({ key, icon, path, name }) => (
              <Item
                key={key}
                className={key === activeKey && 'active-tab'}
                icon={icon}
                onClick={() => {
                  setActiveKey(key);
                }}
              >
                <Link to={path}>{name}</Link>
              </Item>
            ))}
          </SubMenu>
        ))}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
