
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}

export enum DepositStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  fatherPhone: string;
  motherPhone: string;
  role: UserRole;
  balance: number;
  purchasedLessons: string[]; // IDs of lessons
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  price: number;
  viewLimit: number;
  videoUrl: string; // Blob URL
  thumbnail: string; // Blob URL or placeholder
}

export interface UserLessonActivity {
  userId: string;
  lessonId: string;
  viewsUsed: number;
  purchaseDate: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  status: DepositStatus;
  createdAt: string;
}

export interface AppState {
  users: User[];
  lessons: Lesson[];
  activity: UserLessonActivity[];
  depositRequests: DepositRequest[];
  currentUser: User | null;
}
