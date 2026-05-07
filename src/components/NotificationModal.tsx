import React from 'react';
import { X, Users, Gift, Bell, MessageSquare } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Bell className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          <p className="text-gray-600 text-sm">Stay updated with our latest announcements</p>
        </div>

        <div className="space-y-4">
          {/* Special Promotion Card */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-xl border border-teal-100 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16 group-hover:opacity-50 transition-opacity" />
            <div className="relative">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-5 w-5 text-teal-600" />
                <h3 className="font-medium text-teal-900">Project Info</h3>
              </div>
              <p className="text-sm text-teal-800 mb-3">
                This intelligent OCR tool is made by hemanta bhattarai through vibe coding.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-700">Free Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Contact */}
          <div
            className="block p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300 group relative overflow-hidden hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-teal-900 transition-colors">Made by Hemanta Bhattarai</h3>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-teal-700 transition-colors">Developed through vibe coding</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Stay tuned for more updates and features!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;