import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ArrowLeftRight, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboard, getBorrows } from "@/api/api"; // API calls

export default function Dashboard() {
  const [stats, setStats] = useState([
    { name: "Total Books", value: "-", icon: BookOpen, change: "" },
    { name: "Total Members", value: "-", icon: Users, change: "" },
    { name: "Borrowed Books", value: "-", icon: ArrowLeftRight, change: "" },
    { name: "Overdue", value: "-", icon: AlertCircle, change: "" },
  ]);

  const [recentBorrows, setRecentBorrows] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
    fetchRecentBorrows();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard(); 
      setStats([
        { name: "Total Books", value: data.totalBooks, icon: BookOpen, change: "+0%" },
        { name: "Total Members", value: data.totalMembers, icon: Users, change: "+0%" },
        { name: "Borrowed Books", value: data.borrowedBooks, icon: ArrowLeftRight, change: "0%" },
        { name: "Overdue", value: data.overdueBooks, icon: AlertCircle, change: "0%" },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentBorrows = async () => {
    try {
      const borrows = await getBorrows();
      setRecentBorrows(borrows.slice(-5).reverse()); // last 5 records
      // ตัวอย่างสร้าง chart data แบบง่าย: จำนวน borrow/return ต่อเดือน
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const chartMap: any = {};
      borrows.forEach((b) => {
        const month = new Date(b.borrow_date).getMonth();
        if (!chartMap[month]) chartMap[month] = { month: months[month], borrowed: 0, returned: 0 };
        chartMap[month][b.status === "borrowed" ? "borrowed" : "returned"] += 1;
      });
      setChartData(Object.values(chartMap));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-custom">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle>Borrow & Return Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
              <Bar dataKey="borrowed" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returned" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-custom">
        <CardHeader>
          <CardTitle>Recent Borrow Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Member</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Book</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBorrows.map((record) => (
                  <tr key={record.borrow_id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">BRW{String(record.borrow_id).padStart(3, "0")}</td>
                    <td className="py-3 text-sm text-foreground">{record.member_name}</td>
                    <td className="py-3 text-sm text-foreground">{record.book_name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(record.borrow_date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          record.status === "borrowed"
                            ? "bg-accent text-accent-foreground"
                            : record.status === "returned"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
