import { useEffect, useState, useRef } from "react";
import { Hr } from "../Common/Hr";
import { MdNotifications } from "react-icons/md";

export default function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false); 
  const [isVisible, setIsVisible] = useState(false);
  const reopenTimerRef = useRef(null);

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setIsVisible(true);
      setIsOpen(true);
    }, 1000);

    return () => {
      clearTimeout(firstTimer);
      if (reopenTimerRef.current) clearTimeout(reopenTimerRef.current);
    };
  }, []);

  const openModal = () => {
    setIsVisible(true);
    setTimeout(() => setIsOpen(true), 10);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsVisible(false);
      reopenTimerRef.current = setTimeout(openModal, 5000);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4
        transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-labelledby="notification-modal-title"
    >
      <div
        className={`bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl relative text-center shadow-lg
          transform transition-all duration-300
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-gray-600 hover:text-black text-2xl"
          aria-label="Close Notification"
        >
          &times;
        </button>

        {/* Header */}
        <div className="flex justify-center items-center mb-4">
          <MdNotifications className="text-3xl text-blue-500 mr-2" />
          <h2 id="notification-modal-title" className="text-xl sm:text-2xl font-semibold">
            Important Notice
          </h2>
        </div>
        <Hr />
        {/* Content */}
        <p className="text-base sm:text-lg leading-relaxed mt-4">
          Dear Clients, Trading Activity will be closed from
          <br />
          <strong>Friday 08/08/2025 12:00 AM till</strong>{" "}
          <strong>Sunday 17/08/2025 11:59 PM</strong><br />
          Trading Activity will resume from <strong>Monday 12:00 AM</strong>
        </p>
      </div>
    </div>
  );
}
