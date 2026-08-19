import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, error } = useSelector((state) => state.auth);

  const isAuthenticated = !!userInfo && !!userInfo.token;
  const isAdmin = userInfo?.role === 'ADMIN';

  const loginUser = (userData) => {
    dispatch(setCredentials(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user: userInfo,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    loginUser,
    logoutUser,
  };
};
