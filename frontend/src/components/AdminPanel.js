import React, { useState, useEffect } from 'react';
import './../styles/AdminPanel.css';

function AdminPanel() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [priceSmall, setPriceSmall] = useState('');
  const [priceMedium, setPriceMedium] = useState('');
  const [priceLarge, setPriceLarge] = useState('');
  const [productsPrice, setProductsPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://nukesul-backend-1bde.twc1.net/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory('');
    resetFormFields();
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    resetPriceFields();
  };

  const resetFormFields = () => {
    setName('');
    setDescription('');
    setImage(null);
    resetPriceFields();
  };

  const resetPriceFields = () => {
    setPriceSmall('');
    setPriceMedium('');
    setPriceLarge('');
    setProductsPrice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Дизейблим кнопку после нажатия

    const formData = new FormData();
    if (image) formData.append('image', image);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (subCategory) formData.append('subCategory', subCategory);

    if ((category === 'Пиццы' || subCategory === 'Пиццы') && priceSmall) {
      formData.append('priceSmall', parseFloat(priceSmall));
      formData.append('priceMedium', parseFloat(priceMedium));
      formData.append('priceLarge', parseFloat(priceLarge));
    } else if (productsPrice) {
      formData.append('price', parseFloat(productsPrice));
    } else {
      alert('Укажите цену для товара!');
      setIsSubmitting(false); // Включаем кнопку снова в случае ошибки
      return;
    }

    try {
      const response = await fetch('https://nukesul-backend-1bde.twc1.net/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        alert('Продукт добавлен!');
        resetFormFields();
      } else {
        const errorText = await response.text();
        alert(`Ошибка при добавлении продукта: ${errorText}`);
      }
    } catch (error) {
      console.error('Ошибка при добавлении продукта:', error);
      alert('Произошла ошибка при добавлении продукта.');
    }

    setIsSubmitting(false); // Снова активируем кнопку после завершения
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот продукт?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://nukesul-backend-1bde.twc1.net/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        alert('Продукт удален!');
      } else {
        alert('Произошла ошибка при удалении продукта.');
      }
    } catch (error) {
      alert('Произошла ошибка при удалении продукта.');
    }
  };

  const renderProductsByCategory = (categoryName) => {
    const filteredProducts = Array.isArray(products)
      ? products.filter((product) => product.category === categoryName)
      : [];

    return (
      <div className="category-section">
        <h2>{categoryName}</h2>
        <div className="product-cards">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={`https://nukesul-backend-1bde.twc1.net${product.image_url}`}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {product.price_small || product.price_medium || product.price_large ? (
                  <div>
                    {product.price_small && <p>Цена (маленькая): {product.price_small} сом</p>}
                    {product.price_medium && <p>Цена (средняя): {product.price_medium} сом</p>}
                    {product.price_large && <p>Цена (большая): {product.price_large} сом</p>}
                  </div>
                ) : product.price ? (
                  <p>Цена: {product.price} сом</p>
                ) : (
                  <p>Цена не указана</p>
                )}
                <button className="delete-button" onClick={() => handleDelete(product.id)}>
                  Удалить
                </button>
              </div>
            ))
          ) : (
            <p>Нет товаров в этой категории</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-block">
      <form onSubmit={handleSubmit} className="admin-form">
        <div>
          <label>Категория:</label>
          <select value={category} onChange={handleCategoryChange} required>
            <option value="">Выберите категорию</option>
            <option value="Пиццы">Пиццы</option>
            <option value="Бургеры">Бургеры</option>
            <option value="Часто продаваемые товары">Часто продаваемые товары</option>
            <option value="Комбо">Комбо</option>
            <option value="Сет">Сет</option>
            <option value="Суши">Суши</option>
            <option value="Десерты">Десерты</option>
            <option value="Закуски">Закуски</option>
            <option value="Супы">Супы</option>
            <option value="Вок">Вок</option>
            <option value="Завтраки">Завтраки</option>
            <option value="Шаурмы">Шаурмы</option>
            <option value="Салаты">Салаты</option>
            <option value="Соусы">Соусы</option>
            <option value="Напитки">Напитки</option>
            <option value="Лимонады">Лимонады</option>
            <option value="Коктейлы">Коктейлы</option>

            <option value="Кофе">Кофе</option>
          </select>
        </div>

        {category === 'Часто продаваемые товары' && (
          <div>
            <label>Подкатегория:</label>
            <select value={subCategory} onChange={handleSubCategoryChange} required>
              <option value="">Выберите подкатегорию</option>
              <option value="Пиццы">Пиццы</option>
              <option value="Комбо">Комбо</option>
              <option value="Сет">Сет</option>
              <option value="Бургеры">Бургеры</option>
              <option value="Суши">Суши</option>
              <option value="Десерты">Десерты</option>
              <option value="Закуски">Закуски</option>
              <option value="Супы">Супы</option>
              <option value="Вок">Вок</option>
              <option value="Завтраки">Завтраки</option>
              <option value="Шаурмы">Шаурмы</option>
              <option value="Салаты">Салаты</option>
              <option value="Напитки">Напитки</option>
              <option value="Кофе">Кофе</option>
            </select>
          </div>
        )}

        {category && (
          <>
            {category === 'Пиццы' || subCategory === 'Пиццы' ? (
              <>
                <div>
                  <label>Цена (Маленькая):</label>
                  <input
                    type="text"
                    value={priceSmall}
                    onChange={(e) => setPriceSmall(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Цена (Средняя):</label>
                  <input
                    type="text"
                    value={priceMedium}
                    onChange={(e) => setPriceMedium(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Цена (Большая):</label>
                  <input
                    type="text"
                    value={priceLarge}
                    onChange={(e) => setPriceLarge(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label>Цена:</label>
                <input
                  type="text"
                  value={productsPrice}
                  onChange={(e) => setProductsPrice(e.target.value)}
                  required
                />
              </div>
            )}
          </>
        )}

        <div>
          <label>Название:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>Описание:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Изображение:</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Добавление...' : 'Добавить продукт'}
        </button>
      </form>

      <div className="products-section">
        {renderProductsByCategory('Пиццы')}
        {renderProductsByCategory('Часто продаваемые товары')}
        {renderProductsByCategory('Комбо')}
        {renderProductsByCategory('Сет')}
        {renderProductsByCategory('Бургеры')}
        {renderProductsByCategory('Суши')}
        {renderProductsByCategory('Десерты')}
        {renderProductsByCategory('Закуски')}
        {renderProductsByCategory('Супы')}
        {renderProductsByCategory('Вок')}
        {renderProductsByCategory('Завтраки')}
        {renderProductsByCategory('Шаурмы')}
        {renderProductsByCategory('Салаты')}
        {renderProductsByCategory('Соусы')}
        {renderProductsByCategory('Напитки')}
        {renderProductsByCategory('Лимонады')}
        {renderProductsByCategory('Коктейлы')}
        {renderProductsByCategory('Кофе')}
      </div>
    </div>
  );
}

export default AdminPanel;
