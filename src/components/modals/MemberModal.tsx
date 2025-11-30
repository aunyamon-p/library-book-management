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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: any) => void;
  member?: any;
}

export function MemberModal({ isOpen, onClose, onSave, member }: MemberModalProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    name: "",
    email: "",
    phone: "",
    borrowlimit: 5,
    date_registered: new Date().toISOString().split("T")[0],
    status: "active",
  });

  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        name: "",
        email: "",
        phone: "",
        borrowlimit: 5,
        date_registered: new Date().toISOString().split("T")[0],
        status: "active",
      });
    }
  }, [member, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.first_name} ${formData.last_name}`;
    onSave({ ...formData, name: fullName });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="borrowlimit">Borrow Limit</Label>
                <Input
                  id="borrowlimit"
                  type="number"
                  value={formData.borrowlimit}
                  onChange={(e) => setFormData({ ...formData, borrowlimit: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_registered">Date Registered</Label>
                <Input
                  id="date_registered"
                  type="date"
                  value={formData.date_registered}
                  onChange={(e) => setFormData({ ...formData, date_registered: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">สมาชิกสามารถใช้งานได้</SelectItem>
                    <SelectItem value="inactive">สมาชิกถูกระงับ / ไม่สามารถยืมได้</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{member ? "Update" : "Add"} Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
