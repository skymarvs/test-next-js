"use client";

import { DataTable } from "@/components/custom/data-table/data-table";
import { toast } from "@/components/ui/toast";
import { Profile } from "@/lib/types/models";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { getProfile } from "../actions/profile";
import { Button } from "@/components/ui/button";

export default function ManageEventPage() {
  const [profiles, setProfiles] = useState<Profile[] | null>([]);

  useEffect(() => {
    getProfile()
      .then((data) => setProfiles(data))
      .catch((error) => {
        if (error instanceof Error) {
          toast.add({
            title: "Failed to fetch events.",
            description: error.message,
            type: "error",
          });
        }
      });
  }, []);

  return (
    <>
      <h1 className="mb-4">Users Page</h1>
      <DataTable
        columns={columns}
        data={profiles ?? []}
        searchFilter={{
          column_name: "full_name",
          placeholder: "Search by name",
        }}
      />
    </>
  );
}
