'use client';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { EmployeeListPage } from '@/app/components/EmployeeListPage';
import { StatsPage } from '@/app/components/StatsPage';
import { YearlyPage } from '@/app/components/YearlyPage';
import {certifications, employees, certificationRecords } from '@/lib/sample';
import {Employee, Certification, CertificationRecord } from '@/app/type/type';


export default function Home() {
  // 資格取得記録一覧
  const [records, setRecords] = useState<CertificationRecord[]>(certificationRecords);
  // 社員一覧
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
  // 資格一覧
  const [certificationList, setCertificationList] = useState<Certification[]>(certifications);

  // 資格取得登録
  const handleAddRecord = (record: Omit<CertificationRecord, 'id'>) => {
    const newRecord: CertificationRecord = {
      ...record,
      id: `rec${Date.now()}`
    };
    setRecords([...records, newRecord]);
  };

  // 資格取得更新
  const handleUpdateRecord = (recordId: string, updatedRecord: Omit<CertificationRecord, 'id'>) => {
    setRecords(records.map(r => 
      r.id === recordId ? { ...updatedRecord, id: recordId } : r
    ));
  };

  // 社員登録
  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp${Date.now()}`
    };
    setEmployeeList([...employeeList, newEmployee]);
    return newEmployee.id;
  };

  // 社員更新
  const handleUpdateEmployee = (employeeId: string, updatedEmployee: Omit<Employee, 'id'>) => {
    setEmployeeList(employeeList.map(e => 
      e.id === employeeId ? { ...updatedEmployee, id: employeeId } : e
    ));
  };

  // 資格登録
  const handleAddCertification = (certification: Omit<Certification, 'id'>) => {
    const newCertification: Certification = {
      ...certification,
      id: `cert${Date.now()}`
    };
    setCertificationList([...certificationList, newCertification]);
    return newCertification.id;
  };

  // 資格削除
  const handleDeleteRecord = (recordId: string) => {
    setRecords(records.filter(r => r.id !== recordId));
  };

return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">社員資格管理システム</h1>
          <p className="text-gray-600">資格取得状況の一覧・統計・分析</p>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full max-w-[600px] grid-cols-3">
            <TabsTrigger value="list">資格一覧</TabsTrigger>
            <TabsTrigger value="stats">統計・分析</TabsTrigger>
            <TabsTrigger value="yearly">年度別取得者</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <EmployeeListPage 
              employees={employeeList}
              certifications={certificationList}
              records={records}
              onAddRecord={handleAddRecord}
              onUpdateRecord={handleUpdateRecord}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onAddCertification={handleAddCertification}
              onDeleteRecord={handleDeleteRecord}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <StatsPage
              employees={employeeList}
              certifications={certificationList}
              records={records}
            />
          </TabsContent>

          <TabsContent value="yearly" className="space-y-6">
            <YearlyPage
              employees={employeeList}
              certifications={certificationList}
              records={records}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}