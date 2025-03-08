import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

// Create a placeholder auth reducer since we don't have the actual implementation yet
const authReducer = (state = { user: null, isAuthenticated: false }, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers here as they are developed
})

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 