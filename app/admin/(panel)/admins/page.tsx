import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import { Badge } from "@/components/admin/StatusBadge";
import { LoadError, PageHeader, Panel, PanelHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listAdmins, type AdminListEntry } from "@/lib/admin/data";
import { formatDate } from "@/lib/admin/format";
import { AddAdminForm, RemoveAdminButton } from "./AdminForms";

export const metadata: Metadata = { title: "Admins" };

export default async function AdminsPage() {
  const session = await requireAdmin();

  let admins: AdminListEntry[];
  try {
    admins = await listAdmins();
  } catch (err) {
    unstable_rethrow(err);
    console.error("[admin] Admins failed to load:", err);
    return (
      <>
        <PageHeader title="Admins" />
        <LoadError what="admins" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Admins" description="People who can sign in to this dashboard." />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel className="self-start">
          <PanelHeader title={`${admins.length} ${admins.length === 1 ? "admin" : "admins"}`} />
          <ul className="divide-y divide-border">
            {admins.map((admin) => {
              const you = admin.email === session.email;
              return (
                <li key={admin.id ?? "owner"} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-1.5 text-sm text-text">
                      <span className="truncate">{admin.email}</span>
                      {admin.owner && <Badge tone="blue">Owner</Badge>}
                      {you && <Badge tone="gray">You</Badge>}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {admin.owner
                        ? "Set by ADMIN_BOOTSTRAP_EMAIL. Can't be removed."
                        : `Added ${formatDate(admin.createdAt)}${admin.addedBy ? ` by ${admin.addedBy}` : ""}`}
                    </p>
                  </div>
                  {!admin.owner && !you && admin.id && <RemoveAdminButton id={admin.id} email={admin.email} />}
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel className="self-start">
          <PanelHeader title="Add admin" />
          <div className="px-4 py-4">
            <AddAdminForm />
            <p className="mt-3 text-xs text-text-muted">
              They get an email saying they have access, with a link to the sign-in page. They sign in with an emailed
              link, so there&apos;s no password to share.
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}
