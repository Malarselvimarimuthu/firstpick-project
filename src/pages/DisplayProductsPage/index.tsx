import React,{useState,useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../../firebase/firebaseConfig';

const firestore = getFirestore(app);

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
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const docRef = doc(firestore, "products", id!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as ProductDetail);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!product) return <div className="text-center p-4">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {/* Main Image */}
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full rounded-lg shadow-lg mb-4"
          />

          {/* Extra Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.extraImages?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg cursor-pointer"
                onClick={() => {
                  // Optional: Implement image gallery/modal here
                }}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-blue-600 mb-4">₹{product.price}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          {/* Additional Details */}
          <div className="border-t pt-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <p className="text-gray-600">Category: {product.category}</p>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;