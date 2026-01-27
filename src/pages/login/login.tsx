import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/user/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user && isAuthChecked) {
      navigate(from, { replace: true });
    }
  }, [user, isAuthChecked, navigate, from]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Проверьте email и пароль');
    }
  };

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
