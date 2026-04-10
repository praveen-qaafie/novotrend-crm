import { useEffect, useState, useRef, useCallback } from "react";
import api from "../utils/axiosInstance";
import { USER_NOTIFICATION } from "../utils/constants";

const useNotifications = (intervalTime = 1500000000, url) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.post(`${url}`);

      const data = response.data?.data?.response || [];

      setNotifications(data);

      const unread = data.filter(
        (n) => n.read_status === "0" || n.read_status === 0,
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [url]);

  const markAsRead = async (notification_id) => {
    try {
      await api.post(`${USER_NOTIFICATION.READ_NOTIFICATION}`, {
        notification_id,
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notification_id ? { ...n, is_read: 1 } : n)),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, intervalTime);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications, intervalTime]);

  return { notifications, unreadCount, markAsRead };
};

export default useNotifications;