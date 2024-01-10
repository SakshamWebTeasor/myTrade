const isValidMobile = (mobile) => {
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return { valid: false, value: mobile, message: "Invalid Mobile No" };
  }
  return { valid: true, value: parseInt(mobile) };
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email) => {
  let valid = emailRegex.test(email);
  return { valid: valid, value: email, message: valid ? "" : "Invalid Email" };
};

const genderCheck = (gender) => {
  if (!["male", "female", "preferNotToSay"].includes(gender)) {
    return { valid: false, value: gender, message: "Invalid Gender" };
  }
  return { valid: true, value: gender };
};

const isValidPassword = (password) => {
  const errorS = [];
  if (password.length < 8) {
    errorS.push("8 characters");
  }
  if (!/[a-z]/.test(password)) {
    errorS.push("one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errorS.push("one uppercase letter");
  }
  if (!/\d/.test(password)) {
    errorS.push("one numberical digit");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errorS.push("one special character");
  }
  if (errorS.length > 0) {
    return {
      valid: false,
      value: password,
      message: `Password must have at least [${errorS.join(", ")}]`,
    };
  }
  return { valid: true, value: password };
};

const isValidPan = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(pan)) {
    return { valid: false, value: pan, message: "Invalid PAN No" };
  }
  return { valid: true, value: pan };
};

const isValidAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/;
  if (!aadharRegex.test(aadhar)) {
    return { valid: false, value: aadhar, message: "Invalid Aadhar No" };
  }
  return { valid: true, value: parseInt(aadhar) };
};

const isValidRole = (role) => {
  if (!["user", "admin", "superAdmin"].includes(role)) {
    return { valid: false, value: role, message: "Invalid Role" };
  }
  return { valid: true, value: role };
};

module.exports = {
  isValidMobile,
  isValidEmail,
  isValidPassword,
  genderCheck,
  isValidPan,
  isValidAadhar,
  isValidRole,
};
