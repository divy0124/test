import { Input as AntInput } from 'antd';
import PropTypes from 'prop-types';

import '../less/input.less';

function Input({ className, onSearch, placeholder, type, ...props }) {
  if (type === 'search') {
    return (
      <AntInput.Search
        className={className}
        onSearch={onSearch}
        placeholder={placeholder}
        {...props}
      />
    );
  }
  return <AntInput>AntInput</AntInput>;
}

Input.defaultProps = {
  className: '',
  placeholder: '',
  type: '',
};

Input.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

export default Input;
