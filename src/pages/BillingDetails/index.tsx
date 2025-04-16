import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, serverTimestamp, addDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebase/firebaseConfig';

const firestore = getFirestore(app);
const auth = getAuth(app);

// Generates Order ID Based on the {year-month-day0fOrder}
const generateOrderId = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ORD${year}${month}${day}${random}`;
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  mainImage: string;
  quantity: number;
}

interface BillingDetails {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  landmark: string;
  postalCode: string;
}

const BillingFormPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const [formData, setFormData] = useState<BillingDetails>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    landmark: '',
    postalCode: ''
  });

  // Error state management
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    landmark: '',
    postalCode: '',
  });  
  const [generalError, setGeneralError] = useState('');
  

  const navigate = useNavigate();

  useEffect(() => {
    if (buyNowItem) {
      setCartItems([buyNowItem]);
      setTotalPrice(buyNowItem.price * buyNowItem.quantity);
    } else {
      fetchCart();
    }
  }, [buyNowItem]);

  const fetchCart = async () => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const cartRef = doc(firestore, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
  
    if (cartSnap.exists()) {
      const items = cartSnap.data().items;
  
      // Fetch product details for each cart item
      const productPromises = items.map(async (item: { id: string, quantity: number }) => {
        const productRef = doc(firestore, 'products', item.id);
        const productSnap = await getDoc(productRef);
  
        if (productSnap.exists()) {
          const productData = productSnap.data();
          return {
            id: item.id,
            name: productData.name,
            price: productData.price,
            quantity: item.quantity,
          };
        } else {
          return null;
        }
      });
  
      const products = await Promise.all(productPromises);
      const filteredProducts = products.filter((p) => p !== null) as CartItem[];
  
      setCartItems(filteredProducts);
  
      const total = filteredProducts.reduce((acc: number, item: CartItem) =>
        acc + (item.price * item.quantity), 0
      );
      setTotalPrice(total);
    }
  };
  

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(event.key) && event.key !== "Backspace" && event.key !== "Tab") {
      event.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors: any = {};
  
    // Full Name - Required + Letters/Spaces Only
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.fullName.trim())) {
      errors.fullName = "Only letters, spaces, and .'- are allowed";
    }
  
    // Phone Number - Required + 10 digits
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }
  
    // Email - Required + Valid format
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email = "Invalid email format";
    }
  
    // Address - Required
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    // LandMark - Required
    if (!formData.landmark.trim()) {
      errors.landmark = "LandMark is required";
    }
  
    // Postal Code - Required + 6 digits
    if (!formData.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    } else if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      errors.postalCode = "Postal code must be 6 digits";
    }
  
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setGeneralError(" Please fix the errors above before submitting.");
      return false;
    } else {
      setGeneralError('');
      return true;
    }

    // return Object.keys(errors).length === 0; // Valid if no errors
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      console.log("Validation failed");
      return; 
    }

    setIsLoading(true);

    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const userId = auth.currentUser.uid;
      const orderId = generateOrderId();
      
      // Simplified order items with only essential data
      const simplifiedItems = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const orderRef = collection(firestore, 'orders');
      const orderData = {
        orderId,
        userId,
        billingDetails: formData,
        items: simplifiedItems,  // Simplified items array
        totalAmount: totalPrice,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      // Save order to Firestore
      await addDoc(orderRef, orderData);

      // Clear cart if not buy now item
      if (!location.state?.buyNowItem) {
        const cartRef = doc(firestore, 'carts', userId);
        await setDoc(cartRef, { items: [] });
      }

      // Navigate to success page
      navigate('/order-success', { 
        replace: true,
        state: { 
          orderId: orderData.orderId,
          totalAmount: totalPrice 
        }
      });

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="flex flex-col lg:flex-row w-full shadow-xl p-6 lg:p-24 space-y-6 lg:space-y-0 mt-16 sm:mt-2">
      {/* Billing Form */}
      <div className="w-full lg:w-1/2 bg-gray-200 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-black mb-6">Billing Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your name"
              
            />
              {formErrors.fullName && (
                  <p className="text-red-600 text-sm">{formErrors.fullName}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your phone number"
              onKeyDown={handleKeyDown}
              
            />
              {formErrors.phoneNumber && (
                  <p className="text-red-600 text-sm">{formErrors.phoneNumber}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your email"
              
            />
            {formErrors.email && (
                  <p className="text-red-600 text-sm">{formErrors.email}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Address</label>
            <textarea
            name = "address"
              value={formData.address}  // Bind value to formData
              onChange={handleInputChange} 
              className="mt-1 block w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              rows={4}
              placeholder="Enter your address"
           
            ></textarea>
            {formErrors.address && (
                  <p className="text-red-600 text-sm">{formErrors.address}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter the landmark"
            />
            {formErrors.landmark && (
                  <p className="text-red-600 text-sm">{formErrors.landmark}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your postal code"
              
            />
            {formErrors.postalCode && (
                  <p className="text-red-600 text-sm">{formErrors.postalCode}</p>
                )}
          </div>

          {/* Order Summary Section */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-semibold text-black mb-3">Order Summary</h3>
            <div className="bg-white p-4 rounded-md">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        
          {generalError && (
              <p className="text-red-600 text-sm font-medium my-2">{generalError}</p>
            )}
          <div className="flex justify-between items-center mt-4">
            
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/3 bg-red-400 text-black py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Cancel
            </button>

            <button
            type="submit"
            disabled={isLoading}
            className="w-1/3 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>

          </div>
        </form>
      </div>

      {/* Information Cards */}
      <div className="w-full p-6 flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* First Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-black w-full flex items-start space-x-4">
            <div className="text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 01.553-.894L9 4m0 0l5.447 2.724A1 1 0 0115 7.618v8.764a1 1 0 01-.553.894L9 20m0-16v16"
                />
              </svg>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md animate-bounce-slow">
              <h3 className="text-lg font-bold">🚚 Only Cash On Delivery</h3>
              <p className="text-sm mt-2">
                Swipe your heart, not your card — pay cash when it lands! 🛬💵 (Cash on Delivery only!)
              </p>
            </div>

          </div>

          {/* Second Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-black flex items-start space-x-4">
            <div className="text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Easy Returns</h3>
              <p className="text-sm text-black mt-2">
                Hassle-free returns within 30 days of purchase. Customer satisfaction guaranteed for orders over $30 within 50 km.
              </p>
            </div>
          </div>

          {/* Third Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-black flex items-start space-x-4">
            <div className="text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h11M9 21V3m-6 6a6 6 0 0112 0v5a6 6 0 01-12 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Top Quality Products</h3>
              <p className="text-sm text-black mt-2">
                We ensure the highest quality standards for all our products. Shop with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingFormPage;