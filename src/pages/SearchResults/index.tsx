import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import app from '../../firebase/firebaseConfig';

const firestore = getFirestore(app);

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  mainImageUrl: string;
  extraImageUrls: string[];
  category: string;
  productID?: string;
  timestamp?: Date;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all products once
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query changes
  useEffect(() => {
    const query = searchParams.get('q')?.toLowerCase() || '';
    if (products.length > 0) {
      const filtered = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      });
      setFilteredProducts(filtered);
    }
  }, [searchParams, products]);

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
      
      // Initial filtering
      const query = searchParams.get('q')?.toLowerCase() || '';
      const filtered = productsData.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) 
        //   product.description.toLowerCase().includes(query)
        );
      });
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"/>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-4 mt-16">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for "{searchParams.get('q')}"
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Main Image */}
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-2"
              loading="lazy"
            />
            
            {/* Product Details */}
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>

            {/* Category Tag */}
            <div className="mt-2">
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600">
                {product.category}
              </span>
            </div>

            {/* Extra Images */}
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {product.extraImageUrls?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name} extra ${index + 1}`}
                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 p-8">
          No products found matching "{searchParams.get('q')}"
        </div>
      )}
    </div>
  );
};

export default SearchResults;