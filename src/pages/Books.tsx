import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "@/api/api"; // API จริง
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { BookModal } from "@/components/modals/BookModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      toast.error("Cannot load books");
    }
  };

  const handleAdd = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(bookId);
      setBooks(books.filter((b) => b.book_id !== bookId));
      toast.success("Book deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete book");
    }
  };

  const handleSave = (bookData: any) => {
    if (selectedBook) {
      setBooks(books.map((b) => (b.book_id === selectedBook.book_id ? bookData : b)));
      toast.success("Book updated successfully");
    } else {
      setBooks([...books, bookData]);
      toast.success("Book added successfully");
    }
    setIsModalOpen(false);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.book_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory = filterCategory === "all" || book.category_name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Books</h1>
          <p className="text-sm text-muted-foreground">Manage your library's book collection</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <Card className="shadow-custom">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Book List</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:w-64"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Array.from(new Set(books.map((b) => b.category_name))).map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">ISBN</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Book Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Author</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Publisher</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Year</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Shelf</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.book_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{book.isbn}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{book.book_name}</td>
                    <td className="py-3 text-sm text-foreground">{book.author}</td>
                    <td className="py-3 text-sm text-foreground">{book.publisher}</td>
                    <td className="py-3 text-sm text-foreground">{book.publish_year}</td>
                    <td className="py-3 text-sm text-foreground">{book.shelf}</td>
                    <td className="py-3 text-sm text-foreground">{book.amount}</td>
                    <td className="py-3 text-sm text-foreground">{book.category_name}</td>
                    <td className="py-3 text-sm text-foreground">{book.status}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(book)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(book.book_id)}>
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

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        book={selectedBook}
      />
    </div>
  );
}
