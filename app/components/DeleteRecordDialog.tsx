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
import { Label } from './ui/label';

interface EditRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: (recordId: string) => void;
  record: CertificationRecord | null;
  employees: Employee[];
  certifications: Certification[];
}

export function DeleteRecordDialog({
  open,
  onClose,
  onDelete,
  record,
  employees,
  certifications
}: EditRecordDialogProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    certification: '',
    obtainedDate: ''
  });

  useEffect(() => {
    if (record && open) {
      setFormData({
        employeeId: record.employeeId,
        name: employees.find(e => e.id === record.employeeId)?.name || '',
        certification: certifications.find(c => c.id === record.certificationId)?.name || '',
        obtainedDate: record.obtainedDate
      });
    }
  }, [record, open, employees, certifications]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!record) return;

    onDelete(record.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>資格取得情報の削除</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className='flex items-center gap-2'>
              <Label htmlFor="editCertification">取得者名：</Label>
              <Label htmlFor="editCertification">{formData.name || ''}</Label>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
              <h4 className="text-sm text-green-900 mb-3">資格取得情報</h4>

              <div className='flex items-center gap-2'>
                <Label htmlFor="editCertification">資格：</Label>
                <Label htmlFor="editCertification">{formData.certification || ''}</Label>
              </div>

              <div className='flex items-center gap-2'>
                <Label htmlFor="editObtainedDate">取得日：</Label>
                <Label htmlFor="editObtainedDate">{formData.obtainedDate}</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              削除
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
