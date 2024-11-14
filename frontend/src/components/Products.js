import React, { useState, useEffect, useRef } from "react";
import Cart from "./Cart"; // Импортируем компонент Cart
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pizzaSize, setPizzaSize] = useState(null);
  const [cartItems, setCartItems] = useState([]); // Состояние для корзины
  const [errorMessage, setErrorMessage] = useState(""); // Ошибка при добавлении пиццы без размера

  const categories = useRef([]);

  useEffect(() => {
    fetch("https://nukesul-backend-1bde.twc1.net/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        const groupedItems = data.reduce((acc, product) => {
          const { category } = product;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});
        setMenuItems(groupedItems);
        categories.current = Object.keys(groupedItems).map(() =>
          React.createRef()
        );
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleProductClick = (product, category) => {
    setSelectedProduct({ product, category });
    if (category !== "Пиццы") setPizzaSize(null); // Сброс размера только для пиццы
  };

  const isPizza = (product) => {
    return product.price_small && product.price_medium && product.price_large;
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setErrorMessage(""); // Очищаем сообщение об ошибке
  };

  const handleAddToCart = () => {
    if (isPizza(selectedProduct.product) && !pizzaSize) {
      setErrorMessage("Пожалуйста, выберите размер пиццы!"); // Уведомление, если размер не выбран
      return; // Не добавляем товар в корзину, если размер не выбран
    }

    const itemToAdd = {
      id: selectedProduct.product.id,
      name: selectedProduct.product.name,
      price:
        isPizza(selectedProduct.product) && pizzaSize
          ? selectedProduct.product[`price_${pizzaSize}`]
          : selectedProduct.product.price,
      quantity: 1, // Начальное количество
      image: selectedProduct.product.image_url, // Добавляем изображение
    };

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === itemToAdd.id
    );

    if (existingItemIndex > -1) {
      // Если товар уже в корзине, увеличиваем количество
      const updatedCartItems = cartItems.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 }; // Увеличиваем количество на 1
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } else {
      // Если товара нет в корзине, добавляем его
      setCartItems([...cartItems, itemToAdd]);
    }

    closeModal();
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(item.quantity + change, 1) }; // Не позволяем количеству быть меньше 1
        }
        return item;
      });
    });
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal();
    }
  };

  const renderProductsByCategory = (category) => {
    return products
      .filter((product) => product.category === category)
      .map((product) => (
        <div
          className="menu-product"
          key={product.id} // Уникальный ключ
          onClick={() => handleProductClick(product, category)}
        >
          <img
            className="menu-product-image"
            src={`https://nukesul-backend-1bde.twc1.net${product.image_url}`}
            alt={product.name}
          />
          <div className="menu-product-info">
            <h3 className="menu-product-title">{product.name}</h3>
            <p className="menu-product-price">
              {/* Для пицц в меню показываем минимальную цену */}
              {isPizza(product)
                ? `От ${product.price_small} Сом`
                : `${product.price} Сом`}
            </p>
            <p className="menu-product-description">{product.description}</p>
          </div>
        </div>
      ));
  };

  return (
    <div className="menu-wrapper">
        <h2 className="Mark_Shop">Часто продаваемые товары</h2>

      <div className="best-sellers">
        {products
          .filter((product) => product.category === "Часто продаваемые товары")
          .map((product) => (
            <div
              className="best-seller-product"
              key={product.id}
              onClick={() =>
                handleProductClick(product, "Часто продаваемые товары")
              }
            >
              <img
                className="best-seller-product-image"
                src={`https://nukesul-backend-1bde.twc1.net${product.image_url}`}
                alt={product.name}
              />
              <div className="best-seller-product-info">
                <h3 className="best-seller-product-title">{product.name}</h3>
                <p className="best-seller-product-price">
                  {isPizza(product)
                    ? `От ${product.price_small} Сом`
                    : `${product.price} Сом`}{" "}
                  {/* Отображаем минимальную цену для пиццы */}
                </p>
              </div>
            </div>
          ))}
      </div>
        
      <div className='option__container'>
        <div className='option__name'>
          <ul>
            {Object.keys(menuItems).map((category, index) => (
              category !== 'Часто продаваемые товары' && ( // Исключаем "Часто продаваемые товары"
                <li key={category}> {/* Уникальный ключ на основе имени категории */}
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    categories.current[index].current.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    {category}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>

      <div className="menu-items">
        {Object.entries(menuItems).map(
          ([category, products], index) =>
            category !== "Часто продаваемые товары" && (
              <div
                className="menu-category"
                key={category}
                ref={categories.current[index]}
              >
                <h2 className="menu-category-title">{category}</h2>
                <div className="menu-products">
                  {products.map((product) => (
                    <div
                      className="menu-product"
                      key={product.id}
                      onClick={() => handleProductClick(product, category)}
                    >
                      <img
                        className="menu-product-image"
                        src={`https://nukesul-backend-1bde.twc1.net${product.image_url}`}
                        alt={product.name}
                      />
                      <div className="menu-product-info">
                        <h3 className="menu-product-title">{product.name}</h3>
                        <p className="menu-product-price">
                          {isPizza(product)
                            ? `От ${product.price_small} Сом`
                            : `${product.price} Сом`}{" "}
                          {/* Цена для обычных товаров */}
                        </p>
                        <p className="menu-product-description">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      {/* Модальное окно */}
      {selectedProduct && (
        <div
          className={`modal ${selectedProduct ? "see" : ""}`}
          onClick={handleOutsideClick}
        >
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              X
            </button>
            <div className="modal-body">
              <img
                src={`https://nukesul-backend-1bde.twc1.net${selectedProduct.product.image_url}`}
                alt={selectedProduct.product.name}
                className="modal-image"
              />
              <div className="modal-info">
                <h1>{selectedProduct.product.name}</h1>
                <p>{selectedProduct.product.description}</p>

                {isPizza(selectedProduct.product) && (
                  <div className="pizza-selection">
                    <h3>Выберите размер:</h3>
                    <div className="pizza-sizes">
                      <div
                        className={`pizza-size ${
                          pizzaSize === "small" ? "selected" : ""
                        }`}
                        onClick={() => setPizzaSize("small")}
                      >
                        Маленькая
                      </div>
                      <div
                        className={`pizza-size ${
                          pizzaSize === "medium" ? "selected" : ""
                        }`}
                        onClick={() => setPizzaSize("medium")}
                      >
                        Средняя
                      </div>
                      <div
                        className={`pizza-size ${
                          pizzaSize === "large" ? "selected" : ""
                        }`}
                        onClick={() => setPizzaSize("large")}
                      >
                        Большая
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="error-message">{errorMessage}</div> // Сообщение об ошибке
                )}

                <button className="add-to-cart" onClick={handleAddToCart}>
                  Добавить в корзину за{" "}
                  <span className="green-price">
                    {isPizza(selectedProduct.product) && pizzaSize
                      ? selectedProduct.product[`price_${pizzaSize}`]
                      : selectedProduct.product.price}
                  </span>{" "}
                  Сом
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Cart cartItems={cartItems} onQuantityChange={handleQuantityChange} />
    </div>
  );
}

export default Products;
