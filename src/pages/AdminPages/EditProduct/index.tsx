import React, { useState, useEffect, ChangeEvent,DragEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaTrash, FaPlus } from 'react-icons/fa';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../../firebase/firebaseConfig';

const firestore = getFirestore(app);
const storage = getStorage(app);

interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  stockStatus: 'available' | 'outOfStock';
  mainImageUrl: string;
  additionalImages: ProductImage[];
}

const CATEGORY_OPTIONS = [
  { value: 'WATER_BOTTLES', label: 'Water Bottles' },
  { value: 'CASHEW_NUTS', label: 'Cashew Nuts' },
  { value: 'CHOPPING_BOARD', label: 'Chopping Board' },
  { value: 'INVISIBLE_NACKLACE', label: 'Invisible Necklace' }
];



const EditProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    category: '',
    stockStatus: 'available',
    mainImageUrl: '',
    additionalImages: []
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!productId) return;
        
        const productDoc = await getDoc(doc(firestore, "products", productId));
        
        if (productDoc.exists()) {
          const data = productDoc.data();
          setFormData({
            name: data.name || '',
            price: data.price || '',
            description: data.description || '',
            category: data.category || '',
            stockStatus: data.stockStatus || 'available',
            mainImageUrl: data.mainImage || '',
            additionalImages: (data.extraImages || []).map((url: string, index: number) => ({
              id: index.toString(),
              url,
              isMain: false
            }))
          });
          setMainImagePreview(data.mainImage || '');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, imageId: string) => {
    e.dataTransfer.setData('imageId', imageId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleMainImageDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageId = e.dataTransfer.getData('imageId');
    const draggedImage = formData.additionalImages.find(img => img.id === imageId);
    
    if (draggedImage) {
      // Store the current main image
      const currentMainImage = {
        id: Date.now().toString(),
        url: mainImagePreview,
        isMain: false
      };
  
      // Update main image
      setMainImagePreview(draggedImage.url);
      setFormData(prev => ({
        ...prev,
        mainImageUrl: draggedImage.url,
        additionalImages: [
          ...prev.additionalImages.filter(img => img.id !== imageId),
          currentMainImage
        ]
      }));
    }
  };
  

  const handleMainImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setMainImagePreview(result);
        setFormData(prev => ({ ...prev, mainImageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {

      if(formData.additionalImages.length + files.length > 4){
        setError('Maximum 4 additional images allowed');
        return ;
      }
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setFormData(prev => ({
            ...prev,
            additionalImages: [
              ...prev.additionalImages,
              { id: Date.now().toString(), url: result, isMain: false }
            ]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveMainImage = () => {
    setMainImagePreview('');
    setFormData(prev => ({ ...prev, mainImageUrl: '' }));
  };

  const handleRemoveAdditionalImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter(img => img.id !== imageId)
    }));
  };

  const handleSetAsMain = (imageId: string) => {
    const selectedImage = formData.additionalImages.find(img => img.id === imageId);
    if (selectedImage) {
      setMainImagePreview(selectedImage.url);
      setFormData(prev => ({
        ...prev,
        mainImageUrl: selectedImage.url,
        additionalImages: prev.additionalImages.filter(img => img.id !== imageId)
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (!productId) return;
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.name || !formData.price || !formData.description || !formData.category) {
        setError('Please fill in all required fields');
        return;
      }

      let mainImageUrl = formData.mainImageUrl;
      if (mainImagePreview !== formData.mainImageUrl && mainImagePreview.startsWith('data:')) {
        const mainImageRef = ref(storage, `products/${productId}/main.jpg`);
        const mainImageResponse = await fetch(mainImagePreview);
        const mainImageBlob = await mainImageResponse.blob();
        await uploadBytes(mainImageRef, mainImageBlob);
        mainImageUrl = await getDownloadURL(mainImageRef);
      }

      const additionalImageUrls = await Promise.all(
        formData.additionalImages.map(async (image, index) => {
          if (image.url.startsWith('data:')) {
            const imageRef = ref(storage, `products/${productId}/extra${index}.jpg`);
            const imageResponse = await fetch(image.url);
            const imageBlob = await imageResponse.blob();
            await uploadBytes(imageRef, imageBlob);
            return await getDownloadURL(imageRef);
          }
          return image.url;
        })
      );

      await updateDoc(doc(firestore, "products", productId), {
        name: formData.name.trim(),
        price: formData.price,
        description: formData.description.trim(),
        category: formData.category,
        stockStatus: formData.stockStatus,
        mainImage: mainImageUrl,
        extraImages: additionalImageUrls,
        updatedAt: new Date()
      });

      navigate('/admin');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="w-full px-4 sm:px-6">
        <div className="w-[90%] mx-auto">
          {/* Header Section */}
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/admin')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Images */}
              <div className="space-y-5">
                {/* Main Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image
                  </label>
                  <div
                      onDragOver={handleDragOver}
                      onDrop={handleMainImageDrop}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg"
                    >
                      <div className="text-center">
                        {mainImagePreview ? (
                          <div className="relative">
                            <img
                              src={mainImagePreview}
                              alt="Main product"
                              className="mx-auto max-h-[300px] object-contain"
                            />
                            <button 
                              onClick={handleRemoveMainImage}
                              className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <FaImage className="h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-sm text-gray-600">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                <span>Upload main image</span>
                                <input 
                                  type="file" 
                                  className="sr-only" 
                                  onChange={handleMainImageUpload}
                                  accept="image/*"
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images ({formData.additionalImages.length}/4)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.additionalImages.map((image) => (
                        <div 
                          key={image.id} 
                          className="relative"
                          draggable
                          onDragStart={(e) => handleDragStart(e, image.id)}
                        >
                          <img
                            src={image.url}
                            alt="Product"
                            className="w-full h-32 object-cover rounded-lg cursor-move"
                          />
                          <div className="absolute top-2 right-2">
                            <button 
                              onClick={() => handleRemoveAdditionalImage(image.id)}
                              className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                  {formData.additionalImages.length < 4 && (
                        <label className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                          <div className="flex flex-col items-center p-4">
                            <FaPlus className="h-6 w-6 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">Add Image</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleAdditionalImageUpload}
                              accept="image/*"
                              multiple
                            />
                          </div>
                        </label>
                      )}
                    
                  </div>
                </div>

                {/* Stock Status */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Stock Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stockStatus"
                        value="available"
                        checked={formData.stockStatus === 'available'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="stockStatus"
                        value="outOfStock"
                        checked={formData.stockStatus === 'outOfStock'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Out of Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;