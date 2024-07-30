// utils/exportToExcel.ts
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export const exportTasksToExcel = (tasksData: any[]) => {
  // แปลงข้อมูล tasks เป็น sheet ของ Excel
  const worksheet = XLSX.utils.json_to_sheet(
    tasksData.map((task, index) => ({
      No: index + 1,
      Title: task.title,
      Description: task.description,
      "Type of Work": task.typeOfWork,
      "Task CreateAt": task.dateCreateAt
        ? format(new Date(task.dateCreateAt), "dd MMM yyyy HH:mm a", {
            locale: enUS,
          })
        : "N/A",
      "Task Start": task.startAt
        ? format(new Date(task.startAt), "dd MMM yyyy HH:mm a", {
            locale: enUS,
          })
        : "N/A",
      "Task End At": task.endAt
        ? format(new Date(task.endAt), "dd MMM yyyy HH:mm a", { locale: enUS })
        : "N/A",
      Status: task.status,
      "Task Type": task.createAt,
    })),
  );

  // สร้าง workbook ใหม่และเพิ่ม worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  // ดาวน์โหลดไฟล์ Excel
  XLSX.writeFile(workbook, "Tasks_Summary.xlsx");
};
