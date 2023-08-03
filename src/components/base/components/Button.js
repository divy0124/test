import { Button as AntButton } from 'antd';
import cx from 'classnames';
import PropTypes from 'prop-types';

import '../less/button.less';

function Button({
  buttonText,
  className,
  onClick,
  icon,
  textClassName,
  variant,
  ...props
}) {
  const classNames = cx(className, variant);

  return (
    <AntButton className={classNames} icon={icon} onClick={onClick} {...props}>
      {buttonText && <span className={textClassName}> {buttonText} </span>}
    </AntButton>
  );
}

Button.defaultProps = {
  buttonText: '',
  className: '',
  textClassName: '',
  variant: '',
  onClick: () => {},
  icon: <div />,
};

Button.propTypes = {
  buttonText: PropTypes.string,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
};

export default Button;
