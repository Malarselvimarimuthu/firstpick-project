import React, {useState} from 'react';
import app from "../../firebase/firebaseConfig";
// import { getDatabase, ref, set, push } from 'firebase/database';
// import { FirebaseStorage, getStorage, uploadBytes } from 'firebase/storage'; 
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import { getDatabase, ref as dbRef, push, set, ref } from 'firebase/database'; 
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'

const storage = getStorage(app);
const Write: React.FC = () => {
    let [productName, setProductName] = useState("");
    let [productPrice, setProductPrice] = useState<number | null>(null);
    const [productDescription, setProductDescription] = useState("");
    const [productStatus, setProductStatus] = useState('available');
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [numExtraImages, setNumExtraImages] = useState<number>(2);
    const [extraImages, setExtraImages] = useState<File[]>([]);
  
    const handleFileUpload = async (file: File, path: string) => {
      const storageReference = storageRef(storage, path);
      await uploadBytes(storageReference, file);
    };
  
    const saveData = async () => {
        const db = getDatabase(app);
        const newDocRef = push(dbRef(db, "products/test"));
      
        try {
          // Save data to the database
          await set(newDocRef, {
            productName: productName,
            productPrice: productPrice,
            productDescription: productDescription,
            productStatus: productStatus,
            mainImage: mainImage ? `products/${productName}/main.jpg` : null,
            extraImages: extraImages.map((_, i) => `products/${productName}/extra${i + 1}.jpg`),
          });
      
          // Upload main image if it exists
          if (mainImage) {
            await handleFileUpload(mainImage, `products/${productName}/main.jpg`);
          }
      
          // Upload extra images
          const uploadPromises = extraImages.map((image, i) => 
            handleFileUpload(image, `products/${productName}/extra${i + 1}.jpg`)
          );
          await Promise.all(uploadPromises);
      
          // Show success alert
          setTimeout(() => {
            window.alert("Data saved successfully");
          }, 0); // Use a timeout to ensure UI rendering isn't blocked
      
        } catch (error) {
          // Handle errors
          console.error("Error saving data:", error);
          window.alert(`Error: ${error.message}`);
        }
      };
      
      
  
const handleExtraImagesChange = (files: FileList | null) => {
  if (!files) {
    alert("No files selected.");
    return;
  }

  const fileArray: File[] = Array.from(files);

  if (fileArray.length !== numExtraImages) {
    alert(`Please select exactly ${numExtraImages} extra images.`);
    return;
  }

  // Update state if the validation is successful
  setExtraImages(fileArray);
};

      
  
    return (
      <div className="max-w-lg mx-auto my-10">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">Product Name</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              maxLength={50}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productDescription">Product Description</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              maxLength={200}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productPrice">Product Price</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productPrice"
              type="number"
              value={productPrice || ''}
              onChange={(e) => setProductPrice(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">Stock Status</span>
            <label className="inline-flex items-center">
              <input
                className="form-radio"
                type="radio"
                value="available"
                checked={productStatus === 'available'}
                onChange={(e) => setProductStatus(e.target.value)}
              />
              <span className="ml-2">Available</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                className="form-radio"
                type="radio"
                value="outOfStock"
                checked={productStatus === 'outOfStock'}
                onChange={(e) => setProductStatus(e.target.value)}
              />
              <span className="ml-2">Out Of Stock</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mainImage">Main Image</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mainImage"
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files ? e.target.files[0] : null)}
              required
            />
          </div>
          <div className="mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">Number of Extra Images</span>
            <label className="inline-flex items-center">
              <input
                className="form-radio"
                type="radio"
                value={2}
                checked={numExtraImages === 2}
                onChange={(e) => setNumExtraImages(parseInt(e.target.value))}
              />
              <span className="ml-2">2</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                className="form-radio"
                type="radio"
                value={3}
                checked={numExtraImages === 3}
                onChange={(e) => setNumExtraImages(parseInt(e.target.value))}
              />
              <span className="ml-2">3</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                className="form-radio"
                type="radio"
                value={4}
                checked={numExtraImages === 4}
                onChange={(e) => setNumExtraImages(parseInt(e.target.value))}
              />
              <span className="ml-2">4</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="extraImages">Extra Images</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="extraImages"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleExtraImagesChange(e.target.files)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-customBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={saveData}
            >
              SAVE DATA
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Write;






