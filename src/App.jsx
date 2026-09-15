import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [orders, setOrders] = useState([])
const [showOrders, setShowOrders] = useState(false)

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowLogin(false)
    setShowRegister(false)
  }

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.log(error))
  }, [])
  useEffect(() => {
  if (!user) return

  fetch(`http://localhost:5000/cart/${user.id}`)
    .then(response => response.json())
    .then(data => {
      console.log("Cart Loaded:", data)

      if (data.items) {
        const loadedItems = data.items.map(item => ({
          ...item.productId,
          quantity: item.quantity
        }))

        setCartItems(loadedItems)
        setCartCount(
          loadedItems.reduce(
            (total, item) => total + item.quantity,
            0
          )
        )
      }
    })
    .catch(error => {
      console.log("Cart Load Error:", error)
    })
}, [user])

  const addToCart = (product) => {
  if (!user) {
    alert("Please login first")
    return
  }

  fetch(`http://localhost:5000/cart/${user.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productId: product._id,
      quantity: 1
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Cart Response:", data)

      const productWithQuantity = {
        ...product,
        quantity: 1
      }

      setCartItems(prevItems => [...prevItems, productWithQuantity])
      setCartCount(prevCount => prevCount + 1)
    })
    .catch(error => {
      console.log("Cart Error:", error)
    })
}
const removeFromCart = (index) => {
  if (!user) return

  const item = cartItems[index]

  fetch(`http://localhost:5000/cart/${user.id}/${item._id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      console.log("Product Removed:", data)

      const updatedCart = cartItems.filter((_, i) => i !== index)

      setCartItems(updatedCart)

      setCartCount(
        updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        )
      )
    })
    .catch(error => {
      console.log("Remove Cart Error:", error)
    })
}

  const increaseQuantity = (index) => {
  if (!user) return

  const item = cartItems[index]
  const newQuantity = (item.quantity || 1) + 1

  fetch(`http://localhost:5000/cart/${user.id}/${item._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quantity: newQuantity
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Quantity Updated:", data)

      const updatedCart = [...cartItems]
      updatedCart[index].quantity = newQuantity

      setCartItems(updatedCart)

      setCartCount(
        updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        )
      )
    })
    .catch(error => {
      console.log("Quantity Update Error:", error)
    })
}
const decreaseQuantity = (index) => {
  if (!user) return

  const item = cartItems[index]
  const currentQuantity = item.quantity || 1

  if (currentQuantity <= 1) {
    return
  }

  const newQuantity = currentQuantity - 1

  fetch(`http://localhost:5000/cart/${user.id}/${item._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quantity: newQuantity
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Quantity Decreased:", data)

      const updatedCart = [...cartItems]
      updatedCart[index].quantity = newQuantity

      setCartItems(updatedCart)

      setCartCount(
        updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        )
      )
    })
    .catch(error => {
      console.log("Quantity Decrease Error:", error)
    })
}

 const handleCheckout = async () => {
  const token = localStorage.getItem("token")

  if (!token) {
    alert("Please login first")
    return
  }

  if (cartItems.length === 0) {
    alert("Your cart is empty")
    return
  }

  const orderData = {
    items: cartItems.map(item => ({
      productId: item._id,
      quantity: item.quantity || 1,
      price: item.price
    })),
    totalAmount: cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    )
  }

  try {
    const response = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    })

    const data = await response.json()

    console.log("Order Response:", data)

    if (response.ok) {
      alert("Order placed successfully 🎉")
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.log("Order Error:", error)
  }
} 
const fetchOrders = async () => {
  const token = localStorage.getItem("token")

  if (!token) {
    alert("Please login first")
    return
  }

  try {
    const response = await fetch(
      `http://localhost:5000/orders/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await response.json()

    console.log("Orders Response:", data)

    if (response.ok) {
      setOrders(data)
      setShowOrders(true)
      setShowCart(false)
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.log("Orders Error:", error)
  }
}
  
  return (
    <div>
      <nav className="navbar">
        <h2>ShopKart 🛒</h2>

        {user ? (
          <>
            <span className="user-name">
              Hi, {user.name} 👋
            </span>

            <button
              className="auth-button"
              onClick={handleLogout}
            >
              Logout 🚪
            </button>
          </>
        ) : (
          <>
            <button
              className="auth-button"
              onClick={() => {
                setShowLogin(true)
                setShowRegister(false)
                setShowCart(false)
              }}
            >
              Login 🔐
            </button>

            <button
              className="auth-button"
              onClick={() => {
                setShowRegister(true)
                setShowLogin(false)
                setShowCart(false)
              }}
            >
              Register 📝
            </button>
          </>
        )}
        {user && (
  <button
    className="auth-button"
    onClick={fetchOrders}
  >
    📦 My Orders
  </button>
)}

        <button
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          🛒 Cart <span>{cartCount}</span>
        </button>
      </nav>

      {showLogin && <Login />}
      {showRegister && <Register />}

      {showCart && (
        <div className="cart-section">
          <h2>Your Cart 🛒</h2>

          <p className="cart-total">
            Total: ₹
            {cartItems.reduce(
              (total, item) =>
                total + item.price * (item.quantity || 1),
              0
            )}
          </p>
<button
  className="checkout-button"
  onClick={handleCheckout}
>
  Proceed to Checkout 🛍️
</button>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>

                <div className="quantity-control">
                  <button
                    onClick={() => decreaseQuantity(index)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(index)}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                >
                  Remove ❌
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {showOrders && (
  <div className="orders-section">
    <h2>📦 My Orders</h2>

    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      orders.map((order) => (
        <div className="order-card" key={order._id}>
          <h3>Order ID: {order._id}</h3>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <p>
            <strong>Total:</strong> ₹{order.totalAmount}
          </p>

          <h4>Items:</h4>

          {order.items.map((item) => (
            <p key={item._id}>
              {item.productId?.name} × {item.quantity}
            </p>
          ))}
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
            product.name
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map(product => (
            <div
              key={product._id}
              className="product-card"
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />

              <h2>{product.name}</h2>

              <p>Price: ₹{product.price}</p>

              <p>{product.description}</p>

              <p>Category: {product.category}</p>

              <button
                onClick={() => addToCart(product)}
              >
                Add to Cart 🛒
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default App