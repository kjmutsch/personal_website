import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isMovingBackward: boolean;
  isMovingForwards: boolean;
  isJumping: boolean;
}

const initialState: AppState = {
  isMovingBackward: false, // Default values
  isMovingForwards: false,
  isJumping: false
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsMovingBackward: (state, action: PayloadAction<boolean>) => {
      state.isMovingBackward = action.payload;
    },
    setIsMovingForwards: (state, action: PayloadAction<boolean>) => {
        state.isMovingForwards = action.payload;
    },
    setIsJumping: (state, action: PayloadAction<boolean>) => {
      state.isJumping = action.payload;
  },
  },
});

export const { setIsMovingBackward, setIsMovingForwards, setIsJumping } = appSlice.actions;
export default appSlice.reducer;
