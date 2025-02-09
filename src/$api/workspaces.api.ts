import { $fetch } from "@/$api/api.fetch";
import {
  CheckWorkspaceSlugResponse,
  IWorkspace,
  WorkspaceRequest,
} from "@/types";

export function fetchWorkspaces() {
  return $fetch.get<IWorkspace[]>("/workspaces", true);
}

export function createWorkspace(body: WorkspaceRequest) {
  return $fetch.post<IWorkspace>("/workspaces", true, body);
}

export function updateWorkspace(id: number, body: WorkspaceRequest) {
  return $fetch.put<IWorkspace>(`/workspaces/${id}`, true, body);
}

export function deleteWorkspace(id: number) {
  return $fetch.delete(`/workspaces/${id}`, true);
}

export function fetchWorkspace(id: number) {
  return $fetch.get<IWorkspace>(`/workspaces/${id}`, true);
}

export function checkWorkspaceSlug(slug: string) {
  return $fetch.post<CheckWorkspaceSlugResponse>(
    `/workspaces/check-slug`,
    true,
    { slug },
  );
}
