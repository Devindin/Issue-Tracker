export const getProjectStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
