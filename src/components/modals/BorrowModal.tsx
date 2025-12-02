import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getMembers, getBooks, getAdmins } from "@/api/api";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  borrow?: any;
}

export function BorrowModal({ isOpen, onClose, onSave, borrow }: BorrowModalProps) {
  const [formData, setFormData] = useState({
    user_id: "",
    borrow_date: new Date().toISOString().split("T")[0],
    amount: 1,
    recorded_by: "",
    processed_by: "",
    books: [
      {
        book_id: "",
        due_date: new Date().toISOString().split("T")[0],
      },
    ],
  });

  const [members, setMembers] = useState<any[]>([]);
  const [booksList, setBooksList] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mems = await getMembers();
        const books = await getBooks();
        const adms = await getAdmins(); 
        setMembers(mems);
        setBooksList(books);
        setAdmins(adms);
      } catch (err) {
        console.error("Failed to fetch members, books or admins", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
  if (borrow) {
    setFormData({
      user_id: borrow.user_id,
      borrow_date: borrow.borrow_date?.split("T")[0],
      amount: borrow.amount,
      recorded_by: borrow.recorded_by,
      processed_by: borrow.processed_by ?? "",
      books: borrow.books.map((b: any) => ({
        book_id: b.book_id,
        due_date: b.due_date.split("T")[0],
      })),
    });
  } else if (isOpen) {
    setFormData({
      user_id: "",
      borrow_date: new Date().toISOString().split("T")[0],
      amount: 1,
      recorded_by: "",
      processed_by: "",
      books: [
        {
          book_id: "",
          due_date: new Date().toISOString().split("T")[0],
        },
      ],
    });
  }
}, [borrow, isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleBookChange = (idx: number, key: string, value: string) => {
    const updated = [...formData.books];
    updated[idx][key] = value;
    setFormData({ ...formData, books: updated });
  };

  const addBookRow = () => {
    setFormData({
      ...formData,
      books: [
        ...formData.books,
        { book_id: "", due_date: new Date().toISOString().split("T")[0] },
      ],
    });
  };

  const removeBookRow = (idx: number) => {
    setFormData({
      ...formData,
      books: formData.books.filter((_, i) => i !== idx),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{borrow ? "Edit Borrow" : "Add Borrow"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Label>Member</Label>
            <Select
              value={formData.user_id}
              onValueChange={(val) => setFormData({ ...formData, user_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.user_id} value={String(m.user_id)}>
                    {m.user_id} — {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Recorded By (Admin)</Label>
            <Select
              value={formData.recorded_by}
              onValueChange={(val) => setFormData({ ...formData, recorded_by: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select admin" />
              </SelectTrigger>
              <SelectContent>
                {admins.map((a) => (
                  <SelectItem key={a.admin_id} value={String(a.admin_id)}>
                    {a.admin_id} — {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Borrow Date</Label>
            <Input
              type="date"
              value={formData.borrow_date}
              onChange={(e) =>
                setFormData({ ...formData, borrow_date: e.target.value })
              }
              required
            />

            {formData.books.map((book, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label>Book</Label>
                  <Select
                    value={book.book_id}
                    onValueChange={(val) => handleBookChange(idx, "book_id", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {booksList.map((b) => (
                        <SelectItem key={b.book_id} value={String(b.book_id)}>
                          {b.book_id} — {b.book_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={book.due_date}
                    onChange={(e) => handleBookChange(idx, "due_date", e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  {idx === 0 ? (
                    <Button type="button" onClick={addBookRow}>
                      + Add
                    </Button>
                  ) : (
                    <Button type="button" variant="destructive" onClick={() => removeBookRow(idx)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {borrow ? "Update" : "Add Borrow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
