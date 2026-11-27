import { Icon } from "@/components/icons";

/** Admin navigation and action icons, in the site's 24px stroke style. */
export const adminIcons = {
  overview: (
    <Icon>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Icon>
  ),
  clients: (
    <Icon>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
      <path d="M15.5 4.9a3.2 3.2 0 0 1 0 6.2M17.5 14.7c1.9.6 3.1 2.3 3.5 4.8" />
    </Icon>
  ),
  messages: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </Icon>
  ),
  admins: (
    <Icon>
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8 7.5 9.5 4.4-1.5 7.5-5.1 7.5-9.5V6L12 3Z" />
      <circle cx="12" cy="10.5" r="2.2" />
      <path d="M8.5 16c.7-1.6 2-2.4 3.5-2.4s2.8.8 3.5 2.4" />
    </Icon>
  ),
  signOut: (
    <Icon>
      <path d="M14 4h3.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" />
      <path d="M10 8l-4 4 4 4M6 12h9" />
    </Icon>
  ),
  back: (
    <Icon>
      <path d="M15 5l-7 7 7 7" />
    </Icon>
  ),
  download: (
    <Icon>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </Icon>
  ),
  search: (
    <Icon>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Icon>
  ),
  check: (
    <Icon>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Icon>
  ),
  chevron: (
    <Icon>
      <path d="m9 5 7 7-7 7" />
    </Icon>
  ),
};
