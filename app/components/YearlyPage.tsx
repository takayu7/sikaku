'use client';

import { useMemo, useState } from 'react';
import { Employee, Certification, CertificationRecord } from '@/app/type/type';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Calendar, Award } from 'lucide-react';

interface YearlyPageProps {
  employees: Employee[];
  certifications: Certification[];
  records: CertificationRecord[];
}

export function YearlyPage({ employees, certifications, records }: YearlyPageProps) {
  // 年度一覧を取得
  const years = useMemo(() => {
    const yearSet = new Set<number>();
    records.forEach(record => {
      const year = new Date(record.obtainedDate).getFullYear();
      yearSet.add(year);
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [records]);

  const [selectedYear, setSelectedYear] = useState<string>(years[0]?.toString() || '2024');

  // 選択された年度の取得データ
  const yearlyData = useMemo(() => {
    const year = parseInt(selectedYear);
    const yearRecords = records.filter(record => {
      const recordYear = new Date(record.obtainedDate).getFullYear();
      return recordYear === year;
    });

    return yearRecords.map(record => {
      const employee = employees.find(e => e.id === record.employeeId);
      const cert = certifications.find(c => c.id === record.certificationId);
      
      return {
        recordId: record.id,
        employeeName: employee?.name || '',
        department: employee?.department || '',
        position: employee?.position || '',
        certificationName: cert?.name || '',
        obtainedDate: record.obtainedDate,
        rewardRank: cert?.rewardRank || 'C',
        month: new Date(record.obtainedDate).getMonth() + 1
      };
    }).sort((a, b) => a.obtainedDate.localeCompare(b.obtainedDate));
  }, [selectedYear, records, employees, certifications]);

  // 年度統計
  const yearlyStats = useMemo(() => {
    const rankCounts = { S: 0, A: 0, B: 0, C: 0 , D: 0, E: 0};
    const uniqueEmployees = new Set<string>();
    const departmentCounts: { [key: string]: number } = {};

    yearlyData.forEach(data => {
      rankCounts[data.rewardRank]++;
      const employee = employees.find(e => e.name === data.employeeName);
      if (employee) uniqueEmployees.add(employee.id);
      departmentCounts[data.department] = (departmentCounts[data.department] || 0) + 1;
    });

    return {
      totalRecords: yearlyData.length,
      uniqueEmployees: uniqueEmployees.size,
      rankCounts,
      departmentCounts
    };
  }, [yearlyData, employees]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getRewardRankColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'A': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'B': return 'bg-green-100 text-green-700 border-green-300';
      case 'C': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'D': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'E': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // 報奨金額の目安（例）
  const getRewardAmount = (rank: string) => {
    switch (rank) {
      case 'S': return '100,000円';
      case 'A': return '50,000円';
      case 'B': return '30,000円';
      case 'C': return '10,000円';
      case 'D': return '5,000円';
      case 'E': return '1,000円';
      default: return '-';
    }
  };

  const rankData = [
                  { rank: 'S', amount: '100,000円', color: 'purple' },
                  { rank: 'A', amount: '50,000円', color: 'blue' },
                  { rank: 'B', amount: '30,000円', color: 'green' },
                  { rank: 'C', amount: '10,000円', color: 'gray' },
                  { rank: 'D', amount: '5,000円', color: 'yellow' },
                  { rank: 'E', amount: '1,000円', color: 'red' },
                ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            年度選択
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="year">取得年度</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}年度
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 年度統計サマリー */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gap-1">
          <CardHeader>
            <CardDescription>総取得件数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{yearlyStats.totalRecords}件</div>
          </CardContent>
        </Card>
        <Card className="gap-1">
          <CardHeader>
            <CardDescription>取得者数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{yearlyStats.uniqueEmployees}人</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200 gap-1">
          <CardHeader>
            <CardDescription>Sランク</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-purple-700">{yearlyStats.rankCounts.S}件</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200 gap-1">
          <CardHeader>
            <CardDescription>Aランク</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-blue-700">{yearlyStats.rankCounts.A}件</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200  gap-1">
          <CardHeader>
            <CardDescription>Bランク</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-green-700">{yearlyStats.rankCounts.B}件</div>
          </CardContent>
        </Card>
        <Card className="gap-1">
          <CardHeader>
            <CardDescription>Cランク</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{yearlyStats.rankCounts.C}件</div>
          </CardContent>
        </Card>
        <Card className="gap-1">
          <CardHeader>
            <CardDescription>Dランク</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{yearlyStats.rankCounts.D}件</div>
          </CardContent>
        </Card>
        <Card className="gap-1">
          <CardHeader>
            <CardDescription>Eランク</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{yearlyStats.rankCounts.E}件</div>
          </CardContent>
        </Card>
      </div>

      {/* 年度別取得一覧テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedYear}年度 資格取得者一覧</CardTitle>
          <CardDescription>取得日順に表示（報奨金ランク付き）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[100px]">取得月</TableHead>
                    <TableHead className="w-[120px]">氏名</TableHead>
                    <TableHead className="w-[120px]">部署</TableHead>
                    <TableHead className="w-[100px]">役職</TableHead>
                    <TableHead>資格名</TableHead>
                    <TableHead className="w-[120px]">取得日</TableHead>
                    <TableHead className="w-[100px] text-center">報奨金ランク</TableHead>
                    <TableHead className="w-[120px] text-right">報奨金額（目安）</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yearlyData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {selectedYear}年度の資格取得記録がありません
                      </TableCell>
                    </TableRow>
                  ) : (
                    yearlyData.map((data) => (
                      <TableRow key={data.recordId}>
                        <TableCell>{data.month}月</TableCell>
                        <TableCell>{data.employeeName}</TableCell>
                        <TableCell>{data.department}</TableCell>
                        <TableCell>{data.position}</TableCell>
                        <TableCell>{data.certificationName}</TableCell>
                        <TableCell>{formatDate(data.obtainedDate)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getRewardRankColor(data.rewardRank)}>
                            {data.rewardRank}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-gray-900">
                          {getRewardAmount(data.rewardRank)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {yearlyData.length > 0 && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="size-5 text-blue-600" />
                <h4 className="text-gray-900">報奨金ランク詳細</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {rankData.map(({ rank, amount, color }) => (
                  <div key={rank} className={`p-3 bg-${color}-50 border border-${color}-200 rounded-lg`}>
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className={getRewardRankColor(rank)}>
                        ランク{rank}
                      </Badge>
                      <span className="text-sm">{yearlyStats.rankCounts[rank as 'S' | 'A' | 'B' | 'C' | 'D' | 'E']}件</span>
                    </div>
                    <p className="text-xs text-gray-600">報奨金: {amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 部署別集計 */}
      {yearlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>部署別取得状況</CardTitle>
            <CardDescription>{selectedYear}年度の部署別資格取得件数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(yearlyStats.departmentCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => (
                  <div key={dept} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm mb-1 text-gray-700">{dept}</p>
                    <p className="text-gray-900">{count}件</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
