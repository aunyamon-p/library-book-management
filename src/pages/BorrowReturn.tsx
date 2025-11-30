import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const mockRecords = [
  {
    borrow_id: 1,
    user_name: "John Doe",
    book_name: "The Great Gatsby",
    borrow_date: "2024-01-10",
    return_date: null,
    status: "borrowed",
  },
  {
    borrow_id: 2,
    user_name: "Jane Smith",
    book_name: "1984",
    borrow_date: "2024-01-08",
    return_date: "2024-01-22",
    status: "returned",
  },
  {
    borrow_id: 3,
    user_name: "Mike Johnson",
    book_name: "To Kill a Mockingbird",
    borrow_date: "2023-12-20",
    return_date: null,
    status: "borrowed",
  },
];

export default function BorrowReturn() {
  const [records, setRecords] = useState(mockRecords);

  const handleReturn = (borrowId: number) => {
    setRecords(
      records.map((r) =>
        r.borrow_id === borrowId
          ? { ...r, return_date: new Date().toISOString().split("T")[0], status: "returned" }
          : r
      )
    );
    toast.success("Book returned successfully");
  };

  const handleDelete = (borrowId: number) => {
    setRecords(records.filter((r) => r.borrow_id !== borrowId));
    toast.success("Record deleted successfully");
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
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Return Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.borrow_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">BRW{String(record.borrow_id).padStart(3, "0")}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{record.user_name}</td>
                    <td className="py-3 text-sm text-foreground">{record.book_name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{record.borrow_date}</td>
                    <td className="py-3 text-sm text-muted-foreground">{record.return_date || "-"}</td>
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
                        {record.status === "borrowed" ? (
                          <Button variant="outline" size="sm" onClick={() => handleReturn(record.borrow_id)}>
                            Return Book
                          </Button>
                        ) : null}
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
