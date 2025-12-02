import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories } from "@/api/api";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: any) => void;
  book?: any;
}

interface Category {
  category_id: number;
  category_name: string;
}

export function BookModal({ isOpen, onClose, onSave, book }: BookModalProps) {
  const [formData, setFormData] = useState({
    isbn: "",
    book_name: "",
    author: "",
    publisher: "",
    publish_year: new Date().getFullYear(),
    shelf: "",
    status: "available",
    category_id: 1,
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.data)) setCategories(data.data);
        else setCategories([]);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (book) {
      setFormData({
        isbn: book.isbn ?? "",
        book_name: book.book_name ?? "",
        author: book.author ?? "",
        publisher: book.publisher ?? "",
        publish_year: book.publish_year ?? new Date().getFullYear(),
        shelf: book.shelf ?? "",
        status: book.status ?? "available",
        category_id: book.category_id ?? 1,
      });
    } else {
      setFormData({
        isbn: "",
        book_name: "",
        author: "",
        publisher: "",
        publish_year: new Date().getFullYear(),
        shelf: "",
        status: "available",
        category_id: 1,
      });
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Defer API calls to the parent so the modal only manages form state.
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="book_name">Book Name</Label>
                <Input
                  id="book_name"
                  value={formData.book_name}
                  onChange={(e) => setFormData({ ...formData, book_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publish_year">Publish Year</Label>
                <Input
                  id="publish_year"
                  type="number"
                  value={formData.publish_year}
                  onChange={(e) => setFormData({ ...formData, publish_year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shelf">Shelf</Label>
                <Input
                  id="shelf"
                  value={formData.shelf}
                  onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
  value={formData.category_id.toString()}
  onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
>
  <SelectTrigger id="category">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    {categories.map((cat) => (
      <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
        {cat.category_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
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
                    <SelectItem value="available">หนังสือพร้อมให้ยืม</SelectItem>
                    <SelectItem value="borrowed">หนังสือถูกยืมอยู่</SelectItem>
                    <SelectItem value="lost">หนังสือสูญหายหรือไม่พร้อมใช้งาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{book ? "Update" : "Add"} Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
