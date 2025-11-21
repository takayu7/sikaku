import { Certification, Employee, CertificationRecord, Department, Position } from "@/app/type/type";

// 資格一覧のサンプルデータ
export const certifications: Certification[] = [
  { id: 'cert1', name: '基本情報技術者', rewardRank: 'B' },
  { id: 'cert2', name: '応用情報技術者', rewardRank: 'A' },
  { id: 'cert3', name: 'AWS認定ソリューションアーキテクト', rewardRank: 'A' },
  { id: 'cert4', name: 'Google Cloud Professional', rewardRank: 'A' },
  { id: 'cert5', name: '情報処理安全確保支援士', rewardRank: 'S' },
  { id: 'cert6', name: 'プロジェクトマネージャ', rewardRank: 'S' },
  { id: 'cert7', name: 'ビジネスマネジャー検定', rewardRank: 'B' },
  { id: 'cert8', name: 'データベーススペシャリスト', rewardRank: 'A' },
  { id: 'cert9', name: 'ネットワークスペシャリスト', rewardRank: 'A' },
  { id: 'cert10', name: 'TOEIC 800点以上', rewardRank: 'B' },
];

// 社員一覧のサンプルデータ
export const employees: Employee[] = [
  { id: 'emp1', name: '山田太郎', department: '開発1課', position: '課長' },
  { id: 'emp2', name: '佐藤花子', department: '開発1課', position: '主任' },
  { id: 'emp3', name: '鈴木一郎', department: '開発2課', position: '部長' },
  { id: 'emp4', name: '田中美咲', department: '開発2課', position: '一般' },
  { id: 'emp5', name: '伊藤健太', department: '開発3課', position: '課長' },
  { id: 'emp6', name: '渡辺真理', department: '開発3課', position: '主任' },
  { id: 'emp7', name: '中村優子', department: 'インフラ課', position: '一般' },
  { id: 'emp8', name: '小林誠', department: 'インフラ課', position: '課長' },
  { id: 'emp9', name: '加藤直樹', department: 'セキュリティ課', position: '部長' },
  { id: 'emp10', name: '吉田恵子', department: 'セキュリティ課', position: '主任' },
  { id: 'emp11', name: '山本翔太', department: '企画部', position: '課長' },
  { id: 'emp12', name: '松本由美', department: '企画部', position: '一般' },
];

export const departments: Department[] = [
  { id: 1, name: '開発1課' },
  { id: 2, name: '開発2課' },
  { id: 3, name: '開発3課' },
  { id: 4, name: 'インフラ課' },
  { id: 5, name: 'セキュリティ課' },
  { id: 6, name: '企画部' },
];
export const positions: Position[] = [
  { id: 1, name: '一般' },
  { id: 2, name: '主任' },
  { id: 3, name: '課長' },
  { id: 4, name: '部長' },
];

// 資格取得記録のサンプルデータ
export const certificationRecords: CertificationRecord[] = [
  // 山田太郎
  { id: 'rec1', employeeId: 'emp1', certificationId: 'cert1', obtainedDate: '2020-04-15' },
  { id: 'rec2', employeeId: 'emp1', certificationId: 'cert2', obtainedDate: '2021-06-20' },
  { id: 'rec3', employeeId: 'emp1', certificationId: 'cert6', obtainedDate: '2023-03-10' },
  { id: 'rec4', employeeId: 'emp1', certificationId: 'cert7', obtainedDate: '2024-01-15' },
  
  // 佐藤花子
  { id: 'rec5', employeeId: 'emp2', certificationId: 'cert1', obtainedDate: '2021-10-05' },
  { id: 'rec6', employeeId: 'emp2', certificationId: 'cert3', obtainedDate: '2023-08-22' },
  { id: 'rec7', employeeId: 'emp2', certificationId: 'cert10', obtainedDate: '2022-05-30' },
  
  // 鈴木一郎
  { id: 'rec8', employeeId: 'emp3', certificationId: 'cert1', obtainedDate: '2018-04-10' },
  { id: 'rec9', employeeId: 'emp3', certificationId: 'cert2', obtainedDate: '2019-10-15' },
  { id: 'rec10', employeeId: 'emp3', certificationId: 'cert6', obtainedDate: '2022-02-20' },
  { id: 'rec11', employeeId: 'emp3', certificationId: 'cert7', obtainedDate: '2023-11-05' },
  { id: 'rec12', employeeId: 'emp3', certificationId: 'cert8', obtainedDate: '2020-06-12' },
  
  // 田中美咲
  { id: 'rec13', employeeId: 'emp4', certificationId: 'cert1', obtainedDate: '2022-10-20' },
  { id: 'rec14', employeeId: 'emp4', certificationId: 'cert4', obtainedDate: '2024-03-15' },
  
  // 伊藤健太
  { id: 'rec15', employeeId: 'emp5', certificationId: 'cert1', obtainedDate: '2019-04-10' },
  { id: 'rec16', employeeId: 'emp5', certificationId: 'cert2', obtainedDate: '2020-10-22' },
  { id: 'rec17', employeeId: 'emp5', certificationId: 'cert7', obtainedDate: '2023-09-15' },
  { id: 'rec18', employeeId: 'emp5', certificationId: 'cert9', obtainedDate: '2022-05-08' },
  
  // 渡辺真理
  { id: 'rec19', employeeId: 'emp6', certificationId: 'cert1', obtainedDate: '2021-04-15' },
  { id: 'rec20', employeeId: 'emp6', certificationId: 'cert3', obtainedDate: '2023-12-10' },
  { id: 'rec21', employeeId: 'emp6', certificationId: 'cert8', obtainedDate: '2024-02-28' },
  
  // 中村優子
  { id: 'rec22', employeeId: 'emp7', certificationId: 'cert1', obtainedDate: '2023-04-10' },
  { id: 'rec23', employeeId: 'emp7', certificationId: 'cert9', obtainedDate: '2024-09-20' },
  
  // 小林誠
  { id: 'rec24', employeeId: 'emp8', certificationId: 'cert1', obtainedDate: '2017-10-15' },
  { id: 'rec25', employeeId: 'emp8', certificationId: 'cert2', obtainedDate: '2019-04-20' },
  { id: 'rec26', employeeId: 'emp8', certificationId: 'cert7', obtainedDate: '2022-11-10' },
  { id: 'rec27', employeeId: 'emp8', certificationId: 'cert9', obtainedDate: '2021-06-15' },
  
  // 加藤直樹
  { id: 'rec28', employeeId: 'emp9', certificationId: 'cert1', obtainedDate: '2016-04-10' },
  { id: 'rec29', employeeId: 'emp9', certificationId: 'cert2', obtainedDate: '2017-10-20' },
  { id: 'rec30', employeeId: 'emp9', certificationId: 'cert5', obtainedDate: '2020-12-15' },
  { id: 'rec31', employeeId: 'emp9', certificationId: 'cert6', obtainedDate: '2022-08-25' },
  { id: 'rec32', employeeId: 'emp9', certificationId: 'cert7', obtainedDate: '2023-03-30' },
  
  // 吉田恵子
  { id: 'rec33', employeeId: 'emp10', certificationId: 'cert1', obtainedDate: '2020-10-15' },
  { id: 'rec34', employeeId: 'emp10', certificationId: 'cert5', obtainedDate: '2023-07-20' },
  { id: 'rec35', employeeId: 'emp10', certificationId: 'cert9', obtainedDate: '2022-03-10' },
  
  // 山本翔太
  { id: 'rec36', employeeId: 'emp11', certificationId: 'cert7', obtainedDate: '2023-06-15' },
  { id: 'rec37', employeeId: 'emp11', certificationId: 'cert10', obtainedDate: '2022-09-20' },
  
  // 松本由美
  { id: 'rec38', employeeId: 'emp12', certificationId: 'cert10', obtainedDate: '2024-05-10' },
];

