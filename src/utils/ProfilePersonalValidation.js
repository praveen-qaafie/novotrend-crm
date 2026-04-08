export const validateUserFields = (fields, userImage) => {
  const errors = {};

  // First name: required, letters and spaces only
  if (!fields.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (!/^[A-Za-z\s]+$/.test(fields.firstName)) {
    errors.firstName = "First name can only contain letters.";
  }

  // Last name: required, letters and spaces only
  if (!fields.lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (!/^[A-Za-z\s]+$/.test(fields.lastName)) {
    errors.lastName = "Last name can only contain letters.";
  }

  // Date of birth
  if (!fields.dob) {
    errors.dob = "Date of birth is required";
  }

  // Bio (optional, max length)
  if (fields.bio && fields.bio.length > 500) {
    errors.bio = "Bio cannot exceed 500 characters";
  }

  // Email
  
  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(fields.email)) {
    errors.email = "Invalid email address";
  }

  // Mobile
  const mobile = fields.mobile;
  if (!mobile.country) {
    errors.country = "Country is required";
  }
  if (!mobile.number) {
    errors.mobileNumber = "Mobile number is required";
  } else if (!/^\d{10,12}$/.test(mobile.number)) {
    errors.mobileNumber = "Invalid mobile number";
  }

  // Profile image validation
  if (userImage && userImage instanceof File) {
    if (userImage.size > 2 * 1024 * 1024) {
      errors.userImage = "Image size should be less than 2MB";
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(userImage.type)) {
      const extension = userImage.name?.split(".").pop().toLowerCase();
      if (!["png", "jpg", "jpeg"].includes(extension)) {
        errors.userImage = "Only PNG/JPG/JPEG images are allowed";
      }
    }
  }

  return errors;
};
