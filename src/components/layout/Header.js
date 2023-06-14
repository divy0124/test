import { Layout, Row } from 'antd';

function Header() {
  const { Header } = Layout;
  return (
    <Header className="admin-header bg-primary">
      <Row
        align="middle"
        className="h-100 text-h4 text-white font-alegreya"
        justify="space-between"
      >
        <span className="header-title">Touchdown Contest</span>
        <div className="l-22">
          <span className="font-calluna">gkurzius@gmail.com</span>
          <span className="mis-28">Logout</span>
        </div>
      </Row>
    </Header>
  );
}

export default Header;
