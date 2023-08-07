import { useLazyQuery } from '@apollo/client';
import { Tabs } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { GET_CONTESTS_ANALYTICS } from 'graphql/queries';
import { YYYY_MM_DD } from 'utils/constants/labels';

import '../../../assets/styles/analytics.less';
import ChartFilters from '../components/ChartFilters';
import ContestAnalysisCharts from '../components/ContestAnalysisCharts';
import TouchdownAnalysisCharts from '../components/TouchdownAnalysisCharts';

const contestOptions = [
  {
    value: '10',
    label: 'Top 10',
  },
  {
    value: '30',
    label: 'Top 30',
  },
  {
    value: '50',
    label: 'Top 50',
  },
];

const touchDownOptions = [
  {
    value: 'day',
    label: 'Daily',
  },
  {
    value: 'week',
    label: 'Weekly',
  },
  {
    value: 'month',
    label: 'Monthly',
  },
];

function Analytics() {
  const [activeTab, setActiveTab] = useState('touchdown-analysis');
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [intervalRange, setIntervalRange] = useState('week');
  const [showIndividualGraph, setShowIndividualGraph] = useState(true);
  const [countsInfo, setCountsInfo] = useState({
    mlbContestCount: 0,
    nbaContestCount: 0,
    soccerContestCount: 0,
    totalUserEntry: 0,
    totalContest: 0,
  });
  const [contestData, setContestData] = useState(null);

  const [getContestsAnalytics] = useLazyQuery(GET_CONTESTS_ANALYTICS);

  const fetchTouchdownAnalytics = () => {};

  const fetchContestsAnalytics = (limit) => {
    getContestsAnalytics({
      variables: {
        startDate: dateRange[0].format(YYYY_MM_DD),
        endDate: dateRange[1].format(YYYY_MM_DD),
        limit,
        isIndividual: showIndividualGraph,
      },
    }).then((res) => {
      const { getContestsAnalytics } = res.data || {};
      if (getContestsAnalytics) {
        const {
          mlbContestCount,
          nbaContestCount,
          soccerContestCount,
          totalUserEntry,
          mlbContests,
          nbaContests,
          soccerContests,
        } = getContestsAnalytics;

        setCountsInfo({
          mlbContestCount,
          nbaContestCount,
          soccerContestCount,
          totalUserEntry,
          totalContest: mlbContestCount + nbaContestCount + soccerContestCount,
        });

        setContestData({
          nbaContests,
          mlbContests,
          soccerContests,
        });
      }
    });
  };

  useEffect(() => {
    fetchTouchdownAnalytics();
  }, []);

  const fetchGraphData = (selectedTab = activeTab, range = intervalRange) => {
    if (selectedTab === 'touchdown-analysis') {
      fetchTouchdownAnalytics();
    } else {
      fetchContestsAnalytics(parseInt(range, 10));
    }
  };

  const onClick = () => {
    fetchGraphData();
  };

  const tabs = [
    {
      key: 'touchdown-analysis',
      label: `TOUCHDOWN ANALYSIS`,
      children: (
        <ChartFilters
          dateRange={dateRange}
          intervalRange={intervalRange}
          onChecked={() => setShowIndividualGraph(!showIndividualGraph)}
          onClick={onClick}
          onRangeSelect={(_, range) => setDateRange(range)}
          options={touchDownOptions}
          setIntervalRange={setIntervalRange}
          showIndividualGraph={showIndividualGraph}
        />
      ),
    },
    {
      key: 'contest-analysis',
      label: `CONTEST ANALYSIS`,
      children: (
        <ChartFilters
          countsInfo={countsInfo}
          dateRange={dateRange}
          intervalRange={intervalRange}
          isFromContest
          onChecked={() => setShowIndividualGraph(!showIndividualGraph)}
          onClick={onClick}
          onRangeSelect={(range) => setDateRange(range)}
          options={contestOptions}
          setIntervalRange={setIntervalRange}
          showIndividualGraph={showIndividualGraph}
        />
      ),
    },
  ];

  const onTabChange = (tabValue) => {
    const range = tabValue === 'touchdown-analysis' ? 'week' : '10';
    setActiveTab(tabValue);
    setIntervalRange(range);
    fetchGraphData(tabValue, range);
  };

  return (
    <div>
      <div className="analytics-container">
        <Tabs
          defaultActiveKey={activeTab}
          items={tabs}
          onChange={onTabChange}
        />
      </div>

      {activeTab === 'touchdown-analysis' ? (
        <TouchdownAnalysisCharts />
      ) : (
        <div>
          {contestData && (
            <ContestAnalysisCharts
              contestData={contestData}
              showIndividualGraph={showIndividualGraph}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
