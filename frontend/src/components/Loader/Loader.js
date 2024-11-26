import React, { useEffect, useState } from 'react';
import './Loader.css';
import logo_site from './logo.png';

const Loader = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Ожидаем полной загрузки страницы
        window.addEventListener('load', () => {
            setFadeOut(true); // Начинаем исчезновение лоадера
            setTimeout(() => {
                setLoading(false); // Убираем лоадер после исчезновения
            }, 100); // Убираем лоадер после задержки
        });

        return () => {
            // Убираем обработчик события при размонтировании компонента
            window.removeEventListener('load', () => {});
        };
    }, []);

    if (!loading) {
        return null;
    }

    return (
        <div className={`cafe-site-loader ${fadeOut ? 'cafe-site-fade-out' : ''}`}>
            <div className="cafe-site-loader-content">
                <div className="cafe-site-loader-spinner">
                    <img src={logo_site} alt="Логотип сайта" />
                </div>
                <h2>Загрузка, пожалуйста, подождите...</h2>
            </div>
        </div>
    );
};

export default Loader;
