import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Profile from './components/Profile'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path='/home' ></Route>
          <Route element={<Profile />} path='/profile' ></Route>
        </Route>
        <Route element={<Login />} path='/' ></Route>
        <Route element={<Register />} path='/register'></Route>
        <Route element={<NotFound />} path='*'></Route>

      </Routes>
    </Router>
  )
}

export default App
