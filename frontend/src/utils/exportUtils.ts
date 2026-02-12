import type { Issue } from "../types";

export const exportIssuesToCSV = (issues: Issue[]) => {
  const headers = [
    "ID",
    "Title",
    "Description",
    "Status",
    "Priority",
    "Severity",
    "Assignee",
    "Completed At",
    "Created At",
    "Updated At",
  ];

  const rows = issues.map((issue) => [
    issue.id,
    `"${issue.title}"`,
    `"${issue.description}"`,
    issue.status,
    issue.priority,
    issue.severity,
    issue.assignee ? issue.assignee.name : "Unassigned",
    issue.completedAt || "",
    issue.createdAt,
    issue.updatedAt,
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `issues-export-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
};

export const exportIssuesToJSON = (issues: Issue[]) => {
  const jsonContent = JSON.stringify(issues, null, 2);

  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `issues-export-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
};
