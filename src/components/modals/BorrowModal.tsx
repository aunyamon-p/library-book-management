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

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  borrow?: any;
}

export function BorrowModal({ isOpen, onClose, onSave, borrow }: BorrowModalProps) {
  const [formData, setFormData] = useState({
    user_id: "",
    book_id: "",
    borrow_date: new Date().toISOString().split("T")[0],
    due_date: "",
    amount: 1,
    recorded_by: "",
  });

  useEffect(() => {
    if (borrow) {
      setFormData({
        user_id: borrow.user_id,
        book_id: borrow.book_id,
        borrow_date: borrow.borrow_date?.split("T")[0],
        due_date: borrow.due_date?.split("T")[0],
        amount: borrow.amount,
        recorded_by: borrow.recorded_by,
      });
    } else {
      setFormData({
        user_id: "",
        book_id: "",
        borrow_date: new Date().toISOString().split("T")[0],
        due_date: "",
        amount: 1,
        recorded_by: "",
      });
    }
  }, [borrow, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{borrow ? "Edit Borrow" : "Add Borrow"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Book ID</Label>
                <Input
                  value={formData.book_id}
                  onChange={(e) =>
                    setFormData({ ...formData, book_id: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Borrow Date</Label>
                <Input
                  type="date"
                  value={formData.borrow_date}
                  onChange={(e) =>
                    setFormData({ ...formData, borrow_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recorded By</Label>
              <Input
                value={formData.recorded_by}
                onChange={(e) =>
                  setFormData({ ...formData, recorded_by: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
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
