import React, { useEffect, useState } from 'react';
import './Loader.css';
import logo_site from '../../../public/logo_site.png'; // Импорт логотипа

const Loader = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true); // Начинаем анимацию исчезновения
        }, 5000);

        const endTimer = setTimeout(() => {
            setLoading(false); // Убираем загрузочный экран
        }, 6000); // Дополнительная секунда для плавного исчезновения

        return () => {
            clearTimeout(timer);
            clearTimeout(endTimer);
        };
    }, []);

    if (!loading) {
        return null;
    }

    return (
        <div className={`custom-loader ${fadeOut ? 'custom-fade-out' : ''}`}>
            <div className="custom-loader-content">
                <img src={logo_site} alt="Логотип сайта" />
                <h2>Загрузка, пожалуйста, подождите...</h2>
            </div>
        </div>
    );
};

export default Loader;
