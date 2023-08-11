import { useLazyQuery } from '@apollo/client';
import { Spin, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import {
  GET_CONTESTS_ANALYTICS,
  GET_TOUCHDOWN_ANALYTICS,
} from 'graphql/queries';
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
  const [touchdownData, setTouchdownData] = useState(null);
  const [contestData, setContestData] = useState(null);

  const [getContestsAnalytics, { loading: contestAnalyticLoading }] =
    useLazyQuery(GET_CONTESTS_ANALYTICS);
  const [getTouchdownAnalytics, { loading: touchdownAnalyticLoading }] =
    useLazyQuery(GET_TOUCHDOWN_ANALYTICS);

  const fetchTouchdownAnalytics = (interval) => {
    getTouchdownAnalytics({
      variables: {
        startDate: dateRange[0].format(YYYY_MM_DD),
        endDate: dateRange[1].format(YYYY_MM_DD),
        interval,
      },
    }).then((res) => {
      const { getTouchdownAnalytics } = res.data || {};
      if (getTouchdownAnalytics) {
        setTouchdownData(getTouchdownAnalytics);
      }
    });
  };

  useEffect(() => {
    fetchTouchdownAnalytics(intervalRange);
  }, []);

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
          sportsData: {
            nbaContests,
            mlbContests,
            soccerContests,
          },
          individualSport: showIndividualGraph,
        });
      }
    });
  };

  const fetchGraphData = (selectedTab = activeTab, range = intervalRange) => {
    if (selectedTab === 'touchdown-analysis') {
      fetchTouchdownAnalytics(range);
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
          onRangeSelect={(range) => setDateRange(range)}
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

  const renderLoading = () => (
    <div className="item-center border-white bg-white br-4px p-25">
      <Spin className="p-25" size="large" />
    </div>
  );

  return (
    <div>
      <div className="analytics-container">
        <Tabs
          defaultActiveKey={activeTab}
          items={tabs}
          onChange={onTabChange}
        />
      </div>

      <div>
        {activeTab === 'touchdown-analysis' ? (
          <div>
            {touchdownAnalyticLoading || !touchdownData ? (
              renderLoading()
            ) : (
              <TouchdownAnalysisCharts touchdownData={touchdownData} />
            )}
          </div>
        ) : (
          <div>
            {contestAnalyticLoading || !contestData ? (
              renderLoading()
            ) : (
              <ContestAnalysisCharts contestData={contestData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
