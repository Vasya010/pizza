import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        isLoggedIn: false,
        name: '',
        balance: 0,
    });
    const [loading, setLoading] = useState(true); // Для отображения загрузки

    // Функция для загрузки текущего пользователя
    const loadUser = async () => {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        if (!token) {
            console.error('Токен отсутствует. Пользователь не авторизован.');
            setUser({
                isLoggedIn: false,
                name: '',
                balance: 0,
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/me', {
                headers: {
                    Authorization: `Bearer ${token}`, // Отправляем токен в заголовке
                },
            });
            const { name, balance } = response.data;

            setUser({
                isLoggedIn: true,
                name,
                balance,
            });
        } catch (error) {
            console.error('Ошибка при загрузке пользователя:', error);
            setUser({
                isLoggedIn: false,
                name: '',
                balance: 0,
            });
        } finally {
            setLoading(false); // В любом случае убираем загрузку
        }
    };

    // Функция входа
    const login = (name, balance, token) => {
        localStorage.setItem('token', token); // Сохраняем токен
        setUser({
            isLoggedIn: true,
            name,
            balance,
        });
    };

    // Функция выхода
    const logout = () => {
        localStorage.removeItem('token'); // Удаляем токен
        setUser({
            isLoggedIn: false,
            name: '',
            balance: 0,
        });
    };

    // Загружаем пользователя при монтировании компонента
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
