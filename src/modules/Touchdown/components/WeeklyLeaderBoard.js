import { useLazyQuery } from '@apollo/client';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Input from 'components/base/components/Input';
import Table from 'components/base/components/Table';
import { GET_WEEKLY_LEADER_BOARD } from 'graphql/queries';

const weeklyLeaderBoardColumns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    render: (text) => (
      <span>
        &nbsp; &nbsp;
        {text}
      </span>
    ),
  },
  {
    title: 'Winning amount',
    dataIndex: 'winAmount',
    key: 'winAmount',
    render: (text) => (
      <span className="fw-700">
        {text > 0 ? <> ${parseFloat(text).toFixed(2)}</> : '-'}
      </span>
    ),
  },

  {
    title: 'User',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <span className="text-capitalize">{text}</span>,
  },
  {
    title: 'Points',
    dataIndex: 'score',
    key: 'score',
    render: (text) => <span>{text}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => (
      <span className={text !== '-' && 'completed-label'}>
        {text.toLocaleLowerCase()}
      </span>
    ),
  },
  {
    title: 'Payout',
    dataIndex: 'payout',
    key: 'payout',
    render: (text) => (
      <span>
        {text === '-' ? text : dayjs(text).format('MM-DD-YYYY, h:mm A')}
      </span>
    ),
  },
];

function WeeklyLeaderBoard({ dateRange, touchdown }) {
  const { touchdownId } = touchdown || {};
  const [getWeeklyLeaderBoard] = useLazyQuery(GET_WEEKLY_LEADER_BOARD);

  const [weeklyLeaderBoard, setWeeklyLeaderBoard] = useState([]);

  useEffect(() => {
    if (touchdownId) {
      getWeeklyLeaderBoard({
        variables: {
          touchdownId,
          page: 1,
          limit: 10,
          searchStr: '',
          prevRank: 1,
          prevScore: 0,
        },
      }).then(({ data }) => {
        const { getWeeklyLeaderBoard } = data;
        setWeeklyLeaderBoard([...getWeeklyLeaderBoard.data]);
      });
    }
  }, [touchdownId]);

  const handleSearch = () => {};

  return (
    <>
      <Row align="middle" className="mb-20" justify="space-between">
        <Col className="text-h4 font-alegreya">
          Weekly Leaderboard &nbsp;
          {dateRange?.length > 0 && (
            <>
              - &nbsp; {dateRange[0]} - {dateRange[1]}
            </>
          )}
        </Col>
        <Col>
          <Input
            className="br-2px"
            onSearch={handleSearch}
            placeholder="Search"
            style={{
              width: 250,
            }}
            type="search"
          />
        </Col>
      </Row>
      <Row className="border-primary-100 br-2px border-1px">
        <Table
          className="leaderboard-tbl"
          columns={weeklyLeaderBoardColumns}
          dataSource={weeklyLeaderBoard}
        />
      </Row>
    </>
  );
}

WeeklyLeaderBoard.propTypes = {
  dateRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  touchdown: PropTypes.objectOf(Object).isRequired,
};

export default WeeklyLeaderBoard;
