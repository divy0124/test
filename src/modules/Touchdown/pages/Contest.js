import { Button, Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import '../../../assets/styles/contest.less';
import { EST_TIME_ZONE, MM_DD_YYYY, YYYY_MM_DD } from 'utils/constants/labels';

import Touchdown from '../components/Touchdown';
import WeeklySubscriber from '../components/WeeklySubscriber';

const today = dayjs().tz(EST_TIME_ZONE);
const currentWeekStartDate = today.startOf('week').format(MM_DD_YYYY);
const currentWeekEndDate = today.endOf('week').format(MM_DD_YYYY);

const upcomingWeekStartDate = today
  .add(1, 'week')
  .startOf('week')
  .format(MM_DD_YYYY);
const upcomingWeekEndDate = today
  .add(1, 'week')
  .endOf('week')
  .format(MM_DD_YYYY);

function Contest() {
  const [weekDate, setWeekDate] = useState(null);
  const [viewComponent, setViewComponent] = useState(null);

  const setWeeksDate = () => {
    setWeekDate([
      currentWeekStartDate,
      currentWeekEndDate,
      upcomingWeekStartDate,
      upcomingWeekEndDate,
    ]);
  };
  useEffect(() => {
    setWeeksDate();
  }, []);

  const renderMainContent = () => (
    <>
      <Row className="contest-container">
        <Col className="text-h4 fw-500">
          Current Week ({weekDate[0]} To {weekDate[1]})
        </Col>
        <Col style={{ marginInlineStart: '11.333333%' }}>
          <Row gutter={20}>
            <Col>
              <Button
                className="cm-btn"
                onClick={() => setViewComponent('weeklySubscriber')}
              >
                weekly subscriber
              </Button>
            </Col>
            <Col>
              <Button className="cm-btn">weekly leaderboard</Button>
            </Col>
            <Col>
              <Button
                className="ct-btn"
                onClick={() => setViewComponent('touchdown')}
              >
                create touchdown
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>1212</Col>
      </Row>
    </>
  );

  const backToPage = () => {
    setViewComponent(null);
  };
  return (
    <div>
      {weekDate && !viewComponent && renderMainContent()}
      {viewComponent === 'touchdown' && (
        <Touchdown backToPrevPage={backToPage} />
      )}
      {viewComponent === 'weeklySubscriber' && (
        <WeeklySubscriber
          backToPrevPage={backToPage}
          endDate={dayjs(weekDate[1]).format(YYYY_MM_DD)}
          search=""
          startDate={dayjs(weekDate[0]).format(YYYY_MM_DD)}
        />
      )}
    </div>
  );
}

export default Contest;
