export interface JobApplicant {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: "model" | "photographer";
  avatar: string;
  pitchNote: string;
  proposedPrice: string;
  appliedAt: string;
  status: "pending" | "hired" | "declined";
}

export interface JobPosting {
  id: string;
  title: string;
  category: "apparel" | "commercial" | "lookbook" | "short_video";
  targetRole: "model" | "photographer" | "both";
  budget: string;
  shootDate: string;
  location: string;
  description: string;
  moodboardImages: string[];
  status: "open" | "in_review" | "closed";
  createdAt: string;
  applicants: JobApplicant[];
}