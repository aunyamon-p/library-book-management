import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminModal } from "@/components/modals/AdminModal";
import { toast } from "sonner";
import { getAdmins, addAdmin, updateAdmin, deleteAdmin } from "@/api/api";

export default function Admin() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admins");
    }
  };

  const handleAdd = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSave = async (adminData) => {
    try {
      if (selectedAdmin) {
        const updated = await updateAdmin(selectedAdmin.admin_id, adminData);
        setAdmins(admins.map(a => a.admin_id === selectedAdmin.admin_id ? updated : a));
        toast.success("Admin updated successfully");
      } else {
        const newAdmin = await addAdmin(adminData);
        setAdmins([...admins, newAdmin]);
        toast.success("Admin added successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save admin");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await deleteAdmin(id);
      setAdmins(admins.filter(a => a.admin_id !== id));
      toast.success("Admin deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete admin");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Management</h1>
          <p className="text-sm text-muted-foreground">Manage system administrators</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Admin Table */}
      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle>Admin List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Username</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">First Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Last Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.admin_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{admin.admin_id}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{admin.username}</td>
                    <td className="py-3 text-sm text-foreground">{admin.first_name}</td>
                    <td className="py-3 text-sm text-foreground">{admin.last_name}</td>
                    <td className="py-3 text-sm text-foreground">{admin.name}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(admin)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(admin.admin_id)}>
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

      {/* Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        admin={selectedAdmin}
      />
    </div>
  );
}
