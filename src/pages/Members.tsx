import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { MemberModal } from "@/components/modals/MemberModal";
import { toast } from "sonner";
import { getMembers, addMember, updateMember, deleteMember } from "@/api/api";

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members");
    }
  };

  const handleAdd = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(userId);
      setMembers(members.filter((m) => m.user_id !== userId));
      toast.success("Member deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete member");
    }
  };

  const handleSave = async (memberData: any) => {
    try {
      if (selectedMember) {
        // update
        const updated = await updateMember(selectedMember.user_id, memberData);
        setMembers(members.map((m) => (m.user_id === selectedMember.user_id ? updated : m)));
        toast.success("Member updated successfully");
      } else {
        // add
        const newMember = await addMember(memberData);
        setMembers([...members, newMember]);
        toast.success("Member added successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save member");
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
          <p className="text-sm text-muted-foreground">Manage library members</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card className="shadow-custom">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Member List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Borrow Limit</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date Registered</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.user_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{member.user_id}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{member.name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{member.email}</td>
                    <td className="py-3 text-sm text-muted-foreground">{member.phone}</td>
                    <td className="py-3 text-sm text-muted-foreground">{member.borrowlimit}</td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(member.date_registered).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          member.status === "active"
                            ? "bg-accent text-accent-foreground"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(member.user_id)}>
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

      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        member={selectedMember}
      />
    </div>
  );
}
