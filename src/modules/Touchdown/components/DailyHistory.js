import { useLazyQuery } from '@apollo/client';
import { Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Button from 'components/base/components/Button';
import Table from 'components/base/components/Table';
import { BackArrowIcon } from 'components/core/Icons';
import { GET_TOUCHDOWN_DAILY_HISTORY } from 'graphql/queries';
import { MM_DD_YYYY } from 'utils/constants/labels';

import DailyLeaderBoard from './DailyLeaderBoard';

function DailyHistory({ backToPrevPage, dateRange }) {
  const [prizePoolInfo, setPrizePoolInfo] = useState(null);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState(null);

  const [getDailyTouchdownHistory, { loading: dailyTouchdownHistory }] =
    useLazyQuery(GET_TOUCHDOWN_DAILY_HISTORY);

  const renderTextOnCurrentWeekCell = (text) => <div>{text}</div>;
  const renderLeaderboardButton = () => (
    <Button
      buttonText="VIEW"
      className="fw-500 fs-14 "
      icon={false}
      onClick={(text, record) => {
        setSelectedLeaderboard({ ...record });
      }}
      style={{ padding: '4px 15px' }}
      variant="btn-primary-outline"
    />
  );
  const dailyHistoryColumn = [
    {
      title: 'Days',
      dataIndex: 'date',
      key: 'days',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Entry Fees',
      dataIndex: 'entryFees',
      key: 'entryFees',
      render: (text) => <div>${text}</div>,
    },
    {
      title: 'User entry',
      dataIndex: 'userEntryCount',
      key: 'userEntryCount',
      render: renderTextOnCurrentWeekCell,
      sorter: (a, b) => a.userEntryCount - b.userEntryCount,
    },
    {
      title: 'Prize Pool',
      dataIndex: 'actualPrizePool',
      key: 'actualPrizePool',
      render: renderTextOnCurrentWeekCell,
    },
    {
      title: 'Pot Rolls Over',
      dataIndex: 'rollsOver',
      key: 'rollsOver',
      render: (text) => (
        <div className={text ? 'text-green fw-700' : 'text-red'}>
          {text ? 'Yes' : 'No'}
        </div>
      ),
    },
    {
      title: '7-For-7',
      key: 'sevenForSevenAmount',
      className: 'col-divider sevenForSeven',
      children: [
        {
          title: 'Prize',
          dataIndex: 'actualJackpot',
          key: 'actualJackpot',
          render: renderTextOnCurrentWeekCell,
          className: 'hide-col-divider jackpot',
        },
        {
          title: 'Winners',
          dataIndex: 'jackpotWinnersCount',
          key: 'jackpotWinnersCount',
          className: 'winners col-divider colspan',
          render: renderTextOnCurrentWeekCell,
        },
      ],
    },
    {
      title: '6-For-7',
      key: 'sixForSevenAmount',
      className: 'col-divider sixForSeven',
      children: [
        {
          title: 'Prize',
          dataIndex: 'actualSixForSeven',
          key: 'actualSixForSeven',
          render: renderTextOnCurrentWeekCell,
          className: 'hide-col-divider reserve-amt',
        },
        {
          title: 'Winners',
          dataIndex: 'sixForSevenWinnersCount',
          key: 'sixForSevenWinnersCount',
          className: 'winners col-divider colspan',
          render: renderTextOnCurrentWeekCell,
        },
      ],
    },
    {
      title: 'Weekly Reserve',
      key: 'actualWeeklyReserve',
      dataIndex: 'actualWeeklyReserve',
      className: 'weekly-reserve',
    },
    {
      title: 'TopProp Vig',
      dataIndex: 'topPropVig',
      key: 'topPropVig',
      sorter: (a, b) => a.topPropVig - b.topPropVig,
    },
    {
      title: 'Money Added By TopProp',
      dataIndex: 'addedByTopProp',
      key: 'addedByTopProp',
      render: renderTextOnCurrentWeekCell,
      sorter: (a, b) => a.addedByTopProp - b.addedByTopProp,
    },
    {
      title: 'Profit/Loss',
      dataIndex: 'profit',
      key: 'profit',
      render: renderTextOnCurrentWeekCell,
      sorter: (a, b) => a.profit - b.profit,
    },
    {
      title: 'Created Contest',
      key: 'createdContest',
      className: 'col-divider',
      children: [
        {
          title: 'NBA',
          dataIndex: 'nbaContestsCount',
          key: 'nbaContestsCount',
          className: 'hide-col-divider',
        },
        {
          title: 'MLB',
          dataIndex: 'mlbContestsCount',
          key: 'mlbContestsCount',
          className: 'hide-col-divider',
        },
        {
          title: 'Soccer',
          dataIndex: 'soccerContestsCount',
          key: 'soccerContestsCount',
          className: 'col-divider colspan',
        },
      ],
    },
    {
      className: 'leaderboard-btn',
      title: 'Daily Leaderboard',
      dataIndex: 'prizePoolId',
      key: 'prizePoolId',
      render: renderLeaderboardButton,
      onCell: (record) => ({
        onClick: () => {
          setSelectedLeaderboard({ ...record });
        },
      }),
    },
  ];
  const formatAmount = (amount) => `${parseFloat(amount).toFixed(2)}`;

  const prizePoolAmtWithDollar = (pp) =>
    pp.map((data) => ({
      ...data,
      date: dayjs(data.startDate).format(MM_DD_YYYY),
      actualJackpot: '$'.concat(formatAmount(data.actualJackpotAmount || 0)),

      actualSixForSeven: '$'.concat(
        formatAmount(data?.actualReserveAmount?.SIX_FOR_SEVEN || 0),
      ),

      profit: '$'.concat(data.profit),

      actualWeeklyReserve: '$'.concat(
        formatAmount(data?.actualWeeklyReserveAmount || 0),
      ),

      addedByTopProp: '$'.concat(
        formatAmount(data?.actualWeeklyReserveAmount || 0),
      ),

      actualPrizePool: '$'.concat(formatAmount(data?.actualPrizePool)),
    }));

  const fetchDailyHistoryDate = () => {
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');
    getDailyTouchdownHistory({ variables: { startDate, endDate } })
      .then(({ data }) => {
        const { getTouchdownByDate } = data;

        if (getTouchdownByDate.length > 0) {
          const { prizePools } = getTouchdownByDate[0];
          const ppData = prizePoolAmtWithDollar(prizePools);
          setPrizePoolInfo(ppData);
        } else {
          setPrizePoolInfo([]);
        }
      })
      .catch((error) => message.error(error?.message));
  };
  useEffect(() => {
    fetchDailyHistoryDate();
  }, []);

  return (
    <>
      {!selectedLeaderboard && (
        <>
          <Row
            className="text-medium font-alegreya mb-20 pointer back-arrow"
            onClick={backToPrevPage}
          >
            <BackArrowIcon /> &nbsp; BACK
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col
              className="border-primary-100 br-2px border-1px"
              span={24}
              style={{ overflowX: 'scroll', height: '100%' }}
            >
              <Table
                className="daily-history-table"
                columns={dailyHistoryColumn}
                dataSource={prizePoolInfo || []}
                loading={dailyTouchdownHistory}
              />
            </Col>
          </Row>
        </>
      )}
      {selectedLeaderboard && (
        <DailyLeaderBoard
          onBack={() => setSelectedLeaderboard(null)}
          prizePool={selectedLeaderboard}
        />
      )}
    </>
  );
}

DailyHistory.propTypes = {
  backToPrevPage: PropTypes.func.isRequired,
  dateRange: PropTypes.arrayOf(dayjs).isRequired,
};
export default DailyHistory;
