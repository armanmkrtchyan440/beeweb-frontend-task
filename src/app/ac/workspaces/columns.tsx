"use client";

import { DeleteModal } from "@/app/ac/workspaces/components/delete-modal";
import { WorkspaceModal } from "@/app/ac/workspaces/components/workspace-modal";
import { Button } from "@/components/ui/button";
import { IWorkspace } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit } from "lucide-react";

export const columns: ColumnDef<IWorkspace>[] = [
  {
    id: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "id",
    cell: ({ row }) => {
      return <div>{row.getValue("id")}</div>;
    },
  },
  {
    id: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "name",
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    id: "slug",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slug
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "slug",
    cell: ({ row }) => {
      return <div>{row.getValue("slug")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const workspace = row.original;

      const meta = table.options.meta as {
        updateData: (workspace: IWorkspace) => void;
        deleteData: (id: number) => void;
      };

      return (
        <div className="flex items-center gap-2 justify-end">
          <WorkspaceModal
            trigger={
              <Button size={"icon"}>
                <Edit />
              </Button>
            }
            workspace={workspace}
            onWorkspaceChange={meta.updateData}
          />
          <DeleteModal id={workspace.id} deleteData={meta.deleteData} />
        </div>
      );
    },
  },
];
