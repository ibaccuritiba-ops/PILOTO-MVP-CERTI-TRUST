export type UserRole = 'DIRECTOR' | 'PROFESSOR' | 'STUDENT';

export type UserStatus = 'ACTIVE' | 'PAUSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: UserStatus;
  allowedLessons?: string[]; // IDs of ContentItems the student can access
  hasFacialTemplate?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  completed: boolean;
  content: ContentItem[];
}

export interface ContentItem {
  id: string;
  type: 'pdf' | 'html' | 'video' | 'live';
  title: string;
  url?: string;
  body?: string;
  youtubeId?: string;
  videoUrl?: string;
  isNativeLive?: boolean;
  materialUrl?: string; // Mandatory educational material
}

export interface ChatMessage {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
  role: UserRole;
  isDeleted?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

export interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  validationCode: string;
  institutionName: string;
  logoUrl: string;
}

export interface WhiteLabelConfig {
  institutionName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  faviconUrl: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'APPROVAL' | 'REJECTION' | 'CERTIFICATE';
  subject: string;
  body: string;
}
