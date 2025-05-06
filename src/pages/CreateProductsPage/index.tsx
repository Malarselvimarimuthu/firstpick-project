import React, { useEffect, useState } from 'react';
import app from '../../firebase/firebaseConfig';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import createProductBg from './../../assets/images/createProductBg.jpg'; // Import the image

const firestore = getFirestore(app);
const storage = getStorage(app);
const MAX_FILE_SIZE = 3 * 1024 * 1024;

function ProductUpload() {
    const [productName, setProductName] = useState<string>('');
    const [productPrice, setProductPrice] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [numExtraImages, setNumExtraImages] = useState<number>(2);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [extraImages, setExtraImages] = useState<(File | null)[]>([]);
    const [stockStatus, setStockStatus] = useState<'available' | 'outOfStock'>('available');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedCategory,setSelectedCategory] = useState<string>('WATER_BOTTLES');

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
            setExtraImages(newExtraImages);
            setError(null);
        }
    };

    // category Options
    const CATEGORY_OPTIONS = [
        { value: 'WATER_BOTTLES', label: 'Water Bottles' },
        { value: 'CASHEW_NUTS', label: 'Cashew Nuts' },
        { value: 'CHOPPING_BOARD', label: 'Chopping Board' },
        { value: 'INVISIBLE_NACKLACE', label: 'Invisible Necklace' }
    ];

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
            const category = selectedCategory;

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
            setMainImage(null);
            setExtraImages([]);
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
        setExtraImages(new Array(numExtraImages).fill(null));
    }, [numExtraImages]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-lg shadow-xl overflow-hidden">
            <div 
                className="relative"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${createProductBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                        Product Upload
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name and Price in one row */}
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Enter product name"
                                className="shadow-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                Product Price
                            </label>
                            <input
                                type="number"
                                id="productPrice"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                                placeholder="Enter price"
                                className="shadow-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Description takes full width */}
                        <div className="md:col-span-2">
                            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                Product Description
                            </label>
                            <textarea
                                id="productDescription"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                placeholder="Enter product description"
                                rows={4}
                                className="shadow-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Images section */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Main Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Main Product Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Number of Extra Images */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Number of Extra Images
                                    </label>
                                    <div className="flex gap-4 items-center">
                                        {[2, 3, 4].map((number) => (
                                            <label key={number} className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    value={number}
                                                    checked={numExtraImages === number}
                                                    onChange={(e) => setNumExtraImages(Number(e.target.value))}
                                                    className="mr-1"
                                                />
                                                <span className="text-sm text-gray-700">{number}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Extra Images */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Extra Images
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: numExtraImages }).map((_, index) => (
                                    <input
                                        key={index}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleExtraImageChange(e, index)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Category
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {CATEGORY_OPTIONS.map((category) => (
                                    <label key={category.value} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value={category.value}
                                            checked={selectedCategory === category.value}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            {category.label}
                                        </span>
                                    </label>
                                ))}
                            </div> 
                        </div>

                        {/* Stock Status */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock Status
                            </label>
                            <div className="flex gap-4">
                                {['available', 'outOfStock'].map((status) => (
                                    <label key={status} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value={status}
                                            checked={stockStatus === status}
                                            onChange={(e) => setStockStatus(e.target.value as 'available' | 'outOfStock')}
                                            className="mr-1"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {status === 'available' ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Save Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className={`w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            type="button"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {isUploading ? 'Uploading...' : 'Saving...'}
                                </div>
                            ) : (
                                'Save Product'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default ProductUpload;
