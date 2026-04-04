export const validateRegisterField = (
  fieldName,
  value,
  countryCode = "",
  inputChecked = false
) => {
  const val = value ? String(value) : "";

  const nameValidation = (val, fieldLabel) => {
    const trimmed = val.trim();

    // Don't show error if user hasn't typed anything
    if (trimmed === "") return { isValid: true, message: "" };

    if (!/^[A-Za-z]+$/.test(trimmed)) {
      return {
        isValid: false,
        message: `${fieldLabel} must contain only letters`,
      };
    }

    if (trimmed.length < 3) {
      return {
        isValid: false,
        message: `${fieldLabel} must be at least 3 characters`,
      };
    }

    if (trimmed.length > 15) {
      return {
        isValid: false,
        message: `${fieldLabel} cannot exceed 15 characters`,
      };
    }

    return { isValid: true, message: "" };
  };

  const rules = {
    firstname: nameValidation(val, "First name"),
    lastname: nameValidation(val, "Last name"),

    email: {
      isValid:
        val.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      message:
        val.trim() === "" ? "Email is required" : "Enter a valid email address",
    },

    mobileNumber: {
      isValid:
        val.trim() === "" ||
        (/^\d+$/.test(val.trim()) &&
          val.trim().length >= 8 &&
          val.trim().length <= 12),
      message:
        val.trim() === ""
          ? "Mobile number is required"
          : "Enter a valid mobile number (8–12 digits)",
    },

    password: {
      isValid:
        val.trim() === "" ||
        (val.trim().length >= 8 &&
          val.trim().length <= 15 &&
          /[a-z]/.test(val) &&
          /[A-Z]/.test(val) &&
          /\d/.test(val) &&
          /[^A-Za-z0-9]/.test(val)),
      message:
        val.trim() === ""
          ? "Password is required"
          : "Password must meet all the requirements mentioned below.",
    },

    country: {
      isValid: val.trim() !== "",
      message: "Please select your country",
    },
    partnerCode: {
      isValid: !inputChecked || (inputChecked && val.trim() !== ""),
      message: !inputChecked
        ? ""
        : val.trim() === ""
        ? "Partner Code is required"
        : "",
    },
  };
  return rules[fieldName] || { isValid: true, message: "" };
};

// ✅ Validate full form
export const validateRegisterForm = (fields) => {
  const errors = {};
  Object.keys(fields).forEach((key) => {
    const { isValid, message } = validateRegisterField(
      key,
      fields[key],
      fields.countryCode,
      fields.inputChecked // pass checkbox flag
    );
    if (!isValid) errors[key] = message;
  });
  return errors;
};
