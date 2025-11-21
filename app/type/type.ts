export type employee = {
    id: number;
    name: string;
    departmentId: number;
    sectionId: number | null;
    positionId: number | null;
    jobTypeId: number | null;
};

// 社員情報
export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
}

//　報奨金ランク
export interface Certification {
  id: string;
  name: string;
  rewardRank: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
}

// 資格取得記録情報
export interface CertificationRecord {
  id: string;
  employeeId: string;
  certificationId: string;
  obtainedDate: string;
}

// 部門情報
export interface Department {
  id: number;
  name: string;
}

// 課情報
export interface Section {
    id: number;
    name: string;
    departmentId: number;
}

// 職位情報
export interface Position {
    id: number;
    name: string;
}
// 資格区分
export interface Category {
    id: number;
    name: string;
}