import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    if (user && isAuthChecked) {
      navigate('/', { replace: true });
    }
  }, [user, isAuthChecked, navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!userName || !email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      await dispatch(
        registerUser({ name: userName, email, password })
      ).unwrap();
    } catch (err: any) {
      setError(
        err.message ||
          'Ошибка регистрации. Возможно, пользователь уже существует'
      );
    }
  };

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
