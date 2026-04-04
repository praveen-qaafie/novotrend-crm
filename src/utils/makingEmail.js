export const maskEmail = (email) => {
  if (!email || !email.includes("@")) return "";
  const [user, domain] = email?.split("@");
  const maskedUser = user[0] + "*****";
  return `${maskedUser}@${domain}`;
};
