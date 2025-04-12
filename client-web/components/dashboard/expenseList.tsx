
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { deleteExpense } from '@/store/slices/expenseSlice';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Trash2, Edit, Search, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

interface ExpenseListProps {
    onEdit: (expense: any) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onEdit }) => {
    const dispatch = useDispatch();
    const expenses = useSelector((state: RootState) => state.expenses.expenses);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const categories = Array.from(new Set(expenses.map(e => e.category)));

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
        const matchesDate = !selectedDate ||
            new Date(expense.date).toDateString() === selectedDate.toDateString();

        return matchesSearch && matchesCategory && matchesDate;
    });

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDate(null);
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center justify-between">
                    <span>Expenses</span>
                    <div className="flex items-center gap-4 w-full max-w-3xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search expenses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {searchQuery && (
                                <X
                                    className="absolute right-3 top-3 h-4 w-4 cursor-pointer"
                                    onClick={() => setSearchQuery('')}
                                />
                            )}
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DatePicker
                            selected={selectedDate || undefined}
                            onSelect={(date) => setSelectedDate(date || null)}
                            placeholder="Filter by date"
                            className="w-[200px]"
                        />
                        {(searchQuery || selectedCategory !== 'all' || selectedDate) && (
                            <Button
                                variant="ghost"
                                onClick={handleResetFilters}
                                className="text-muted-foreground"
                            >
                                Clear Filters
                                <X className="h-4 w-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        {expenses.length === 0 ? (
                            'No expenses added yet!'
                        ) : (
                            'No expenses found matching your criteria'
                        )}
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell className="font-medium">
                                            {expense.title}
                                        </TableCell>
                                        <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 bg-accent rounded-full text-sm">
                                                {expense.category}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(expense.date).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEdit(expense)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    dispatch(deleteExpense(expense.id));
                                                    toast.warning('Expense deleted successfully');
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ExpenseList;