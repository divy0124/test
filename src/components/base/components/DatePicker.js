import { SwapRightOutlined } from '@ant-design/icons';
import { DatePicker as AntDatePicker, Col, Row } from 'antd';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { CalenderIcon } from 'components/core/Icons';
import { DATE_FORMAT } from 'utils/constants/labels';

import '../less/datePicker.less';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

function DatePicker({ dateRange, selectedDate, className, onChange }) {
  const [openPicker, setOpenPicker] = useState(false);

  return (
    <Col className={className}>
      <Row
        className="border-1px br-2px border-primary-100 tp-date-picker"
        onClick={() => setOpenPicker(!openPicker)}
      >
        <CalenderIcon />
        <div className="text-medium mx-10">{dateRange[0]}</div>
        <SwapRightOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
        <div className="text-medium mx-10">{dateRange[1]}</div>
      </Row>
      <AntDatePicker.WeekPicker
        className="hide-date-picker-input"
        format={DATE_FORMAT}
        onChange={onChange}
        onOpenChange={() => setOpenPicker(!openPicker)}
        open={openPicker}
        value={dayjs(selectedDate, DATE_FORMAT)}
      />
    </Col>
  );
}

DatePicker.defaultProps = {
  className: '',
  onChange: () => {},
  selectedDate: dayjs(),
};

DatePicker.propTypes = {
  className: PropTypes.string,
  dateRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  selectedDate: PropTypes.objectOf(dayjs),
};

export default DatePicker;
