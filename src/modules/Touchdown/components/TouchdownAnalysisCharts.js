/* eslint-disable */

import { Col, Row } from 'antd';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartImage from '../../../assets/images/chart.svg';

const touchdownGraphInfo = {
  entryLimitColor: '#D0D6E0',
  userEntryColor: '#B69056',
  profitColor: '#20743E',
  lossColor: '#EB1745',
};

function CustomTooltip({ payload, fromProfitLoss }) {
  if (payload?.length < 1) return;

  const { interval, allowedEntryCount, actualEntryCount, profit } =
    payload?.[0]?.payload || {};

  return (
    <div className="chart-tooltip">
      <div className="text-h5">{interval}</div>

      <div className="tooltip-title player-name">
        <div
          style={{
            background: fromProfitLoss
              ? Number(profit < 0)
                ? touchdownGraphInfo.lossColor
                : touchdownGraphInfo.profitColor
              : touchdownGraphInfo.entryLimitColor,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            marginInlineEnd: '5px',
          }}
        />
        <div style={{ marginRight: 'auto' }}>
          {fromProfitLoss
            ? Number(profit < 0)
              ? 'Loss'
              : 'Profit'
            : 'Entry limit'}{' '}
          : &nbsp;&nbsp;
        </div>
        <div>{fromProfitLoss ? profit : allowedEntryCount}</div>
      </div>
      {!fromProfitLoss && (
        <div className="tooltip-title">
          <div
            style={{
              background: touchdownGraphInfo.userEntryColor,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              marginInlineEnd: '5px',
            }}
          />
          <div style={{ marginRight: 'auto' }}>User entry : &nbsp;&nbsp;</div>
          <div>{actualEntryCount}</div>
        </div>
      )}
    </div>
  );
}

function CustomXAxisTick(props) {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        color="#212121"
        dy={20}
        fontSize={16}
        textAnchor="middle"
        x={0}
        y={0}
      >
        {payload?.value}
      </text>
    </g>
  );
}

function EmptyContainer() {
  return (
    <div style={{ marginTop: '30px', marginBottom: '50px' }}>
      <div className="item-center mb-20">
        <img alt="chart image" src={ChartImage} />
      </div>
      <div className="item-center text-medium">DATA NOT AVAILABLE YET</div>
    </div>
  );
}

function TouchdownAnalysisCharts({ touchdownData }) {
  const getChartWidth = (data) => {
    const dataLength = data?.length;
    return dataLength * (dataLength > 2 ? 110 : 180);
  };

  return (
    <div>
      <div className="chart-container mb-30">
        <Row className="mb-20" justify="space-between">
          <Col className="text-h4">Profit/Loss</Col>
          {!isEmpty(touchdownData) && (
            <Col className="player-container">
              <div
                className="player-color"
                style={{
                  background: touchdownGraphInfo.profitColor,
                }}
              />
              <div style={{ marginInlineEnd: '15px' }}>Profit</div>
              <div
                className="player-color"
                style={{
                  background: touchdownGraphInfo.lossColor,
                }}
              />
              <div>Loss</div>
            </Col>
          )}
        </Row>

        {size(touchdownData) ? (
          <div className="bar-chart-wrapper">
            <BarChart
              barCategoryGap="30%"
              className="user-entry-chart"
              data={touchdownData}
              height={400}
              layout="horizontal"
              width={getChartWidth(touchdownData)}
            >
              <CartesianGrid
                color="#D4D4D4"
                horizontal
                vertical={false}
                width="1px"
              />
              <XAxis
                axisLine={false}
                className="text-regular"
                dataKey="interval"
                // height={40}
                interval={0}
                tick={<CustomXAxisTick />}
              />
              <YAxis
                axisLine={false}
                className="text-regular"
                color="#8C8C8C"
              />

              {touchdownData.length > 0 && (
                <Tooltip
                  content={<CustomTooltip fromProfitLoss />}
                  cursor={{ fill: '#F8F8F8' }}
                />
              )}

              <ReferenceLine stroke="#D4D4D4" />
              <Bar active={false} dataKey="profit">
                {touchdownData.map(({ interval, profit }) => (
                  <Cell
                    key={interval}
                    fill={
                      Number(profit || 0) > 0
                        ? touchdownGraphInfo.profitColor
                        : touchdownGraphInfo.lossColor
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </div>
        ) : (
          <EmptyContainer />
        )}
      </div>
      <div className="chart-container mb-30">
        <Row className="mb-20" justify="space-between">
          <Col className="text-h4">User Entry</Col>
          {!isEmpty(touchdownData) && (
            <Col className="player-container">
              <div
                className="player-color"
                style={{
                  background: touchdownGraphInfo.entryLimitColor,
                }}
              />
              <div style={{ marginInlineEnd: '15px' }}>Entry Limit</div>
              <div
                className="player-color"
                style={{
                  background: touchdownGraphInfo.userEntryColor,
                }}
              />
              <div>User Entry</div>
            </Col>
          )}
        </Row>

        {size(touchdownData) ? (
          <div className="mb-">
            <div className="bar-chart-wrapper">
              <BarChart
                barCategoryGap="20%"
                className="user-entry-chart"
                data={touchdownData}
                height={300}
                layout="horizontal"
                width={getChartWidth(touchdownData)}
              >
                <CartesianGrid
                  color="#D4D4D4"
                  horizontal
                  vertical={false}
                  width="1px"
                />
                <XAxis
                  axisLine={false}
                  className="text-regular"
                  dataKey="interval"
                  height={40}
                  interval={0}
                  tick={<CustomXAxisTick />}
                />
                <YAxis
                  axisLine={false}
                  className="text-regular"
                  color="#8C8C8C"
                />

                {touchdownData.length > 0 && (
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: '#F8F8F8' }}
                  />
                )}

                <Bar
                  active={false}
                  dataKey="allowedEntryCount"
                  fill={touchdownGraphInfo.entryLimitColor}
                />
                <Bar
                  active={false}
                  dataKey="actualEntryCount"
                  fill={touchdownGraphInfo.userEntryColor}
                />
              </BarChart>
            </div>
          </div>
        ) : (
          <EmptyContainer />
        )}
      </div>
    </div>
  );
}

export default TouchdownAnalysisCharts;
