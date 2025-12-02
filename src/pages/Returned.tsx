import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getReturnDetails, deleteReturn } from "@/api/api";

export default function Returned() {
  const [records, setRecords] = useState<any[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
  try {
    const data = await getReturnDetails();

    const grouped = data.reduce((acc: any, item: any) => {
      if (!acc[item.return_id]) {
        acc[item.return_id] = {
          return_id: item.return_id,
          return_header_date: item.detail_return_date,
          totalfine: item.totalfine || 0,
          processed_by: item.processed_by,
          processed_by_name: item.processed_by_name || (item.processed_by ? `ID ${item.processed_by}` : "-"),
          details: [],
        };
      }

      const retDate = new Date(item.detail_return_date || item.return_date);
      const dueDate = new Date(item.due_date);
      const lateDays = Math.max(0, Math.ceil((retDate.getTime() - dueDate.getTime()) / (1000*60*60*24)));
      const fine = lateDays * 5;

      acc[item.return_id].details.push({
        borrow_id: item.borrow_id,
        book_id: item.book_id,
        book_name: item.book_name,
        member_name: item.member_name,
        status: lateDays > 0 ? "Late" : "OnTime",
        fine: fine || 0,
        return_date: item.return_date,
        due_date: item.due_date,
      });

      return acc;
    }, {} as Record<number, any>);

    setRecords(Object.values(grouped));
  } catch (err) {
    toast.error("Failed to load return records");
    console.error(err);
  }
};
  const handleDelete = async (returnId: number) => {
    if (!confirm("Are you sure you want to delete this return record?")) return;
    try {
      await deleteReturn(returnId);
      toast.success("Return record deleted successfully");
      setRecords(records.filter(r => r.return_id !== returnId));
    } catch (err) {
      toast.error("Failed to delete return record");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Return Records</h1>

      {records.map(record => (
        <Card key={record.return_id} className="shadow-custom">
          <CardHeader
            onClick={() => setOpenId(openId === record.return_id ? null : record.return_id)}
            className="cursor-pointer"
          >
            <CardTitle>
              RET{String(record.return_id).padStart(3, "0")} — {record.details[0].member_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Return Date: {new Date(record.return_header_date).toLocaleDateString()} | 
              Processed by: {record.processed_by_name}
            </p>
          </CardHeader>

          {openId === record.return_id && (
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th>Book Name</th>
                    <th>Member Name</th>
                     <th>Due Date</th> 
                    <th>Status</th>
                    <th>Fine</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {record.details.map(book => (
                    <tr key={book.book_id}>
                      <td>{book.book_name}</td>
                      <td>{book.member_name}</td>
                      <td>{new Date(book.due_date).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            book.status === "OnTime"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {book.status === "OnTime" ? "On time" : "Late"}
                        </span>
                      </td>
                      <td>{book.fine}฿</td>
                      <td className="text-right">
                        <button
                          className="text-red-500 flex items-center gap-1"
                          onClick={() => handleDelete(record.return_id)}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
