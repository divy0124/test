import { Tabs } from 'antd';
import '../../../assets/styles/configure.less';

import ContestTitle from '../components/ContestTitle';
import TouchdownMath from '../components/TouchdownMath';

function onChange(key) {
  console.log(key);
}
function Configure() {
  const items = [
    {
      key: '1',
      label: `TOUCHDOWN MATH`,
      children: <TouchdownMath />,
    },
    {
      key: '2',
      label: `TITLE OF THE CONTESTS`,
      children: <ContestTitle />,
    },
  ];
  return (
    <div className="configure">
      <div className="container">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}

export default Configure;
