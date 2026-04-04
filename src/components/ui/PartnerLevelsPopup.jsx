const PartnerLevelsPopup = ({ onClose }) => {
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={stopPropagation}
        className="bg-white rounded-2xl p-8 w-96 max-w-full shadow-lg border border-gray-600 relative"
        style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.25)" }}
      >
        <h3 className="text-2xl font-semibold text-center mb-5 border border-gray-400 rounded-md py-2">
          Partner Levels
        </h3>
        <div className="space-y-5 px-1">
          <div className="flex justify-between items-center text-base font-medium">
            <span>Level - 1</span>
            <span>15%</span>
          </div>
          <div className="flex justify-between items-center text-base font-medium">
            <span>Level - 2</span>
            <span>10%</span>
          </div>
          <div className="flex justify-between items-center text-base font-medium">
            <span>Level - 3</span>
            <span>5%</span>
          </div>
          <div className="flex justify-between items-center text-base font-medium">
            <span>Level - 4</span>
            <span>3%</span>
          </div>
          <div className="flex justify-between items-center text-base font-medium">
            <span>Level - 5</span>
            <span>2%</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full text-center mt-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PartnerLevelsPopup;
