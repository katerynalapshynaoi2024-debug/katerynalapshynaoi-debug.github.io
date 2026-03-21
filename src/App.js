import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; 
import Auth from './Auth';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, getIdToken } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const initialProducts = [
  { id: 1, name: "Спортивні кросівки", price: 2500, rating: 4.8, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=250&h=150&fit=crop" },
  { id: 2, name: "Футбольний м'яч", price: 1200, rating: 4.6, img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=250&h=150&fit=crop" },
  { id: 3, name: "Гантелі 5 кг", price: 1800, rating: 4.7, img: "https://yogamarket.com.ua/wp-content/uploads/2020/04/ganteli-dlya-fitnesa-adidas-Neoprene-5kg-ADWT-10025-2.jpg" },
  { id: 4, name: "Спортивний рюкзак", price: 950, rating: 4.5, img: "https://diforte.ua/pic/DSCF0219-694x1040/DSCF0219-694x1040.jpg" }
];

function ProductsPage({ products, addToCart, addToWishlist }) {
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    setDisplayProducts(products);
  }, [products]);

  const sort = (type) => {
    const sorted = [...displayProducts].sort((a, b) => type === 'price' ? a.price - b.price : b.rating - a.rating);
    setDisplayProducts(sorted);
  };

  return (
    <section id="productslist">
      <h2>Наші Товари</h2>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={() => sort('price')} className="add-to-cart-btn">Дешевші попереду</button>
        <button onClick={() => sort('rating')} className="add-to-cart-btn" style={{ marginLeft: '10px' }}>Найкращий рейтинг</button>
      </div>
      <div className="products-grid">
        {displayProducts.map((p, index) => (
          <article key={p.id || index} className="product-card">
            <img src={p.img} alt={p.name} width="250" />
            <h3>{p.name}</h3>
            <p>Ціна: {p.price} грн | ⭐ {p.rating}</p>
            <button onClick={() => addToCart(p)} className="add-to-cart-btn">В кошик</button>
            <button onClick={() => addToWishlist(p)} className="add-to-cart-btn" style={{backgroundColor: '#7a122e', marginTop: '5px'}}>❤️ В обране</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage({ cart, removeFromCart }) {
  const totalSum = cart.reduce((sum, item) => sum + Number(item.price), 0);
  
  return (
    <section>
      <h2>Ваш кошик</h2>
      <div id="total-sum-container">
        <h3>Загальна сума: <span id="total-price">{totalSum}</span> грн</h3>
        <div id="cart-items-list">
          {cart.length === 0 ? <p>Кошик порожній</p> : null}
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
              <span>{item.name} — {item.price} грн</span>
              <button onClick={() => removeFromCart(index)} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>Видалити</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SalesPage() {
  return (
    <section id="sales">
      <h2>Акції</h2>
      <p>Спеціальні пропозиції та знижки на певні товари.</p>
      <div style={{ backgroundColor: 'rgba(229, 245, 85, 0.916)', padding: '15px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
        <ul>
          <li>Спортивні кросівки AirRun — знижка 20%</li>
          <li>Футбольний м'яч ProLeague — знижка 15%</li>
        </ul>
      </div>
    </section>
  );
}

// ВИПРАВЛЕНО: Прибрали getProtectedData з дужок
function ProfilePage({ user, wishlist, addToCart }) {
  const getProtectedData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please log in first.");
      return;
    }
    try {
      const token = await getIdToken(currentUser);
      const response = await fetch("https://my-sport-shop-backend.onrender.com/api/protected", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      alert(JSON.stringify(data)); 
    } catch (error) {
      alert("Error fetching protected data: " + error.message);
    }
  };

  if (!user) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Будь ласка, авторизуйтесь (натисніть "Увійти" в меню)</h2>;
  return (
    <section className="product-card" style={{maxWidth: '600px', margin: '0 auto'}}>
      <h2>Вітаємо, {user.email}</h2>
      <h3>Мій Список Бажань (Завдання 2)</h3>
      {wishlist.length === 0 ? <p>Список порожній</p> : (
        wishlist.map((item, i) => (
          <div key={i} style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
            {item.name} — {item.price} грн 
            <button onClick={() => addToCart(item)} style={{marginLeft: '10px', fontSize: '12px'}} className="add-to-cart-btn">В кошик</button>
          </div>
        ))
      )}
      <button onClick={() => signOut(auth)} className="add-to-cart-btn" style={{background: 'red', marginTop: '20px'}}>Вийти</button>
      <button onClick={getProtectedData} style={{background: 'blue', marginTop: '20px', marginLeft: '10px'}} className="add-to-cart-btn">Перевірити захищений доступ</button>
    </section>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialProducts); 
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch("https://my-sport-shop-backend.onrender.com/api/message")
      .then(response => response.json())
      .then(data => console.log("СЕРВЕР КАЖЕ:", data.message))
      .catch(error => console.error("Помилка з'єднання з сервером:", error));

    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadWishlist(u.uid);
      else setWishlist([]);
    });

    const getProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const list = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
        if (list.length > 0) {
          setProducts(list);
        }
      } catch (error) {
        console.error("Помилка завантаження товарів з БД: ", error);
      }
    };
    getProducts();
  }, []);

  // ВИПРАВЛЕНО: Тепер список завантажується через твій сервер, а не напряму
  const loadWishlist = async (uid) => {
    try {
      const response = await fetch(`https://my-sport-shop-backend.onrender.com/api/wishlist/${uid}`);
      const data = await response.json();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Помилка завантаження списку:", error);
      setWishlist([]);
    }
  };

  // ВИПРАВЛЕНО: Товари додаються через твій сервер із перевіркою на дублікати
  const addToWishlist = async (p) => {
    if (!user) return alert("Спочатку увійдіть в систему!");
    
    try {
      const response = await fetch("https://my-sport-shop-backend.onrender.com/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, product: p })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setWishlist([...wishlist, p]);
        alert(`${p.name} додано в обране!`);
      } else {
        alert(result.message); 
      }
    } catch (error) {
      alert("Помилка зв'язку з сервером: " + error.message);
    }
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Router>
      <header>
        <h1>SportStyle — онлайн-магазин</h1>
        <nav>
          <ul>
            <li><Link to="/">Товари</Link></li>
            <li><Link to="/sales">Акції</Link></li>
            <li><Link to="/cart">Кошик ({cart.length})</Link></li>
            <li><Link to="/profile">Профіль</Link></li>
            {!user && <li><Link to="/auth" style={{color: 'yellow'}}>Увійти</Link></li>}
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ProductsPage products={products} addToCart={(p) => { setCart([...cart, p]); alert('Додано до кошика!'); }} addToWishlist={addToWishlist} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} />} />
          <Route path="/profile" element={<ProfilePage user={user} wishlist={wishlist} addToCart={(p) => { setCart([...cart, p]); alert('Додано до кошика!'); }} />} />
        </Routes>
      </main>
    </Router>
  );
}