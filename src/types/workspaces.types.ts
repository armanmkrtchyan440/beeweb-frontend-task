export interface IWorkspace {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceRequest {
  name: string;
  slug: string;
}

export interface CheckWorkspaceSlugResponse {
  available: boolean;
  suggestion?: string;
}
