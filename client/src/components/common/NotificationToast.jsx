import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { FiBell, FiX } from 'react-icons/fi';

const NotificationToast = () => {
  const { notifications, setNotifications } = useSocket();

  const removeNotification = (timestamp) => {
    setNotifications((prev) => prev.filter((n) => n.timestamp !== timestamp));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.timestamp}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 w-80 flex items-start gap-4"
          >
            <div className="flex-shrink-0 bg-yellow-500/10 p-2 rounded-full mt-1">
              <FiBell className="text-yellow-600 w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="text-sm font-semibold text-slate-800">{notification.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(notification.timestamp)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
