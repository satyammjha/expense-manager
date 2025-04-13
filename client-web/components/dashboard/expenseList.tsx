import React, { useState, useMemo } from 'react';
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
import { Trash2, Edit, Search, Filter, X, ArrowUp, ArrowDown, Currency, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseListProps {
    onEdit: (expense: any) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onEdit }) => {
    const dispatch = useDispatch();
    const expenses = useSelector((state: RootState) => state.expenses.expenses);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const matchesSearch = expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                expense.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
            const matchesDate = !selectedDate ||
                new Date(expense.date).toDateString() === selectedDate.toDateString();

            return matchesSearch && matchesCategory && matchesDate;
        });
    }, [expenses, searchQuery, selectedCategory, selectedDate]);

    const categories = useMemo(() =>
        Array.from(new Set(expenses.map(e => e.category))) as string[],
        [expenses]
    );

    const stats = useMemo(() => {
        if (filteredExpenses.length === 0) return null;

        const amounts = filteredExpenses.map(e => e.amount);
        const total = amounts.reduce((a, b) => a + b, 0);
        const average = total / filteredExpenses.length;
        const max = Math.max(...amounts);
        const min = Math.min(...amounts);

        return {
            total,
            average,
            max,
            min,
            maxExpense: filteredExpenses.find(e => e.amount === max),
            minExpense: filteredExpenses.find(e => e.amount === min)
        };
    }, [filteredExpenses]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDate(null);
    };

    return (
        <>

            <CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Spending Card */}
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <Currency className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Spending</p>
                                <p className="text-2xl font-semibold">
                                    ₹{stats?.total.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Average Spending Card */}
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Average</p>
                                <p className="text-2xl font-semibold">
                                    ₹{stats?.average.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Max Spending Card */}
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <ArrowUp className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Max Spending</p>
                                <p className="text-2xl font-semibold">
                                    ₹{stats?.max.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                                </p>
                                {stats?.maxExpense && (
                                    <Badge variant="outline" className="mt-1">
                                        {stats.maxExpense.category}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Min Spending Card */}
                    <div className="bg-background p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <ArrowDown className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Min Spending</p>
                                <p className="text-2xl font-semibold">
                                    ₹{stats?.min.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                                </p>
                                {stats?.minExpense && (
                                    <Badge variant="outline" className="mt-1">
                                        {stats.minExpense.category}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <CardTitle className="text-2xl font-semibold">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                    
                        <div className="w-full md:w-auto flex flex-col gap-4">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search expenses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10 w-full md:w-[300px]"
                                />
                                {searchQuery && (
                                    <X
                                        className="absolute right-3 top-3 h-4 w-4 cursor-pointer"
                                        onClick={() => setSearchQuery('')}
                                    />
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full md:w-[180px]">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Category" />
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
                                    placeholder="Select Date"
                                    className="w-full md:w-[200px]"
                                />

                                {(searchQuery || selectedCategory !== 'all' || selectedDate) && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleResetFilters}
                                        className="text-muted-foreground w-full md:w-auto"
                                    >
                                        Clear Filters
                                        <X className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
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
                                        <TableCell>
                                            ₹{expense.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {expense.category}
                                            </Badge>
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
                                                className="gap-2"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="hidden md:inline">Edit</span>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    dispatch(deleteExpense(expense.id));
                                                    toast.warning('Expense deleted successfully');
                                                }}
                                                className="gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="hidden md:inline">Delete</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </>
    );
};

export default ExpenseList;