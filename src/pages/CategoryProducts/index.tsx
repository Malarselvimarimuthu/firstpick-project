import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import app from '../../firebase/firebaseConfig';
import { Product } from '../../types/product';

const CategoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<'available' | 'outOfStock'>('available');

  const { category } = useParams();
  const navigate = useNavigate();
  const firestore = getFirestore(app);

  const getCategoryName = (urlCategory: string | undefined) => {
    switch (urlCategory) {
      case 'waterbottle':
        return 'WATER_BOTTLES';
      case 'cashewnuts':
        return 'CASHEW_NUTS';
      case 'choppingboard':
        return 'CHOPPING_BOARD';
      default:
        return '';
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(firestore, 'products');
      const q = query(productsRef, where('category', '==', getCategoryName(category)));
      const querySnapshot = await getDocs(q);

      const productsData: Product[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          description: data.description,
          mainImageUrl: data.mainImage,
          category: data.category,
          productID: data.productID,
          timestamp: data.timestamp?.toDate()
        };
      });

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="w-full px-2 sm:px-4 mt-14">
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No products found in this category</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-row sm:flex-col bg-white rounded-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden h-[150px] sm:h-auto"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Image Section */}
              <div className="w-1/2 sm:w-full aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={product.mainImageUrl}
                  alt={product.name}
                  className="w-full h-full max-w-[140px] max-h-[140px] sm:max-w-full sm:max-h-full object-contain rounded-md shadow"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="w-1/2 sm:w-full p-3 flex flex-col justify-between">
                <h3 className="text-gray-900 font-medium text-sm sm:text-base line-clamp-2 mb-1">
                  {product.name}
                </h3>

                <div className="mt-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-t pt-2">
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className={`
                    text-[10px] sm:text-xs px-2 py-1 rounded font-medium
                    ${stockStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {stockStatus === 'available' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
