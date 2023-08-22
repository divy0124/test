import { useLazyQuery } from '@apollo/client';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import TPInput from 'components/base/components/TPInput';
import TPTable from 'components/base/components/TPTable';
import { BackArrowIcon } from 'components/core/Icons';
import { GET_DAILY_LEADER_BOARD } from 'graphql/queries';
import { MM_DD_YYYY } from 'utils/constants/labels';

const dailyLeaderBoardColumns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    render: (text, record) => (
      <span>
        &nbsp; &nbsp;
        {text}
        &nbsp; &nbsp;
        {record.score === 7 ? (
          <span className="bg-green winners-label">7-For-7</span>
        ) : record.score === 6 ? (
          <span className="bg-primary winners-label">6-For-7</span>
        ) : (
          ''
        )}
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

function DailyLeaderBoard({ onBack, prizePool }) {
  const { prizePoolId, startDate } = prizePool;
  const [getDailyLeaderBoard, { loading: loadingDailyLeaderboard }] =
    useLazyQuery(GET_DAILY_LEADER_BOARD);

  const [dailyLeaderBoard, setDailyLeaderBoard] = useState([]);

  useEffect(() => {
    getDailyLeaderBoard({
      variables: {
        prizePoolId,
        page: 1,
        limit: 10,
        searchStr: '',
        prevRank: 1,
        prevScore: 0,
      },
    }).then(({ data }) => {
      const { getDailyLeaderBoard } = data;
      setDailyLeaderBoard([...getDailyLeaderBoard.data]);
    });
  }, [prizePoolId]);

  const handleSearch = () => {};

  return (
    <div>
      <Row
        align="middle"
        className="text-medium font-alegreya mb-20 pointer"
        onClick={() => onBack()}
      >
        <BackArrowIcon /> &nbsp; BACK
      </Row>
      <Row
        align="middle"
        className="font-alegreya mb-20"
        justify="space-between"
      >
        <Col className="text-h4 font-alegreya">
          Daily Leaderboard ({dayjs(startDate).format(MM_DD_YYYY)})
        </Col>
        <Col>
          <TPInput
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
      <Row className="border-1px br-2px border-primary-100">
        <TPTable
          className="leaderboard-tbl"
          columns={dailyLeaderBoardColumns}
          dataSource={dailyLeaderBoard}
          loading={loadingDailyLeaderboard}
        />
      </Row>
    </div>
  );
}

DailyLeaderBoard.propTypes = {
  prizePool: PropTypes.objectOf(Object).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default DailyLeaderBoard;
