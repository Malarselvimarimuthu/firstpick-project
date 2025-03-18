import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebase/firebaseConfig';
import { useAuth } from '../../context/AuthContext';

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
      setCartItems(cartSnap.data().items);
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
        cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b p-4">
            <img src={item.mainImage} alt={item.name} className="w-16 h-16 object-contain" />
            <p>{item.name}</p>
            <p>₹{item.price}</p>
            <div className="flex items-center">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => removeItem(item.id)}
              className="text-red-500"
            >
              Remove
            </button>
            <p>₹{(item.price * item.quantity).toFixed(2)}</p>
          </div>
          )) 
      )}
      <h2 className="text-xl font-bold">
              Total: ₹{totalPrice.toFixed(2)}
            </h2>
    </div>
  );
}

export default Cart;