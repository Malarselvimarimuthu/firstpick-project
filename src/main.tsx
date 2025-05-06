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

// In cart page change ProceedToCheckout validation  , Error,EmptyCart Validation - Done 
//  Display Your cart is empty with some image - Done
// Check for In Stock Error - Done 
// Update "/ " page on clicking logo - Done
// Change UI of DisplayProductPage - Done 

// Design Orders page - mention status of product -  [ change UI ]
// Design a verification page after billing page - also enable edit option there -optional
// About Page
// Edit Footer
// Update Pop Ups on AddToCart , Etc.. 
// Payments Option - Noneed



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

// // Change UI of DisplayProductPage Border is too gapped 
