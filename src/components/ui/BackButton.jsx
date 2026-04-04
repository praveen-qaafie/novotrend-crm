import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const BackButton = ({
  customPath = null,
  className = "",
  onClick = null,
  icon: CustomIcon = null,
  disabled = false,
  size = "md",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // If custom onClick is provided, execute it
    if (onClick) {
      onClick();
      return;
    }

    // If custom path is provided, navigate to that path
    if (customPath) {
      navigate(customPath);
      return;
    }

    // Default behavior: navigate back in history
    navigate(-1);
  };

  // Define size variants
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  // Base styles for circular button
  const baseStyles =
    "flex items-center justify-center rounded-full border-2 border-black bg-white text-black hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${className}`;

  // Choose icon
  const IconComponent = CustomIcon || IoArrowBack;

  return (
    <button
      className={buttonStyles}
      onClick={handleClick}
      disabled={disabled}
      aria-label="Go back"
    >
      <IconComponent className={iconSizes[size]} />
    </button>
  );
};

export default BackButton;
