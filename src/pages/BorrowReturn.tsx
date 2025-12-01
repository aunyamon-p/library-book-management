import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getBorrows, updateBorrow, deleteBorrow } from "@/api/api";

export default function BorrowReturn() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await getBorrows();
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load borrow records");
    }
  };

  const handleReturn = async (borrowId: number) => {
    try {
      const record = records.find(r => r.borrow_id === borrowId);
      if (!record) return;

      const updated = await updateBorrow(borrowId, {
        ...record,
        status: "returned",
        due_date: new Date().toISOString() // หรือ field สำหรับ return date
      });

      setRecords(records.map(r => r.borrow_id === borrowId ? updated : r));
      toast.success("Book returned successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to return book");
    }
  };

  const handleDelete = async (borrowId: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteBorrow(borrowId);
      setRecords(records.filter(r => r.borrow_id !== borrowId));
      toast.success("Record deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Borrow & Return</h1>
        <p className="text-sm text-muted-foreground">Manage book borrowing and returns</p>
      </div>

      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle>Borrow Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Borrow ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Member Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Book Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Borrow Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.borrow_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">BRW{String(record.borrow_id).padStart(3, "0")}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{record.member_name}</td>
                    <td className="py-3 text-sm text-foreground">{record.book_name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{record.borrow_date.split("T")[0]}</td>
                    <td className="py-3 text-sm text-muted-foreground">{record.due_date.split("T")[0]}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          record.status === "borrowed"
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {record.status === "borrowed" && (
                          <Button variant="outline" size="sm" onClick={() => handleReturn(record.borrow_id)}>
                            Return Book
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(record.borrow_id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
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
