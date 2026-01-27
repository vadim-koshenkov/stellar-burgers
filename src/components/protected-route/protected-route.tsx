import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useSelector } from '../../services/store';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/user/userSlice';
import { Preloader } from '@ui';

export const ProtectedRoute = ({
  children
}: {
  children: React.ReactElement;
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if (user) return children;

  return <Navigate to='/login' state={{ from: location }} replace />;
};
