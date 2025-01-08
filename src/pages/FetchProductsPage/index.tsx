import  { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const firestore = getFirestore(app);

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  mainImageUrl: string;
  extraImageUrls: string[];
  category: string;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<'available' | 'outOfStock'>('available');

  const navigate = useNavigate();

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(firestore, "products"));
      
      const productsData: Product[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          description: data.description,
          mainImageUrl: data.mainImage,
          extraImageUrls: data.extraImages || [],
          category: data.category,
          productID: data.productID,
          timestamp: data.timestamp?.toDate() 
        };
      });
  
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }


  return (
    <div className="mt-10 p-4">
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        {products.map((product) => (
          <div key={product.id} 
          className="w-[270px] border rounded-sm shadow hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}>

            {/* Main Image */}
            <div className="w-[270px] h-[270px] overflow-hidden">
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-sm"
              loading="lazy"
            />
            </div>
            
        <div className="flex-1 p-3 flex flex-col">
        {/* Product Name - Now takes 2 lines with ellipsis */}
        <div className="mb-auto">
          <h3 className="font-bold text-lg line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Bottom Row: Price and Stock Status */}
        <div className="flex justify-between items-center mt-2">
          {/* Price */}
          <p className="text-gray-800 font-semibold">₹{product.price}</p>

          {/* Stock Status */}
          <span 
            className={`px-3 py-1 rounded-full text-sm ${
              stockStatus === 'available'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {stockStatus === 'available' ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
      

          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
}

export default ProductList;