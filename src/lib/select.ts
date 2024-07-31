import { UserRole } from "@prisma/client";
import { Option } from "../components/ui/multipleSelect";

export const SelectRole = [
  {
    value: UserRole.Trainee,
    role: UserRole.Trainee,
  },
  {
    value: UserRole.Employe,
    role: UserRole.Employe,
  },
];

export const OPTIONS: Option[] = [
  { label: "nextjs", value: "Nextjs" },
  { label: "React", value: "react" },
  { label: "Remix", value: "remix" },
  { label: "Vite", value: "vite" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Ember", value: "ember", disable: true },
  { label: "Gatsby", value: "gatsby", disable: true },
  { label: "Astro", value: "astro" },
];

export const SelectLevel = [
  {
    value: "Admin",
    level: "Admin",
  },
  {
    value: "General",
    level: "General",
  },
];

export const DepartMent = [
  { value: "Development", label: "Development" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Business Analysis", label: "Business Analysis" },
];

export const Jobs: { [key: string]: { value: string; label: string }[] } = {
  Development: [
    { value: "Dev", label: "Developer" },
    { value: "QA", label: "Quality Assurance" },
  ],
  "Human Resources": [
    { value: "HR", label: "HR Specialist" },
    { value: "Recruiter", label: "Recruiter" },
  ],
  "Business Analysis": [
    { value: "BA", label: "Business Analyst" },
    { value: "PM", label: "Project Manager" },
  ],
};
