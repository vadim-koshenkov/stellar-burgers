import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/user/userSlice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
      return;
    }

    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      });
  };

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
