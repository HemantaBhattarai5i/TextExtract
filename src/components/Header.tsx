import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-teal-400" />
            <span className="text-xl font-bold">TextExtract</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li className="relative group">
                <button className="py-2 text-white hover:text-teal-300 transition duration-200">
                  About
                </button>
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md p-3 transform scale-0 group-hover:scale-100 origin-top-left transition-transform duration-200 z-10">
                  <p className="text-gray-700 text-sm">
                    TextExtract uses Tesseract.js to perform OCR on your images. All processing happens in your browser - no images are uploaded to any server.
                  </p>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;