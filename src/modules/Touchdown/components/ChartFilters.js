import { Checkbox, Col, Row } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import Button from 'components/base/components/Button';
import TPRangePicker from 'components/base/components/DatePicker/TPRangePicker';
import Select from 'components/base/components/Select';
import { ArrowIcon } from 'components/core/Icons';

function ChartFilters({
  countsInfo,
  dateRange,
  intervalRange,
  isFromContest,
  onChecked,
  onClick,
  options,
  onRangeSelect,
  setIntervalRange,
  showIndividualGraph,
}) {
  const {
    mlbContestCount,
    nbaContestCount,
    soccerContestCount,
    totalUserEntry,
    totalContest,
  } = countsInfo;
  return (
    <>
      <Row gutter={20} style={{ marginTop: '10px' }}>
        <Col span={6}>
          <span className="text-small">Date range </span>
          <TPRangePicker
            dateRange={dateRange}
            onChange={onRangeSelect}
            style={{ marginTop: '5px' }}
          />
        </Col>
        <Col span={3}>
          <span className="text-small">
            {isFromContest ? 'Contests' : 'Time interval'}
          </span>
          <Select
            onChange={setIntervalRange}
            options={options}
            style={{ marginTop: '5px' }}
            value={intervalRange}
          />
        </Col>
        {isFromContest && (
          <Col className="checkbox-container" span={5}>
            <Checkbox defaultChecked={showIndividualGraph} onChange={onChecked}>
              <span className="font-calluna"> Show Graphs by Sport</span>
            </Checkbox>
          </Col>
        )}
        <Col className="btn-container" offset={isFromContest ? 7 : 12} span={3}>
          <Button
            className="arrow-btn"
            icon={<ArrowIcon />}
            onClick={onClick}
            variant="btn-primary"
          />
        </Col>
      </Row>
      {isFromContest && (
        <Row className="text-regular mt-20" gutter={13}>
          <Col>
            total contest : <span className="fw-500"> {totalContest} </span>
          </Col>
          <Col>
            nba : <span className="fw-500"> {nbaContestCount} </span>
          </Col>
          <Col>
            mlb : <span className="fw-500"> {mlbContestCount} </span>
          </Col>
          <Col>
            soccer : <span className="fw-500"> {soccerContestCount} </span>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            total user entry :<span className="fw-500"> {totalUserEntry} </span>
          </Col>
        </Row>
      )}
    </>
  );
}

ChartFilters.defaultProps = {
  countsInfo: {},
  dateRange: [],
  isFromContest: false,
};

ChartFilters.propTypes = {
  countsInfo: PropTypes.objectOf(Object),
  dateRange: PropTypes.arrayOf(dayjs),
  intervalRange: PropTypes.string.isRequired,
  isFromContest: PropTypes.bool,
  onChecked: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(Object).isRequired,
  onRangeSelect: PropTypes.func.isRequired,
  setIntervalRange: PropTypes.func.isRequired,
  showIndividualGraph: PropTypes.bool.isRequired,
};

export default ChartFilters;
