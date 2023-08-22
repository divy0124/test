import { useLazyQuery } from '@apollo/client';
import { Button as AntdBtn, Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Button from 'components/base/components/Button';
import Table from 'components/base/components/Table';
import { GET_TOUCHDOWN_BY_DATE_FOR_CURRENT_WEEK } from 'graphql/queries';
import { EST_TIME_ZONE, MM_DD_YYYY, YYYY_MM_DD } from 'utils/constants/labels';
import '../../../assets/styles/contest.less';

import DailyLeaderBoard from '../components/DailyLeaderBoard';
import Touchdown from '../components/Touchdown';
import WeeklyLeaderBoard from '../components/WeeklyLeaderBoard';
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

const initialPrizePool = {
  status: 'PENDING',
  date: null,
  mlbContestsCount: 0,
  soccerContestsCount: 0,
  nbaContestsCount: 0,
  predetermineJackpot: 0,
  predetermineReserveAmount: {
    SIX_FOR_SEVEN: 0,
  },
  predetermineWeeklyReserve: 0,
};
function Contest() {
  const location = useLocation();
  const { state } = location;

  const [weekDate, setWeekDate] = useState(null);
  const [viewComponent, setViewComponent] = useState(state || null);
  const [currentWeekTouchdownInfo, setCurrentWeekTouchdownInfo] =
    useState(null);
  const [upcomingWeekTouchdownInfo, setUpcomingWeekTouchdownInfo] =
    useState(null);
  const [selectedPrizePool, setSelectedPrizePool] = useState(null);

  const [getTouchDown] = useLazyQuery(GET_TOUCHDOWN_BY_DATE_FOR_CURRENT_WEEK);

  const setWeeksDate = () => {
    setWeekDate([
      currentWeekStartDate,
      currentWeekEndDate,
      upcomingWeekStartDate,
      upcomingWeekEndDate,
    ]);
  };

  const formatAmount = (amount) => `${parseFloat(amount).toFixed(2)}`;

  const prizePoolAmountWithDollar = (prizePoolData) =>
    prizePoolData.map((pp) => ({
      ...pp,

      date: dayjs(pp.startDate).format(MM_DD_YYYY),

      predetermineJackpot: '$'.concat(
        formatAmount(pp.predetermineJackpot || 0),
      ),

      actualJackpot: '$'.concat(formatAmount(pp.actualJackpotAmount || 0)),

      predetermineSixForSeven: '$'.concat(
        formatAmount(pp.predetermineReserveAmount.SIX_FOR_SEVEN),
      ),

      actualSixForSeven: '$'.concat(
        formatAmount(pp?.actualReserveAmount?.SIX_FOR_SEVEN || 0),
      ),

      profit: '$'.concat(pp.profit),

      predetermineWeeklyReserve: '$'.concat(
        formatAmount(pp.predetermineWeeklyReserveAmount),
      ),

      actualWeeklyReserve: '$'.concat(
        formatAmount(pp?.actualWeeklyReserveAmount || 0),
      ),

      addedByTopProp: '$'.concat(
        formatAmount(pp?.actualWeeklyReserveAmount || 0),
      ),
    }));

  const getPrizePoolForWeek = (dates, prizePools) => {
    const prizePoolData = dates.map((date) => ({
      ...(prizePools.find(({ startDate }) =>
        dayjs(date, MM_DD_YYYY).isSame(dayjs(startDate).format(MM_DD_YYYY)),
      ) || { ...initialPrizePool, startDate: date }),
    }));
    return prizePoolData;
  };

  const getTouchDownByDateRange = async (
    weekStartDate,
    weekEndDate,
    setTouchdownInfo,
  ) => {
    const startDate = dayjs(weekStartDate, MM_DD_YYYY).format('YYYY-MM-DD');
    const endDate = dayjs(weekEndDate, MM_DD_YYYY).format('YYYY-MM-DD');

    getTouchDown({ variables: { startDate, endDate } })
      .then(({ data }) => {
        // Get the list of current || upcoming weeks date
        const { getTouchdownByDate } = data;

        let mondayDate = dayjs.tz(startDate, EST_TIME_ZONE).startOf('day');
        const sundayDate = dayjs.tz(endDate, EST_TIME_ZONE).endOf('day');

        const dates = [];
        // The monday date and sunday dates day must be 1 and 0
        if (mondayDate.day() === 1 && sundayDate.day() === 0) {
          while (
            mondayDate.isBefore(sundayDate) ||
            mondayDate.isSame(sundayDate)
          ) {
            dates.push(mondayDate.utc().format(MM_DD_YYYY));
            mondayDate = mondayDate.add(1, 'day');
          }
        } else {
          message.error('Pass valid startdate and endDate');
          return;
        }
        let prizePools = [];
        if (getTouchdownByDate.length > 0) {
          const firstObj = getTouchdownByDate[0];
          // The remaining PrizePool dates will be added.
          const prizePoolData = getPrizePoolForWeek(dates, firstObj.prizePools);
          prizePools = prizePoolAmountWithDollar(prizePoolData);

          setTouchdownInfo({
            ...firstObj,
            prizePools,
          });
        } else {
          prizePools = dates.map((date) => ({
            ...initialPrizePool,
            date,
            status: 'PENDING',
          }));
          setTouchdownInfo(prizePools);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };
  useEffect(() => {
    setWeeksDate();
    getTouchDownByDateRange(
      currentWeekStartDate,
      currentWeekEndDate,
      setCurrentWeekTouchdownInfo,
    );
    getTouchDownByDateRange(
      upcomingWeekStartDate,
      upcomingWeekEndDate,
      setUpcomingWeekTouchdownInfo,
    );
  }, []);

  const renderTextOnCurrentWeekCell = (text, record) => (
    <div>{record.status === 'COMPLETED' ? text : '-'}</div>
  );

  const renderLeaderboardButton = (text, record) => (
    <div>
      {record.status === 'DRAFT' || record.status === 'PENDING' ? (
        '-'
      ) : (
        <Button
          buttonText="VIEW"
          className="fw-500 fs-14 "
          icon={false}
          onClick={() => {
            setViewComponent('dailyLeaderboard');
          }}
          style={{ padding: '4px 15px' }}
          variant="btn-primary-outline"
        />
      )}
    </div>
  );

  const currentWeekTableColumns = [
    {
      title: 'Days',
      dataIndex: 'date',
      key: 'days',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <div className={text.toLocaleLowerCase().concat('-label')}>
          {text.toLocaleLowerCase()}
        </div>
      ),
    },
    {
      title: 'Entry Fees',
      dataIndex: 'entryFees',
      key: 'entryFees',
      render: (text, { status }) => (
        <div>{status === 'PENDING' ? '-' : `$${text}`}</div>
      ),
    },
    {
      title: 'Entry Limit',
      dataIndex: 'totalEntrants',
      key: 'totalEntrants',
      render: (text, { status }) => (
        <div>{status === 'PENDING' ? '-' : `$${text}`}</div>
      ),
    },
    {
      title: 'User entry',
      dataIndex: 'userEntryCount',
      key: 'userEntryCount',
      render: renderTextOnCurrentWeekCell,
    },
    {
      title: 'Prize Pool',
      dataIndex: 'prizePool',
      key: 'prizePool',
      render: (text, { status }) => (
        <div>{status === 'PENDING' ? '-' : `$${text}`}</div>
      ),
    },
    {
      title: 'Pot Rolls Over',
      dataIndex: 'rollsOver',
      key: 'rollsOver',
      render: (text, record) => (
        <div className={text ? 'text-green fw-700' : 'text-red'}>
          {record.status === 'COMPLETED' ? (text ? 'Yes' : 'No') : '-'}
        </div>
      ),
    },
    {
      title: '7-For-7',
      key: 'sevenForSevenAmount',
      className: 'col-divider sevenForSeven',
      children: [
        {
          title: 'Pre',
          dataIndex: 'predetermineJackpot',
          key: 'predetermineJackpot',
          render: (text, { status }) => (
            <div>{status === 'PENDING' ? '-' : `${text}`}</div>
          ),
          className: 'hide-col-divider jackpot',
        },
        {
          title: 'Post',
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
          title: 'Pre',
          dataIndex: 'predetermineSixForSeven',
          key: 'predetermineSixForSeven',
          render: (text, { status }) => (
            <div>{status === 'PENDING' ? '-' : `${text}`}</div>
          ),
          className: 'hide-col-divider reserve-amt',
        },
        {
          title: 'Post',
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
      key: 'weeklyReserve',
      className: 'weekly-reserve',
      children: [
        {
          title: 'Pre',
          dataIndex: 'predetermineWeeklyReserve',
          key: 'predetermineWeeklyReserve',
          render: (text, { status }) => (
            <div>{status === 'PENDING' ? '-' : `${text}`}</div>
          ),
          className: 'hide-col-divider weekly-reserve',
        },
        {
          title: 'Post',
          dataIndex: 'actualWeeklyReserve',
          key: 'actualWeeklyReserve',
          render: renderTextOnCurrentWeekCell,
          className: 'weekly-reserve col-divider colspan',
        },
      ],
    },

    {
      title: 'TopProp Vig',
      dataIndex: 'topPropVig',
      key: 'topPropVig',
      render: (text, { status }) => (
        <div>{status === 'PENDING' ? '-' : `$${text}`}</div>
      ),
    },
    {
      title: 'Money Added By TopProp',
      dataIndex: 'addedByTopProp',
      key: 'addedByTopProp',
      render: renderTextOnCurrentWeekCell,
    },
    {
      title: 'Profit/Loss',
      dataIndex: 'profit',
      key: 'profit',
      render: renderTextOnCurrentWeekCell,
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
        onClick: () => setSelectedPrizePool({ ...record }),
      }),
    },
  ];

  const renderTextOnUpcomingWeekCell = (text, status) => (
    <div>{status === 'PENDING' ? '-' : text}</div>
  );

  const upcomingWeekTableColumn = [
    {
      title: 'Days',
      dataIndex: 'date',
      key: 'days',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <div className={text.toLocaleLowerCase().concat('-label')}>
          {text.toLocaleLowerCase()}
        </div>
      ),
    },
    {
      title: 'Entry Fees',
      dataIndex: 'entryFees',
      key: 'entryFees',
      render: (text, record) =>
        renderTextOnUpcomingWeekCell(`$${text}`, record.status),
    },
    {
      title: 'Entry Limit',
      dataIndex: 'totalEntrants',
      key: 'totalEntrants',
      render: (text, { status }) =>
        renderTextOnUpcomingWeekCell(`${text}`, status),
    },
    {
      title: 'Prize Pool',
      dataIndex: 'prizePool',
      key: 'prizePool',
      render: (text, record) =>
        renderTextOnUpcomingWeekCell(`$${text}`, record.status),
    },
    {
      title: '7-For-7',
      dataIndex: 'predetermineJackpot',
      key: 'predetermineJackpot',
      render: (text, record) =>
        renderTextOnUpcomingWeekCell(`${text}`, record.status),
    },
    {
      title: '6-For-7',
      key: 'predetermineSixForSeven',
      dataIndex: 'predetermineSixForSeven',
      render: (text, record) =>
        renderTextOnUpcomingWeekCell(`${text}`, record.status),
    },
    {
      title: 'Weekly Reserve',
      dataIndex: 'predetermineWeeklyReserve',
      key: 'predetermineWeeklyReserve',
      render: (text, record) =>
        renderTextOnUpcomingWeekCell(`${text}`, record.status),
    },
    {
      title: 'TopProp Vig',
      dataIndex: 'topPropVig',
      key: 'topPropVig',
      render: (text, record) =>
        renderTextOnUpcomingWeekCell(`$${text}`, record.status),
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
  ];

  const { prizePools } = currentWeekTouchdownInfo || { prizePools: [] };

  const renderMainContent = () => (
    <>
      <Row className="contest-container">
        <Col className="text-h4 fw-500">
          Current Week ({weekDate[0]} To {weekDate[1]})
        </Col>
        <Col style={{ marginInlineStart: '11.333333%' }}>
          <Row gutter={20}>
            <Col>
              <AntdBtn
                className="cm-btn"
                onClick={() => setViewComponent('weeklySubscriber')}
              >
                weekly subscriber
              </AntdBtn>
            </Col>
            <Col>
              <AntdBtn
                className="cm-btn"
                onClick={() => setViewComponent('weeklyLeaderboard')}
              >
                weekly leaderboard
              </AntdBtn>
            </Col>
            <Col>
              <AntdBtn
                className="ct-btn"
                onClick={() => setViewComponent('touchdown')}
              >
                create touchdown
              </AntdBtn>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: '16px' }}>
        <Col
          className="border-primary-100 br-2px border-1px"
          span={24}
          style={{ overflowX: 'scroll', height: '100%' }}
        >
          <Table
            className="current-week-tbl"
            columns={currentWeekTableColumns}
            dataSource={prizePools}
            height={452}
            loadMoreFunc={() => {}}
            rowClassName={(record) =>
              record.status === 'LIVE' ? 'bg-red-200' : ''
            }
            totalCount={7}
            type=""
          />
        </Col>
      </Row>
      <Row className="text-h4 fw-500" style={{ marginTop: '30px' }}>
        Upcoming Week({upcomingWeekStartDate} To {upcomingWeekEndDate}){' '}
      </Row>
      <Row style={{ marginTop: '14px' }}>
        <Col
          className="border-primary-100 br-2px border-1px"
          span={24}
          style={{ overflowX: 'scroll', height: '100%' }}
        >
          <Table
            className="upcoming-week-tbl"
            columns={upcomingWeekTableColumn}
            dataSource={upcomingWeekTouchdownInfo?.prizePools || []}
          />
        </Col>
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
      {viewComponent === 'weeklyLeaderboard' && (
        <WeeklyLeaderBoard
          backArrow
          backToPrevPage={backToPage}
          dateRange={[currentWeekStartDate, currentWeekEndDate]}
          height={550}
          touchdown={currentWeekTouchdownInfo}
          type=""
        />
      )}
      {viewComponent === 'dailyLeaderboard' && (
        <DailyLeaderBoard onBack={backToPage} prizePool={selectedPrizePool} />
      )}
    </div>
  );
}

export default Contest;
