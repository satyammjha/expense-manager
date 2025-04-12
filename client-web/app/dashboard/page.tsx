'use client';

import { useState, useEffect } from 'react';
import { useSessionTimer } from '@/lib/hooks/useSessionTimer';
import ExpenseForm from '@/components/dashboard/expenseForm';
import ExpenseList from '@/components/dashboard/expenseList';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RocketIcon, ClockIcon, ExitIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardPage() {
    const { minutes, seconds } = useSessionTimer();
    const [showLogoutNotification, setShowLogoutNotification] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const session = JSON.parse(localStorage.getItem('session') || 'null');
            if (!session) {
                clearInterval(interval);
                setShowLogoutNotification(true);
                toast.error('Session expired. Redirecting to login...', {
                    duration: 3000,
                    position: 'bottom-right'
                });
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 3000);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn('min-h-screen bg-muted/40', inter.className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        <div className="bg-background p-6 rounded-xl shadow-sm border">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Expense Dashboard</h1>
                                    <p className="text-muted-foreground mt-2">
                                        Track and manage your expenses efficiently
                                    </p>
                                </div>
                                <div className="w-full sm:w-64">
                                    <div className="flex items-center gap-2 text-sm">
                                        <ClockIcon className="h-4 w-4 text-primary" />
                                        <span className="text-muted-foreground">Session:</span>
                                        <span className="font-medium">
                                            {minutes}:{seconds.toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(minutes * 60 + seconds) / (60 * 60) * 100}
                                        className="h-2 mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <ExpenseForm
                            editingExpense={editingExpense}
                            onSuccess={() => setEditingExpense(null)}
                        />


                        <HoverCard>
                            <HoverCardTrigger>
                                <div className="bg-background mt-7 p-6 rounded-xl shadow-sm border cursor-help hover:bg-accent/50 transition-colors">
                                    <h3 className="text-sm font-medium flex items-center gap-2">
                                        <RocketIcon className="h-4 w-4 text-primary" />
                                        Quick Tips
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Click/Hover for expense tracking tips
                                    </p>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-full max-w-xl">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Tracking Tips</h4>
                                    <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground">
                                        <li>Add expenses immediately after purchase</li>
                                        <li>Use specific categories for better insights</li>
                                        <li>Review weekly spending patterns</li>
                                        <li>Set monthly budget goals</li>
                                        <li>Use tags for special occasions</li>
                                    </ul>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>


                    <div className="lg:w-[700px]">
                        <div className="bg-background h-full p-6 rounded-xl shadow-sm border">
                            <ExpenseList onEdit={(expense) => setEditingExpense(expense)} />
                        </div>
                    </div>
                </div>

                {showLogoutNotification && (
                    <Alert variant="destructive" className="fixed bottom-4 right-4 w-fit">
                        <ExitIcon className="h-4 w-4" />
                        <AlertDescription>
                            Session expired. Redirecting to login...
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}