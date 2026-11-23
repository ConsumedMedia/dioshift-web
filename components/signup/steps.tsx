import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { PACKAGES, formatImpressions, formatPrice, getPackageById } from "@/lib/packages";
import {
  AGE_RANGES,
  BUSINESS_CATEGORIES,
  HOUSEHOLD_INCOMES,
  RADIUS_MAX,
  RADIUS_MIN,
  US_STATES,
  todayLocalISO,
  withProtocol,
  type AgeRange,
  type Gender,
  type ServiceAreaType,
} from "@/lib/signup-schema";
import {
  CheckboxField,
  FieldError,
  Legend,
  SelectField,
  TextAreaField,
  TextField,
  choiceClass,
  inputClass,
} from "./fields";
import type { FormValues, StepProps } from "./form-state";

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const SERVICE_AREA_OPTIONS: ReadonlyArray<{ value: ServiceAreaType; label: string }> = [
  { value: "radius", label: "Radius around my business" },
  { value: "zip_codes", label: "Zip codes" },
  { value: "cities", label: "Cities" },
  { value: "counties", label: "Counties" },
];

const AREA_DETAILS: Record<Exclude<ServiceAreaType, "radius">, { label: string; placeholder: string }> = {
  zip_codes: { label: "Which zip codes?", placeholder: "43123, 43119, 43228" },
  cities: { label: "Which cities?", placeholder: "Grove City, Hilliard, Dublin" },
  counties: { label: "Which counties?", placeholder: "Franklin County, Delaware County" },
};

const GENDER_OPTIONS: ReadonlyArray<{ value: Gender; label: string }> = [
  { value: "all", label: "All" },
  { value: "male", label: "Men" },
  { value: "female", label: "Women" },
];

const STATE_OPTIONS = US_STATES.map(([code, name]) => ({ value: code, label: name }));
const CATEGORY_OPTIONS = BUSINESS_CATEGORIES.map((c) => ({ value: c, label: c }));
const INCOME_OPTIONS = [
  { value: "", label: "Any" },
  ...HOUSEHOLD_INCOMES.map((i) => ({ value: i, label: i })),
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function Fieldset({
  id,
  legend,
  required,
  error,
  hint,
  action,
  children,
}: {
  id: string;
  legend: ReactNode;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset aria-describedby={describedBy} className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <Legend required={required}>{legend}</Legend>
        {action}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 mb-3 text-sm text-text-muted">
          {hint}
        </p>
      )}
      {children}
      <FieldError id={id} error={error} />
    </fieldset>
  );
}

/** Radio buttons styled as a segmented control. */
function Segmented<T extends string>({
  name,
  options,
  value,
  onChange,
  error,
  columns,
}: {
  name: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  error?: string;
  columns: string;
}) {
  return (
    <div className={cn("grid gap-2", columns)}>
      {options.map((o, i) => {
        const selected = value === o.value;
        return (
          <label
            key={o.value}
            className={cn(
              choiceClass(selected, !!error),
              "flex min-h-11 items-center justify-center px-3 py-2 text-center text-sm font-medium leading-snug",
            )}
          >
            <input
              type="radio"
              id={i === 0 ? name : `${name}-${o.value}`}
              name={name}
              value={o.value}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
        selected ? "border-accent bg-accent" : "border-border-bright",
      )}
    >
      {selected && <span className="size-2 rounded-full bg-white" />}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Package
// ---------------------------------------------------------------------------

export function PackageStep({ values, set, errorFor }: StepProps) {
  const error = errorFor("packageId");
  return (
    <Fieldset id="packageId-group" legend="Choose your monthly reach" required error={error}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PACKAGES.map((pkg, i) => {
          const selected = values.packageId === pkg.id;
          return (
            <label key={pkg.id} className={cn(choiceClass(selected, !!error), "flex flex-col p-4 sm:p-5")}>
              <input
                type="radio"
                id={i === 0 ? "packageId" : `packageId-${pkg.id}`}
                name="packageId"
                value={pkg.id}
                checked={selected}
                onChange={() => set("packageId", pkg.id)}
                className="sr-only"
              />
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold text-text-dim">{pkg.label}</span>
                <RadioDot selected={selected} />
              </span>
              <span className="mt-3 font-display text-2xl font-bold tracking-tight text-text">
                {formatImpressions(pkg.impressions)}
              </span>
              <span className="text-xs text-text-dim">impressions per month</span>
              <span className="mt-3 flex flex-wrap items-baseline gap-x-1 gap-y-2">
                <span className="font-display text-xl font-bold text-text">{formatPrice(pkg.monthlyPrice)}</span>
                <span className="text-xs text-text-dim">/month</span>
                {pkg.popular && (
                  <span className="ml-auto rounded-full border border-accent/30 bg-accent-glow px-2.5 py-1 text-[11px] font-semibold text-accent-soft">
                    Most Popular
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </Fieldset>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Business
// ---------------------------------------------------------------------------

export function BusinessStep({ values, set, errorFor, blur }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        id="businessName" label="Business name" required autoComplete="organization" maxLength={150}
        value={values.businessName} onValueChange={(v) => set("businessName", v)}
        onBlur={blur("businessName")} error={errorFor("businessName")}
      />
      <TextField
        id="contactName" label="Your name" required autoComplete="name" maxLength={100}
        value={values.contactName} onValueChange={(v) => set("contactName", v)}
        onBlur={blur("contactName")} error={errorFor("contactName")}
      />
      <TextField
        id="email" label="Email" type="email" required autoComplete="email" inputMode="email" maxLength={254}
        value={values.email} onValueChange={(v) => set("email", v)}
        onBlur={blur("email")} error={errorFor("email")}
      />
      <TextField
        id="phone" label="Phone" type="tel" required autoComplete="tel" inputMode="tel" maxLength={40}
        value={values.phone} onValueChange={(v) => set("phone", v)}
        onBlur={blur("phone")} error={errorFor("phone")}
      />
      <TextField
        id="website" label="Website" className="sm:col-span-2" autoComplete="url" inputMode="url" maxLength={300}
        placeholder="yourbusiness.com"
        value={values.website} onValueChange={(v) => set("website", v)}
        onBlur={blur("website")} error={errorFor("website")}
      />
      <SelectField
        id="businessCategory" label="Business category" required placeholder="Choose one"
        className={values.businessCategory === "Other" ? undefined : "sm:col-span-2"}
        options={CATEGORY_OPTIONS}
        value={values.businessCategory} onValueChange={(v) => set("businessCategory", v)}
        onBlur={blur("businessCategory")} error={errorFor("businessCategory")}
      />
      {values.businessCategory === "Other" && (
        <TextField
          id="businessCategoryOther" label="What kind of business?" required maxLength={100}
          placeholder="Pet grooming"
          value={values.businessCategoryOther} onValueChange={(v) => set("businessCategoryOther", v)}
          onBlur={blur("businessCategoryOther")} error={errorFor("businessCategoryOther")}
        />
      )}
      <TextField
        id="businessCity" label="City" required autoComplete="address-level2" maxLength={100}
        className="sm:col-span-2"
        value={values.businessCity} onValueChange={(v) => set("businessCity", v)}
        onBlur={blur("businessCity")} error={errorFor("businessCity")}
      />
      <SelectField
        id="businessState" label="State" required placeholder="Choose a state" autoComplete="address-level1"
        options={STATE_OPTIONS}
        value={values.businessState} onValueChange={(v) => set("businessState", v)}
        onBlur={blur("businessState")} error={errorFor("businessState")}
      />
      <TextField
        id="businessZip" label="Zip code" required autoComplete="postal-code" inputMode="numeric" maxLength={5}
        value={values.businessZip} onValueChange={(v) => set("businessZip", v.replace(/\D/g, "").slice(0, 5))}
        onBlur={blur("businessZip")} error={errorFor("businessZip")}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Audience
// ---------------------------------------------------------------------------

export function AudienceStep({ values, set, errorFor, blur }: StepProps) {
  const areaType = values.serviceAreaType;
  const ageError = errorFor("targetAgeRanges");
  const allAges = values.targetAgeRanges.length === AGE_RANGES.length;

  const toggleAge = (range: AgeRange, on: boolean) =>
    set(
      "targetAgeRanges",
      on ? AGE_RANGES.filter((r) => r === range || values.targetAgeRanges.includes(r))
        : values.targetAgeRanges.filter((r) => r !== range),
    );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Fieldset id="serviceAreaType-group" legend="Where are your customers?" required error={errorFor("serviceAreaType")}>
          <Segmented
            name="serviceAreaType"
            columns="grid-cols-2 sm:grid-cols-4"
            options={SERVICE_AREA_OPTIONS}
            value={areaType}
            onChange={(v) => set("serviceAreaType", v)}
            error={errorFor("serviceAreaType")}
          />
        </Fieldset>

        {areaType === "radius" ? (
          <TextField
            id="radiusMiles" label="How many miles around your business?" required
            type="number" inputMode="numeric" min={RADIUS_MIN} max={RADIUS_MAX} step={1} suffix="miles"
            className="sm:max-w-xs"
            hint={`Up to ${RADIUS_MAX} miles, centered on your business location.`}
            value={values.radiusMiles} onValueChange={(v) => set("radiusMiles", v)}
            onBlur={blur("radiusMiles")} error={errorFor("radiusMiles")}
          />
        ) : (
          <TextAreaField
            key={areaType}
            id="serviceAreaDetails" label={AREA_DETAILS[areaType].label} required maxLength={1000}
            placeholder={AREA_DETAILS[areaType].placeholder}
            hint="Separate each one with a comma."
            value={values.serviceAreaDetails} onValueChange={(v) => set("serviceAreaDetails", v)}
            onBlur={blur("serviceAreaDetails")} error={errorFor("serviceAreaDetails")}
          />
        )}
      </div>

      <Fieldset
        id="targetAgeRanges-group"
        legend="Ages to reach"
        required
        error={ageError}
        hint="Pick every age group that buys from you."
        action={
          <button
            type="button"
            onClick={() => set("targetAgeRanges", allAges ? [] : [...AGE_RANGES])}
            className="text-sm font-medium text-accent-soft transition-colors hover:text-text"
          >
            {allAges ? "Clear all" : "Select all"}
          </button>
        }
      >
        <div className="flex flex-wrap gap-2">
          {AGE_RANGES.map((range, i) => {
            const checked = values.targetAgeRanges.includes(range);
            return (
              <label
                key={range}
                className={cn(
                  choiceClass(checked, !!ageError),
                  "inline-flex h-11 min-w-[4.75rem] items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium",
                )}
              >
                <input
                  type="checkbox"
                  id={i === 0 ? "targetAgeRanges" : `targetAgeRanges-${range}`}
                  name="targetAgeRanges"
                  value={range}
                  checked={checked}
                  onChange={(e) => toggleAge(range, e.target.checked)}
                  aria-invalid={ageError ? true : undefined}
                  className="sr-only"
                />
                {checked && (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="-ml-1 size-3.5 text-accent-soft">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {range}
              </label>
            );
          })}
        </div>
      </Fieldset>

      <Fieldset id="targetGender-group" legend="Who to reach" required error={errorFor("targetGender")}>
        <Segmented
          name="targetGender"
          columns="grid-cols-3 sm:max-w-sm"
          options={GENDER_OPTIONS}
          value={values.targetGender}
          onChange={(v) => set("targetGender", v)}
          error={errorFor("targetGender")}
        />
      </Fieldset>

      <SelectField
        id="targetHouseholdIncome" label="Household income" className="sm:max-w-xs"
        options={INCOME_OPTIONS}
        value={values.targetHouseholdIncome} onValueChange={(v) => set("targetHouseholdIncome", v)}
        onBlur={blur("targetHouseholdIncome")} error={errorFor("targetHouseholdIncome")}
      />

      <TextAreaField
        id="targetInterests" label="Interests" maxLength={1000}
        placeholder="home improvement, outdoor living"
        hint="What are your best customers into? We'll use this to fine-tune who sees your ad."
        value={values.targetInterests} onValueChange={(v) => set("targetInterests", v)}
        onBlur={blur("targetInterests")} error={errorFor("targetInterests")}
      />

      <StartDate values={values} set={set} errorFor={errorFor} blur={blur} />
    </div>
  );
}

function StartDate({ values, set, errorFor, blur }: StepProps) {
  const error = errorFor("preferredStart");
  const options: ReadonlyArray<{ value: FormValues["startMode"]; label: string }> = [
    { value: "asap", label: "As soon as possible" },
    { value: "date", label: "Pick a date" },
  ];
  return (
    <Fieldset id="startMode-group" legend="When do you want to start?" required>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => {
          const selected = values.startMode === o.value;
          return (
            <label
              key={o.value}
              className={cn(choiceClass(selected), "flex min-h-12 items-center gap-3 px-4 text-[15px] font-medium")}
            >
              <input
                type="radio"
                id={i === 0 ? "startMode" : `startMode-${o.value}`}
                name="startMode"
                value={o.value}
                checked={selected}
                onChange={() => set("startMode", o.value)}
                className="sr-only"
              />
              <RadioDot selected={selected} />
              {o.label}
            </label>
          );
        })}
      </div>
      {values.startMode === "date" && (
        <div className="mt-4 sm:max-w-xs">
          <label htmlFor="preferredStart" className="mb-2 block text-sm font-medium text-text">
            Start date
          </label>
          <input
            id="preferredStart"
            name="preferredStart"
            type="date"
            min={todayLocalISO()}
            value={values.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            onBlur={blur("preferredStart")}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "preferredStart-error" : undefined}
            aria-required
            className={inputClass(error, "h-12 [color-scheme:dark]")}
          />
          <FieldError id="preferredStart" error={error} />
        </div>
      )}
    </Fieldset>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Commercial
// ---------------------------------------------------------------------------

const CREATIVE_OPTIONS = [
  {
    value: "have",
    title: "I have a commercial",
    body: "Send us a link to your :30 spot.",
    icon: (
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 11.5v-6ZM8.5 6.8v3.4L11.5 8.5 8.5 6.8ZM7 15.5h6" />
    ),
  },
  {
    value: "need",
    title: "I need a commercial",
    body: "No problem. We'll talk it through with you.",
    icon: <path d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2M5.4 5.4l1.4 1.4M13.2 13.2l1.4 1.4M5.4 14.6l1.4-1.4M13.2 6.8l1.4-1.4" />,
  },
] as const;

export function CommercialStep({ values, set, errorFor, blur }: StepProps) {
  const statusError = errorFor("creativeStatus");
  return (
    <div className="space-y-8">
      <Fieldset id="creativeStatus-group" legend="Do you have a commercial ready?" required error={statusError}>
        <div className="grid gap-3 sm:grid-cols-2">
          {CREATIVE_OPTIONS.map((o, i) => {
            const selected = values.creativeStatus === o.value;
            return (
              <label key={o.value} className={cn(choiceClass(selected, !!statusError), "flex gap-4 p-4 sm:p-5")}>
                <input
                  type="radio"
                  id={i === 0 ? "creativeStatus" : `creativeStatus-${o.value}`}
                  name="creativeStatus"
                  value={o.value}
                  checked={selected}
                  onChange={() => set("creativeStatus", o.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    selected ? "border-accent/40 bg-accent/15 text-accent-soft" : "border-border-bright text-text-dim",
                  )}
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    {o.icon}
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-base font-semibold text-text">{o.title}</span>
                    <RadioDot selected={selected} />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-text-dim">{o.body}</span>
                </span>
              </label>
            );
          })}
        </div>
      </Fieldset>

      {values.creativeStatus === "have" && (
        <div className="space-y-5">
          <TextField
            id="creativeLink" label="Link to your commercial" required type="url" inputMode="url" maxLength={500}
            placeholder="Google Drive or Dropbox share link"
            hint={<>In your sharing settings, set access to &quot;anyone with the link&quot; so we can open it.</>}
            value={values.creativeLink} onValueChange={(v) => set("creativeLink", v)}
            onBlur={blur("creativeLink")} error={errorFor("creativeLink")}
          />
          <CheckboxField
            id="creativeSpecsConfirmed"
            required
            checked={values.creativeSpecsConfirmed}
            onCheckedChange={(v) => set("creativeSpecsConfirmed", v)}
            error={errorFor("creativeSpecsConfirmed")}
          >
            My commercial is :30 seconds and 1080p
          </CheckboxField>
        </div>
      )}

      {values.creativeStatus === "need" && (
        <div className="space-y-3">
          <TextAreaField
            id="creativeNotes" label="Anything we should know?" maxLength={2000}
            placeholder="Offer, tone, ideas."
            value={values.creativeNotes} onValueChange={(v) => set("creativeNotes", v)}
            onBlur={blur("creativeNotes")} error={errorFor("creativeNotes")}
          />
          <p className="flex gap-2.5 rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-text-dim">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-soft">
              <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.9 12H9.1V9h1.8v5Zm0-6.5H9.1V5.8h1.8v1.7Z" />
            </svg>
            We&apos;ll reach out after you sign up to talk through options.
          </p>
        </div>
      )}

      <TextAreaField
        id="additionalNotes" label="Anything else?" maxLength={2000}
        placeholder="Questions, timing, or anything else we should know."
        value={values.additionalNotes} onValueChange={(v) => set("additionalNotes", v)}
        onBlur={blur("additionalNotes")} error={errorFor("additionalNotes")}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5: Review
// ---------------------------------------------------------------------------

function formatStart(v: FormValues): string {
  if (v.startMode === "asap") return "As soon as possible";
  if (!v.startDate) return "Not set";
  const date = new Date(`${v.startDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return v.startDate;
  return date.toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" });
}

function areaSummary(v: FormValues): string {
  if (v.serviceAreaType === "radius") {
    const where = [v.businessCity.trim(), v.businessState].filter(Boolean).join(", ");
    return `${v.radiusMiles || "?"} miles around ${where || "your business"}`;
  }
  const label = SERVICE_AREA_OPTIONS.find((o) => o.value === v.serviceAreaType)?.label ?? "";
  return `${label}: ${v.serviceAreaDetails.trim()}`;
}

type Row = [label: string, value: ReactNode];

function ReviewGroup({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: Row[];
  onEdit: () => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-white/[0.02] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md text-sm font-medium text-accent-soft transition-colors hover:text-text"
        >
          Edit<span className="sr-only"> {title.toLowerCase()}</span>
        </button>
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-[10rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-text-muted">{label}</dt>
            <dd className="-mt-2 break-words text-text sm:mt-0">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReviewStep({
  values,
  set,
  errorFor,
  goTo,
}: StepProps & { goTo: (step: number) => void }) {
  const pkg = getPackageById(values.packageId);
  const dash = <span className="text-text-muted">Not provided</span>;
  const opt = (s: string) => (s.trim() ? s.trim() : dash);
  const category =
    values.businessCategory === "Other" ? `Other: ${values.businessCategoryOther.trim()}` : values.businessCategory;
  const stateName = US_STATES.find(([code]) => code === values.businessState)?.[1] ?? values.businessState;
  const website = withProtocol(values.website);

  return (
    <div className="space-y-4">
      <ReviewGroup
        title="Your package"
        onEdit={() => goTo(0)}
        rows={[
          ["Plan", pkg ? `${pkg.label}: ${formatImpressions(pkg.impressions)} impressions per month` : ""],
          ["Monthly price", pkg ? `${formatPrice(pkg.monthlyPrice)}/month` : ""],
        ]}
      />
      <ReviewGroup
        title="Your business"
        onEdit={() => goTo(1)}
        rows={[
          ["Business", values.businessName.trim()],
          ["Contact", values.contactName.trim()],
          ["Email", values.email.trim()],
          ["Phone", values.phone.trim()],
          ["Website", website || dash],
          ["Category", category],
          ["Location", `${values.businessCity.trim()}, ${stateName} ${values.businessZip}`],
        ]}
      />
      <ReviewGroup
        title="Who to reach"
        onEdit={() => goTo(2)}
        rows={[
          ["Area", areaSummary(values)],
          ["Ages", values.targetAgeRanges.join(", ")],
          ["Gender", GENDER_OPTIONS.find((g) => g.value === values.targetGender)?.label ?? ""],
          ["Household income", values.targetHouseholdIncome || "Any"],
          ["Interests", opt(values.targetInterests)],
          ["Start", formatStart(values)],
        ]}
      />
      <ReviewGroup
        title="Your commercial"
        onEdit={() => goTo(3)}
        rows={[
          ["Commercial", values.creativeStatus === "have" ? "I have a commercial" : "I need a commercial"],
          ...(values.creativeStatus === "have"
            ? ([["Link", withProtocol(values.creativeLink)]] as Row[])
            : ([["Notes", opt(values.creativeNotes)]] as Row[])),
          ["Anything else", opt(values.additionalNotes)],
        ]}
      />

      <div className="pt-4">
        <CheckboxField
          id="termsAccepted"
          required
          checked={values.termsAccepted}
          onCheckedChange={(v) => set("termsAccepted", v)}
          error={errorFor("termsAccepted")}
        >
          I understand my plan is billed monthly starting today and renews automatically until canceled, and
          that cancellation requires 30 days&apos; notice.
        </CheckboxField>
      </div>
    </div>
  );
}
