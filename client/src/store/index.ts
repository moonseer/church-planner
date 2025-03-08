import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more reducers here as they are developed
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 