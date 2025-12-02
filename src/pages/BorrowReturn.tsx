import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 , Plus } from "lucide-react";
import { toast } from "sonner";
import { getBorrows, deleteBorrow, addBorrow, addReturn } from "@/api/api";
import { BorrowModal } from "./../components/modals/BorrowModal";

export default function BorrowReturn() {
  const [records, setRecords] = useState<any[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await getBorrows();
      setRecords(data);
    } catch (err) {
      toast.error("Failed to load borrow records");
    }
  };

  const handleReturnBook = async (record: any, book: any) => {
    const processedBy = record?.processed_by || record?.recorded_by;
    if (!processedBy) {
      toast.error("No 'processed by' admin found for this borrow record.");
      return;
    }
    try {
      const returnDate = new Date();
      const dueDate = new Date(book.due_date);

      const lateDays = Math.max(
        0,
        Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      const fine = lateDays * 5;
      const status = lateDays > 0 ? "Late" : "OnTime";

      const payload = {
        totalfine: fine,
        processed_by: Number(processedBy),
        items: [
          {
            return_id: 0,
            borrow_id: record.borrow_id,
            book_id: book.book_id,
            return_date: returnDate.toISOString(),
            fine: fine,
            status: status,
          },
        ],
      };

      await addReturn(payload);

      toast.success(
        `Book "${book.book_name}" returned successfully (${status}${
          fine > 0 ? `, Fine: ${fine}฿` : ""
        })`
      );
      fetchRecords();
    } catch (error) {
      console.error(error);
      toast.error("Failed to return book");
    }
  };

  const handleSave = async (data: any) => {
    try {
      await addBorrow(data);
      toast.success("Borrow record created");
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (borrowId: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteBorrow(borrowId);
      setRecords(records.filter(r => r.borrow_id !== borrowId));
      toast.success("Record deleted successfully");
    } catch {
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="space-y-6">
      <BorrowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        borrow={editRecord}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Borrow & Return</h1>

        <Button
          onClick={() => {
            setEditRecord(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Borrow Record
        </Button>
      </div>

      {records.map(record => (
        <Card key={record.borrow_id} className="shadow-custom">
          <CardHeader
            onClick={() => setOpenId(openId === record.borrow_id ? null : record.borrow_id)}
            className="cursor-pointer"
          >
            <CardTitle>
              BRW{String(record.borrow_id).padStart(3, "0")} — {record.member_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Borrow Date: {record.borrow_date.split("T")[0]} | Books: {record.books.length}
            </p>
          </CardHeader>

          {openId === record.borrow_id && (
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th>Book Name</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {record.books.map(book => (
                    <tr key={book.book_id}>
                      <td>{book.book_name}</td>
                      <td>{book.due_date.split("T")[0]}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            book.status === "borrowed"
                              ? "bg-accent"
                              : book.status === "Late"
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>
                      <td className="text-left">
                        {book.status === "borrowed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReturnBook(record, book)}
                          >
                            Return Book
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right mt-3 ">
                <Button variant="destructive" onClick={() => handleDelete(record.borrow_id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
