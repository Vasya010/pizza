import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Nav.css"; // Подключаем стили
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleBurgerMenu = () => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen);
  };

  const handleAboutClick = () => {
    setIsBurgerMenuOpen(false); // Закрываем меню
    navigate("/about"); // Переходим на страницу "О нас"
  };

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

      {/* Отдельный объект ниже навбара для больших экранов */}
      <div className="navbar-links-container">
        <ul className="navbar-links">
          <li>
            <Link to="/about" onClick={handleAboutClick}>О нас</Link>
          </li>
          <li>
            <a href="tel:+996998064064">Контакты</a> {/* Телефонная ссылка для звонка */}
          </li>
          <li className="divider"></li>
          <li>
            <div className="delivery-details">
              <p className="info-heading">🚗 Доставка к вашему порогу!</p>
              <p className="rating-info">🌟 25 мин • 4,43⭐</p>
            </div>
          </li>
          <li className="divider"></li>
          <li>
            <div className="contact-details">
              <p className="contact-number">📞 +996 • 0 (998) 064-064</p>
              <p className="contact-label">Звонок для заказа</p>
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
                <p className="info-heading">🚗 Доставка к вашему порогу!</p>
                <p className="rating-info">🌟 40 мин • 4,43⭐</p>
              </div>
            </li>
            <li className="divider"></li>
            <li>
              <div className="contact-details">
                <p className="contact-number">📞 +996 • 0 (998) 064-064</p>
                <p className="contact-label">Звонок для заказа</p>
              </div>
            </li>
            <li>
              <Link to="/about" onClick={handleAboutClick}>О нас</Link>
            </li>
            <li>
              <a href="tel:+996998064064">Контакты</a> {/* Телефонная ссылка для звонка */}
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Nav;
