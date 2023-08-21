import { useLazyQuery } from '@apollo/client';
import { Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import Button from 'components/base/components/Button';
import CustomRangePicker from 'components/base/components/DatePicker/CustomRangePicker';
import Table from 'components/base/components/Table';
import { GET_TOUCHDOWN_WEEKLY_HISTORY } from 'graphql/queries';
import { YYYY_MM_DD } from 'utils/constants/labels';
import getColumn, { getColumnWithChildren } from 'utils/helpers/column';

import DailyHistory from '../components/DailyHistory';

const prevWeekStartDate = dayjs().startOf('week').subtract(1, 'week');
const prevWeekEndDate = dayjs().endOf('week').subtract(1, 'week');

function ContestHistory() {
  const [dateRange, setDateRange] = useState([
    prevWeekStartDate,
    prevWeekEndDate,
  ]);
  const [tdWeeklyHistory, setTdWeeklyHistory] = useState(null);
  const [viewComponent, setViewComponent] = useState('weekly-history');

  const [getTouchDownHistory, { loading: loadingWeeklyHistory }] = useLazyQuery(
    GET_TOUCHDOWN_WEEKLY_HISTORY,
  );

  const setContestCountCol = (history) =>
    history.map((data) => ({
      ...data,
      soccerContestCount: data.allSportContestCount.Soccer,
      mlbContestCount: data.allSportContestCount.MLB,
      nbaContestCount: data.allSportContestCount.NBA,
    }));

  const fetchTouchdownContestHistory = () => {
    const startDate = dateRange[0].format(YYYY_MM_DD);
    const endDate = dateRange[1].format(YYYY_MM_DD);

    getTouchDownHistory({ variables: { startDate, endDate } })
      .then(({ data }) => {
        const { getWeeklyHistoryByDateRange } = data;

        if (getWeeklyHistoryByDateRange.length > 0) {
          const weeklyHistory = setContestCountCol(getWeeklyHistoryByDateRange);
          setTdWeeklyHistory([...weeklyHistory]);
        } else {
          setTdWeeklyHistory([]);
        }
      })
      .catch((error) => message.error(error));
  };

  const weeklyHistoryColumn = [
    // Title, dataIndex, key , ...
    getColumn('Week', 'weekDate', 'weekDate', '', 'week-date'),
    getColumn('Entry Fee', 'entryFee', 'entryFee'),
    getColumn(
      'User entry',
      'totalUserEntry',
      'totalUserEntry',
      (a, b) => a.totalUserEntry - b.totalUserEntry,
    ),
    getColumn('Received Fees', 'totalEntryFees', 'totalEntryFees'),
    getColumn(
      'Total topprop vig',
      'totalTopropVig',
      'totalTopropVig',
      (a, b) => a.totalTopropVig - b.totalTopropVig,
    ),
    getColumn(
      'Total weekly reserve',
      'totalWeeklyReserve',
      'totalWeeklyReserve',
    ),
    getColumn('Weekly Prize', 'weeklyPrize', 'weeklyPrize'),
    getColumn(
      'Money added by topprop',
      'moneyAddedByTopprop',
      'moneyAddedByTopprop',
    ),
    getColumn('Profit/loss', 'profit', 'profit', (a, b) => a.profit - b.profit),
    getColumnWithChildren(
      'Created Contest',
      'allSportContestCount',
      'col-divider contest-count',
      [
        getColumn(
          'NBA',
          'nbaContestCount',
          'nbaContestCount',
          '',
          'hide-col-divider',
        ),
        getColumn(
          'MLB',
          'mlbContestCount',
          'mlbContestCount',
          '',
          'hide-col-divider',
        ),
        getColumn(
          'Soccer',
          'soccerContestCount',
          'soccerContestCount',
          '',
          'col-divider colspan',
        ),
      ],
    ),
    getColumn(
      'Weekly Subscriber',
      'totalSubscribers',
      'totalSubscribers',
      (a, b) => a.totalSubscribers - b.totalSubscribers,
    ),
    {
      className: 'leaderboard-btn',
      title: 'Weekly Leaderboard',
      dataIndex: 'touchdownId',
      key: 'touchdownId',
      render: () => (
        <Button
          buttonText="VIEW"
          className="fw-500 fs-14 "
          icon={false}
          onClick={() => {}}
          style={{ padding: '4px 15px' }}
          variant="btn-primary-outline"
        />
      ),
      onCell: (record) => ({
        onClick: () => {
          const dates = record.weekDate.split('To');
          setDateRange([dayjs(dates[0]), dayjs(dates[1])]);
          setViewComponent('daily-history');
        },
      }),
    },
  ];

  const disabledDate = (current) => {
    // Calculate the start of the current week
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    // Disable dates that are on or after the start of the current week
    return current && current >= startOfWeek;
  };

  const handleDateChange = (dateRange) => {
    setDateRange(dateRange);
    const startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
    const endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    fetchTouchdownContestHistory(startDate, endDate);
  };

  useEffect(() => {
    fetchTouchdownContestHistory();
  }, []);

  const backToPrevPage = () => setViewComponent('weekly-history');
  return (
    <>
      {viewComponent === 'weekly-history' && (
        <>
          <Row className="weekly-his-header">
            <Col className="text-h4 fw-500" span={4}>
              Weekly History
            </Col>
            <Col style={{ width: '22%', marginInlineStart: '59.333333%' }}>
              <CustomRangePicker
                className="weekly-history-range-picker"
                dateRange={dateRange}
                disabledDate={disabledDate}
                onChange={handleDateChange}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            <Col
              className="border-primary-100 br-2px border-1px"
              span={24}
              style={{ overflowX: 'scroll', height: '100%' }}
            >
              <Table
                className="weekly-contest-tbl"
                columns={weeklyHistoryColumn}
                dataSource={tdWeeklyHistory || []}
                height={600}
                loading={loadingWeeklyHistory}
                type="range-picker"
              />
            </Col>
          </Row>
        </>
      )}

      {viewComponent === 'daily-history' && (
        <DailyHistory backToPrevPage={backToPrevPage} dateRange={dateRange} />
      )}
    </>
  );
}

export default ContestHistory;
