import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.log(error))
  }, [])
const addToCart = (product) => {
  setCartItems(prevItems => [...prevItems, product])
  setCartCount(prevCount => prevCount + 1)
}
const removeFromCart = (index) => {
  const updatedCart = cartItems.filter((_, i) => i !== index)
  setCartItems(updatedCart)
  setCartCount(updatedCart.length)
}
const increaseQuantity = (index) => {
  console.log("PLUS CLICKED", index);

  const updatedCart = [...cartItems];
  updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;

  setCartItems(updatedCart);
};

const decreaseQuantity = (index) => {
  console.log("MINUS CLICKED", index);

  const updatedCart = [...cartItems];

  if ((updatedCart[index].quantity || 1) > 1) {
    updatedCart[index].quantity -= 1;
    setCartItems(updatedCart);
  }
};
  return (
    <div>
    <nav className="navbar">
  <h2>ShopKart 🛒</h2>

  <button
  className="cart-button"
  onClick={() => setShowCart(!showCart)}
>
  🛒 Cart <span>{cartCount}</span>
</button>
</nav>
{showCart && (
  <div className="cart-section">
    <h2>Your Cart 🛒</h2>
    <p className="cart-total">
  Total: ₹{cartItems.reduce((total, item) => total + item.price, 0)}
</p>

    {cartItems.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      cartItems.map((item, index) => (
        <div className="cart-item" key={index}>
          <img src={item.image} alt={item.name} />

          <div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
          <div className="quantity-control">
  <button onClick={() => decreaseQuantity(index)}>−</button>
  <span>{item.quantity}</span>
  <button onClick={() => increaseQuantity(index)}>+</button>
</div>
          <button onClick={() => removeFromCart(index)}>
  Remove ❌
</button>
        </div>
      ))
    )}
  </div>
)}
      <h1>E-Commerce Store 🛒</h1>
      <div className="search-box">
  <input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
</div>

      <div className="products-grid">
  {products
  .filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )
  .map(product => (
          <div key={product._id} className="product-card">

  <img
    src={product.image}
    alt={product.name}
    className="product-image"
  />

  <h2>{product.name}</h2>

  <p>Price: ₹{product.price}</p>

  <p>{product.description}</p>

  <p>Category: {product.category}</p>

  <button onClick={() => addToCart(product)}>
  Add to Cart 🛒
</button>
</div>
        ))}
      </div>
    </div>
  )
}

export default App