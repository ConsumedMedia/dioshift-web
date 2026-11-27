/**
 * Industries Dioshift writes about. Each one is a tile on the homepage and
 * /industries. Published entries also get a full page at
 * /industries/[slug], built from `content` below. Unpublished entries show
 * as a tile with no link, and their URL returns 404.
 *
 * To publish one: set `published: true` and fill in `content`. The page,
 * sitemap entry and llms.txt link follow automatically.
 *
 * Copy rules: plain language, no invented statistics or results, timing
 * framed as common patterns rather than guarantees.
 */
import type { FaqItem } from "@/lib/faq";
import type { PackageId } from "@/lib/packages";

export type TargetingSetup = {
  name: string;
  location: string;
  ageRange: string;
  interests: string;
  /** One line on why this setup makes sense. */
  why: string;
};

export type TimingWindow = { title: string; body: string };

export type ScriptBeat = {
  label: "Hook" | "What you do" | "Why you" | "Call to action";
  /** Rough time in the :30 spot, e.g. "0:00 to 0:05". */
  time: string;
  direction: string;
  /** Sample line. Square brackets are placeholders for the business. */
  example: string;
};

export type IndustryContent = {
  /** Page title, before the " | Dioshift" suffix. Keep it under 49 characters. */
  metaTitle: string;
  /** 120 to 155 characters. */
  metaDescription: string;
  /** Who the page is for, used as the schema.org audience. */
  audience: string;
  headline: string;
  intro: string;
  whyItFits: { title: string; body: string }[];
  targetingIntro: string;
  targeting: TargetingSetup[];
  timingIntro: string;
  timing: TimingWindow[];
  timingNote: string;
  scriptIntro: string;
  script: ScriptBeat[];
  scriptTips: string[];
  planFit: {
    packageId: PackageId;
    body: string;
    stepUp: { packageId: PackageId; body: string };
  };
  faqs: FaqItem[];
};

type IndustryBase = {
  slug: string;
  name: string;
  shortDescription: string;
};

export type PublishedIndustry = IndustryBase & { published: true; content: IndustryContent };
export type UnpublishedIndustry = IndustryBase & { published: false };
export type Industry = PublishedIndustry | UnpublishedIndustry;

export const INDUSTRIES: Industry[] = [
  {
    slug: "roofing-home-services",
    name: "Roofing and Home Services",
    shortDescription: "Stay top of mind with homeowners in the neighborhoods you work.",
    published: true,
    content: {
      metaTitle: "Streaming TV Ads for Roofing and Home Services",
      metaDescription:
        "Streaming TV ads for roofers, HVAC, siding and other home service pros. Target the zip codes you serve. Prices on the page, no contract.",
      audience: "Roofing contractors and home service businesses",
      headline: "Streaming TV for roofers and home service pros.",
      intro:
        "Homeowners don't hire a roofer off one ad. They call the name they've seen around, the one that feels established. Streaming TV puts your name on the biggest screen in their house, in the neighborhoods you actually work.",
      whyItFits: [
        {
          title: "Big jobs need trust first",
          body: "A new roof, furnace or set of windows is a big purchase, and homeowners take their time deciding. Being on TV makes your company feel established before they ever pick up the phone.",
        },
        {
          title: "You serve a map, not a market",
          body: "You know which towns you'll drive to and which you won't. We target your ad to those zip codes, cities or counties, so you aren't paying to reach households you'd never work for.",
        },
        {
          title: "Nobody thinks about their roof until it leaks",
          body: "The moment a homeowner needs you is hard to predict. A steady presence on TV means your name is already familiar when the ceiling stains or the AC quits in July.",
        },
        {
          title: "The decision makers are at home",
          body: "Your ad plays inside the house you want to work on, while the people who decide on the project are sitting in it. That's a different moment than a phone feed on a lunch break.",
        },
      ],
      targetingIntro:
        "Here are a few example setups. They're starting points, not rules. Tell us who your best customers are on the signup form and we'll build your targeting around them.",
      targeting: [
        {
          name: "Residential roofing, core service area",
          location: "The zip codes within your normal driving range, for example 20 to 25 miles from your shop",
          ageRange: "35 to 64",
          interests: "Home improvement, home and garden",
          why: "Aims at people likely to own their home and be planning work on it, close enough that you want the job.",
        },
        {
          name: "Storm response",
          location: "The specific zip codes a recent hail or wind storm came through",
          ageRange: "35 and up",
          interests: "Home improvement, home repair",
          why: "Puts your name in front of the neighborhoods dealing with damage, instead of your whole area.",
        },
        {
          name: "HVAC, plumbing or electrical across the metro",
          location: "The counties you serve, for example Franklin, Delaware and Licking",
          ageRange: "30 to 64",
          interests: "Home improvement, home and garden",
          why: "A wider area fits trades that take calls from all over, with age and interests keeping it focused on homeowners.",
        },
      ],
      timingIntro:
        "Home service work in Ohio follows the weather. These are the stretches when businesses in this industry usually push hardest.",
      timing: [
        {
          title: "Spring",
          body: "Once the weather breaks, homeowners start looking at what winter did to their roof, siding and gutters. Many contractors start advertising in March or April so they're top of mind as the schedule fills up.",
        },
        {
          title: "Late summer into fall",
          body: "The push before cold weather. Homeowners want the roof done, the furnace checked and the windows sealed before winter. For a lot of contractors this runs from August through October.",
        },
        {
          title: "After major storms",
          body: "After a hail or wind storm, homeowners in the affected neighborhoods start looking for help quickly. It pays to already be running when it happens. Talk to us about shifting your targeting toward the zip codes that were hit.",
        },
      ],
      timingNote:
        "These are common patterns, not guarantees. Your own busy season might look different. Plans are month to month, so you can move to a bigger or smaller package as the year goes. Just contact us.",
      scriptIntro:
        "A :30 spot is short. Here's a simple outline that works for most home service businesses. Swap in your own details, and only say what's true for your company.",
      script: [
        {
          label: "Hook",
          time: "0:00 to 0:05",
          direction: "Name a problem the homeowner can picture.",
          example: "Shingles in the yard after last week's storm? Water spot on the ceiling?",
        },
        {
          label: "What you do",
          time: "0:05 to 0:15",
          direction: "Say what you do and where, with your name and logo on screen.",
          example: "[Company name] repairs and replaces roofs across [your area]. Local crews, [number] years in business.",
        },
        {
          label: "Why you",
          time: "0:15 to 0:23",
          direction: "One or two real reasons to pick you over the next truck.",
          example: "Free inspections. Licensed and insured. We'll walk you through the insurance claim.",
        },
        {
          label: "Call to action",
          time: "0:23 to 0:30",
          direction: "One action, with your phone number or web address on screen until the end.",
          example: "Call [phone number] or visit [web address] to book your free inspection.",
        },
      ],
      scriptTips: [
        "Show your trucks, yard signs and crew shirts early. People recognize them from around town.",
        "Real jobs and real crews feel more trustworthy than stock footage.",
        "Leave the phone number or web address on screen for the last several seconds, in large type.",
        "Skip the fine print. If an offer needs a paragraph of conditions, it's the wrong offer for a :30 spot.",
      ],
      planFit: {
        packageId: "100k",
        body: "If you serve one county or a set of nearby zip codes, the Local plan is a sensible place to start. It's enough to run steadily across your area every month.",
        stepUp: {
          packageId: "150k",
          body: "Covering several counties, or heading into spring or fall? Stepping up to Growth gives your ad more plays across the bigger area.",
        },
      },
      faqs: [
        {
          id: "roofing-target-neighborhoods",
          question: "Can I target only the neighborhoods I want to work in?",
          answer:
            "Yes. You can target by zip code, city, county or a radius around your shop. Pick the zip codes you actually drive to, and your ad won't reach homes outside your service area.",
        },
        {
          id: "roofing-storm-only",
          question: "Should I only run ads after a storm?",
          answer:
            "You can, but you'd be starting from zero right when everyone else is advertising too. Running steadily means homeowners already know your name when they need you. Plans are month to month, so you can step up to a bigger package in storm season and back down after.",
        },
        {
          id: "roofing-multiple-services",
          question: "I do roofing, siding and gutters. Can one commercial cover all of it?",
          answer:
            "It can mention all three, but lead with one. A :30 spot works best with one clear message. Pick the service you most want more of, make that the focus, and list the rest briefly near the end.",
        },
      ],
    },
  },
  {
    slug: "auto-dealers",
    name: "Auto Dealers",
    shortDescription: "Keep your store in front of car shoppers within driving distance.",
    published: true,
    content: {
      metaTitle: "Streaming TV Ads for Auto Dealers",
      metaDescription:
        "Streaming TV ads for car dealers. Reach shoppers around your store, push month-end and holiday events, and pick a plan with prices on the page.",
      audience: "Auto dealers",
      headline: "Streaming TV for auto dealers.",
      intro:
        "Car shoppers do a lot of homework before they ever walk the lot. Streaming TV keeps your store's name in front of them at home while they decide, aimed at the area your buyers come from instead of the whole market.",
      whyItFits: [
        {
          title: "Cars look good on a big screen",
          body: "A vehicle walkaround or a lot full of inventory is made for TV. Your spot plays full screen in the living room, and most streaming ads can't be skipped.",
        },
        {
          title: "Reach the drive you can win",
          body: "Target a radius around your store, or the zip codes your buyers tend to come from, instead of paying for every household in range.",
        },
        {
          title: "Not just the sales floor",
          body: "Service, parts and tires keep customers coming back between purchases. A service spot keeps your name in front of the owners who already bought from you.",
        },
        {
          title: "Steady presence, room to push",
          body: "Run every month to stay familiar, then step up to a bigger plan for event months. Plans are month to month, so you aren't locked into a schedule.",
        },
      ],
      targetingIntro:
        "A few example setups to start from. Your store, your brands and your buyers will shape the real thing. Tell us on the signup form and we'll set it up.",
      targeting: [
        {
          name: "New and used sales around the store",
          location: "A 15 to 30 mile radius around the dealership",
          ageRange: "25 to 64",
          interests: "Autos, car shopping",
          why: "Reaches people within a realistic drive who are into vehicles, without spending on the far side of the market.",
        },
        {
          name: "Truck and SUV focus",
          location: "The suburban and rural zip codes around your store",
          ageRange: "30 to 64",
          interests: "Trucks, outdoor recreation, home improvement",
          why: "Fits a truck-heavy lineup or a truck event, aimed at the households most likely to want one.",
        },
        {
          name: "Service department",
          location: "The zip codes within 10 to 15 miles of the store",
          ageRange: "30 and up",
          interests: "Autos, auto maintenance",
          why: "Service is usually a close-to-home errand, so a tighter area keeps the budget where it counts.",
        },
      ],
      timingIntro:
        "Car sales have a rhythm. These are the times dealers commonly push hardest.",
      timing: [
        {
          title: "Month-end and quarter-end",
          body: "Dealers often push as monthly and quarterly goals close out. Being on screen in the days leading up to it helps bring people in when you're most ready to make a deal.",
        },
        {
          title: "Holiday weekends",
          body: "Holiday weekend sales events are a long-running part of car shopping. Memorial Day, the Fourth of July, Labor Day and the end of the year are common ones.",
        },
        {
          title: "Model year changeover",
          body: "When the new model year arrives, there's outgoing inventory to move. Late summer into fall is a common window, though it varies by brand.",
        },
      ],
      timingNote:
        "These are common patterns, not guarantees. Your plan's impressions are delivered across the month, so a spot for a short event will keep playing after the event ends. Plan your message for that, or contact us to talk timing.",
      scriptIntro:
        "Here's a simple outline for a :30 dealer spot. Swap in your own store, inventory and reasons. Only say what's true for your store.",
      script: [
        {
          label: "Hook",
          time: "0:00 to 0:05",
          direction: "Lead with what's happening, or the reason to come in now.",
          example: "It's the [Store name] year-end event, and we need to make room.",
        },
        {
          label: "What you do",
          time: "0:05 to 0:15",
          direction: "Show the inventory and the store, with your name and location on screen.",
          example: "New [brand] trucks and SUVs, plus [number] used vehicles, all at [Store name] on [road] in [city].",
        },
        {
          label: "Why you",
          time: "0:15 to 0:23",
          direction: "Why your store, not the one down the road.",
          example: "Family owned since [year]. Straightforward pricing. A service department that knows your vehicle.",
        },
        {
          label: "Call to action",
          time: "0:23 to 0:30",
          direction: "One action, with your web address on screen until the end.",
          example: "Shop [web address] or stop by [Store name] this weekend.",
        },
      ],
      scriptTips: [
        "Put the store name and location on screen in the first few seconds.",
        "If you mention financing or lease terms, the required disclosures need to be on screen long enough to read. Check them with whoever handles compliance for your store.",
        "Keep one evergreen spot about the store itself. It can run any month without going stale.",
        "Show the real lot and the real people. Viewers recognize the store when they drive past.",
      ],
      planFit: {
        packageId: "150k",
        body: "For a single store reaching a realistic drive around the lot, the Growth plan is a solid starting point. It gives your ad steady reach across the area every month.",
        stepUp: {
          packageId: "200k",
          body: "Wider radius, more than one rooftop, or a big event month? Expanded gives you more plays when you need them.",
        },
      },
      faqs: [
        {
          id: "auto-target-radius",
          question: "Can we target just the area around our dealership?",
          answer:
            "Yes. You can target a radius around the store, specific zip codes, cities or counties. A common approach is to start with a radius, then add or drop zip codes based on where your buyers actually come from.",
        },
        {
          id: "auto-event-spot",
          question: "Can we run a commercial for a sales event?",
          answer:
            "Yes. Keep in mind that your impressions are delivered across the whole month, so the spot will keep playing after a short event ends. A month-long event fits well. For a single weekend, try a spot that works before and after it, like one about the store with the event as a mention.",
        },
        {
          id: "auto-service-spot",
          question: "Can we advertise our service department instead of sales?",
          answer:
            "Yes. The commercial is yours, so it can be about service, parts or tires. Keep it to one clear message, and consider a tighter area, since service is usually a close-to-home errand.",
        },
      ],
    },
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    shortDescription: "Stay on the minds of diners who live and work near you.",
    published: false,
  },
  {
    slug: "healthcare-med-spas",
    name: "Healthcare and Med Spas",
    shortDescription: "Build familiarity with patients in the neighborhoods you serve.",
    published: false,
  },
  {
    slug: "legal",
    name: "Legal",
    shortDescription: "Be the name people recognize when they need an attorney.",
    published: false,
  },
  {
    slug: "retail",
    name: "Retail",
    shortDescription: "Bring in shoppers from the zip codes around your store.",
    published: false,
  },
];

export const PUBLISHED_INDUSTRIES: PublishedIndustry[] = INDUSTRIES.filter(
  (industry): industry is PublishedIndustry => industry.published,
);

/** "/industries/auto-dealers" */
export const industryPath = (slug: string) => `/industries/${slug}`;

/** A published industry by slug. Unpublished or unknown slugs return undefined. */
export function getPublishedIndustry(slug: string): PublishedIndustry | undefined {
  return PUBLISHED_INDUSTRIES.find((industry) => industry.slug === slug);
}
