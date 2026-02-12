import type { Issue } from "../types";

interface FilterOptions {
  filterAssignee: string;
  filterProject: string;
  filterCompletedDate: string;
}

export const filterIssues = (
  issues: Issue[],
  { filterAssignee, filterProject, filterCompletedDate }: FilterOptions
): Issue[] => {
  return issues.filter((issue) => {
    const matchesAssignee =
      filterAssignee === "All" ||
      (filterAssignee === "Unassigned" && !issue.assignee) ||
      (issue.assignee && issue.assignee.name === filterAssignee);

    const matchesProject =
      filterProject === "All" ||
      (filterProject === "Unassigned" && !issue.project) ||
      (issue.project && issue.project._id === filterProject);

    const matchesCompletedDate = (() => {
      if (filterCompletedDate === "All") return true;

      if (filterCompletedDate === "Unassigned") {
        return !issue.completedAt;
      }

      if (!issue.completedAt) return false;

      const completedDate = new Date(issue.completedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);

      switch (filterCompletedDate) {
        case "Today":
          return completedDate.toDateString() === today.toDateString();
        case "Yesterday":
          return completedDate.toDateString() === yesterday.toDateString();
        case "Last Week":
          return completedDate >= lastWeek;
        default:
          return true;
      }
    })();

    return matchesAssignee && matchesProject && matchesCompletedDate;
  });
};
