export const priorityStyles: Record<string, string> = {
  LOW: "bg-green-100 text-green-600 border border-green-300",
  MEDIUM: "bg-orange-100 text-orange-600 border border-orange-300",
  HIGH: "bg-red-100 text-red-600 border border-red-300",
};

export const urgencyStyles: Record<string, string> = {
  COLD: "bg-cyan-100 text-cyan-600 border border-cyan-300",
  WARM: "bg-pink-100 text-pink-600 border border-pink-300",
};

export const statusStyles: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-600 border border-blue-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-600 border border-yellow-300",
  RESOLVED: "bg-teal-100 text-teal-800 border border-teal-300",
  CLOSED: "bg-gray-100 text-gray-800 border border-gray-300",
};
