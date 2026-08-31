import type { Project } from "@/types";

// CLIENT INFORMATION REQUIRED - no verified project/case-study data has
// been provided yet. Populate this array only with real projects (name,
// location, client, year, services, description, and - ideally -
// challenge/solution/execution/results and approved photography).
// Do not invent entries.
export const projects: Project[] = [];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
