-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "section_id" INTEGER,
    "post_id" INTEGER,
    "job_type" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "department_id" INTEGER NOT NULL,
    "department_name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "Section" (
    "section_id" INTEGER NOT NULL,
    "section_name" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" INTEGER NOT NULL,
    "post_name" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE SET NULL ON UPDATE CASCADE;
