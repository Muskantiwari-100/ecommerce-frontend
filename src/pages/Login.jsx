import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
e.preventDefault()

fetch('http://localhost:5000/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email,
    password
  })
})
  .then(response => response.json())
  .then(data => {
  console.log('Login Response:', data)

  if (data.token) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }
})
  .catch(error => {
    console.log('Login Error:', error)
  })
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login 🔐</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button
  type="button"
  className="password-toggle"
  onClick={() => setShowPassword(!showPassword)}
>
  &#128065;
</button>
</div>

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login