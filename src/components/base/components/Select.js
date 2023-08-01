import { CaretDownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import '../less/select.less';

function AntSelect({ className, onChange, options, ...rest }) {
  return (
    <Select
      className={className}
      onChange={onChange}
      options={options}
      suffixIcon={<CaretDownOutlined />}
      {...rest}
    />
  );
}

AntSelect.defaultProps = {
  className: '',
};

AntSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(Object).isRequired,
};

export default AntSelect;
