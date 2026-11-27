import { Skeleton } from "@/components/admin/ui";

export default function AdminLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-28" />
      <Skeleton className="h-64" />
    </div>
  );
}
