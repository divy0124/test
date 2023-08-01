/* eslint-disable*/
import { Checkbox, Col, Row, Tabs } from 'antd';

import Button from 'components/base/components/Button';
import RangePicker from 'components/base/components/DatePicker/RangePicker';
import Select from 'components/base/components/Select';
import { ArrowIcon } from 'components/core/Icons';

import '../../../assets/styles/analytics.less';

const TouchdownAnalysis = () => {
  const handleChange = (e) => {
    console.log('first', e);
  };

  const onClick = (e) => {
    console.log('click', e);
  };
  const onRangeSelect = (a, b) => {
    console.log('a', a);
    console.log('a', b);
  };

  return (
    <Row style={{ marginTop: '10px' }} gutter={20}>
      <Col span={6}>
        <span className="text-small">Date range </span>
        <RangePicker onChange={onRangeSelect} style={{ marginTop: '5px' }} />
      </Col>
      <Col span={3}>
        <span className="text-small">Time interval </span>
        <Select
          defaultValue="month"
          onChange={handleChange}
          options={[
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
          ]}
          style={{ marginTop: '5px' }}
        />
      </Col>
      <Col offset={12} span={3} className="btn-container">
        <Button
          className="arrow-btn"
          icon={<ArrowIcon />}
          variant="btn-primary"
          onClick={onClick}
        />
      </Col>
    </Row>
  );
};

const ContestAnalysis = () => {
  const handleChange = (e) => {
    console.log('first', e);
  };

  const onRangeSelect = (a, b) => {
    console.log('a', a);
    console.log('a', b);
  };

  const onClick = (e) => {
    console.log('click', e);
  };
  const onChecked = (e) => {
    console.log('e', e);
  };

  return (
    <Row style={{ marginTop: '10px' }} gutter={20}>
      <Col span={6}>
        <span className="text-small">Date range </span>
        <RangePicker onChange={onRangeSelect} style={{ marginTop: '5px' }} />
      </Col>
      <Col span={3}>
        <span className="text-small">Time interval </span>
        <Select
          defaultValue="10"
          onChange={handleChange}
          options={[
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
          ]}
          style={{ marginTop: '5px' }}
        />
      </Col>
      <Col span={5} className="checkbox-container">
        <Checkbox onChange={onChecked}>
          <span className="font-calluna"> Show Graphs by Sport</span>
        </Checkbox>
      </Col>
      <Col offset={7} span={3} className="btn-container">
        <Button
          className="arrow-btn"
          icon={<ArrowIcon />}
          variant="btn-primary"
          onClick={onClick}
        />
      </Col>
    </Row>
  );
};

function Analytics() {
  const tabs = [
    {
      key: 'touchdown-analysis',
      label: `TOUCHDOWN ANALYSIS`,
      children: <TouchdownAnalysis />,
    },
    {
      key: 'contest-analysis',
      label: `CONTEST ANALYSIS`,
      children: <ContestAnalysis />,
    },
  ];
  return (
    <div className="analytics-container">
      <Tabs
        defaultActiveKey="touchdown-analysis"
        items={tabs}
        itemActiveColor={'#fff'}
      />
    </div>
  );
}

export default Analytics;
