import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebase/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const firestore = getFirestore(app);
const auth = getAuth(app);


interface CartItem {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  quantity: number;
}

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[ ]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  
  
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() =>{
    calculateTotalPrice();
  },[cartItems]);

  const fetchCart = async () => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const cartRef = doc(firestore, 'carts', userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      const cartItemsData = cartData.items || [];
  
      // Fetch product details for each item
      const productPromises = cartItemsData.map(async (item: { id: string, quantity: number }) => {
        const productRef = doc(firestore, 'products', item.id); // assuming your products are in 'products' collection
        const productSnap = await getDoc(productRef);
  
        if (productSnap.exists()) {
          const productData = productSnap.data();
          return {
            id: item.id,
            name: productData.name,
            price: productData.price,
            mainImage: productData.mainImage,
            quantity: item.quantity,
          };
        } else {
          console.warn(`Product not found for id: ${item.id}`);
          return null; // or handle missing product
        }
      });
  
      const products = await Promise.all(productPromises);
      const filteredProducts = products.filter((p) => p !== null); // remove nulls
  
      setCartItems(filteredProducts as CartItem[]);
    }
    setLoading(false);
  };

  const calculateTotalPrice = () =>{
    const total = cartItems.reduce((acc,item) =>{
      return acc+ (item.price * item.quantity);
    },0);
    setTotalPrice(total);
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!auth.currentUser) return;
    
    // Prevent quantity from going below 1
    if (newQuantity < 1) return;

    const userId = auth.currentUser.uid;
    const cartRef = doc(firestore, 'carts', userId);

    // Create a new array of cart items with updated quantity
    const updatedCartItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    try {
      // Update Firestore document
      await updateDoc(cartRef, {
        items: updatedCartItems
      });

      // Update local state
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const cartRef = doc(firestore, 'carts', userId);

    // Filter out the item to be removed
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);

    try {
      // Update Firestore document
      await updateDoc(cartRef, {
        items: updatedCartItems
      });

      // Update local state
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
<div className="min-h-screen bg-[#EEF2F6] mt-8">
  <div className="max-w-7xl mx-auto p-4 sm:p-6">
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Column - Cart Items */}
      <div className="w-full lg:flex-grow">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold">Shopping Bag</h1>
          <p className="text-gray-600 mb-4">{cartItems.length} items in your bag.</p>

          {/* Header Row - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[4fr_1fr_2fr_2fr_1fr] border-b pb-2">
            <div>
              <h3 className="font-medium">Product</h3>
            </div>
            <div>
              <h3 className="font-medium">Price</h3>
            </div>
            <div className="text-center">
              <h3 className="font-medium">Quantity</h3>
            </div>
            <div>
              <h3 className="font-medium">Total Price</h3>
            </div>
            <div className="text-center">
              <h3 className="font-medium">Delete</h3>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col md:grid md:grid-cols-[4fr_1fr_2fr_2fr_1fr] py-4 border-b items-center">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full md:w-auto">
                <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] object-contain rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center text-center sm:text-left">
                  <h3 className="font-medium">{item.name}</h3>
                </div>
              </div>

              {/* Price - Mobile & Desktop */}
              <div className="flex md:hidden justify-between w-full mt-4">
                <span className="font-medium">Price:</span>
                <span>₹{item.price}</span>
              </div>
              <div className="hidden md:block">
                <span>₹{item.price}</span>
              </div>

              {/* Quantity Controls */}
              <div className="flex justify-center w-full md:w-auto mt-4 md:mt-0">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 sm:px-2 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input 
                    type="text" 
                    value={item.quantity} 
                    className="w-12 sm:w-8 text-center border-x" 
                    readOnly
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 sm:px-2 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price - Mobile & Desktop */}
              <div className="flex md:hidden justify-between w-full mt-4">
                <span className="font-medium">Total:</span>
                <span className="text-orange-400">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="hidden md:block">
                <span className="text-orange-400">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>

              {/* Delete Button */}
              <div className="flex justify-center mt-4 md:mt-0">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Summary Sections */}
      <div className="w-full lg:w-[400px] space-y-4 lg:space-y-6">
        
        

        {/* Cart Total Section */}
        <div className="bg-[#FFF8F2] rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-medium mb-2">Cart Total</h2>
          <div className="flex justify-between mb-2">
            <span>Total Ammount</span>
            <span>₹{totalPrice}</span>
          </div>
          <button
              onClick={() => navigate('/billing')}
              className="w-full mt-4 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          <div className="flex justify-between text-sm text-gray-500">
           
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default Cart;