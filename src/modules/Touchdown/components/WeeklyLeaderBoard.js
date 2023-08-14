import { useLazyQuery } from '@apollo/client';
import { Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Input from 'components/base/components/Input';
import Table from 'components/base/components/Table';
import { BackArrowIcon } from 'components/core/Icons';
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
    sorter: (a, b) => a.rank - b.rank,
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
    sorter: (a, b) => a.winAmount - b.winAmount,
  },

  {
    title: 'User',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <span className="text-capitalize">{text}</span>,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Points',
    dataIndex: 'score',
    key: 'score',
    render: (text) => <span>{text}</span>,
    sorter: (a, b) => a.score - b.score,
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

function WeeklyLeaderBoard({
  dateRange,
  touchdown,
  backArrow,
  backToPrevPage,
  height,
  type,
}) {
  const { touchdownId } = touchdown || {};
  const [getWeeklyLeaderBoard] = useLazyQuery(GET_WEEKLY_LEADER_BOARD);

  const [weeklyLeaderBoard, setWeeklyLeaderBoard] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // Will b removed onces the backend api received with proper format

  const fetchWeeklyLeaderBoard = (searchStr, page, limit) => {
    if (!touchdownId) {
      message.error('Touchdown Id not found !!');
      return;
    }

    getWeeklyLeaderBoard({
      variables: {
        touchdownId,
        page,
        limit,
        searchStr,
        prevRank: 1,
        prevScore: 0,
      },
    }).then(({ data }) => {
      const { getWeeklyLeaderBoard } = data;
      setTotalCount(getWeeklyLeaderBoard.totalCount);
      const updatedItems =
        page > 1
          ? [...weeklyLeaderBoard, ...getWeeklyLeaderBoard.data]
          : [...getWeeklyLeaderBoard.data];
      setWeeklyLeaderBoard([...updatedItems]);
    });
  };
  useEffect(() => {
    if (touchdownId) {
      fetchWeeklyLeaderBoard('', 1, 15);
    }
  }, [touchdownId]);

  const handleSearch = () => {};

  return (
    <>
      {backArrow && (
        <Row
          className="text-medium font-alegreya mb-20 pointer back-arrow"
          onClick={backToPrevPage}
        >
          <BackArrowIcon /> &nbsp; BACK
        </Row>
      )}
      <Row align="middle" className="mb-20" justify="space-between">
        <Col className="text-h4 font-alegreya">
          Weekly Leaderboard &nbsp;
          {dateRange?.length > 0 && (
            <>
              ( {dateRange[0]} - {dateRange[1]} )
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
          height={height}
          loadMoreFunc={fetchWeeklyLeaderBoard}
          totalCount={totalCount} // need to change
          type={type}
        />
      </Row>
    </>
  );
}

WeeklyLeaderBoard.propTypes = {
  backToPrevPage: PropTypes.func,
  dateRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  touchdown: PropTypes.objectOf(Object).isRequired,
  backArrow: PropTypes.bool.isRequired,
  height: PropTypes.number,
  type: PropTypes.string,
};

WeeklyLeaderBoard.defaultProps = {
  backToPrevPage: () => {},
  height: '600',
  type: '',
};

export default WeeklyLeaderBoard;
