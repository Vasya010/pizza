import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registerform.css';

const Registerform = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, phone, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Регистрация прошла успешно!');
        navigate('/login'); // Перенаправление на страницу входа
      } else {
        setErrorMessage(data.message || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setErrorMessage('Ошибка при подключении к серверу');
    }
  };


  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Регистрация</h1>
        <p className="register-subtitle">Создайте аккаунт, чтобы оформить заказ</p>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="firstName">Имя</label>
            <input type="text" id="firstName" placeholder="Введите ваше имя" className="form-input5" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Фамилия</label>
            <input type="text" id="lastName" placeholder="Введите вашу фамилию" className="form-input5" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Номер телефона</label>
            <input type="tel" id="phone" placeholder="Введите ваш номер телефона" className="form-input5" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <input type="email" id="email" placeholder="Введите ваш email" className="form-input5" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input type="password" id="password" placeholder="Придумайте пароль" className="form-input5" />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="register-button">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registerform;
