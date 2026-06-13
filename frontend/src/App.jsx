import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from "./components/Login";
import Signup from "./components/Signup";
import Main from "./components/Main";

function App(){
  const token = localStorage.getItem('token')
  return (
    <Routes>
      <Route path="/" element={ token ? <Navigate to="/app" /> : <Navigate to="/login"/> } />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/app" element={ token ? <Main/> : <Navigate to="/login" /> } />
    </Routes>
  )
}

export default App
