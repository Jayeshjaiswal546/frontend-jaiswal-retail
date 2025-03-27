
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    token: JSON.parse(localStorage.getItem('jaiswal-retail-userToken')),
    // userCart: [],
  }


  export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      addUserToken: (state,action) => {
        state.token = action.payload;
      },
      removeUserToken: (state) => {
        state.token = null
      },
      // addUserCart: (state,action)=>{
      //   state.userCart = action.payload;
      // },
      // removeUserCart: ()=>{
      //   state.userCart = [];
      // }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { addUserToken, removeUserToken,} = userSlice.actions
  
  export default userSlice.reducer;
