import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { MemberModal } from "@/components/modals/MemberModal";
import { toast } from "sonner";

const mockMembers = [
  {
    user_id: 1,
    name: "John Doe",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    borrowlimit: 5,
    date_registered: "2023-01-15",
    status: "active",
  },
  {
    user_id: 2,
    name: "Jane Smith",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@email.com",
    phone: "+1-555-0124",
    borrowlimit: 5,
    date_registered: "2023-02-20",
    status: "active",
  },
  {
    user_id: 3,
    name: "Mike Johnson",
    first_name: "Mike",
    last_name: "Johnson",
    email: "mike.j@email.com",
    phone: "+1-555-0125",
    borrowlimit: 3,
    date_registered: "2023-03-10",
    status: "inactive",
  },
];

export default function Members() {
  const [members, setMembers] = useState(mockMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member: typeof mockMembers[0]) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    setMembers(members.filter((m) => m.user_id !== userId));
    toast.success("Member deleted successfully");
  };

  const handleSave = (memberData: any) => {
    if (selectedMember) {
      setMembers(members.map((m) => (m.user_id === selectedMember.user_id ? { ...memberData, user_id: m.user_id } : m)));
      toast.success("Member updated successfully");
    } else {
      setMembers([...members, { ...memberData, user_id: members.length + 1 }]);
      toast.success("Member added successfully");
    }
    setIsModalOpen(false);
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
                    <td className="py-3 text-sm text-muted-foreground">{member.date_registered}</td>
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
