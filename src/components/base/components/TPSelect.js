import { CaretDownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import '../less/select.less';

function TPSelect({ className, onChange, options, value, ...rest }) {
  return (
    <Select
      className={className}
      onChange={onChange}
      options={options}
      suffixIcon={<CaretDownOutlined />}
      value={value}
      {...rest}
    />
  );
}

TPSelect.defaultProps = {
  className: '',
};

TPSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(Object).isRequired,
  value: PropTypes.string.isRequired,
};

export default TPSelect;
