import { useEffect, useState } from "react";
import { Hr } from "../components/Common/Hr";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";

export const DocumentSetting = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions } = useUserContext();
  const [fileFront, setFileFront] = useState(null);
  const [fileFront2, setFileFront2] = useState(null);
  const [fileBack, setFileBack] = useState(null);
  const [fileBack2, setFileBack2] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedDocumentType2, setSelectedDocumentType2] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentNumber2, setDocumentNumber2] = useState("");
  const [doc, setDoc] = useState(null);
  const [getStatus, setGetStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [frontPreview2, setFrontPreview2] = useState("");
  const [backPreview2, setBackPreview2] = useState("");

  const documentTypes = [
    { value: "National ID Card", label: "National ID Card" },
    { value: "Passport", label: "Passport" },
    { value: "Driving License", label: "Driving License" },
    { value: "Bank Statement", label: "Bank Statement" },
    { value: "Utility Bill", label: "Utility Bill" },
  ];

  const handleFileChange = (event, type, docSet = "poi") => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (docSet === "poi") {
        if (type === "front") {
          setFileFront(selectedFile);
          setFrontPreview(URL.createObjectURL(selectedFile));
        } else {
          setFileBack(selectedFile);
          setBackPreview(URL.createObjectURL(selectedFile));
        }
      } else if (docSet === "poa") {
        if (type === "front") {
          setFileFront2(selectedFile);
          setFrontPreview2(URL.createObjectURL(selectedFile));
        } else {
          setFileBack2(selectedFile);
          setBackPreview2(URL.createObjectURL(selectedFile));
        }
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("doc_type", selectedDocumentType);
    formData.append("doc_number", documentNumber);
    formData.append("doc_type2", selectedDocumentType2);
    formData.append("doc_number2", documentNumber2);
    if (fileFront) formData.append("doc_front", fileFront);
    if (fileBack) formData.append("doc_back", fileBack);
    if (fileFront2) formData.append("doc_front2", fileFront2);
    if (fileBack2) formData.append("doc_back2", fileBack2);

    try {
      const response = await api.post(`${USER_API.EKYC}`, formData);
      if (response.data?.data?.status === 200) {
        toast.success(response.data.data.result, toastOptions);
        fetchDocumentData();
      } else if (response.data?.data?.status === 400) {
        toast.error(
          response?.data?.data?.result || "Something went wrong",
          toastOptions,
        );
      } else {
        toast.error(response.data?.result || "Update failed", toastOptions);
      }
    } catch (error) {
      console.error("An error occurred while updating documents.", error);
      toast.error("An error occurred while updating documents.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocumentData = async () => {
    try {
      const response = await api.post(`${USER_API.GET_KYC}`);
      if (response.data?.data?.status === 200) {
        const docData = response.data.data.response[0];
        const status = docData?.kyc_status?.trim();
        setGetStatus(status);
        if (status?.toLowerCase() === "rejected") {
          setDoc(null);
          setSelectedDocumentType("");
          setSelectedDocumentType2("");
          setDocumentNumber("");
          setDocumentNumber2("");
          setFrontPreview("");
          setBackPreview("");
          setFrontPreview2("");
          setBackPreview2("");
          setFileFront(null);
          setFileBack(null);
          setFileFront2(null);
          setFileBack2(null);
        } else {
          setDoc({
            doc_type: docData.doc_type,
            address_doc_type: docData.address_doc_type,
            doc_number: docData.kyc_identity_number,
            doc_number2: docData.kyc_address_number,
            identity_front_photo: docData.identity_front_photo,
            identity_back_photo: docData.identity_back_photo,
            address_front_photo: docData.address_photo,
            address_back_photo: docData.address_photo_back,
            kyc_status: docData.kyc_status,
          });
          setSelectedDocumentType(docData.doc_type || "");
          setSelectedDocumentType2(docData.address_doc_type || "");
          setDocumentNumber(docData.kyc_identity_number || "");
          setDocumentNumber2(docData.kyc_address_number || "");
          setFrontPreview(docData.identity_front_photo || "");
          setBackPreview(docData.identity_back_photo || "");
          setFrontPreview2(docData.address_photo || "");
          setBackPreview2(docData.address_photo_back || "");
        }
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  useEffect(() => {
    fetchDocumentData();
  }, []);

  return (
    <section className={`transition-all duration-300`}>
      <div className="rounded-lg text-start md:min-h-[83vh]">
        <div
          onClick={() => {
            if (isMobile && toggle) {
              setToggle(false);
            }
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col items-start gap-1 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-base font-normal text-[#535862]">
              Upload documents for verification purpose.
            </p>
          </div>
          {/* Main Row: Status and Form */}
          <div className="flex gap-4 flex-col mt-3 mb-10">
            {/* Status Line */}
            <p className="text-black font-bold mb-2 max-w-6xl">
              Status:{" "}
              <span
                className={`font-normal text-sm ${
                  getStatus?.toLowerCase() === "pending"
                    ? "text-yellow-500"
                    : getStatus?.toLowerCase() === "success" ||
                        getStatus?.toLowerCase() === "approved"
                      ? "text-green-500"
                      : getStatus?.toLowerCase() === "rejected"
                        ? "text-red-500"
                        : "text-gray-500"
                }`}
              >
                {getStatus || "Not Submit"}
              </span>
            </p>
            {/* Form Card */}
            <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
              <form onSubmit={handleSubmit}>
                {/* POI Section */}
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Proof of Identity (POI)
                  </label>
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select document Type</option>
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6 w-full hidden">
                  <label className="block text-sm font-medium text-gray-700">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter document number"
                  />
                </div>
                {/* Image section     */}
                <div className="">
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Front
                    </label>
                    <span className="text-xs text-gray-400">
                      Front photo of your POI
                    </span>
                    <div className="flex justify-start">
                      <div className="relative w-full max-w-xs h-32 md:h-40">
                        {frontPreview ? (
                          <>
                            <img
                              src={frontPreview}
                              alt="Front POI document"
                              className="w-full h-full object-contain bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                            <input
                              onChange={(e) =>
                                handleFileChange(e, "front", "poi")
                              }
                              type="file"
                              // accept="image/*"
                              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </>
                        ) : (
                          <input
                            onChange={(e) =>
                              handleFileChange(e, "front", "poi")
                            }
                            type="file"
                            accept="image/*"
                            className="w-full h-full bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Back
                    </label>
                    <span className="text-xs text-gray-400">
                      Back photo of your POI
                    </span>
                    <div className="flex justify-start">
                      <div className="relative w-full max-w-xs h-32 md:h-40">
                        {backPreview ? (
                          <>
                            <img
                              src={backPreview}
                              alt="Back POI document"
                              className="w-full h-full object-contain bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                            <input
                              onChange={(e) =>
                                handleFileChange(e, "back", "poi")
                              }
                              type="file"
                              accept="image/*"
                              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </>
                        ) : (
                          <input
                            onChange={(e) => handleFileChange(e, "back", "poi")}
                            type="file"
                            accept="image/*"
                            className="w-full h-full bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:ring focus:ring-blue-200"
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* POA Section */}
                <div className="mb-6 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Proof of Address (POA)
                  </label>
                  <select
                    value={selectedDocumentType2}
                    onChange={(e) => setSelectedDocumentType2(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes
                      .filter((item) => item.value !== selectedDocumentType)
                      .map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-6 w-full hidden">
                  <label className="block text-sm font-medium text-gray-700">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={documentNumber2}
                    onChange={(e) => setDocumentNumber2(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter document number"
                  />
                </div>

                <div className="">
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Front
                    </label>
                    <span className="text-xs text-gray-400">
                      Front photo of your POA
                    </span>
                    <div className="flex justify-start">
                      <div className="relative w-full max-w-xs h-32 md:h-40">
                        {frontPreview2 ? (
                          <>
                            <img
                              src={frontPreview2}
                              alt="Front POA document"
                              className="w-full h-full object-contain bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                            <input
                              onChange={(e) =>
                                handleFileChange(e, "front", "poa")
                              }
                              type="file"
                              accept="image/*"
                              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </>
                        ) : (
                          <input
                            onChange={(e) =>
                              handleFileChange(e, "front", "poa")
                            }
                            type="file"
                            accept="image/*"
                            className="w-full h-full bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:ring focus:ring-blue-200"
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Back
                    </label>
                    <span className="text-xs text-gray-400">
                      Back photo of your POA
                    </span>
                    <div className="flex justify-start">
                      <div className="relative w-full max-w-xs h-32 md:h-40">
                        {backPreview2 ? (
                          <>
                            <img
                              src={backPreview2}
                              alt="Back POA document"
                              className="w-full h-full object-contain bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:ring focus:ring-blue-200"
                            />
                            <input
                              onChange={(e) =>
                                handleFileChange(e, "back", "poa")
                              }
                              type="file"
                              accept="image/*"
                              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </>
                        ) : (
                          <input
                            onChange={(e) => handleFileChange(e, "back", "poa")}
                            type="file"
                            accept="image/*"
                            className="w-full h-full bg-transparent border border-[#E9EAEB] rounded-md p-2 focus:ring focus:ring-blue-200"
                            required
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Hr />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};