'use client';
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
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface AddRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (record: Omit<CertificationRecord, 'id'>) => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => string;
  onAddCertification: (certification: Omit<Certification, 'id'>) => string;
  employees: Employee[];
  certifications: Certification[];
}

export function AddRecordDialog({
  open,
  onClose,
  onSave,
  onAddEmployee,
  onAddCertification,
  employees,
  certifications
}: AddRecordDialogProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    certificationId: '',
    obtainedDate: ''
  });

  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    department: '',
    position: '',
    jobType: '技術職'
  });

  const [isNewCertification, setIsNewCertification] = useState(false);
  const [newCertificationData, setNewCertificationData] = useState({
    name: '',
    category: '',
    rewardRank: 'C' as 'S' | 'A' | 'B' | 'C' | 'D' | 'E'
  });

  useEffect(() => {
    if (!open) {
      // ダイアログが閉じたらリセット
      setFormData({
        employeeId: '',
        certificationId: '',
        obtainedDate: ''
      });
      setIsNewEmployee(false);
      setNewEmployeeData({
        name: '',
        department: '',
        position: '',
        jobType: '技術職'
      });
      setIsNewCertification(false);
      setNewCertificationData({
        name: '',
        category: '',
        rewardRank: 'C'
      });
    }
  }, [open]);

  const handleEmployeeChange = (value: string) => {
    if (value === 'new') {
      setIsNewEmployee(true);
      setFormData({ ...formData, employeeId: '' });
    } else {
      setIsNewEmployee(false);
      setFormData({ ...formData, employeeId: value });
    }
  };

  const handleCertificationChange = (value: string) => {
    if (value === 'new') {
      setIsNewCertification(true);
      setFormData({ ...formData, certificationId: '' });
    } else {
      setIsNewCertification(false);
      setFormData({ ...formData, certificationId: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalEmployeeId = formData.employeeId;
    let finalCertificationId = formData.certificationId;

    // 新規社員の場合、先に社員を登録
    if (isNewEmployee) {
      finalEmployeeId = onAddEmployee({
        name: newEmployeeData.name,
        department: newEmployeeData.department,
        position: newEmployeeData.position
      });
    }

    // 新規資格の場合、先に資格を登録
    if (isNewCertification) {
      finalCertificationId = onAddCertification({
        name: newCertificationData.name,
        rewardRank: newCertificationData.rewardRank
      });
    }

    // 資格取得を登録
    onSave({
      employeeId: finalEmployeeId,
      certificationId: finalCertificationId,
      obtainedDate: formData.obtainedDate
    });

    onClose();
  };

  const getButtonText = () => {
    if (isNewEmployee && isNewCertification) {
      return '社員 & 資格 & 取得を登録';
    } else if (isNewEmployee) {
      return '社員登録 & 資格登録';
    } else if (isNewCertification) {
      return '資格登録 & 取得登録';
    }
    return '資格登録';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>資格取得の登録</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="employee">社員 *</Label>
              <Select 
                value={isNewEmployee ? 'new' : formData.employeeId} 
                onValueChange={handleEmployeeChange}
                required={!isNewEmployee}
              >
                <SelectTrigger id="employee" className="mt-1.5">
                  <SelectValue placeholder="社員を選択" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </SelectItem>
                  ))}
                  <Separator className="my-2" />
                  <SelectItem value="new" className="text-blue-600 font-medium">
                    ＋ 未登録社員（新規登録）
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isNewEmployee && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                <h4 className="text-sm text-blue-900 mb-3">新規社員情報</h4>
                <div>
                  <Label htmlFor="newName">氏名 *</Label>
                  <Input
                    id="newName"
                    required
                    placeholder="例: 田中太郎"
                    value={newEmployeeData.name}
                    onChange={(e) => setNewEmployeeData({ ...newEmployeeData, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newDepartment">部署 *</Label>
                    <Input
                      id="newDepartment"
                      required
                      placeholder="例: 開発1課"
                      value={newEmployeeData.department}
                      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, department: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPosition">役職 *</Label>
                    <Select
                      value={newEmployeeData.position}
                      onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, position: value })}
                      required
                    >
                      <SelectTrigger id="newPosition" className="mt-1.5">
                        <SelectValue placeholder="役職を選択" />
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

                <div>
                  <Label htmlFor="newJobType">職種 *</Label>
                  <Select
                    value={newEmployeeData.jobType}
                    onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, jobType: value })}
                    required
                  >
                    <SelectTrigger id="newJobType" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="技術職">技術職</SelectItem>
                      <SelectItem value="営業職">営業職</SelectItem>
                      <SelectItem value="管理職">管理職</SelectItem>
                      <SelectItem value="人事">人事</SelectItem>
                      <SelectItem value="総務">総務</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="certification">資格 *</Label>
              <Select
                value={isNewCertification ? 'new' : formData.certificationId} 
                onValueChange={handleCertificationChange}
                required={!isNewCertification}
              >
                <SelectTrigger id="certification" className="mt-1.5">
                  <SelectValue placeholder="資格を選択" />
                </SelectTrigger>
                <SelectContent>
                  {certifications.map(cert => (
                    <SelectItem key={cert.id} value={cert.id}>
                      {cert.name} (ランク: {cert.rewardRank})
                    </SelectItem>
                  ))}
                  <Separator className="my-2" />
                  <SelectItem value="new" className="text-green-600 font-medium">
                    ＋ 未登録資格（新規登録）
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isNewCertification && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                <h4 className="text-sm text-green-900 mb-3">新規資格情報</h4>

                <div>
                  <Label htmlFor="newCertName">資格名 *</Label>
                  <Input
                    id="newCertName"
                    required
                    placeholder="例: ITパスポート"
                    value={newCertificationData.name}
                    onChange={(e) => setNewCertificationData({ ...newCertificationData, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="newCertCategory">分野 *</Label>
                  <Select 
                    value={newCertificationData.category}
                    onValueChange={(value) => setNewCertificationData({ ...newCertificationData, category: value })}
                    required
                  >
                    <SelectTrigger id="newCertCategory" className="mt-1.5">
                      <SelectValue placeholder="分野を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="情報処理一般">情報処理一般</SelectItem>
                      <SelectItem value="プログラミング">プログラミング</SelectItem>
                      <SelectItem value="業務分析">業務分析</SelectItem>
                      <SelectItem value="テスト/品質管理">テスト/品質管理</SelectItem>
                      <SelectItem value="ビジネス教養">ビジネス教養</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">報奨金ランク *</Label>
                  <RadioGroup 
                    value={newCertificationData.rewardRank}
                    onValueChange={(value) => setNewCertificationData({ ...newCertificationData, rewardRank: value as 'S' | 'A' | 'B' | 'C' | 'D' | 'E'})}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="S" id="rank-s" className='border-2'/>
                      <Label htmlFor="rank-s" className="cursor-pointer">S</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A" id="rank-a" />
                      <Label htmlFor="rank-a" className="cursor-pointer">A</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B" id="rank-b" />
                      <Label htmlFor="rank-b" className="cursor-pointer">B</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="C" id="rank-c" />
                      <Label htmlFor="rank-c" className="cursor-pointer">C</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="D" id="rank-d" />
                      <Label htmlFor="rank-d" className="cursor-pointer">D</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="E" id="rank-e" />
                      <Label htmlFor="rank-e" className="cursor-pointer">E</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="obtainedDate">取得日 *</Label>
              <Input
                id="obtainedDate"
                type="date"
                required
                value={formData.obtainedDate}
                onChange={(e) => setFormData({ ...formData, obtainedDate: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              {getButtonText()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
