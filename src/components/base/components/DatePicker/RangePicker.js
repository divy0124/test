import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

import { CalenderIcon } from 'components/core/Icons';
import { MM_DD_YYYY } from 'utils/constants/labels';
import '../../less/datePicker.less';

function RangePicker({ className, onChange, ...props }) {
  const { RangePicker: AntRangePicker } = DatePicker;
  return (
    <AntRangePicker
      allowClear={false}
      className={className}
      direction="down"
      format={MM_DD_YYYY}
      onChange={onChange}
      placeholder={['START DATE', 'END DATE']}
      suffixIcon={<CalenderIcon color="#D4D4D4" />}
      {...props}
    />
  );
}
RangePicker.defaultProps = {
  className: '',
  onChange: () => {},
};

RangePicker.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default RangePicker;
