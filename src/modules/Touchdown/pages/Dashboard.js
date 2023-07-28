import { useLazyQuery } from '@apollo/client';
import { Col, Row } from 'antd';
import cx from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'components/base/components/Button';
import DatePicker from 'components/base/components/DatePicker';
import Table from 'components/base/components/Table';
import { GET_TOUCHDOWN_BY_DATE } from 'graphql/queries';
import { MM_DD_YYYY, dashboardTotalCountsLabels } from 'utils/constants/labels';

import DailyLeaderBoard from '../components/DailyLeaderBoard';
import WeeklyLeaderBoard from '../components/WeeklyLeaderBoard';

import '../../../assets/styles/dashboard.less';

const initTotals = {
  totalEntries: 0,
  receivedFees: 0,
  totalTopPropVig: 0,
  totalWeeklyReserve: 0,
  weeklyPrize: 0,
  moneyAddedByTopProp: 0,
  profitLoss: 0,
};

const profitLossClass = (value) => (value > 0 ? 'profit-block' : 'loss-block');

const createPrizePoolList = (touchdownInfo) =>
  touchdownInfo.prizePools.map((pp) => ({
    ...pp,
    date: dayjs(pp.startDate).format(MM_DD_YYYY),
    predetermineJackpot: '$'.concat(
      parseFloat(pp.predetermineJackpot).toFixed(2),
    ),
    predetermineSixForSeven: pp.predetermineReserveAmountStr
      ? '$'.concat(
          parseFloat(
            JSON.parse(pp.predetermineReserveAmountStr).SIX_FOR_SEVEN,
          ).toFixed(2),
        )
      : '$0',
    profit: '$'.concat(pp.profit),
  }));

const getRowClassName = (record) => {
  if (record.status === 'LIVE') {
    return 'bg-red-200';
  }
  return '';
};

const currentDate = dayjs();

function Dashboard() {
  const [dateRange, setDateRange] = useState([]);
  const [totalCountInfo, setTotalCountInfo] = useState(initTotals);
  const [touchdown, setTouchdown] = useState(null);
  const [selectedPrizePool, setSelectedPrizePool] = useState(null);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const navigate = useNavigate();
  const [getTouchDown] = useLazyQuery(GET_TOUCHDOWN_BY_DATE);

  const getTouchDownByDateRange = async (dateRange) => {
    const startDate = dayjs(dateRange[0], MM_DD_YYYY).format('YYYY-MM-DD');
    const endDate = dayjs(dateRange[1], MM_DD_YYYY).format('YYYY-MM-DD');

    getTouchDown({ variables: { startDate, endDate } }).then(({ data }) => {
      const { getTouchdownByDate } = data;
      if (getTouchdownByDate.length > 0) {
        const firstObj = getTouchdownByDate[0];
        const copyInitTotals = { ...initTotals };
        copyInitTotals.weeklyPrize = parseFloat(firstObj.weeklyPrize).toFixed(
          2,
        );
        firstObj.prizePools.forEach(({ userEntryCount, entryFees }) => {
          copyInitTotals.totalEntries += userEntryCount;
          copyInitTotals.receivedFees += userEntryCount * entryFees;
        });
        const prizePoolList = createPrizePoolList(firstObj);
        const touchdown = { ...firstObj, prizePools: prizePoolList };

        setTotalCountInfo({ ...copyInitTotals });
        setTouchdown({ ...touchdown });
      } else {
        setTotalCountInfo({ ...initTotals });
        setTouchdown({});
      }
    });
  };

  useEffect(() => {
    const monday = currentDate.startOf('week').format(MM_DD_YYYY);
    const sunday = currentDate.endOf('week').format(MM_DD_YYYY);
    const selectedWeek = [monday, sunday];
    setSelectedPrizePool(null);
    setDateRange(selectedWeek);
    getTouchDownByDateRange(selectedWeek);
  }, []);

  const touchdownInfoColumns = [
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
      render: (text) => <div>${text}</div>,
    },
    {
      title: 'Entry Limit',
      dataIndex: 'totalEntrants',
      key: 'totalEntrants',
    },
    {
      title: 'User entry',
      dataIndex: 'userEntryCount',
      key: 'userEntryCount',
      render: (text, record) => (
        <div>{record.status === 'DRAFT' ? '-' : text}</div>
      ),
    },
    {
      title: 'Prize Pool',
      dataIndex: 'prizePool',
      key: 'prizePool',
      render: (text) => <div>${text}</div>,
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
      title: '7-For-7 Prize',
      dataIndex: 'predetermineJackpot',
      key: 'predetermineJackpot',
      className: 'hide-col-divider',
    },
    {
      title: 'Winners',
      dataIndex: 'jackpotWinnersCount',
      key: 'jackpotWinnersCount',
      className: 'winners',
      render: (text, record) => (
        <div>{record.status === 'COMPLETED' ? text : '-'}</div>
      ),
    },
    {
      title: '6-For-7 Prize',
      dataIndex: 'predetermineSixForSeven',
      key: 'predetermineSixForSeven',
      className: 'hide-col-divider',
    },

    {
      title: 'Winners',
      dataIndex: 'sixForSevenWinnersCount',
      key: 'sixForSevenWinnersCount',
      className: 'winners',
      render: (text, record) => (
        <div>{record.status === 'COMPLETED' ? text : '-'}</div>
      ),
    },

    {
      title: 'TopProp Vig',
      dataIndex: 'topPropVig',
      key: 'topPropVig',
      render: (text) => <div>${text}</div>,
    },
    {
      title: 'Money Added By TopProp',
      dataIndex: 'addedByTopProp',
      key: 'addedByTopProp',
    },
    {
      title: 'Profit/Loss',
      dataIndex: 'profit',
      key: 'profit',
      render: (text, record) => (
        <div>{record.status === 'COMPLETED' ? text : '-'}</div>
      ),
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
          title: 'PGA',
          dataIndex: 'pgaContestsCount',
          key: 'pgaContestsCount',
          className: 'hide-col-divider',
        },
        {
          title: 'NFL',
          dataIndex: 'nflContestsCount',
          key: 'nflContestsCount',
          className: 'col-divider colspan',
        },
      ],
    },
    {
      title: 'Daily Leaderboard',
      dataIndex: 'prizePoolId',
      key: 'prizePoolId',
      render: (text, record) => (
        <div>
          {record.status === 'DRAFT' ? (
            '-'
          ) : (
            <Button
              buttonText="VIEW"
              className="fw-500 fs-14"
              onClick={() => {}}
              style={{ padding: '4px 15px' }}
              variant="btn-primary-outline"
            />
          )}
        </div>
      ),
      onCell: (record) => ({
        onClick: () => setSelectedPrizePool({ ...record }),
      }),
    },
  ];

  const handleDateChange = (date) => {
    const monday = date.startOf('week').format(MM_DD_YYYY);
    const sunday = date.endOf('week').format(MM_DD_YYYY);
    const selectedWeek = [monday, sunday];
    setDateRange([...selectedWeek]);
    setSelectedDate(date);
    getTouchDownByDateRange(selectedWeek);
  };

  return (
    <div>
      {selectedPrizePool ? (
        <DailyLeaderBoard
          onBack={() => setSelectedPrizePool(null)}
          prizePool={selectedPrizePool}
        />
      ) : (
        <div>
          {touchdown && (
            <>
              <Row
                align="middle"
                className="font-alegreya"
                justify="space-between"
              >
                <DatePicker
                  dateRange={dateRange}
                  disabledDate={false}
                  iconColor="#B69056"
                  onChange={handleDateChange}
                  selectedDate={selectedDate}
                />

                <Col>
                  <Button
                    buttonText="CREATE TOUCHDOWN"
                    className="fw-500 fs-16"
                    onClick={() => navigate('/touchdown/contest')}
                    style={{ padding: '8px 15px' }}
                    variant="btn-primary"
                  />
                </Col>
              </Row>
              <Row className="my-20 text-h4 font-alegreya">
                Weekly Touchdown &nbsp;
                {dateRange?.length > 0 && (
                  <>
                    - &nbsp; {dateRange[0]} - {dateRange[1]}
                  </>
                )}
              </Row>
              <Row className="mb-20" justify="space-between">
                {dashboardTotalCountsLabels.map(({ key, value }, i) => (
                  <Col
                    key={key}
                    className={cx(
                      'font-alegreya col-total-value',
                      key === 'profitLoss'
                        ? profitLossClass(totalCountInfo[key])
                        : 'border-primary-100',
                    )}
                  >
                    <div
                      className="text-regular"
                      dangerouslySetInnerHTML={{ __html: value }}
                    />
                    <span className="text-primary text-total-value">
                      {i !== 0 && '$'}
                      {totalCountInfo[key]}
                    </span>
                  </Col>
                ))}
              </Row>
              <Row className="border-primary-100 br-2px border-1px mb-30">
                <Table
                  columns={touchdownInfoColumns}
                  dataSource={touchdown?.prizePools || []}
                  rowClassName={(record) => getRowClassName(record)}
                />
              </Row>
              <WeeklyLeaderBoard dateRange={dateRange} touchdown={touchdown} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
