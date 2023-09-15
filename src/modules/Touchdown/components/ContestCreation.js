import { Tabs } from 'antd';
import cx from 'classnames';
import { useState } from 'react';

import mlbSportLogo from '../../../assets/images/sports-logo/mlb.svg';
import nbaSportLogo from '../../../assets/images/sports-logo/nba.svg';
import soccerSportLogo from '../../../assets/images/sports-logo/soccer.svg';

const sports = [
  { key: 'nba', label: 'NBA', logo: nbaSportLogo },
  { key: 'mlb', label: 'MLB', logo: mlbSportLogo },
  { key: 'soccer', label: 'Soccer', logo: soccerSportLogo },
];

function ContestCreation() {
  const [activeTab, setActiveTab] = useState('nba');

  console.log('activeTab', activeTab);

  return (
    <div>
      <div className="text-h4">Contest</div>

      <Tabs
        className="sports-tabs"
        defaultActiveKey="nba"
        items={sports.map(({ key, label, logo }) => ({
          key,
          label: (
            <div
              className={cx(
                'd-flex item-center ',
                key === activeTab ? 'active-tab' : '',
              )}
            >
              <img
                alt="logo"
                className="testing"
                height={14}
                src={logo}
                width={14}
              />
              <span
                style={{
                  marginInlineStart: '5px',
                  marginInlineEnd: '5px',
                }}
              >
                {label}
              </span>
              <span
                className={cx(
                  'contest-count-lbl',
                  key === activeTab && 'active-sport',
                )}
              >
                120
              </span>
            </div>
          ),
          // children: <TouchdownMath />,
        }))}
        onChange={(tabValue) => setActiveTab(tabValue)}
      />
    </div>
  );
}

ContestCreation.defaultProps = {};

ContestCreation.propTypes = {};

export default ContestCreation;
