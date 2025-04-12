import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { userReducer } from './user/reducer';
import expensesReducer from './slices/expenseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    user: userReducer,  
    expenses: expensesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;