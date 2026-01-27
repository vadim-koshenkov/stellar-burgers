import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  selectIsLoading,
  updateUser,
  getUser
} from '../../services/slices/user/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      setIsFormChanged(false);
    }
  }, [user]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updateData: Record<string, string> = {};

      if (formValue.name !== user?.name) {
        updateData.name = formValue.name;
      }

      if (formValue.email !== user?.email) {
        updateData.email = formValue.email;
      }

      if (formValue.password) {
        updateData.password = formValue.password;
      }

      if (Object.keys(updateData).length === 0) {
        setIsFormChanged(false);
        return;
      }

      await dispatch(updateUser(updateData)).unwrap();

      dispatch(getUser());

      setFormValue((prev) => ({ ...prev, password: '' }));
      setSuccessMessage('Данные успешно обновлены!');
      setIsFormChanged(false);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error);
      setErrorMessage(error.message || 'Ошибка обновления данных');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      setIsFormChanged(false);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value
    }));

    if (!user) return;

    const changed =
      (name === 'name' && value !== user.name) ||
      (name === 'email' && value !== user.email) ||
      (name === 'password' && value !== '');

    setIsFormChanged(changed);
  };

  if (isLoading && !user) {
    return <Preloader />;
  }

  return (
    <>
      {errorMessage && (
        <div style={{ color: 'red', textAlign: 'center', margin: '10px' }}>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div style={{ color: 'green', textAlign: 'center', margin: '10px' }}>
          {successMessage}
        </div>
      )}
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </>
  );
};
