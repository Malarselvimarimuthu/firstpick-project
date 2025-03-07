import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
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
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState(false);

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

      // Check if product is already in cart
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product?.id);

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Add new product to cart
        cartItems.push({ ...product, quantity: 1 });
      }

      // Save updated cart back to Firestore
      await setDoc(cartRef, { items: cartItems });

      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!product) return <div className="text-center p-4">Product not found</div>;

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-[10px] py-4">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-4 md:w-1/5 justify-center items-center">
                <div className="w-24 h-24">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className={`w-full h-full object-contain rounded-sm cursor-pointer ${
                      mainImage === product.mainImage ? 'border-2 border-blue-500' : 'border-2 border-gray-200'
                    }`}
                    onMouseEnter={() => setMainImage(product.mainImage)}
                  />
                </div>
                {product.extraImages?.map((img, index) => (
                  <div key={index} className="w-24 h-24">
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-full h-full object-contain rounded-sm cursor-pointer ${
                        mainImage === img ? 'border-2 border-blue-500' : 'border-2 border-gray-200'
                      }`}
                      onMouseEnter={() => setMainImage(img)}
                    />
                  </div>
                ))}
              </div>
              <div className="md:w-4/5 h-[400px]">
                <img src={mainImage} alt={product.name} className="w-full h-full object-contain transition duration-1000" />
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl text-blue-600 mb-4">₹{product.price}</p>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
