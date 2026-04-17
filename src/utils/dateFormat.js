export const formatNotificationTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isToday) return timeString;
  if (isYesterday) return `Yesterday · ${timeString}`;

  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} · ${timeString}`;
};