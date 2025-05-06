import { useState, useEffect, Key } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from '../../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../types/product';
import { FaChevronDown, FaChevronUp, FaEdit, FaExpandAlt, FaTrash } from 'react-icons/fa'; // Import icons if you want to use them

const firestore = getFirestore(app);

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

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
          stockStatus: data.stockStatus,
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

  const handleDelete = async (productId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation when clicking delete
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(firestore, "products", productId));
        setProducts(products.filter(product => product.id !== productId));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation when clicking edit
    navigate(`/admin/edit-product/${productId}`);
  };

  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const toggleDescription = (productId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };
  
  return (
<div className="min-h-screen bg-gray-100 mb-20">
<div className="w-full px-4 sm:px-6 mt-10">
    {/* Header with Actions */}
    <div className="w-[90%] mx-auto">
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* ... existing header code ... */}
    </div>
  
    {/* Products Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Left Section - Image and Actions */}
            <div className="w-full sm:w-2/5 flex flex-col">
              {/* Image Container */}
              <div className="relative h-72 sm:h-80 bg-gray-50 border-b sm:border-r border-gray-100">
                <img
                  src={product.mainImageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span className={`
                    text-sm px-3 py-1 rounded-full font-medium
                    ${product.stockStatus === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}
                  `}>
                    {product.stockStatus === 'available' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Admin Actions under image */}
              <div className="flex gap-2 p-3 bg-gray-50">
                <button
                  onClick={(e) => handleEdit(product.id, e)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FaEdit size={14} /> Edit
                </button>
                <button
                  onClick={(e) => handleDelete(product.id, e)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FaTrash size={14} /> Delete
                </button>
              </div>
            </div>

            {/* Right Section - Product Details */}
            <div className="w-full sm:w-3/5 p-6">
              {/* Name and Price */}
              <div className="flex flex-col gap-2 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
              </div>

              {/* Description Section */}
              <div className="mb-6">
                <div className={`text-gray-600 text-base ${expandedDescriptions.has(product.id) ? '' : 'line-clamp-4'}`}>
                  {product.description}
                </div>
                {product.description.length > 150 && (
                  <button
                    onClick={() => toggleDescription(product.id)}
                    className="text-blue-600 text-sm mt-2 flex items-center hover:text-blue-700 font-medium"
                  >
                    {expandedDescriptions.has(product.id) ? (
                      <>
                        Show Less <FaChevronUp className="ml-1" />
                      </>
                    ) : (
                      <>
                        Show More <FaChevronDown className="ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Date Added */}
              <div className="text-sm text-gray-500">
                Added: {product.timestamp?.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Empty State */}
    {filteredProducts.length === 0 && (
      <div className="text-center text-gray-500 py-10">
        <p className="text-xl">No products found in this category</p>
      </div>
    )}

    {/* Loading State */}
    {loading && (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )}
</div>
</div>
</div>
  );
}

export default AdminProducts;