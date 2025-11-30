import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { BookModal } from "@/components/modals/BookModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const mockBooks = [
  {
    book_id: 1,
    isbn: "978-0-06-112008-4",
    book_name: "To Kill a Mockingbird",
    author: "Harper Lee",
    publisher: "HarperCollins",
    publish_year: 1960,
    shelf: "A-12",
    amount: 5,
    status: "available",
    category_name: "Fiction",
  },
  {
    book_id: 2,
    isbn: "978-0-452-28423-4",
    book_name: "1984",
    author: "George Orwell",
    publisher: "Penguin Books",
    publish_year: 1949,
    shelf: "B-08",
    amount: 3,
    status: "borrowed",
    category_name: "Science Fiction",
  },
  {
    book_id: 3,
    isbn: "978-0-7432-7356-5",
    book_name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publisher: "Scribner",
    publish_year: 1925,
    shelf: "A-15",
    amount: 0,
    status: "lost",
    category_name: "Fiction",
  },
];

export default function Books() {
  const [books, setBooks] = useState(mockBooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof mockBooks[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleAdd = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEdit = (book: typeof mockBooks[0]) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (bookId: number) => {
    setBooks(books.filter((b) => b.book_id !== bookId));
    toast.success("Book deleted successfully");
  };

  const handleSave = (bookData: any) => {
    if (selectedBook) {
      setBooks(books.map((b) => (b.book_id === selectedBook.book_id ? { ...bookData, book_id: b.book_id } : b)));
      toast.success("Book updated successfully");
    } else {
      setBooks([...books, { ...bookData, book_id: books.length + 1 }]);
      toast.success("Book added successfully");
    }
    setIsModalOpen(false);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.book_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <div className="flex flex-col gap-2 sm:flex-row">
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
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                  <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
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
                    <td className="py-3 text-sm text-muted-foreground">{book.publisher}</td>
                    <td className="py-3 text-sm text-muted-foreground">{book.publish_year}</td>
                    <td className="py-3 text-sm text-muted-foreground">{book.shelf}</td>
                    <td className="py-3 text-sm text-muted-foreground">{book.amount}</td>
                    <td className="py-3 text-sm text-muted-foreground">{book.category_name}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          book.status === "available"
                            ? "bg-accent text-accent-foreground"
                            : book.status === "borrowed"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
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
