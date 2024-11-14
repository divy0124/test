import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

function PublicRoute({ component: Component }) {
  const isAuthenticated = !true; /* Your authentication logic */

  return isAuthenticated ? <Navigate to="/" /> : <Component />;
}

PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default PublicRoute;
