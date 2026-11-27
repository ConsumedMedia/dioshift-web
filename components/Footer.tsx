import Link from "next/link";
import { cacheLife } from "next/cache";
import { icons } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { FOOTER_LINKS, LEGAL_LINKS } from "@/lib/nav";
import { formatAddress, siteConfig } from "@/lib/site-config";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const links = FOOTER_LINKS;

  return (
    <footer data-sticky-cta-stop className="relative border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-text-dim">
            Streaming TV ads for local businesses. Your commercial on the big screen, in your area.
          </p>
        </div>

        <address className="text-sm not-italic">
          <p className="font-medium text-text">Based in Grove City, Ohio</p>
          <ul className="mt-3 space-y-2.5 text-text-dim">
            <li className="flex items-start gap-2.5">
              <span className="mt-px text-text-muted [&_svg]:size-4">{icons.pin}</span>
              {formatAddress()}
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-px text-text-muted [&_svg]:size-4">{icons.mail}</span>
              <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-text">
                {siteConfig.email}
              </a>
            </li>
            {siteConfig.phone && (
              <li className="flex items-start gap-2.5">
                <span className="mt-px text-text-muted [&_svg]:size-4">{icons.phone}</span>
                <a
                  href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                  className="transition-colors hover:text-text"
                >
                  {siteConfig.phone}
                </a>
              </li>
            )}
          </ul>
        </address>

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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © <CopyrightYear /> Dioshift. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
