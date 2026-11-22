import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/Logo";
import { GET_STARTED, NAV_LINKS } from "@/lib/nav";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const links = [...NAV_LINKS, GET_STARTED];

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-text-dim">
            Streaming TV ads for local businesses. Your commercial on the big screen, in your area.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-text-dim transition-colors hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-text-muted sm:px-6 lg:px-8">
          © <CopyrightYear /> Dioshift. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
