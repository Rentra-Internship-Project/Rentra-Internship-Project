import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheckCircle, FiTrash2, FiFilter } from 'react-icons/fi';
import { useCustomer } from '../../context/CustomerContext';
import NotificationCard from '../../components/customer/NotificationCard';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Button from '../../components/common/Button';

const Notifications = () => {
  const {
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useCustomer();

  const [filter, setFilter] = useState('All'); // 'All' | 'Unread' | 'Read'
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredNotifications = useMemo(() => {
    if (filter === 'Unread') return notifications.filter((n) => !n.read);
    if (filter === 'Read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const handleConfirmDelete = () => {
    if (notifToDelete) {
      deleteNotification(notifToDelete);
      setNotifToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Notifications Center</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Stay updated with real-time equipment booking updates, payment authorizations, and dispatch alerts.
          </p>
        </div>

        {unreadNotifCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            icon={FiCheckCircle}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="panel-card p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Unread', 'Read'].map((f) => {
            const count =
              f === 'All'
                ? notifications.length
                : f === 'Unread'
                ? unreadNotifCount
                : notifications.length - unreadNotifCount;

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === f
                    ? 'bg-[#CCCCFF] text-[#0F172A] shadow-xs font-extrabold'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
              >
                <span>{f} Notifications</span>
                <span className="px-1.5 py-0.2 bg-white/90 rounded-full text-[10px] text-[#0F172A]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkRead={markNotificationRead}
              onDelete={(id) => {
                setNotifToDelete(id);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiBell}
          title="No Notifications"
          description={
            filter === 'Unread'
              ? 'You have read all your notifications!'
              : 'There are no notifications in this view.'
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Notifications;
