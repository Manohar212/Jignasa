export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Lecture {
  id: string;
  title: string;
  professor: string;
  time: string;
  date: string;
  room?: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
}

export interface Group {
  id: string;
  name: string;
  code: string;
  studentsCount: number;
  professor: string;
}
