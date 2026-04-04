export const Button = ({ type, btnName, size }) => {
  return (
    <button
      className={`w-${size} bg-[#2842F6] text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200`}
      type={type}
    >
      {btnName}
    </button>
  );
};
