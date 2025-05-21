/**
 * useAuthService Hook
 * Custom hook for accessing authentication service functionality with loading and error states
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useApi from './useApi';
import { authService } from '../services';
import * as authThunks from '../store/thunks/authThunks';

/**
 * Custom hook for accessing authentication service functionality
 * Provides both direct API access and Redux thunk dispatching
 * 
 * @returns {Object} Auth service methods with loading and error states
 */
const useAuthService = () => {
  const dispatch = useDispatch();
  
  // Direct API methods with loading/error states
  const loginApi = useApi(authService.login);
  const registerApi = useApi(authService.register);
  const logoutApi = useApi(authService.logout);
  const refreshTokenApi = useApi(authService.refreshToken);
  const getCurrentUserApi = useApi(authService.getCurrentUser);
  const updateUserProfileApi = useApi(authService.updateUserProfile);
  const changePasswordApi = useApi(authService.changePassword);
  const forgotPasswordApi = useApi(authService.forgotPassword);
  const resetPasswordApi = useApi(authService.resetPassword);
  
  // Redux thunk dispatchers
  const dispatchLogin = useCallback(
    (credentials) => dispatch(authThunks.loginUser(credentials)),
    [dispatch]
  );
  
  const dispatchRegister = useCallback(
    (userData) => dispatch(authThunks.registerUser(userData)),
    [dispatch]
  );
  
  const dispatchLogout = useCallback(
    () => dispatch(authThunks.logoutUser()),
    [dispatch]
  );
  
  const dispatchRefreshToken = useCallback(
    () => dispatch(authThunks.refreshAuthToken()),
    [dispatch]
  );
  
  const dispatchGetCurrentUser = useCallback(
    () => dispatch(authThunks.getCurrentUser()),
    [dispatch]
  );
  
  const dispatchUpdateProfile = useCallback(
    (userData) => dispatch(authThunks.updateProfile(userData)),
    [dispatch]
  );
  
  const dispatchChangePassword = useCallback(
    (passwordData) => dispatch(authThunks.changePassword(passwordData)),
    [dispatch]
  );
  
  const dispatchForgotPassword = useCallback(
    (data) => dispatch(authThunks.forgotPassword(data)),
    [dispatch]
  );
  
  const dispatchResetPassword = useCallback(
    (data) => dispatch(authThunks.resetPassword(data)),
    [dispatch]
  );
  
  return {
    // Direct API methods with loading/error states
    api: {
      login: loginApi,
      register: registerApi,
      logout: logoutApi,
      refreshToken: refreshTokenApi,
      getCurrentUser: getCurrentUserApi,
      updateUserProfile: updateUserProfileApi,
      changePassword: changePasswordApi,
      forgotPassword: forgotPasswordApi,
      resetPassword: resetPasswordApi,
    },
    
    // Redux thunk dispatchers
    dispatch: {
      login: dispatchLogin,
      register: dispatchRegister,
      logout: dispatchLogout,
      refreshToken: dispatchRefreshToken,
      getCurrentUser: dispatchGetCurrentUser,
      updateProfile: dispatchUpdateProfile,
      changePassword: dispatchChangePassword,
      forgotPassword: dispatchForgotPassword,
      resetPassword: dispatchResetPassword,
    },
  };
};

export default useAuthService;
