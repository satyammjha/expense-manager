
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense, editExpense } from '@/store/slices/expenseSlice';
import { format } from 'date-fns';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseFormProps {
    editingExpense?: {
        id: string;
        title: string;
        amount: number;
        category: string;
        date: string;
    };
    onSuccess?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ editingExpense, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: '',
    });
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (editingExpense) {
            const isCustomCategory = !['Food', 'Transport', 'Housing', 'Entertainment'].includes(editingExpense.category);

            setFormData({
                title: editingExpense.title,
                amount: editingExpense.amount.toString(),
                category: editingExpense.category,
                date: editingExpense.date,
            });

            setShowCustomCategory(isCustomCategory);
        }
    }, [editingExpense]);

    const handleCategoryChange = (value: string) => {
        const isOther = value === 'Other';
        setShowCustomCategory(isOther);

        if (isOther) {
            setFormData(prev => ({ ...prev, category: '' }));
        } else {
            setFormData(prev => ({ ...prev, category: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.date) {
            toast.error('Please select a date');
            return;
        }

        if (showCustomCategory && !formData.category.trim()) {
            toast.error('Please enter a custom category');
            return;
        }

        if (!formData.title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        const expense = {
            id: editingExpense ? editingExpense.id : Date.now().toString(),
            title: formData.title.trim(),
            amount: parseFloat(formData.amount),
            category: formData.category.trim(),
            date: formData.date,
        };

        if (editingExpense) {
            dispatch(editExpense(expense));
            toast.success('Expense updated successfully!');
        } else {
            dispatch(addExpense(expense));
            toast.success('Expense added successfully!');
        }

        setFormData({ title: '', amount: '', category: '', date: '' });
        setShowCustomCategory(false);
        onSuccess?.();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Dinner with clients"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (USD) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="49.99"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={showCustomCategory ? "Other" : formData.category}
                                onValueChange={handleCategoryChange}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Housing">Housing</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>

                            {showCustomCategory && (
                                <div className="mt-2">
                                    <Input
                                        id="customCategory"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Enter custom category"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        id="date"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? (
                                            format(new Date(formData.date), 'PPP')
                                        ) : (
                                            <span>Select date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date ? new Date(formData.date) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                setFormData({
                                                    ...formData,
                                                    date: format(date, 'yyyy-MM-dd'),
                                                });
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <input
                                type="hidden"
                                value={formData.date}
                                required
                                readOnly
                                aria-hidden
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="submit"
                            className="w-full md:w-auto bg-black text-white hover:bg-gray-800"
                            variant={editingExpense ? 'default' : 'secondary'}
                        >
                            {editingExpense ? 'Update Expense' : 'Add Expense'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ExpenseForm;