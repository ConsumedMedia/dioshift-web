import type { PackageId } from "@/lib/packages";
import type {
  AgeRange,
  CreativeStatus,
  Gender,
  ServiceAreaType,
  SignupField,
  SignupInput,
} from "@/lib/signup-schema";

/** Everything the form keeps in state. Kept across steps. */
export type FormValues = {
  packageId: PackageId;

  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  businessCategory: string;
  businessCategoryOther: string;
  businessCity: string;
  businessState: string;
  businessZip: string;

  serviceAreaType: ServiceAreaType;
  radiusMiles: string;
  serviceAreaDetails: string;
  targetAgeRanges: AgeRange[];
  targetGender: Gender;
  targetHouseholdIncome: string;
  targetInterests: string;
  startMode: "asap" | "date";
  startDate: string;

  creativeStatus: CreativeStatus | "";
  creativeLink: string;
  creativeSpecsConfirmed: boolean;
  creativeNotes: string;
  additionalNotes: string;

  termsAccepted: boolean;
};

export function initialValues(packageId: PackageId): FormValues {
  return {
    packageId,
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    businessCategory: "",
    businessCategoryOther: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    serviceAreaType: "radius",
    radiusMiles: "15",
    serviceAreaDetails: "",
    targetAgeRanges: [],
    targetGender: "all",
    targetHouseholdIncome: "",
    targetInterests: "",
    startMode: "asap",
    startDate: "",
    creativeStatus: "",
    creativeLink: "",
    creativeSpecsConfirmed: false,
    creativeNotes: "",
    additionalNotes: "",
    termsAccepted: false,
  };
}

/** Shape sent to the API (and validated by the shared schema). */
export function toPayload(v: FormValues): Record<SignupField, unknown> {
  const { startMode, startDate, ...rest } = v;
  return {
    ...rest,
    preferredStart: startMode === "asap" ? "asap" : startDate,
  } satisfies Record<keyof SignupInput, unknown>;
}

export type Errors = Partial<Record<SignupField, string>>;

/** What each step component needs from the form. */
export type StepProps = {
  values: FormValues;
  set: <K extends keyof FormValues>(field: K, value: FormValues[K]) => void;
  errorFor: (field: SignupField) => string | undefined;
  blur: (field: SignupField) => () => void;
};
