"use client";
import { useState, useEffect } from 'react';
import { Employee, Certification, CertificationRecord } from '@/app/type/type';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface EditRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (recordId: string, record: Omit<CertificationRecord, 'id'>) => void;
  onUpdateEmployee: (employeeId: string, employee: Omit<Employee, 'id'>) => void;
  record: CertificationRecord | null;
  employees: Employee[];
  certifications: Certification[];
}

export function EditRecordDialog({
  open,
  onClose,
  onSave,
  onUpdateEmployee,
  record,
  employees,
  certifications
}: EditRecordDialogProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    certificationId: '',
    obtainedDate: ''
  });

  const [employeeData, setEmployeeData] = useState({
    name: '',
    department: '',
    position: ''
  });

  useEffect(() => {
    if (record && open) {
      setFormData({
        employeeId: record.employeeId,
        certificationId: record.certificationId,
        obtainedDate: record.obtainedDate
      });

      const employee = employees.find(e => e.id === record.employeeId);
      if (employee) {
        setEmployeeData({
          name: employee.name,
          department: employee.department,
          position: employee.position
        });
      }
    }
  }, [record, open, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!record) return;

    // 社員情報を更新
    onUpdateEmployee(formData.employeeId, {
      name: employeeData.name,
      department: employeeData.department,
      position: employeeData.position
    });

    // 資格取得レコードを更新
    onSave(record.id, {
      employeeId: formData.employeeId,
      certificationId: formData.certificationId,
      obtainedDate: formData.obtainedDate
    });

    onClose();
  };

  // const currentEmployee = employees.find(e => e.id === formData.employeeId);
  const currentCertification = certifications.find(c => c.id === formData.certificationId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>資格取得情報の編集</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
              <h4 className="text-sm text-blue-900 mb-3">社員情報</h4>
              
              <div>
                <Label htmlFor="editName">氏名 *</Label>
                <Input
                  id="editName"
                  required
                  value={employeeData.name}
                  onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editDepartment">部署 *</Label>
                  <Input
                    id="editDepartment"
                    required
                    value={employeeData.department}
                    onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="editPosition">役職 *</Label>
                  <Select 
                    value={employeeData.position}
                    onValueChange={(value) => setEmployeeData({ ...employeeData, position: value })}
                    required
                  >
                    <SelectTrigger id="editPosition" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="部長">部長</SelectItem>
                      <SelectItem value="課長">課長</SelectItem>
                      <SelectItem value="主任">主任</SelectItem>
                      <SelectItem value="一般">一般</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
              <h4 className="text-sm text-green-900 mb-3">資格取得情報</h4>

              <div>
                <Label htmlFor="editCertification">資格 *</Label>
                <Select 
                  value={formData.certificationId} 
                  onValueChange={(value) => setFormData({ ...formData, certificationId: value })}
                  required
                >
                  <SelectTrigger id="editCertification" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {certifications.map(cert => (
                      <SelectItem key={cert.id} value={cert.id}>
                        {cert.name} (ランク: {cert.rewardRank})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="editObtainedDate">取得日 *</Label>
                <Input
                  id="editObtainedDate"
                  type="date"
                  required
                  value={formData.obtainedDate}
                  onChange={(e) => setFormData({ ...formData, obtainedDate: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              {currentCertification && (
                <div className="p-3 bg-white border border-green-300 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">現在の報奨金ランク:</span>
                    <span className="text-sm font-medium">{currentCertification.rewardRank}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              変更を保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
