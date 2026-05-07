import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Camera, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onImageClear: () => void;
  previewUrl: string | null;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  onImageClear, 
  previewUrl, 
  isProcessing 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  }, [dragCounter]);

  const validateImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP, HEIC)');
      return false;
    }

    if (file.size > maxSize) {
      setError('Image size should be less than 10MB');
      return false;
    }

    setError(null);
    return true;
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateImage(file)) {
        onImageUpload(file);
      }
    }
  }, [onImageUpload]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateImage(file)) {
        onImageUpload(file);
      }
    }
  }, [onImageUpload]);
  
  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleClearImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageClear();
    setError(null);
    setIsCameraActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageClear]);

  const handleCameraToggle = useCallback(() => {
    setIsCameraActive(prev => !prev);
    if (previewUrl) {
      onImageClear();
    }
  }, [previewUrl, onImageClear]);

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            onImageUpload(file);
            setIsCameraActive(false);
          });
      }
    }
  }, [onImageUpload]);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div 
          className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 group
            ${isDragging ? 'border-teal-500 bg-teal-50 scale-[1.02]' : 'border-gray-300 hover:border-teal-400'}
            ${isProcessing ? 'pointer-events-none opacity-70' : ''}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif" 
            onChange={handleFileSelect}
            disabled={isProcessing}
          />
          
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: isDragging 
                ? 'linear-gradient(120deg, rgba(13, 148, 136, 0.1), rgba(45, 212, 191, 0.1))'
                : 'none'
            }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-transparent to-teal-400/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isDragging ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          {isCameraActive ? (
            <motion.div 
              className="p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative rounded-xl overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-64 object-cover"
                />
                <motion.div 
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    onClick={handleCapture}
                    className="bg-teal-600 text-white rounded-full p-3 hover:bg-teal-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isProcessing}
                  >
                    <Camera size={24} />
                  </motion.button>
                  <motion.button
                    onClick={handleCameraToggle}
                    className="bg-gray-600 text-white rounded-full p-3 hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={24} />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ) : previewUrl ? (
            <motion.div 
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative group/image">
                <motion.div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.button 
                    onClick={handleClearImage}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: 1, opacity: 1 }}
                    disabled={isProcessing}
                  >
                    <Trash2 size={20} />
                  </motion.button>
                  <motion.button
                    onClick={handleCameraToggle}
                    className="bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 transition-colors duration-200"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: 1, opacity: 1 }}
                    disabled={isProcessing}
                  >
                    <RefreshCw size={20} />
                  </motion.button>
                </motion.div>
                <motion.img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-64 object-contain rounded-xl shadow-sm transition-transform duration-300"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="p-8 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center space-y-6">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div 
                    className="p-4 bg-teal-50 rounded-full mb-4"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(13, 148, 136, 0.2)",
                        "0 0 0 20px rgba(13, 148, 136, 0)",
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Upload size={48} className="text-teal-600" />
                  </motion.div>
                </motion.div>
                <div className="text-center space-y-2">
                  <motion.p 
                    className="text-lg font-medium text-gray-700 group-hover:text-teal-600 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Drop your image here or click to browse
                  </motion.p>
                  <motion.p 
                    className="text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Supports JPEG, PNG, GIF, WEBP, HEIC (max 10MB)
                  </motion.p>
                </div>
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleButtonClick}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ImageIcon size={18} />
                    <span>Choose File</span>
                  </motion.button>
                  <motion.button
                    onClick={handleCameraToggle}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera size={18} />
                    <span>Use Camera</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="flex items-center space-x-2 text-red-600 text-sm p-2 bg-red-50 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;