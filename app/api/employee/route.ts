import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const employee = await prisma.employee.findMany();
  return NextResponse.json(employee);
}