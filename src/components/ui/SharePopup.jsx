import { WhatsappIcon, FacebookIcon, XIcon, EmailIcon } from "react-share";
import { useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";

const ShareModal = ({ onClose, shareLink }) => {
  const modalRef = useRef(null);
  const pageTitle = "Invitation to Join The Future of Global Tread";

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const customMessage = `Explore our powerful Novotrend Forex CRM – built  to manage clients, IBs, and trades with ease.\nTry it now:\n${shareLink}`;

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <WhatsappIcon size={40} round />,
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `${customMessage}`,
        )}`;
        window.open(whatsappUrl, "_blank");
      },
    },
    {
      name: "Facebook",
      icon: <FacebookIcon size={40} round />,
      action: () => {
        if (
          !shareLink ||
          typeof shareLink !== "string" ||
          !shareLink.startsWith("http")
        ) {
          alert("Share link is invalid or missing.");
          console.error("Invalid shareLink:", shareLink);
          return;
        }
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareLink,
        )}`;
        const win = window.open(facebookUrl, "_blank");
        if (!win) {
          alert("Popup blocked! Please allow popups for this site.");
        }
      },
    },
    {
      name: "X",
      icon: <XIcon size={40} round />,
      action: () => {
        if (
          !shareLink ||
          typeof shareLink !== "string" ||
          !shareLink.startsWith("http")
        ) {
          alert("Share link is invalid or missing.");
          console.error("Invalid shareLink:", shareLink);
          return;
        }
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${customMessage}\n${pageTitle}`,
        )}`;
        const win = window.open(twitterUrl, "_blank");
        if (!win) {
          alert("Popup blocked! Please allow popups for this site.");
        }
      },
    },
    {
      name: "Email",
      icon: <EmailIcon size={40} round />,
      action: () => {
        if (
          !shareLink ||
          typeof shareLink !== "string" ||
          !shareLink.startsWith("http")
        ) {
          alert("Share link is invalid or missing.");
          console.error("Invalid shareLink:", shareLink);
          return;
        }
        const emailUrl = `mailto:?subject=${encodeURIComponent(
          pageTitle,
        )}&body=${encodeURIComponent(`${customMessage}\n\n${shareLink}`)}`;
        try {
          const a = document.createElement("a");
          a.href = emailUrl;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (err) {
          alert(
            "Could not open your email client. Please check your system settings.",
          );
          console.error("Mailto error:", err);
        }
      },
    },
  ];

  return (
    <div className="fixed bg-black/30 inset-0 z-50 flex items-center justify-center share-modal-overlay">
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-30"></div>

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-lg flex flex-col"
        style={{ minHeight: "200px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Share</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        {/* Share Options */}
        <div className="flex-1 p-4">
          <div className="">
            <div className="flex gap-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group share-option flex-shrink-0"
                  title={option.name}
                >
                  <div className="w-12 h-12 mb-2 flex items-center justify-center">
                    {option.icon}
                  </div>
                  <span className="text-xs text-black font-medium text-center leading-tight">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
