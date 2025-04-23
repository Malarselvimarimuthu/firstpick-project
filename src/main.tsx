import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)

// In cart page change ProceedToCheckout validation  , Error - Done
//  Display Your cart is empty with some image 
// Check for In Stock Error
// Update "/ " page on clicking logo
// Change UI of DisplayProductPage
// Design Orders page - mention status of product
// Design a verification page after billing page - also enable edit option there -optional
// About Page
// Edit Footer

// Admin Modules
// Verify Admin Email
// Design Navbar for Admin
// Edit Navbar for Admin
// Product managemnt - Create ( update category click )
//  , Read , Update , Delete
// View Orders - Update Order status

// Help Desk
// Admin Help Desk Management 
// Customer Feedback
// Feedback view page of admin  

