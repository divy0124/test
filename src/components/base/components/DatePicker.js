import { SwapRightOutlined } from '@ant-design/icons';
import { DatePicker as AntDatePicker, Col, Row } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { CalenderIcon } from 'components/core/Icons';
import { MM_DD_YYYY } from 'utils/constants/labels';

import '../less/datePicker.less';

dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});
dayjs.extend(utc);
dayjs.extend(timezone);

function DatePicker({
  dateRange,
  selectedDate,
  className,
  onChange,
  iconColor,
  customDateDisable,
}) {
  const [openPicker, setOpenPicker] = useState(false);

  return (
    <Col className={className}>
      <Row
        className="border-1px br-2px border-primary-100 tp-date-picker date-picker"
        onClick={() => setOpenPicker(!openPicker)}
      >
        {/* <BlurCalenderIcon /> */}
        <CalenderIcon color={iconColor} />

        <div className="fs-14 fw-500 l-22 mx-10 start-date">
          {dateRange.length === 0 ? 'START DATE' : dateRange[0]}
        </div>
        <SwapRightOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
        <div className="fs-14 fw-500 l-22 mx-10 end-date">
          {dateRange.length === 0 ? 'END DATE' : dateRange[1]}
        </div>
      </Row>
      <AntDatePicker.WeekPicker
        className="hide-date-picker-input"
        disabledDate={customDateDisable}
        format={MM_DD_YYYY}
        onChange={onChange}
        onOpenChange={() => setOpenPicker(!openPicker)}
        open={openPicker}
        value={dayjs(selectedDate, MM_DD_YYYY)}
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
  iconColor: PropTypes.string.isRequired,
  customDateDisable: PropTypes.bool.isRequired,
};

export default DatePicker;
