import { Button as AntButton } from 'antd';
import cx from 'classnames';
import PropTypes from 'prop-types';

import '../less/button.less';

function Button({
  buttonText,
  className,
  onClick,
  textClassName,
  variant,
  ...props
}) {
  const classNames = cx(className, variant);

  return (
    <AntButton className={classNames} onClick={onClick} {...props}>
      <span className={textClassName}> {buttonText} </span>
    </AntButton>
  );
}

Button.defaultProps = {
  className: '',
  textClassName: '',
  variant: '',
};

Button.propTypes = {
  buttonText: PropTypes.string.isRequired,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  variant: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default Button;
