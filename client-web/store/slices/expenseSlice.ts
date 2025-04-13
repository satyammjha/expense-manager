import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpensesState {
  expenses: Expense[];
}

const initialState: ExpensesState = {
  expenses: [],
};

// Check if window is defined (i.e., client-side)
if (typeof window !== 'undefined') {
  const storedExpenses = localStorage.getItem('expenses');
  if (storedExpenses) {
    initialState.expenses = JSON.parse(storedExpenses);
  }
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('expenses', JSON.stringify(state.expenses));
      }
    },
    editExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex((expense) => expense.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('expenses', JSON.stringify(state.expenses));
        }
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('expenses', JSON.stringify(state.expenses));
      }
    },
  },
});

export const { addExpense, editExpense, deleteExpense } = expensesSlice.actions;

export default expensesSlice.reducer;