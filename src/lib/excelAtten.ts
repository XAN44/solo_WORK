// utils/exportToExcel.ts
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export const exportAttenToExcel = (attendanceData: any[]) => {
  // แปลงข้อมูล attendance เป็น sheet ของ Excel
  const worksheet = XLSX.utils.json_to_sheet(
    attendanceData.map((att, index) => ({
      No: index + 1,
      "Date Time In": att.dateIn
        ? format(new Date(att.dateIn), "dd MMM yyyy HH:mm a", { locale: enUS })
        : "N/A",
      "Date Time Out": att.dateOut
        ? format(new Date(att.dateOut), "dd MMM yyyy HH:mm a", { locale: enUS })
        : "N/A",
      "Attendance Status": att.type,
      "Leave Status": att.statusLeave || "No LeaveRequest",
    })),
  );

  // สร้าง workbook ใหม่และเพิ่ม worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // ดาวน์โหลดไฟล์ Excel
  XLSX.writeFile(workbook, "Attendance.xlsx");
};
