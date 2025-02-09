import { fetchWorkspaces } from "@/$api";
import { columns } from "@/app/ac/workspaces/columns";
import { DataTable } from "@/app/ac/workspaces/data-table";
import React from "react";

const WorkspacesPage = async () => {
  const workspaces = await fetchWorkspaces();
  return <DataTable columns={columns} data={workspaces} />;
};

export default WorkspacesPage;
