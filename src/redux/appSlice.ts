// Redux slice for movement intent flags and the iris transition trigger.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isMovingBackwards: boolean;
  isMovingForwards: boolean;
  isJumping: boolean;
  isIrisActive: boolean;
}

const initialState: AppState = {
  isMovingBackwards: false,
  isMovingForwards: false,
  isJumping: false,
  isIrisActive: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsMovingBackward: (state, action: PayloadAction<boolean>) => {
      state.isMovingBackwards = action.payload;
    },
    setIsMovingForwards: (state, action: PayloadAction<boolean>) => {
      state.isMovingForwards = action.payload;
    },
    setIsJumping: (state, action: PayloadAction<boolean>) => {
      state.isJumping = action.payload;
    },
    triggerIris: (state) => {
      state.isIrisActive = true;
    },
    endIris: (state) => {
      state.isIrisActive = false;
    },
  },
});

export const {
  setIsMovingBackward,
  setIsMovingForwards,
  setIsJumping,
  triggerIris,
  endIris,
} = appSlice.actions;
export default appSlice.reducer;
