import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebase/firebaseConfig';
import { BsCart2 } from "react-icons/bs";

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

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        cartItems.push({ id: product?.id, quantity });
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

  // Function to handle image navigation
  const navigateImage = (direction: 'prev' | 'next') => {
    if (!product) return;
    
    const allImages = [product.mainImage, ...(product.extraImages || [])];
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!product) return <div className="text-center p-4">Product not found</div>;

  const allImages = [product.mainImage, ...(product.extraImages || [])];

  return (
    <div className="min-h-screen bg-white py-1 mt-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-white shadow-sm overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="p-6 md:p-8 flex flex-col-reverse md:flex-row gap-6">
          {/* Thumbnails for Desktop */}
          <div className="hidden md:flex md:flex-col gap-4 md:w-1/5 justify-center">
            {[product.mainImage, ...(product.extraImages || [])].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`relative w-16 h-16 md:w-20 md:h-20 overflow-hidden
                  transition-all duration-200 ${
                    mainImage === img ? 'shadow-md ring-1 ring-sky-500' : 'hover:shadow-md'
                  }`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain bg-white" />
              </button>
            ))}
          </div>

          {/* Main Image Display */}
          <div className="md:w-4/5 relative">
            {/* Desktop View */}
            <div className="hidden md:flex w-full h-[400px] md:h-[500px] bg-white items-center justify-center overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden relative w-full h-[350px] bg-white">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`Product view ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                {/* Prev/Next buttons */}
                <button onClick={() => navigateImage('prev')} className="absolute left-2 p-2 rounded-full bg-white/80 shadow-md text-gray-800 hover:bg-white transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => navigateImage('next')} className="absolute right-2 p-2 rounded-full bg-white/80 shadow-md text-gray-800 hover:bg-white transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {/* Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      currentImageIndex === idx ? 'bg-sky-500 w-4' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details - shared for mobile & desktop */}
        <div className="p-6 md:p-8 md:border-l space-y-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{product.name}</h1>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">₹{product.price}</div>

          <div>
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">About this item</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-12 text-center bg-gray-50 rounded-md py-1 text-sm 
                  focus:ring-1 focus:ring-sky-500 focus:outline-none border border-gray-300"
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-700">Total:</span>
              <span className="ml-2 text-lg md:text-2xl font-bold text-gray-900">
                ₹{(parseFloat(product.price) * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="px-3 md:px-6 py-2 md:py-3 bg-sky-500 text-white font-medium rounded-lg 
                hover:bg-sky-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2
                shadow hover:shadow-lg hover:shadow-sky-100"
            >
              <BsCart2 className="h-6 w-6" style={{ strokeWidth: 0.5 }} />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="px-3 md:px-6 py-2 md:py-3 bg-gray-800 text-white font-medium rounded-lg 
                hover:bg-gray-900 transition-all duration-200 shadow hover:shadow-lg hover:shadow-gray-100"
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
};

export default ProductDetails;