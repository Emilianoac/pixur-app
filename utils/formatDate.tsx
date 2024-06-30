
export default function formatDate(timestamp: number) {
  if (!timestamp) {
    throw new Error("Timestamp is required");
  };

  return new Date(Number(timestamp)).toLocaleDateString("en-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};