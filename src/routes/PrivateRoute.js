import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ component: Component }) {
  const { pathname } = useLocation();
  const isAuthenticated = true; /* Your authentication logic */

  return isAuthenticated ? (
    <Component />
  ) : (
    <Navigate replace state={{ from: pathname }} to="/login" />
  );
}
PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired,
};
export default PrivateRoute;
