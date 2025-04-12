// store/user/reducer.ts

// Define the initial state for the user slice
const initialState = {
  user: null, // This will hold the user data or null if no user is logged in
};

// Define the user reducer
export const userReducer = (state = initialState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    // Add cases here for user-related actions (e.g., setUser, clearUser, etc.)
    case 'user/setUser':
      return {
        ...state,
        user: action.payload,
      };

    case 'user/clearUser':
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

// Export initial state for potential use
export const selectUser = (state: { user: { user: any } }) => state.user.user;
