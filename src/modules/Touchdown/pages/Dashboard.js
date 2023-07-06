import { Col, DatePicker, Row } from 'antd';
import axios from 'axios';
import cx from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import Button from 'components/base/components/Button';
import Table from 'components/base/components/Table';
import { useGetTouchdownByDateQuery } from 'graphql/graphql.generated.ts';
import {
  DATE_FORMAT,
  dashboardTotalCountsLabels,
} from 'utils/constants/labels';

import DailyLeaderBoard from '../components/DailyLeaderBoard';
import WeeklyLeaderBoard from '../components/WeeklyLeaderBoard';

import '../../../assets/styles/dashboard.less';

const getTouchdownUrl = 'http://localhost:5008/api/admin/touchdown';

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
    date: dayjs(pp.startDate).format(DATE_FORMAT),
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

const getTouchDown = async (startDate, endDate) =>
  axios
    .get(`${getTouchdownUrl}?startDate=${startDate}&endDate=${endDate}`)
    .then((res) => res.data);

const currentDate = dayjs();
const currentMonday = currentDate
  .startOf('week')
  .add(1, 'day')
  .format(DATE_FORMAT);
const nextSunday = currentDate.endOf('week').add(1, 'day').format(DATE_FORMAT);

function Dashboard() {
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState([]);
  const [totalCountInfo, setTotalCountInfo] = useState(initTotals);
  const [touchdown, setTouchdown] = useState(null);
  const [selectedPrizePool, setSelectedPrizePool] = useState({
    prizePoolId: 1,
  });

  const getTouchDownByDateRange = async (dateRange) => {
    console.log('first', dateRange[0]);
    const startDate = dayjs(dateRange[0], DATE_FORMAT).format('YYYY-MM-DD');
    const endDate = dayjs(dateRange[1], DATE_FORMAT).format('YYYY-MM-DD');

    getTouchDown(startDate, endDate).then((resp) => {
      if (resp[0]) {
        const copyInitTotals = { ...initTotals };
        copyInitTotals.weeklyPrize = parseFloat(
          resp[0].predetermineWeeklyPrize,
        ).toFixed(2);
        resp[0].prizePools.forEach(({ userEntryCount, entryFees }) => {
          copyInitTotals.totalEntries += userEntryCount;
          copyInitTotals.receivedFees += userEntryCount * entryFees;
        });
        const prizePoolList = createPrizePoolList(resp[0]);
        const touchdown = { ...resp[0], prizePools: prizePoolList };

        setTotalCountInfo({ ...copyInitTotals });
        setTouchdown({ ...touchdown });
      } else {
        setTotalCountInfo({ ...initTotals });
        setTouchdown({});
      }
    });
  };

  useEffect(() => {
    setSelectedPrizePool(null);
    setDateRange([currentMonday, nextSunday]);
    getTouchDownByDateRange([currentMonday, nextSunday]);
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

  const handleDateChange = (date, dateString) => {
    setDateRange([...dateString]);
    getTouchDownByDateRange(dateString);
  };

  // const { data, isError, error, isLoading } = useGetMathConstantQuery(
  //   RequestClient,
  //   {},
  // );
  // console.log(
  //   ' data, isError, error, isLoading',
  //   data,
  //   ',',
  //   isError,
  //   ',',
  //   error,
  //   ',',
  //   isLoading,
  //   ',',
  // );

  // const {
  //   data: contests,
  //   isLoading,
  //   refetch: refetchContests,
  // } = useGetAllContestsQuery(
  //   { data: { filter: ContestsReportFilterType.Open } },
  //   {
  //     staleTime: 300_000, // 5 min
  //   },
  // );

  // const { data: contests, isLoading } = useGetTouchdownByDateQuery(
  //   requestClient,
  //   {
  //     startDate: '2023-06-19',
  //     endDate: '2023-07-04',
  //   },
  // );

  const { data: contests, isLoading } = useGetTouchdownByDateQuery({
    startDate: '2023-06-19',
    endDate: '2023-07-04',
  });

  console.log('contests', contests);
  console.log('isLoading', isLoading);
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
                <Col>
                  <RangePicker
                    allowClear={false}
                    className="dashboard-date-picker border-primary-100"
                    defaultValue={[
                      dayjs(currentMonday, DATE_FORMAT),
                      dayjs(nextSunday, DATE_FORMAT),
                    ]}
                    format={DATE_FORMAT}
                    onChange={handleDateChange}
                  />
                </Col>
                <Col>
                  <Button
                    buttonText="CREATE TOUCHDOWN"
                    className="fw-500 fs-16"
                    onClick={() => {}}
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
                  dataSource={touchdown?.prizePools}
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
