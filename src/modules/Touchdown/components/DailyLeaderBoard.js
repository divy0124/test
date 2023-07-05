import { Col, Row } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Input from 'components/base/components/Input';
import Table from 'components/base/components/Table';
import { BackArrowIcon } from 'components/core/Icons';
import { useGetDailyLeaderBoardQuery } from 'graphql/graphql.generated.ts';
import requestClient from 'graphql/graphqlRequestClient';
import { DATE_FORMAT } from 'utils/constants/labels';

const dailyLeaderBoard =
  'http://localhost:5008/api/admin/touchdown/daily/leaderboard';

const getDailyLeaderBoard = async (
  prizePoolId = 1,
  page = 1,
  limit = 10,
  searchStr = '',
  prevRank = 1,
  prevScore = 0,
) =>
  axios
    .get(
      `${dailyLeaderBoard}/${prizePoolId}?page=${page}&limit=${limit}&searchStr=${searchStr}&prevRank=${prevRank}&prevScore=${prevScore}`,
    )
    .then((res) => res.data);

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

  const [dailyLeaderBoard, setDailyLeaderBoard] = useState([]);

  const { data } = useGetDailyLeaderBoardQuery(requestClient, {
    limit: 10,
    page: 1,
    prevRank: 1,
    prevScore: 0,
    prizePoolId,
    searchStr: '',
  });

  console.log('data', data);
  useEffect(() => {
    getDailyLeaderBoard(prizePoolId).then((resp) => {
      const { data } = resp;
      setDailyLeaderBoard([...data]);
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
          {console.log('first', startDate)}
          Daily Leaderboard ({dayjs(startDate).format(DATE_FORMAT)})
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
      <Row className="border-1px br-2px border-primary-100">
        <Table
          className="leaderboard-tbl"
          columns={dailyLeaderBoardColumns}
          dataSource={dailyLeaderBoard}
          pagination
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
