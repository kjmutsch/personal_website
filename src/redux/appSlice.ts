import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isMovingBackward: boolean;
  isMovingForwards: boolean;

}

const initialState: AppState = {
  isMovingBackward: false, // Default value
  isMovingForwards: false, // Default value
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
  },
});

export const { setIsMovingBackward, setIsMovingForwards } = appSlice.actions;
export default appSlice.reducer;
