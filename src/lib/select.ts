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
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Finance", label: "Finance" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "IT", label: "IT" },
  { value: "Legal", label: "Legal" },
  { value: "Operations", label: "Operations" },
  { value: "Research and Development", label: "Research and Development" },
];

export const Jobs: { [key: string]: { value: string; label: string }[] } = {
  Development: [
    { value: "Dev", label: "Developer" },
    { value: "QA", label: "Quality Assurance" },
    { value: "DevOps", label: "DevOps Engineer" },
    { value: "Frontend", label: "Frontend Developer" },
    { value: "Backend", label: "Backend Developer" },
  ],
  "Human Resources": [
    { value: "HR", label: "HR Specialist" },
    { value: "Recruiter", label: "Recruiter" },
    { value: "HRBP", label: "HR Business Partner" },
  ],
  "Business Analysis": [
    { value: "BA", label: "Business Analyst" },
    { value: "PM", label: "Project Manager" },
    { value: "ProductOwner", label: "Product Owner" },
  ],
  Sales: [
    { value: "SalesRep", label: "Sales Representative" },
    { value: "AccountManager", label: "Account Manager" },
    { value: "SalesExec", label: "Sales Executive" },
  ],
  Marketing: [
    { value: "SEO", label: "SEO Specialist" },
    { value: "Content", label: "Content Marketing" },
    { value: "Digital", label: "Digital Marketing" },
  ],
  Finance: [
    { value: "Accountant", label: "Accountant" },
    { value: "FinancialAnalyst", label: "Financial Analyst" },
    { value: "Controller", label: "Financial Controller" },
  ],
  "Customer Support": [
    { value: "SupportRep", label: "Support Representative" },
    { value: "CustomerSuccess", label: "Customer Success Manager" },
  ],
  IT: [
    { value: "SysAdmin", label: "System Administrator" },
    { value: "NetworkEngineer", label: "Network Engineer" },
    { value: "ITSupport", label: "IT Support Specialist" },
  ],
  Legal: [
    { value: "LegalAdvisor", label: "Legal Advisor" },
    { value: "Paralegal", label: "Paralegal" },
  ],
  Operations: [
    { value: "OperationsManager", label: "Operations Manager" },
    { value: "Logistics", label: "Logistics Coordinator" },
  ],
  "Research and Development": [
    { value: "R&DEngineer", label: "R&D Engineer" },
    { value: "Scientist", label: "Research Scientist" },
  ],
};
