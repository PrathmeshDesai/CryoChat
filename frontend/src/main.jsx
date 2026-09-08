import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <--- Add this import
import App from './App.jsx'
import './index.css'
import { StrictMode } from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </StrictMode>
)