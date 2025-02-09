"use client";

import { checkWorkspaceSlug, createWorkspace, updateWorkspace } from "@/$api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { IWorkspace } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash/debounce"; // Import debounce
import { Loader2, RefreshCw } from "lucide-react";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface WorkspaceModalProps {
  workspace?: IWorkspace;
  trigger: ReactNode;
  onWorkspaceChange: (workspace: IWorkspace) => void;
}

const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  slug: z.string().nonempty({ message: "Slug is required" }),
});

export const WorkspaceModal: FC<WorkspaceModalProps> = ({
  trigger,
  workspace,
  onWorkspaceChange,
}) => {
  const isEdit = !!workspace;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workspace?.name || "",
      slug: workspace?.slug || "",
    },
  });

  // Debounced function to check slug
  const debouncedCheckSlug = useCallback(
    debounce(async (slug: string) => {
      console.log("Debounced check slug:", slug);
      const data = await checkWorkspaceSlug(slug);

      if (!data.available && data.suggestion) {
        form.setValue("slug", data.suggestion);
      } else {
        form.setValue("slug", slug);
      }
    }, 500),
    [form],
  );

  const handleSlugChange = useCallback(
    (slug: string) => {
      if (slug) {
        debouncedCheckSlug(slug);
      }
    },
    [debouncedCheckSlug],
  );

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true);
      try {
        let result: IWorkspace;
        if (isEdit) {
          result = await updateWorkspace(workspace!.id, values);
          toast({
            description: "Workspace updated successfully",
            variant: "default",
          });
        } else {
          result = await createWorkspace(values);
          toast({
            description: "Workspace created successfully",
            variant: "default",
          });
        }
        onWorkspaceChange(result);
        form.reset();
        setOpen(false);
      } catch {
        toast({ description: "Something went wrong", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    },
    [isEdit, workspace, toast, onWorkspaceChange, form],
  );

  useEffect(() => {
    form.setValue("name", workspace?.name || "");
    form.setValue("slug", workspace?.slug || "");
  }, [workspace, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit workspace" : "Create new workspace"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center py-4 gap-2">
                      <Input
                        placeholder="Slug"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleSlugChange(e.target.value);
                        }}
                      />
                      <Button
                        size="icon"
                        type="button"
                        onClick={() =>
                          handleSlugChange(
                            form.getValues().slug || form.getValues().name,
                          )
                        }
                      >
                        <RefreshCw size={20} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
