import { parse, format } from "date-fns";

export const formatDate = (dateString) => {
  const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
  return format(parsedDate, "yyyy-MM-dd");
};