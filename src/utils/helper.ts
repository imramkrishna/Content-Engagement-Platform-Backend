import { format } from "date-fns";

interface PaginationResult {
  totalItems: number;
  totalPages: number;
  currentPage: number;

  offset: number;
  limit: number;
}
// const convertNepDateTimeToUtc = (fullDate: any) => {
//   const [date, time]: any = fullDate.split(" ");
//   const [year, month, day] = date.split("-").map(Number);
//   const [hour, minute] = time.split(":").map(Number);
//   const localInMillis = Date.UTC(year, month - 1, day, hour, minute);
//   const utcInMillis = localInMillis - (5 * 60 + 45) * 60 * 1000;
//   const utcDate = new Date(utcInMillis);
//   return utcDate;
// };
const convertNepDateTimeToUtc = (fullDate: string | Date) => {
  if (!fullDate) throw new Error("Invalid date");

  // If Date object, convert to string "YYYY-MM-DD HH:mm"
  let dateStr: string;
  if (fullDate instanceof Date) {
    const year = fullDate.getFullYear();
    const month = String(fullDate.getMonth() + 1).padStart(2, "0");
    const day = String(fullDate.getDate()).padStart(2, "0");
    const hours = String(fullDate.getHours()).padStart(2, "0");
    const minutes = String(fullDate.getMinutes()).padStart(2, "0");
    dateStr = `${year}-${month}-${day} ${hours}:${minutes}`;
  } else if (typeof fullDate === "string") {
    dateStr = fullDate;
  } else {
    throw new Error("fullDate must be string or Date");
  }

  const [datePart, timePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Nepal is UTC+5:45
  const localInMillis = Date.UTC(year, month - 1, day, hour, minute);
  const utcInMillis = localInMillis - (5 * 60 + 45) * 60 * 1000;
  return new Date(utcInMillis);
};
const paginate = (query: any, totalItems: number): PaginationResult => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;

  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const offset = (currentPage - 1) * limit;

  return {
    totalItems,
    totalPages,
    currentPage,
    offset,
    limit,
  };
};

export default {
  convertNepDateTimeToUtc,
  paginate,
};
