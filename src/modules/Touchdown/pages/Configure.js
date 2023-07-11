import { Tabs } from 'antd';
import '../../../assets/styles/configure.less';

import ContestTitle from '../components/ContestTitle';
import TouchdownMath from '../components/TouchdownMath';

const items = [
  {
    key: 'touchdown-math',
    label: `TOUCHDOWN MATH`,
    children: <TouchdownMath />,
  },
  {
    key: 'contest-title',
    label: `TITLE OF THE CONTESTS`,
    children: <ContestTitle />,
  },
];

function Configure() {
  return (
    <div className="configure">
      <div className="container">
        <Tabs defaultActiveKey="touchdown-math" items={items} />
      </div>
    </div>
  );
}

export default Configure;
