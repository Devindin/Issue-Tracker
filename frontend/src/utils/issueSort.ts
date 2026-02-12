import type { Issue, SortField, SortOrder } from "../types";

export const sortIssues = (
  issues: Issue[],
  sortField: SortField,
  sortOrder: SortOrder
): Issue[] => {
  const sorted = [...issues];

  sorted.sort((a, b) => {
    let comparison = 0;

    if (sortField === "priority") {
      const priorityOrder: Record<Issue["priority"], number> = {
        Low: 1,
        Medium: 2,
        High: 3,
        Critical: 4,
      };

      comparison =
        priorityOrder[a.priority] - priorityOrder[b.priority];

    } else if (sortField === "status") {
      const statusOrder: Record<Issue["status"], number> = {
        Open: 1,
        "In Progress": 2,
        Resolved: 3,
        Closed: 4,
      };

      comparison =
        statusOrder[a.status] - statusOrder[b.status];

    } else if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);

    } else {
      // createdAt or updatedAt
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      comparison = dateA - dateB;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
};
