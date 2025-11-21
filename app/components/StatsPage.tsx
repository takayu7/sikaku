'use client';

import { useMemo, useState } from 'react';
import { Employee, Certification, CertificationRecord } from '@/app/type/type';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface StatsPageProps {
  employees: Employee[];
  certifications: Certification[];
  records: CertificationRecord[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

export function StatsPage({ employees, certifications, records }: StatsPageProps) {
  // 選択された資格（部門別統計用）
  const [selectedCertForDept, setSelectedCertForDept] = useState<string>(
    certifications.find(c => c.name === '基本情報技術者')?.id || certifications[0]?.id || ''
  );

  // 資格別保有率データ
  const certificationStats = useMemo(() => {
    return certifications.map(cert => {
      const holders = records.filter(r => r.certificationId === cert.id).length;
      const uniqueHolders = new Set(
        records.filter(r => r.certificationId === cert.id).map(r => r.employeeId)
      ).size;
      
      return {
        name: cert.name,
        holders: uniqueHolders,
        percentage: (uniqueHolders / employees.length) * 100,
        rewardRank: cert.rewardRank
      };
    }).sort((a, b) => b.holders - a.holders);
  }, [certifications, records, employees]);

  // 技術職（開発・インフラ・セキュリティ部門）の資格保有率
  const techDepartments = ['開発1課', '開発2課', '開発3課', 'インフラ課', 'セキュリティ課'];
  const techEmployees = employees.filter(emp => techDepartments.includes(emp.department));

  const techCertificationStats = useMemo(() => {
    return certifications.map(cert => {
      const uniqueHolders = new Set(
        records.filter(r => {
          const emp = employees.find(e => e.id === r.employeeId);
          return r.certificationId === cert.id && emp && techDepartments.includes(emp.department);
        }).map(r => r.employeeId)
      ).size;
      
      return {
        name: cert.name,
        holders: uniqueHolders,
        percentage: techEmployees.length > 0 ? (uniqueHolders / techEmployees.length) * 100 : 0,
      };
    }).filter(stat => stat.holders > 0).sort((a, b) => b.percentage - a.percentage);
  }, [certifications, records, employees, techEmployees]);

  // 部門別の基本情報技術者取得率
  const basicInfoCert = certifications.find(c => c.name === '基本情報技術者');
  const departmentBasicInfoStats = useMemo(() => {
    const selectedCert = certifications.find(c => c.id === selectedCertForDept);
    if (!selectedCert) return [];
    
    const departments = new Set(employees.map(e => e.department));
    
    return Array.from(departments).map(dept => {
      const deptEmployees = employees.filter(e => e.department === dept);
      const holders = deptEmployees.filter(emp => 
        records.some(r => r.employeeId === emp.id && r.certificationId === selectedCertForDept)
      ).length;
      
      return {
        department: dept,
        holders: holders,
        total: deptEmployees.length,
        percentage: deptEmployees.length > 0 ? (holders / deptEmployees.length) * 100 : 0
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [employees, records, selectedCertForDept, certifications]);

  // 役職別のビジネスマネジャー検定取得率
  const bizManagerCert = certifications.find(c => c.name === 'ビジネスマネジャー検定');
  const positionBizManagerStats = useMemo(() => {
    const managerPositions = ['課長', '部長'];
    
    return managerPositions.map(position => {
      const positionEmployees = employees.filter(e => e.position === position);
      const holders = positionEmployees.filter(emp =>
        records.some(r => r.employeeId === emp.id && r.certificationId === bizManagerCert?.id)
      ).length;
      
      return {
        position: position,
        holders: holders,
        total: positionEmployees.length,
        percentage: positionEmployees.length > 0 ? (holders / positionEmployees.length) * 100 : 0
      };
    });
  }, [employees, records, bizManagerCert]);

  // 報奨金ランク別の分布
  const rewardRankDistribution = useMemo(() => {
    const distribution = { S: 0, A: 0, B: 0, C: 0 , D: 0, E: 0};
    
    records.forEach(record => {
      const cert = certifications.find(c => c.id === record.certificationId);
      if (cert) {
        distribution[cert.rewardRank]++;
      }
    });
    
    return Object.entries(distribution).map(([rank, count]) => ({
      rank: `ランク${rank}`,
      count: count
    }));
  }, [records, certifications]);

  // 選択された部門
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* 全体統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>総社員数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{employees.length}人</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>総資格取得件数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{records.length}件</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均資格数/人</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{(records.length / employees.length).toFixed(1)}件</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>技術職社員数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{techEmployees.length}人</div>
          </CardContent>
        </Card>
      </div>

      {/* 資格別保有率 */}
      <Card>
        <CardHeader>
          <CardTitle>資格別保有率（全社員）</CardTitle>
          <CardDescription>各資格の社内保有率と人数</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={certificationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={120}
                interval={0}
                style={{ fontSize: '12px' }}
              />
              <YAxis label={{ value: '保有率 (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}%`}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar dataKey="percentage" name="保有率" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {certificationStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{stat.name}</p>
                  <p className="text-xs text-gray-500">
                    {stat.holders}人 / {employees.length}人
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-sm">{stat.percentage.toFixed(1)}%</span>
                  <Badge variant="outline" className={
                    stat.rewardRank === 'S' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                    stat.rewardRank === 'A' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    stat.rewardRank === 'B' ? 'bg-green-100 text-green-700 border-green-300' :
                    'bg-gray-100 text-gray-700 border-gray-300'
                  }>
                    {stat.rewardRank}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 技術職の資格保有率 */}
      <Card>
        <CardHeader>
          <CardTitle>技術職社員の資格保有率</CardTitle>
          <CardDescription>開発・インフラ・セキュリティ部門（{techEmployees.length}人）の資格保有状況</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={techCertificationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={150}
                interval={0}
                style={{ fontSize: '11px' }}
              />
              <YAxis label={{ value: '保有率 (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}%`}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar dataKey="percentage" name="保有率" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 部門別基本情報技術者取得率 */}
      <Card>
        <CardHeader>
          <CardTitle>部門別資格取得率</CardTitle>
          <CardDescription>各部門における選択資格の取得状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="cert-select">表示する資格を選択</Label>
            <Select value={selectedCertForDept} onValueChange={setSelectedCertForDept}>
              <SelectTrigger id="cert-select" className="mt-1.5 max-w-md">
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

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentBasicInfoStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis label={{ value: '取得率 (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'percentage') return `${value.toFixed(1)}%`;
                  return value;
                }}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar dataKey="percentage" name="取得率" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {departmentBasicInfoStats.map((stat, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm mb-1">{stat.department}</p>
                <p className="text-gray-900">{stat.holders}/{stat.total}人</p>
                <p className="text-green-700 text-xs">{stat.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 役職別ビジネスマネジャー検定取得率 */}
      <Card>
        <CardHeader>
          <CardTitle>管理職のビジネスマネジャー検定取得率</CardTitle>
          <CardDescription>課長・部長のビジネスマネジャー検定取得状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionBizManagerStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis label={{ value: '取得率 (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="percentage" name="取得率" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex flex-col justify-center gap-4">
              {positionBizManagerStats.map((stat, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-900">{stat.position}</span>
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                      {stat.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    取得者: {stat.holders}人 / 対象: {stat.total}人
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 報奨金ランク別分布 */}
      <Card>
        <CardHeader>
          <CardTitle>報奨金ランク別 取得件数</CardTitle>
          <CardDescription>取得された資格の報奨金ランク別分布</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rewardRankDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rank, count, percent }) => `${rank}: ${count}件 (${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {rewardRankDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col justify-center gap-3">
              {rewardRankDistribution.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{stat.rank}</span>
                  </div>
                  <span className="text-gray-900">{stat.count}件</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}