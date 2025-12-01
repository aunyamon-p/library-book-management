import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryModal } from "@/components/modals/CategoryModal";
import { toast } from "sonner";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/api/api";

export default function Category() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  // โหลด categories จาก API ตอน mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Cannot load categories");
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(c => c.category_id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  const handleSave = async (categoryData: any) => {
    try {
      if (selectedCategory) {
        // Update existing category
        const updated = await updateCategory(selectedCategory.category_id, categoryData);
        setCategories(categories.map(c => c.category_id === selectedCategory.category_id ? updated : c));
        toast.success("Category updated successfully");
      } else {
        // Add new category
        const added = await addCategory(categoryData);
        setCategories([...categories, added]);
        toast.success("Category added successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage book categories</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Category ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Category Name</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.category_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{category.category_id}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{category.category_name}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(category.category_id)}>
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
      />
    </div>
  );
}
