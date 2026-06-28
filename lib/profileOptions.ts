/**
 * Options for the optional profile / segmentation fields and the communication
 * streams. Used by the signup form and the profile page. Kept in one place so
 * the labels stay consistent (and match the consent_events channels / metadata).
 */

export const INDUSTRIES = [
  "Manufacturing",
  "Food & drink",
  "Healthcare",
  "Education",
  "Public sector",
  "Commercial / offices",
  "Retail",
  "Hospitality & leisure",
  "Utilities & energy",
  "Logistics & transport",
  "Other",
];

export const JOB_ROLES = [
  "Energy manager",
  "Facilities / estates",
  "Engineer",
  "Operations / production",
  "Sustainability / ESG",
  "Director / leadership",
  "Consultant",
  "Student / academic",
  "Other",
];

export const TOPICS = [
  "Boilers & steam",
  "HVAC",
  "Motors & drives",
  "Compressed air",
  "Refrigeration",
  "Lighting",
  "Insulation",
  "Renewables & heat pumps",
  "Net zero & carbon",
  "Energy finance & investment",
  "Procurement & policy",
];

/** Communication streams — each is a separate, freely-given consent. */
export const COMMS_STREAMS = [
  {
    key: "comms_updates" as const,
    label: "Course & platform updates",
    description: "New courses, features and content on the learning platform.",
  },
  {
    key: "comms_newsletter" as const,
    label: "Newsletter & energy tips",
    description: "Regular energy-management insights, tips and articles.",
  },
  {
    key: "comms_consulting" as const,
    label: "Consulting & services",
    description: "Occasional information and offers about our consulting and professional services.",
  },
  {
    key: "comms_events" as const,
    label: "Events & webinars",
    description: "Invitations to events, webinars and training sessions.",
  },
];

export type CommsKey = (typeof COMMS_STREAMS)[number]["key"];
