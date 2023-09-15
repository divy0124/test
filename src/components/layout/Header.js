import { Layout, Row } from 'antd';
import { useLocation } from 'react-router-dom';

const routesLabel = {
  '/touchdown/dashboard': 'Touchdown Dashboard',
  '/touchdown/contest': 'Touchdown Contest',
  '/touchdown/contest-history': 'Contest History',
  '/touchdown/analytics': 'Analytics',
  '/touchdown/configure': 'Configure',
};

function Header() {
  const { Header } = Layout;
  const location = useLocation();
  const { pathname } = location || {};

  return (
    <Header className="admin-header bg-primary">
      <Row
        align="middle"
        className="h-100 text-h4 text-white font-alegreya"
        justify="space-between"
      >
        <span className="header-title">{routesLabel[pathname] || ''}</span>
        <div className="l-22">
          <span className="font-calluna">gkurzius@gmail.com</span>
          <span className="mis-28">Logout</span>
        </div>
      </Row>
    </Header>
  );
}

export default Header;
