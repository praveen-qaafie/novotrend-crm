import { useState, useEffect, useRef, useCallback } from "react";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import { Link, useParams } from "react-router-dom";
import { MdOutlineUploadFile } from "react-icons/md";
import BackButton from "../components/ui/BackButton";
import api from "../utils/axiosInstance";
import { USER_API } from "../utils/constants";

const SupportDetails = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions } = useUserContext();
  const { id } = useParams();
  const containerRef = useRef(null);

  const [inputFields, setInputFields] = useState({
    sudelid: "",
    remakrusers: "",
    image: null, // actual File object
  });
  const [filename, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [ticketDetails, setTicketDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields((prev) => ({ ...prev, [name]: value }));
  };

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

  const getSupportTicketdetail = useCallback(
    async (supportid) => {
      try {
        setLoading(true);
        const payload = { sudelid: supportid };
        const response = await api.post(
          `${USER_API.OPEN_SUPPORT_TICKET_DETAILS}`,
          payload,
        );
        const data = response.data?.data;

        if (data?.status === 200) {
          const ticketArray = Array.isArray(data.response)
            ? data.response
            : [data.response];
          setTicketDetails(ticketArray);
        } else {
          setTicketDetails([]);
          toast.error("Failed to load support ticket details", toastOptions);
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        toast.error("Error fetching ticket details", toastOptions);
      } finally {
        setLoading(false);
      }
    },
    [toastOptions],
  );

  useEffect(() => {
    if (id) {
      getSupportTicketdetail(id);
    }
  }, [id, getSupportTicketdetail]);

  const ChatUserSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("sudelid", id);
    formData.append("remakrusers", inputFields.remakrusers);
    if (inputFields.image) {
      formData.append("s_file_name", inputFields.image);
    }

    try {
      const response = await api.post(
        `${USER_API.ADD_REMARK_CREATE_SUPPORT_TICKET}`, // this ?
        formData,
      );

      const data = response.data.data;

      if (data.status === 200) {
        toast.success(data.result, toastOptions);
        getSupportTicketdetail(id);
        setInputFields({ sudelid: "", remakrusers: "", image: null });
        setFileName("");
        setPreview("");
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

  const separateDateTime = (dateTimeStr) => {
    const [date, time] = dateTimeStr.split(" ");
    return { date, time };
  };

  // Always scroll to bottom

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [ticketDetails]);

  return (
    <section
      className={`transition-all duration-300`}
      onClick={() => isMobile && toggle && setToggle(false)}
    >
      <div className=" max-w-6xl">
        <div className="flex items-center justify-between gap-1 mb-5 w-full">
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-3xl font-bold text-gray-900">
              Support Details
            </h2>
          </div>
          <div>
            <BackButton customPath={"/support"} />
          </div>
        </div>

        {ticketDetails && (
          <>
            {/* Ticket Info Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 w-full bg-white shadow-md p-6 text-start">
              <table className="min-w-full border border-gray-200 border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Sr No.",
                      "Ticket Name",
                      "Question Name",
                      "Support Ticket File",
                      "Support Ticket Status",
                      "Support Ticket Date",
                    ].map((title) => (
                      <th
                        key={title}
                        className="p-4 text-center text-sm text-gray-600 border border-gray-200"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="border border-gray-200 h-40 p-6 text-center align-middle"
                      >
                        <div className="flex justify-center items-center h-full">
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
                      </td>
                    </tr>
                  ) : (
                    ticketDetails.map((detail, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-4 text-center text-sm text-gray-700 border border-gray-200">
                          {detail.sr_no}
                        </td>
                        <td className="p-4 text-center text-sm text-gray-700 border border-gray-200">
                          {detail.ticket_name}
                        </td>
                        <td className="p-4 text-center text-sm text-gray-700 border border-gray-200">
                          {detail.s_question}
                        </td>
                        <td className="p-4 text-center text-sm text-gray-700 border border-gray-200">
                          {detail.s_file_name ? (
                            <Link
                              to={detail.s_file_name}
                              target="_blank"
                              className="inline-flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden"
                            >
                              <img
                                src={detail.s_file_name}
                                alt="attachment"
                                className="w-10 text-center h-10 rounded-md"
                              />
                            </Link>
                          ) : (
                            "NA"
                          )}
                        </td>
                        <td
                          className={`font-semibold text-center p-4 text-sm border border-gray-200
                         ${
                           detail.s_status === "Open"
                             ? "text-green-600"
                             : detail.s_status === "Closed"
                               ? "text-red-600"
                               : ""
                         }`}
                        >
                          {detail.s_status}
                        </td>
                        <td className="p-4 text-center text-sm text-gray-700 border border-gray-200">
                          {detail.s_date}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* heading */}
            <div className="w-full my-5 text-start">
              <h2 className="text-2xl font-bold text-gray-900">Support Chat</h2>
            </div>
            {/* Chat Section */}
            <div className="rounded-xl border border-gray-200 w-full bg-white shadow-md mt-2">
              {/* Chat messages container */}
              <div
                ref={containerRef}
                className="relative w-full p-6 overflow-y-auto h-80 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              >
                <ul className="space-y-6">
                  {ticketDetails[0]?.details_list
                    .slice()
                    .reverse()
                    .map((elem, idx) => {
                      const isUser = elem.chatstatus === "UserChat";
                      const { time } = separateDateTime(elem.s_date);
                      return (
                        <li
                          key={idx}
                          className={`flex items-end ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          {/* Avatar (left for support, right for user) */}
                          {!isUser && (
                            <img
                              src={elem?.user_img}
                              alt="avatar"
                              className="w-9 h-9 rounded-full mr-3 border border-gray-200 shadow-sm"
                            />
                          )}
                          <div
                            className={`max-w-xs md:max-w-md flex flex-col ${
                              isUser ? "items-end" : "items-start"
                            }`}
                          >
                            <span className="text-xs font-medium text-gray-600 mb-1">
                              {elem.user_name}
                            </span>
                            <div
                              className={`px-4 py-2 rounded-2xl shadow-sm text-sm leading-relaxed
                            ${
                              isUser
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                            }`}
                            >
                              {elem.supp_del_file_name && (
                                <div className="mb-2">
                                  <Link
                                    to={elem.supp_del_file_name}
                                    target="_blank"
                                    className="inline-flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden"
                                  >
                                    <img
                                      src={elem.supp_del_file_name}
                                      alt="support img"
                                      className="rounded-lg max-w-40 shadow-md"
                                    />
                                  </Link>
                                </div>
                              )}
                              <p>{elem.sup_del_remak}</p>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">
                              {time}
                            </span>
                          </div>

                          {isUser && (
                            <img
                              src={elem?.user_img}
                              alt="avatar"
                              className="w-9 h-9 rounded-full ml-3 border border-gray-200 shadow-sm"
                            />
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>

            {ticketDetails[0]?.s_status === "Closed" || (
              <div className="mt-4 mb-10 flex justify-end w-full">
                <form
                  onSubmit={ChatUserSubmit}
                  className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg w-full"
                >
                  <div className="flex-1 w-full">
                    <label htmlFor="remakrusers" className="sr-only">
                      Enter question here
                    </label>
                    <input
                      type="text"
                      id="remakrusers"
                      name="remakrusers"
                      value={inputFields.remakrusers}
                      onChange={handleInputChange}
                      placeholder="Enter question here"
                      className="outline-none px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="w-full sm:w-fit flex gap-3 justify-end">
                    <div className="flex items-center justify-center">
                      <label
                        title="Upload File"
                        htmlFor="fileUpload"
                        className="cursor-pointer flex items-center justify-center text-xl font-bold bg-blue-500 text-white  md:bg-none hover:text-white p-2 rounded-md transition-colors duration-150"
                        aria-label="Upload File"
                      >
                        <MdOutlineUploadFile className="w-6 h-6" />
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,application/pdf"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md 
                                 text-white 
                                 bg-blue-500 hover:bg-blue-700 
                                 disabled:bg-gray-300 disabled:text-gray-500 
                                 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Send"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SupportDetails;
