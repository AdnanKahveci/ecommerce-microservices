import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

// Let's create a simple event-based mechanism to trigger toasts
const toastEvents = {
  listeners: new Set<(toast: Omit<Toast, 'id'>) => void>(),
  subscribe(listener: (toast: Omit<Toast, 'id'>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  publish(toast: Omit<Toast, 'id'>) {
    this.listeners.forEach(listener => listener(toast));
  }
};

// Function to show toast from anywhere in the app
export function showToast(message: string, type: ToastType = 'info') {
  toastEvents.publish({ message, type });
}

// Toast component
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${getBgColor()} border rounded-lg shadow-lg p-4 flex items-start mb-2 w-full max-w-md`}
    >
      <div className="mr-3 pt-0.5">{getIcon()}</div>
      <div className="flex-1">{toast.message}</div>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
        <X size={18} />
      </button>
    </motion.div>
  );
}

// Toast container
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastEvents.subscribe((toast) => {
      setToasts(prev => [...prev, { ...toast, id: String(Date.now()) }]);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return createPortal(
    <div className="fixed bottom-0 right-0 p-6 z-50 flex flex-col items-end space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export default Toaster;