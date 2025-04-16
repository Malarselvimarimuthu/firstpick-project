import React,{useEffect, useState} from 'react';
import app from '../../firebase/firebaseConfig';
import { getFirestore,collection ,addDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firestore = getFirestore(app);
const storage = getStorage(app);
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

function ProductUpload()
{
  const[productName,setProductName] = useState<string>("");
  const[productPrice,setProductPrice]  =useState<string>("");
  const[productDescription,setProductDescription] = useState<string>("");

  const[numExtraImages,setNumExtraImages] = useState<number>(2);
  const[mainImage,setMainImage] = useState<File | null>(null);
  const[extraImages,setExtraImage] = useState<(File | null)[]>([]);
  const [stockStatus, setStockStatus] = useState<'available' | 'outOfStock'>('available');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Upload Image to Storage
  const uploadImageToStorage = async (file: File, path: string) => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size should be less than 3MB");
        e.target.value = '';
        return;
      }
      
      setMainImage(file); 
    }
  };
  
  const handleExtraImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      if (file.size > MAX_FILE_SIZE) {
        setError("Image size should be less than 3MB");
        e.target.value = '';
        return;
      }
  
      // Create new array with existing images
      const newExtraImages = [...extraImages];
      while (newExtraImages.length < numExtraImages) {
        newExtraImages.push(null);
      }
      newExtraImages[index] = file;
      setExtraImage(newExtraImages);
      setError(null);
    }
  };
  
  const handleSave = async () => {
    setError(null);
    setIsLoading(true);
    setIsUploading(true);
  
    try {
      // Validate inputs
      if (!productName.trim() || !productPrice || !productDescription.trim()) {
        setError("Please fill all fields");
        return;
      }
  
      if (!mainImage) {
        setError("Please select a main image");
        return;
      }
  
      // Check if all extra images are selected
      const allExtraImagesSelected = extraImages.every(img => img !== null);
      if (!allExtraImagesSelected || extraImages.length !== numExtraImages) {
        setError(`Please select all ${numExtraImages} extra images`);
        return;
      }
  
  
      const productID = uuidv4();
      const category = "CHOPPING_BOARD";

      // Upload main image to Storage
      const mainImageUrl = await uploadImageToStorage(
        mainImage,
        `products/${category}/${productID}/main.jpg`
      );
  
          // Upload extra images to Storage
    const extraImageUrls = await Promise.all(
      extraImages.map((img, index) => {
        if (!img) throw new Error("Missing extra image");
        return uploadImageToStorage(
          img,
          `products/${category}/${productID}/extra${index + 1}.jpg`
        );
      })
    );
  
      // Save to Firestore
      await addDoc(collection(firestore, "products"), {
        productID,
        category,
        name: productName.trim(),
        price: productPrice,
        description: productDescription.trim(),
        mainImage: mainImageUrl,
        extraImages: extraImageUrls,
        stockStatus: stockStatus,
        timestamp: new Date()
      });
  
      // Success
      alert("Product saved successfully!");
  
      // Reset form
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      // setMainImage(null);
      // setExtraImage([]);
      setNumExtraImages(2);

      // Reset file input fields 
      const mainImageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (mainImageInput) {
        mainImageInput.value = '';
      }
  
      // Reset extra image inputs
      const extraImageInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      extraImageInputs.forEach(input => {
        input.value = '';
      });
  
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error saving product");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setExtraImage(new Array(numExtraImages).fill(null));
  }, [numExtraImages]);
  
  return(
    <div className='p-4 m-5'>
        <h2>Product Upload</h2>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Product Name */}
        <div className="mb-4">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Product Price"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Product Description"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Main Image Input */}
        <div className="mb-4">
        <label className="block mb-2">Main Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Radio Buttons for Extra Images */}
      <div className="mb-4">
        <label className="block mb-2">Number of Extra Images</label>
        <div className="flex gap-4">
          {[2, 3, 4].map((number) => (
            <label key={number} className="flex items-center">
              <input
                type="radio"
                value={number}
                checked={numExtraImages === number}
                onChange={(e) => setNumExtraImages(Number(e.target.value))}
                className="mr-2"
              />
              {number}
            </label>
          ))}
        </div>
      </div>

      {/* Extra Image Inputs */}
      <div className="mb-4">
        <label className="block mb-2">Extra Images</label>
        {Array.from({ length: numExtraImages }).map((_, index) => (
          <div key={index} className="mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleExtraImageChange(e, index)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>

      {/*StockStatus Input*/}
      <div className="mb-4">
      <label className="block mb-2">Stock Status</label>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="available"
            checked={stockStatus === 'available'}
            onChange={(e) => setStockStatus(e.target.value as 'available' | 'outOfStock')}
            className="mr-2"
          />
          Available
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="outOfStock"
            checked={stockStatus === 'outOfStock'}
            onChange={(e) => setStockStatus(e.target.value as 'available' | 'outOfStock')}
            className="mr-2"
          />
          Out of Stock
        </label>
      </div>
      </div>

      {/* Save Button */}
      <button 
        onClick={handleSave}
        disabled={isLoading}
        className={`
          px-4 py-2 rounded
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
          }
          text-white transition-colors
        `}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {isUploading ? 'Uploading Images...' : 'Saving...'}
          </div>
        ) : (
          'Save Product'
        )}
      </button>
    </div>
  )
  
}

export default ProductUpload;