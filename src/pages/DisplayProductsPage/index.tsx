import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebase/firebaseConfig';

const firestore = getFirestore(app);
const auth = getAuth(app);

interface ProductDetail {
  id: string;
  name: string;
  price: string;
  description: string;
  mainImage: string;
  extraImages: string[];
  category: string;
}

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore, 'products', id!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = { id: docSnap.id, ...docSnap.data() } as ProductDetail;
        setProduct(productData);
        setMainImage(productData.mainImage);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      alert('You must be logged in to add items to the cart.');
      return;
    }
  
    setAddingToCart(true);
    const userId = auth.currentUser.uid;
    const cartRef = doc(firestore, 'carts', userId);
  
    try {
      const cartSnap = await getDoc(cartRef);
      let cartItems = cartSnap.exists() ? cartSnap.data().items || [] : [];
  
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product?.id);
  
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({ id: product?.id, quantity }); // Only storing id and quantity
      }
  
      await setDoc(cartRef, { items: cartItems });
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleBuyNow = () => {
    if (!auth.currentUser) {
      alert('You must be logged in to purchase items.');
      return;
    }

    if (product) {
      const buyNowItem = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        mainImage: product.mainImage,
        quantity: quantity
      };

      navigate('/billing', { 
        state: { 
          buyNowItem,
          isBuyNow: true 
        } 
      });
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!product) return <div className="text-center p-4">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#F0F9FF] py-8 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="p-6 md:p-8 flex flex-col-reverse md:flex-row gap-6 bg-[#E0F2FE]">
              {/* Thumbnail Images */}
              <div className="flex md:flex-col gap-4 md:w-1/5 justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className={`w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 ${
                      mainImage === product.mainImage 
                        ? 'ring-2 ring-blue-500' 
                        : 'ring-1 ring-gray-200'
                    }`}
                    onMouseEnter={() => setMainImage(product.mainImage)}
                  />
                </div>
                {product.extraImages?.map((img, index) => (
                  <div key={index} className="w-20 h-20 md:w-24 md:h-24 rounded-sm overflow-hidden">
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 ${
                        mainImage === img 
                          ? 'ring-2 ring-blue-500' 
                          : 'ring-1 ring-gray-200'
                      }`}
                      onMouseEnter={() => setMainImage(img)}
                    />
                  </div>
                ))}
              </div>
  
              {/* Main Image */}
              <div className="md:w-4/5 h-[400px] md:h-[500px] bg-gray-50 rounded-xl p-4">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-opacity duration-300"
                />
              </div>
            </div>
  
            {/* Product Details Section */}
            <div className="bg-gray-50 p-6 md:p-8 flex flex-col">
              <div className="flex-grow">
                {/* Category */}
                <p className="text-blue-600 font-medium text-sm mb-2">
                  {product.category}
                </p>
  
                {/* Title & Price */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-3xl text-blue-600 font-semibold mb-4">
                  ₹{product.price}
                </p>
  
                {/* Description */}
                <div className="bg-white rounded-xl p-4 mb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
  
                {/* Quantity Selector */}
                <div className="bg-white rounded-xl p-4 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 text-center border rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                  </div>
                </div>
  
                {/* Total Price */}
                <div className="bg-white rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{(parseFloat(product.price) * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
  
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl
                           border-2 border-blue-600 hover:bg-blue-50 
                           transition-all duration-200 disabled:opacity-50
                           flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <span className="animate-spin">↻</span>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold 
                           rounded-xl hover:bg-blue-700 transition-all duration-200
                           shadow-lg hover:shadow-xl"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;