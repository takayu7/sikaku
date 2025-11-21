"use client";

import { useState, useMemo } from 'react';
import { Employee, Certification, CertificationRecord } from '@/app/type/type';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { AddRecordDialog } from './AddRecordDialog';
import { EditRecordDialog } from './EditRecordDialog';
import { DeleteRecordDialog } from './DeleteRecordDialog';

interface EmployeeListPageProps {
  employees: Employee[];
  certifications: Certification[];
  records: CertificationRecord[];
  onAddRecord: (record: Omit<CertificationRecord, 'id'>) => void;
  onUpdateRecord: (recordId: string, record: Omit<CertificationRecord, 'id'>) => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => string;
  onUpdateEmployee: (employeeId: string, employee: Omit<Employee, 'id'>) => void;
  onAddCertification: (certification: Omit<Certification, 'id'>) => string;
  onDeleteRecord: (recordId: string) => void;
}

export function EmployeeListPage({
  employees,
  certifications,
  records,
  onAddRecord,
  onUpdateRecord,
  onAddEmployee,
  onUpdateEmployee,
  onAddCertification,
  onDeleteRecord
}: EmployeeListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [certificationFilter, setCertificationFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CertificationRecord | null>(null);

  // 部署一覧を取得
  const departments = useMemo(() => {
    const depts = new Set(employees.map(emp => emp.department));
    return Array.from(depts).sort();
  }, [employees]);

  // 社員データに資格情報を結合
  const employeeData = useMemo(() => {
    return employees.map(employee => {
      const empRecords = records.filter(r => r.employeeId === employee.id);
      const empCertifications = empRecords.map(record => {
        const cert = certifications.find(c => c.id === record.certificationId);
        return {
          name: cert?.name || '',
          obtainedDate: record.obtainedDate,
          rewardRank: cert?.rewardRank || 'C',
          recordId: record.id,
          certId: record.certificationId
        };
      }).sort((a, b) => a.obtainedDate.localeCompare(b.obtainedDate));

      return {
        ...employee,
        certifications: empCertifications
      };
    });
  }, [employees, records, certifications]);

  // フィルタリングとソート
  const filteredData = useMemo(() => {
    let filtered = employeeData;

    // 検索フィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.certifications.some(cert => cert.name.toLowerCase().includes(query))
      );
    }

    // 部署フィルタ
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    // 資格フィルタとソート
    if (certificationFilter !== 'all') {
      filtered = filtered.filter(emp => 
        emp.certifications.some(cert => cert.certId === certificationFilter)
      );
      // 資格保有者を上位にソート
      filtered.sort((a, b) => {
        const aHasCert = a.certifications.some(cert => cert.certId === certificationFilter);
        const bHasCert = b.certifications.some(cert => cert.certId === certificationFilter);
        if (aHasCert && !bHasCert) return -1;
        if (!aHasCert && bHasCert) return 1;
        return 0;
      });
    }

    return filtered;
  }, [employeeData, searchQuery, departmentFilter, certificationFilter]);

  const getRewardRankColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'A': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'B': return 'bg-green-100 text-green-700 border-green-300';
      case 'C': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 特定資格の保有者数を計算
  const certificationHolders = useMemo(() => {
    if (certificationFilter === 'all') return null;
    
    const holders = employeeData.filter(emp => 
      emp.certifications.some(cert => cert.certId === certificationFilter)
    );
    
    const certName = certifications.find(c => c.id === certificationFilter)?.name || '';
    
    return {
      name: certName,
      count: holders.length,
      total: employeeData.length
    };
  }, [certificationFilter, employeeData, certifications]);

  // 編集処理
  const handleEditRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      setEditingRecord(record);
      setIsEditDialogOpen(true);
    }
  };

  // 削除処理
  const handleDeleteRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
    setEditingRecord(record);
    setIsDeleteDialogOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>フィルタ・検索</span>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-[rgb(42,32,214)]">
              <Plus className="size-4" />
              資格取得を登録
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">検索</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="名前、部署、資格で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="department">部署</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger id="department" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての部署</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="certification">資格でフィルタ・ソート</Label>
              <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                <SelectTrigger id="certification" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての資格</SelectItem>
                  {certifications.map(cert => (
                    <SelectItem key={cert.id} value={cert.id}>
                      {cert.name} (報奨金ランク: {cert.rewardRank})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>社員別資格一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[120px]">名前</TableHead>
                    <TableHead className="w-[120px]">部署</TableHead>
                    <TableHead className="w-[100px]">役職</TableHead>
                    <TableHead>資格名</TableHead>
                    <TableHead className="w-[140px]">取得日</TableHead>
                    <TableHead className="w-[80px] text-center">ランク</TableHead>
                    <TableHead className="w-[100px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        該当する社員が見つかりません
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((employee) => {
                      const rowSpan = Math.max(employee.certifications.length, 1);
                      return employee.certifications.length === 0 ? (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell className="text-gray-400">資格なし</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      ) : (
                        employee.certifications.map((cert, index) => (
                          <TableRow key={`${employee.id}-${index}`}>
                            {index === 0 && (
                              <>
                                <TableCell rowSpan={rowSpan} className="align-top border-r">
                                  {employee.name}
                                </TableCell>
                                <TableCell rowSpan={rowSpan} className="align-top border-r">
                                  {employee.department}
                                </TableCell>
                                <TableCell rowSpan={rowSpan} className="align-top border-r">
                                  {employee.position}
                                </TableCell>
                              </>
                            )}
                            <TableCell>{cert.name}</TableCell>
                            <TableCell>{formatDate(cert.obtainedDate)}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className={getRewardRankColor(cert.rewardRank)}>
                                {cert.rewardRank}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  onClick={() => handleEditRecord(cert.recordId)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="size-4 text-blue-600" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteRecord(cert.recordId)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="size-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>表示人数: {filteredData.length}人 / 全{employees.length}人</span>
            </div>
            {certificationHolders && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {certificationHolders.name}
                </Badge>
                <span>保有者: {certificationHolders.count}人 ({((certificationHolders.count / certificationHolders.total) * 100).toFixed(1)}%)</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddRecordDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={onAddRecord}
        onAddEmployee={onAddEmployee}
        onAddCertification={onAddCertification}
        employees={employees}
        certifications={certifications}
      />

      <EditRecordDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={onUpdateRecord}
        onUpdateEmployee={onUpdateEmployee}
        record={editingRecord}
        employees={employees}
        certifications={certifications}
      />

      <DeleteRecordDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={onDeleteRecord}
        record={editingRecord}
        employees={employees}
        certifications={certifications}
      />
    </>
  );
}