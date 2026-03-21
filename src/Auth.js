import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Реєстрація успішна!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Ви увійшли!");
      }
      navigate('/profile');
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  return (
    <div className="product-card" style={{maxWidth: '400px', margin: '50px auto', padding: '20px'}}>
      <h2>{isRegister ? "Створити аккаунт" : "Вхід у систему"}</h2>
      <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <input type="email" placeholder="Ваш Email" className="item-qty" style={{width: '100%'}} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" className="item-qty" style={{width: '100%'}} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="add-to-cart-btn">{isRegister ? "Зареєструватися" : "Увійти"}</button>
      </form>
      <p onClick={() => setIsRegister(!isRegister)} style={{cursor: 'pointer', textAlign: 'center', marginTop: '15px', color: '#4c091cf3'}}>
        {isRegister ? "Вже є аккаунт? Увійти" : "Немає аккаунту? Реєстрація"}
      </p>
    </div>
  );
}

export default Auth;