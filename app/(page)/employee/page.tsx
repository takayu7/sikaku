import { prisma } from "@/lib/prisma";


export default async function EnployeePage() {
  const employees = await prisma.employee.findMany();
    console.log(employees);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー一覧</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">名前</th>
              <th className="px-4 py-2 border">部署ID</th>
              <th className="px-4 py-2 border">課ID</th>
              <th className="px-4 py-2 border">役職ID</th>
              <th className="px-4 py-2 border">職種ID</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{employee.employee_id}</td>
                <td className="px-4 py-2 border">{employee.name}</td>
                <td className="px-4 py-2 border">{employee.department_id}</td>
                <td className="px-4 py-2 border text-center">
                  {employee.section_id ?? "-"}
                </td>
                <td className="px-4 py-2 border text-center">
                  {employee.post_id ?? "-"}
                </td>
                <td className="px-4 py-2 border text-center">
                  {employee.job_type ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}