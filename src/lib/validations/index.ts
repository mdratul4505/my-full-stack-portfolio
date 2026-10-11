import { z } from "zod";

export const SKILL_CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Database",
  "Tools & Version Control",
] as const;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(60, "Skill name too long").trim(),
  category: z.enum(SKILL_CATEGORIES),
  icon: z.string().trim().optional().nullable(),
  proficiency: z.string().trim().optional().nullable(),
  order: z.coerce.number().int().min(0, "Order must be 0 or greater").default(0),
  isPublished: z.boolean().default(true),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens")
    .trim(),
  description: z.string().min(5, "Description must be at least 5 characters").trim(),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => !val || val === "" || /^https?:\/\//i.test(val) || val.startsWith("/"), {
      message: "Please enter a valid URL or path",
    }),
  technologies: z
    .array(z.string().min(1))
    .min(1, "At least one technology is required")
    .or(
      z.string().transform((str) =>
        str
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    ),
  liveUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => !val || val === "" || /^https?:\/\//i.test(val), {
      message: "Live URL must start with http:// or https://",
    }),
  githubUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => !val || val === "" || /^https?:\/\//i.test(val), {
      message: "GitHub URL must start with http:// or https://",
    }),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required").trim(),
  department: z.string().min(1, "Department is required").trim(),
  degree: z.string().trim().optional().nullable(),
  semester: z.string().trim().optional().nullable(),
  startYear: z.string().trim().optional().nullable(),
  endYear: z.string().trim().optional().nullable(),
  cgpa: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
});

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  headline: z.string().min(1, "Headline is required").trim(),
  shortBio: z.string().min(1, "Short bio is required").trim(),
  aboutText: z.string().min(1, "About text is required").trim(),
  profileImage: z.string().trim().optional().nullable(),
  resumeUrl: z.string().trim().optional().nullable(),
  email: z.string().email("Invalid primary email").trim(),
  contactEmail: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => !val || val === "" || z.string().email().safeParse(val).success, {
      message: "Invalid contact email address",
    }),
  phone: z.string().trim().optional().nullable(),
  githubUrl: z.string().trim().optional().nullable(),
  linkedinUrl: z.string().trim().optional().nullable(),
  twitterUrl: z.string().trim().optional().nullable(),
  availableForWork: z.boolean().default(true),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name too long").trim(),
  email: z.string().email("Please provide a valid email address").trim().toLowerCase(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150, "Subject too long").trim(),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000, "Message too long").trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
