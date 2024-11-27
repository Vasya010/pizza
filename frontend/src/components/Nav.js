import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Nav.css';
import logo from '../images/logo.png';

const Nav = () => {
    const [user, setUser] = useState({
        isLoggedIn: false,
        name: '',
        balance: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          setLoading(false);
          return;
      }
  
      fetch('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
      })
          .then((res) => {
              if (!res.ok) {
                  throw new Error(res.status === 403 ? 'Необходима авторизация' : 'Ошибка сервера');
              }
              return res.json();
          })
          .then((data) => {
              setUser({
                  isLoggedIn: true,
                  name: data.username,
                  balance: parseFloat(data.balance).toFixed(2),
              });
          })
          .catch(() => {
              localStorage.removeItem('token');
              navigate('/login');
          })
          .finally(() => setLoading(false));
  }, [navigate]);
  
    const toggleBurgerMenu = () => {
        setIsBurgerMenuOpen(prevState => !prevState);
    };

    const handleAboutClick = () => {
        console.log('Переход на страницу "О нас"');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser({
            isLoggedIn: false,
            name: '',
            balance: 0,
        });
        navigate('/login');
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }
    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-wrapper">
                    <div className="navbar-left">
                        <div className="brand-container">
                            <img className="pizza-logo" src={logo} alt="Logo" />
                            <h1 className="brand-name">BOODAI PIZZA</h1>
                        </div>
                    </div>

                    <div className="navbar-right">
                        {user.isLoggedIn ? (
                            <div className="user-info">
                                <FaUserCircle className="user-icon" />
                                <span className="user-name">{user.name}</span>
                                <span className="user-balance">{user.balance} B</span>
                                <button className="logout-btn" onClick={handleLogout}>
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <button className="login-btn" onClick={() => navigate('/login')}>
                                    Вход
                                </button>
                                <button
                                    className="register-btn"
                                    onClick={() => navigate('/register')}
                                >
                                    Регистрация
                                </button>
                            </div>
                        )}
                        <div className="hamburger-menu" onClick={toggleBurgerMenu}>
                            {isBurgerMenuOpen ? (
                                <FaTimes className="hamburger-icon" />
                            ) : (
                                <FaBars className="hamburger-icon" />
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Основные ссылки */}
            <div className="navbar-links-container">
                <ul className="navbar-links">
                    <li>
                        <Link to="/about" onClick={handleAboutClick}>
                            О нас
                        </Link>
                    </li>
                    <li>
                        <a href="tel:+996998064064">Контакты</a>
                    </li>
                    <li className="divider"></li>
                    <li>
                        <div className="delivery-details">
                            <p className="info-heading">
                                🚚 Бесплатная доставка при заказе от 1200 сом в пределах 3 км 🎉
                            </p>
                            <p className="rating-info">🌟 25 мин • 4,87⭐</p>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Меню для мобильных устройств */}
            {isBurgerMenuOpen && (
                <div className="mobile-menu">
                    <ul className="navbar-links">
                        <li>
                            <div className="delivery-details">
                                <p className="info-heading">
                                    🚚 Бесплатная доставка при заказе от 1200 сом в пределах 3 км 🎉
                                </p>
                                <p className="rating-info">🌟 25 мин • 4,87⭐</p>
                            </div>
                        </li>
                        <li>
                            <Link to="/about" onClick={handleAboutClick}>
                                О нас
                            </Link>
                        </li>
                        <li>
                            <a href="tel:+996998064064">Контакты</a>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default Nav;
