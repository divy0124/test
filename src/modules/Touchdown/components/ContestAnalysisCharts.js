/* eslint-disable */
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { MM_DD_YYYY } from 'utils/constants/labels';

import ChartImage from '../../../assets/images/chart.svg';

const contestGraphInfo = {
  nbaContests: {
    key: 'NBA',
    name: 'NBA Contests',
    p1: '#1E9493',
    p2: '#E86452',
  },
  soccerContests: {
    key: 'Soccer',
    name: 'Soccer Contests',
    p1: '#F6BD16',
    p2: '#6DC8EC',
  },
  mlbContests: {
    key: 'MLB',
    name: 'MLB Contests',
    p1: '#5AD8A6',
    p2: '#FF9845',
  },
};

const prepareSportData = (contests, key = null) =>
  contests.map(
    ({
      player1FirstName,
      player1Count,
      player2FirstName,
      player2Count,
      startDate,
      totalCount,
    }) => ({
      key,
      contestName: `${player1FirstName.trim()} vs ${player2FirstName.trim()}`,
      player1FirstName,
      player2FirstName,
      player1Count,
      player2Count,
      startDate,
      totalCount,
    }),
  );

const CustomXAxisTick = (props) => {
  const { x, y, payload } = props;
  const [player1, player2] = payload.value.split('vs');

  return (
    <g transform={`translate(${x},${y})`}>
      <text color="#212121" dy={20} textAnchor="middle" x={0} y={0}>
        {player2}
      </text>
      <text color="#212121" dy={34} textAnchor="middle" x={0} y={0}>
        vs
      </text>
      <text color="#212121" dy={48} textAnchor="middle" x={0} y={0}>
        {player1}
      </text>
    </g>
  );
};

const CustomYAxisTick = (props) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={2} dx={-20} fill="#8C8C8C" fontSize={16} textAnchor="middle">
        {payload?.value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ payload, individualSport }) => {
  if (payload?.length < 1) return;

  const {
    key,
    player1FirstName,
    player2FirstName,
    player1Count,
    player2Count,
    startDate,
    totalCount,
  } = payload?.[0]?.payload || {};
  let player1Color;
  let player2Color;

  if (individualSport) {
    player1Color = payload?.[0]?.color || {};
    player2Color = payload?.[1]?.color || {};
  } else {
    player1Color = contestGraphInfo[key]?.p1;
    player2Color = contestGraphInfo[key]?.p2;
  }

  return (
    <div className="chart-tooltip">
      <div className="text-h5">
        {!individualSport && contestGraphInfo[key]?.key}{' '}
        {dayjs(startDate).format(MM_DD_YYYY)}
      </div>

      <div className="tooltip-title player-name">
        <div
          style={{
            background: player2Color,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            marginInlineEnd: '5px',
          }}
        />
        <div style={{ marginRight: 'auto' }}>
          {player2FirstName} : &nbsp;&nbsp;
        </div>
        <div>{player2Count}</div>
      </div>
      <div className="tooltip-title">
        <div
          style={{
            background: player1Color,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            marginInlineEnd: '5px',
          }}
        />
        <div style={{ marginRight: 'auto' }}>
          {player1FirstName} : &nbsp;&nbsp;
        </div>
        <div>{player1Count}</div>
      </div>
      <div className="tooltip-title">
        <div style={{ fontSize: '11px' }}> Total Contest : &nbsp;&nbsp;</div>
        <div>{totalCount}</div>
      </div>
    </div>
  );
};

function ContestAnalysisCharts({ contestData }) {
  const { sportsData, individualSport } = contestData || {};
  const [graphsData, setGraphsData] = useState([]);

  useEffect(() => {
    if (individualSport) {
      const graphList = Object.entries(sportsData).map(([key, value]) => ({
        data: prepareSportData(value),
        contestName: contestGraphInfo[key]?.name,
        p1Color: contestGraphInfo[key]?.p1,
        p2Color: contestGraphInfo[key]?.p2,
      }));
      setGraphsData(graphList);
    } else {
      const graphList = Object.entries(sportsData).map(([key, value]) => ({
        data: prepareSportData(value, key),
      }));
      const data = graphList
        .flatMap((graph) => graph.data)
        .sort((a, b) => b.totalCount - a.totalCount);
      setGraphsData([{ data, contestName: 'Contest' }]);
    }
  }, [contestData]);

  return (
    <>
      {graphsData.map(({ contestName, data, p1Color, p2Color }) => (
        <div key={contestName} className="chart-container mb-30">
          <Row className="mb-20" justify="space-between">
            <Col className="text-h4">{contestName}</Col>
            {!isEmpty(data) && (
              <Col className="player-container">
                {individualSport ? (
                  <>
                    <div
                      className="player-color"
                      style={{ background: p2Color }}
                    />
                    <div style={{ marginInlineEnd: '15px' }}>PlayerA</div>
                    <div
                      className="player-color"
                      style={{ background: p1Color }}
                    />
                    <div>PlayerB</div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, #EA7363 50%, #349E9D 50%)',
                      }}
                      className="player-color"
                    />
                    <div style={{ marginInlineEnd: '15px' }}>NBA</div>
                    <div
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, #FFA257 50%, #6ADCAE 50%)',
                      }}
                      className="player-color"
                    />
                    <div style={{ marginInlineEnd: '15px' }}>MLB</div>
                    <div
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, #7BCEEE 50%, #F6C32D 50%)',
                      }}
                      className="player-color"
                    />
                    <div>Soccer</div>
                  </>
                )}
              </Col>
            )}
          </Row>

          {size(data) ? (
            <div className="bar-chart-wrapper">
              <BarChart
                width={data.length * 100}
                height={300}
                barCategoryGap="30%"
                data={data}
                layout="horizontal"
                margin={{
                  bottom: 10,
                  top: 10,
                  left: 10,
                  right: 10,
                }}
              >
                <CartesianGrid
                  color="#D4D4D4"
                  horizontal={true}
                  vertical={false}
                  width="1px"
                />
                <XAxis
                  axisLine={false}
                  className="axis-label"
                  dataKey="contestName"
                  height={50}
                  interval={0}
                  tick={<CustomXAxisTick />}
                />
                <YAxis
                  axisLine={false}
                  className="axis-label fw-400"
                  color="#8C8C8C"
                  tick={<CustomYAxisTick />}
                >
                  <Label
                    color="#8C8C8C"
                    offset={-28}
                    position="insideBottom"
                    value="PlayerA"
                  />
                  <Label
                    color="#8C8C8C"
                    offset={-54}
                    position="insideBottom"
                    value="PlayerB"
                  />
                </YAxis>
                {data.length > 0 && (
                  <Tooltip
                    content={
                      <CustomTooltip individualSport={individualSport} />
                    }
                    cursor={{ fill: '#F8F8F8' }}
                  />
                )}

                {individualSport ? (
                  <>
                    <Bar
                      active={false}
                      dataKey="player1Count"
                      fill={p1Color}
                      stackId="a"
                    />
                    <Bar
                      active={false}
                      dataKey="player2Count"
                      fill={p2Color}
                      stackId="a"
                    />
                  </>
                ) : (
                  <>
                    <Bar active={false} dataKey="player1Count" stackId="a">
                      {data.map(({ key, contestName }) => (
                        <Cell
                          key={contestName}
                          fill={contestGraphInfo[key]?.p1}
                        />
                      ))}
                    </Bar>
                    <Bar active={false} dataKey="player2Count" stackId="a">
                      {data.map(({ key, contestName }) => (
                        <Cell
                          key={contestName}
                          fill={contestGraphInfo[key]?.p2}
                        />
                      ))}
                    </Bar>
                  </>
                )}
              </BarChart>
            </div>
          ) : (
            <div style={{ marginTop: '30px', marginBottom: '50px' }}>
              <div className="item-center mb-20">
                <img alt="chart image" src={ChartImage} />
              </div>
              <div className="item-center text-medium">
                DATA NOT AVAILABLE YET
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default ContestAnalysisCharts;
