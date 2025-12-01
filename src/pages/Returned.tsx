import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReturnedBooks } from "@/api/api"; // ฟังก์ชัน API จริง
import { toast } from "sonner";

export default function Returned() {
  const [returned, setReturned] = useState<any[]>([]);

  useEffect(() => {
    loadReturned();
  }, []);

  const loadReturned = async () => {
    try {
      const data = await getReturnedBooks();

      const formatted = data.map((r) => ({
        return_id: r.return_id,
        user_name: r.user_name || r.member_name || "-",
        book_name: r.book_name || "-",
        borrow_date: r.borrow_date,
        return_date: r.return_date,
        totalfine: Number(r.totalfine) || 0, // ✅ แปลงเป็น number
        status: r.status || (Number(r.totalfine) > 0 ? "Late" : "On Time"),
        processed_by: r.processed_by || r.processed_id || "-",
      }));

      setReturned(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Cannot load returned books");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Returned Books</h1>
        <p className="text-sm text-muted-foreground">
          View completed book returns and fines
        </p>
      </div>

      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle>Return History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Return ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Member</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Book</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Borrow Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Return Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Fine ($)</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Processed By</th>
                </tr>
              </thead>
              <tbody>
                {returned.map((record) => (
                  <tr key={record.return_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">
                      RET{String(record.return_id).padStart(3, "0")}
                    </td>
                    <td className="py-3 text-sm font-medium text-foreground">{record.user_name}</td>
                    <td className="py-3 text-sm text-foreground">{record.book_name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{formatDate(record.borrow_date)}</td>
                    <td className="py-3 text-sm text-muted-foreground">{formatDate(record.return_date)}</td>
                    <td className="py-3 text-sm text-foreground">${record.totalfine.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          record.status === "On Time"
                            ? "bg-accent text-accent-foreground"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{record.processed_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
