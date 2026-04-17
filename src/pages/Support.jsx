import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/useUserContext";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";

export const Support = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [supportTickets, setSupportTickets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inputFields, setInputFields] = useState({
    category: "",
    question: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);

  const dropRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setInputFields((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type.startsWith("image/")) {
          setPreview(reader.result);
        } else {
          setPreview("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange({ target: { files: [file] } });
    dropRef.current.classList.remove("border-blue-400");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-blue-400");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("border-blue-400");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const getSupportCategories = useCallback(async () => {
    try {
      const response = await api.post(`${USER_API.GET_SUPPORT_TICKET}`);
      const data = response.data.data;

      if (data.status === 200) {
        setCategories(data.response);
      } else {
        toast.error("Failed to fetch support categories", toastOptions);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching support categories", toastOptions);
    }
  }, [toastOptions]);

  const selectedCategory = categories.find(
    (item) => item.s_category === inputFields.category,
  );
  const selectedMastId = selectedCategory ? selectedCategory.s_mast_id : "";

  const AddSupportTicketData = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("sup_mst_id", selectedMastId);
    formData.append("s_question", inputFields.question);

    if (inputFields.image) {
      formData.append("s_file_name", inputFields.image);
    }

    try {
      const response = await api.post(
        `${USER_API.CREATE_SUPPORT_TICKET}`,
        formData,
      );

      const data = response.data.data;

      if (data.status === 200) {
        toast.success(data.result, toastOptions);
        setInputFields({
          category: "",
          question: "",
          image: "",
        });
        setFileName("");
        setPreview("");
        getSupportTicketdata();
      } else {
        toast.error(data.result, toastOptions);
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Error while submitting ticket", toastOptions);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSupportTicketdata = useCallback(async () => {
    setLoading(true);
    const payload = { type: "all" };

    try {
      const response = await api.post(
        `${USER_API.OPEN_SUPPORT_TICKET_LIST}`,
        payload,
      );
      const data = response.data?.data;
      if (data?.status === 200 && Array.isArray(data?.response)) {
        setSupportTickets(data.response);
      } else {
        setSupportTickets([]);
        toast.error("No support tickets Found", toastOptions);
      }
    } catch (error) {
      setSupportTickets([]);
      toast.error("Error fetching support tickets", toastOptions);
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  }, [toastOptions]);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getSupportTicketdata();
      getSupportCategories();
    }
  }, [getSupportTicketdata, getSupportCategories]);

  return (
    <section
      className={``}
      onClick={() => {
        if (isMobile && toggle) setToggle(false);
      }}
    >
      <div className="">
        {/* Heading */}
        <div className="flex flex-col items-start gap-1 mb-2">
          <h2 className="text-3xl font-bold text-gray-900">Support</h2>
        </div>

        {/* Form and Table Section */}
        <div className="flex gap-4 flex-col mt-5 mb-10 max-w-6xl">
          {/* Form Card */}
          <div className="w-full bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
            <form onSubmit={AddSupportTicketData}>
              {/* Select Support Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Support Type
                </label>
                <select
                  name="category"
                  onChange={handleInputChange}
                  value={inputFields.category}
                  className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Support Type</option>
                  {categories.map((item) => (
                    <option value={item.s_category} key={item.s_mast_id}>
                      {item.s_category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload file */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("hiddenFileInput").click()
                  }
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center transition duration-300 cursor-pointer bg-white hover:shadow-md"
                >
                  <input
                    id="hiddenFileInput"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <p className="text-gray-500">
                    {fileName
                      ? `Selected File: ${fileName}`
                      : "Drag & Drop a file here or click to select"}
                  </p>
                </div>

                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-40 h-40 object-cover rounded-md border"
                  />
                )}
              </div>

              {/* Question */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Question
                </label>
                <input
                  type="text"
                  name="question"
                  placeholder="Enter Query"
                  className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={handleInputChange}
                  value={inputFields.question}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md 
                                 text-white 
                                 bg-blue-600 hover:bg-blue-700 
                                 disabled:bg-gray-300 disabled:text-gray-500 
                                 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
          {/* Table Card */}
          <div className="w-full h-fit bg-white border rounded-lg shadow-sm p-6">
            <div className="overflow-x-auto rounded-xl w-full">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <table className="min-w-full border border-gray-200 border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-center text-sm text-gray-600 border border-gray-200">
                        Sr No.
                      </th>
                      <th className="p-4 text-center text-sm text-gray-600 border border-gray-200">
                        Date
                      </th>
                      <th className="p-4 text-center text-sm text-gray-600 border border-gray-200">
                        Support Ticket Name
                      </th>
                      <th className="p-4 text-center text-sm text-gray-600 border border-gray-200">
                        Question
                      </th>
                      <th className="p-4 text-center text-sm text-gray-600 border border-gray-200">
                        File name
                      </th>
                      <th className="p-4 text-center text-sm text-gray-600 border border-gray-200">
                        Status
                      </th>
                      <th className="p-4 text-center text-sm text-gray-600 border border-gray-200">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets?.length > 0 ? (
                      supportTickets.map((ticketData, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-700 border border-gray-200">
                            {index + 1}
                          </td>
                          <td className="p-4 text-sm text-gray-700 border border-gray-200">
                            {ticketData.s_date}
                          </td>
                          <td className="p-4 text-sm text-gray-700 border border-gray-200">
                            {ticketData.ticket_name}
                          </td>
                          <td className="p-4 text-sm text-gray-700 border border-gray-200">
                            {ticketData.s_question}
                          </td>
                          <td className="p-4 text-center text-sm text-gray-700 border border-gray-200">
                            {ticketData.s_file_name ? (
                              <Link
                                to={ticketData.s_file_name}
                                target="_blank"
                                className="inline-flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={ticketData.s_file_name}
                                  alt="attachment"
                                  className="w-10 text-center h-10 rounded-md"
                                />
                              </Link>
                            ) : (
                              "NA"
                            )}
                          </td>
                          <td
                            className={`font-semibold p-4 text-sm border border-gray-200
                           ${
                             ticketData.s_status === "Open"
                               ? "text-green-600"
                               : ticketData.s_status === "Closed"
                                 ? "text-red-600"
                                 : ""
                           }`}
                          >
                            {ticketData.s_status}
                          </td>
                          <td className="p-4 text-sm text-gray-700 border border-gray-200">
                            <Link
                              to={`/support/support-detail/${ticketData.ticket_id}`}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-lg transition"
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-10 text-center">
                          <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                            {/* Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-12 h-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 13h6m-6 4h6M9 9h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 
                                2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                              />
                            </svg>

                            {/* Text */}
                            <p className="text-sm font-medium">No Data Found</p>
                            <p className="text-xs text-gray-400">
                              You don’t have any support tickets yet.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
