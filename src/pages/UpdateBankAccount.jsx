import { useEffect, useState } from "react";
import { Hr } from "../components/Common/Hr";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/ui/BackButton";
import api from "../utils/axiosInstance";
import { USER_API } from "../utils/constants";

export const UpdateBankAccount = () => {
  const navigate = useNavigate();
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions } = useUserContext();
  const [kycBankImageFile, setKycBankImageFile] = useState(null);
  const [kycBankImagePreview, setKycBankImagePreview] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [errors, setErrors] = useState({});
  const [bankStatus, setBankStatus] = useState(null);
  const [originalBankFields, setOriginalBankFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inputFields, setInputFields] = useState({
    bankname: "",
    accno: "",
    ifsc: "",
    iban_number: "",
    bankaddress: "",
    kyc_bank_country: "1",
    accname: "",
  });

  // Configurable field array with validation
  const inputFieldsArray = [
    {
      label: "Bank Name",
      type: "text",
      placeholder: "Enter name of bank",
      name: "bankname",
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return "Bank name is required";
        if (!/^[A-Za-z\s]+$/.test(trimmed))
          return "Bank name must only contain letters";
        if (trimmed.length < 3)
          return "Bank name must be at least 3 characters";
        if (trimmed.length > 30)
          return "Bank name must not exceed 30 characters";
        return true;
      },
    },
    {
      label: "Bank Holder Name",
      type: "text",
      placeholder: "Enter Account holder name",
      name: "accname",
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return "Bank Holder name is required";
        if (!/^[A-Za-z\s]+$/.test(trimmed))
          return "Bank holder name must only contain letters";
        if (trimmed.length < 3)
          return "Bank holder name must be at least 3 characters";
        if (trimmed.length > 50)
          return "Bank holder name must not exceed 50 characters";
        return true;
      },
    },
    {
      label: "Account Number",
      type: "text",
      placeholder: "Enter Account number",
      name: "accno",
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return "Account number is required";
        if (!/^[0-9]+$/.test(trimmed))
          return "Account number must contain digits only";
        if (trimmed.length < 9)
          return "Account number must be at least 9 digits";
        if (trimmed.length > 18)
          return "Account number must not exceed 18 digits";
        return true;
      },
    },
    {
      label: "IFSC Code",
      type: "text",
      placeholder: "Enter IFSC code",
      name: "ifsc",
      validate: (val) => {
        const trimmed = val.trim().toUpperCase();
        if (!trimmed) return "IFSC code is required";
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmed))
          return "Invalid IFSC format (e.g., HDFC0001234)";
        return true;
      },
    },
    {
      label: "IBAN Number",
      type: "text",
      placeholder: "Enter IBAN Number",
      name: "iban_number",
      validate: (val) => {
        const trimmed = val.trim().toUpperCase();
        if (!trimmed) return "IBAN is required";
        if (trimmed.length < 15) return "IBAN must be at least 15 characters";
        if (trimmed.length > 34) return "IBAN must not exceed 34 characters";
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]{9,30}$/.test(trimmed))
          return "Invalid IBAN format (e.g., GB29NWBK60161331926819)";
        return true;
      },
    },
    {
      label: "Bank Address",
      type: "text",
      placeholder: "Enter bank address",
      name: "bankaddress",
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return "Bank address is required";
        if (trimmed.length < 15)
          return "Bank address must be at least 15 characters long";
        if (trimmed.length > 100)
          return "Bank address must not exceed 100 characters";
        return true;
      },
    },
  ];

  const getBankDetail = async () => {
    try {
      const userResponse = await api.post(`${USER_API.GET_BANK_DETAILS}`);

      if (userResponse.data.data.status === 200) {
        const resp = userResponse.data.data.response;
        setInputFields({
          bankname: resp.bankname || "",
          accno: resp.accno || "",
          ifsc: resp.ifsc || "",
          iban_number: resp.iban || "",
          bankaddress: resp.kyc_bank_address || "",
          accname: resp.accholder || "",
          kyc_bank_country: "1",
        });

        setOriginalBankFields({
          bankname: resp.bankname || "",
          accno: resp.accno || "",
          ifsc: resp.ifsc || "",
          iban_number: resp.iban || "",
          bankaddress: resp.kyc_bank_address || "",
          accname: resp.accholder || "",
          kyc_bank_country: "1",
        });

        setBankStatus(resp.status);

        // Set image preview from server if exists
        if (resp.image) {
          setKycBankImagePreview(resp.image);
          setSelectedImageName("");
          setKycBankImageFile(null);
        } else {
          setKycBankImagePreview("");
          setSelectedImageName("");
          setKycBankImageFile(null);
        }
      }
    } catch (error) {
      console.error("err: ----------->", error);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getBankDetail();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error("The file size must be less than 2MB.", toastOptions);
          return;
        }
        setKycBankImageFile(file);
        setSelectedImageName(file.name);

        const reader = new FileReader();
        reader.onloadend = () => {
          setKycBankImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setKycBankImageFile(null);
        setKycBankImagePreview("");
        setSelectedImageName("");
      }
    } else {
      // Update field value
      setInputFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const isFormUnchanged = () => {
    const fieldsUnchanged =
      JSON.stringify(inputFields) === JSON.stringify(originalBankFields);
    const fileUnchanged = !kycBankImageFile; // no new file selected
    return fieldsUnchanged && fileUnchanged;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const newErrors = {};
    inputFieldsArray.forEach((field) => {
      const errorMessage = field.validate(inputFields[field.name]);
      if (errorMessage !== true) {
        newErrors[field.name] = errorMessage;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("bankname", inputFields.bankname);
    formData.append("accname", inputFields.accname);
    formData.append("accno", inputFields.accno);
    formData.append("ifsc", inputFields.ifsc);
    formData.append("iban_number", inputFields.iban_number);
    formData.append("bankaddress", inputFields.bankaddress);
    // formData.append("kyc_bank_country", "1"); // not using 

    if (kycBankImageFile) {
      formData.append("kyc_bank_image", kycBankImageFile);
    }

    try {
      setIsSubmitting(true);
      const response = await api.post(`${USER_API.ADD_USER_BANK}`, formData);
      console.log("formData", formData);
      if (response.data.data.status === 200) {
        await getBankDetail();
        toast.success(response.data.data.result, toastOptions);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error(response.data.data.result, toastOptions);
      }
    } catch (err) {
      console.error("err -------->", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFilePreview = () => {
    if (!kycBankImagePreview) return null;
    const fileType =
      kycBankImageFile?.type ||
      (kycBankImagePreview &&
        kycBankImagePreview.split(".").pop()?.toLowerCase());

    // Handle PDF preview
    if (fileType?.includes("pdf") || fileType === "pdf") {
      return (
        <object
          data={kycBankImagePreview}
          type="application/pdf"
          width="100%"
          height="400px"
          className="border rounded-lg mt-3"
        >
          <a
            href={kycBankImagePreview}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        </object>
      );
    }

    // Handle TIFF or HEIC or other non-displayable formats
    if (
      fileType?.includes("tiff") ||
      fileType?.includes("heic") ||
      fileType === "tiff" ||
      fileType === "heic"
    ) {
      return (
        <div className="mt-3 p-4 border rounded-lg text-center text-sm text-gray-600">
          <p>Preview not available for this file type.</p>
          <a
            href={kycBankImagePreview}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View / Download File
          </a>
        </div>
      );
    }

    // Default image preview
    return (
      <img
        src={kycBankImagePreview}
        alt="Preview"
        className="mt-3 p-4 max-h-64 object-contain border rounded-lg"
      />
    );
  };

  return (
    <section>
      <div
        onClick={() => {
          if (isMobile && toggle) {
            setToggle(false);
          }
        }}
      >
        <div className="">
          {/* Header Section */}
          <div className="flex items-center justify-between gap-1 mb-2 w-full max-w-6xl">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-3xl font-bold text-gray-900">
                Add Bank Account
              </h2>
              <span className="text-gray-500 font-normal text-base">
                Add your bank account details below
              </span>
              <p className="text-black font-bold mb-2 max-w-6xl">
                Status:{" "}
                <span
                  className={`font-normal text-sm ${
                    bankStatus?.toLowerCase() === "pending"
                      ? "text-yellow-500"
                      : bankStatus?.toLowerCase() === "success" ||
                          bankStatus?.toLowerCase() === "approved"
                        ? "text-green-500"
                        : bankStatus?.toLowerCase() === "rejected"
                          ? "text-red-500"
                          : "text-gray-500"
                  }`}
                >
                  {bankStatus || "Not Submit"}
                </span>
              </p>
            </div>
            <div>
              <BackButton customPath={"/"} />
            </div>
          </div>

          {/* Main Row: Form and Terms */}
          <div className="flex gap-4 flex-col mt-3 mb-10 lg:flex-row">
            {/* Main Form Card */}
            <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
              <form onSubmit={handleSubmit}>
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inputFieldsArray.map((element, index) => (
                    <div className="mb-4" key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {element.label}
                      </label>
                      <input
                        className={`w-full px-3 py-2 border rounded-md ${
                          errors[element.name]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        type={element.type}
                        placeholder={element.placeholder}
                        onChange={handleInputChange}
                        name={element.name}
                        value={inputFields[element.name]}
                      />
                      {errors[element.name] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[element.name]}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Image upload field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Proof Image
                    </label>
                    <input
                      className="w-full border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-input-border bg-white
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium 
                       file:bg-light-blue file:text-text-blue"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleInputChange}
                      name="kyc_bank_image"
                    />
                    {kycBankImagePreview && renderFilePreview()}
                    {selectedImageName && (
                      <span className="ml-2 text-xs text-gray-600">
                        {selectedImageName}
                      </span>
                    )}
                  </div>
                </div>

                <Hr />
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="submit"
                    disabled={isFormUnchanged() || isSubmitting}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? "Processing..." : "Add Account"}
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