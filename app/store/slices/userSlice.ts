import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userData: { firstname: string; email: string } | null;
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ firstname: string; email: string }>) {
      state.userData = action.payload;
    },
    clearUser(state) {
      state.userData = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
