
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    cartArray: JSON.parse(localStorage.getItem('jaiswal-retail-userCart'))??[],
    cartSummary: {
        // mrpTotal: 0,
        // discountAmt: 0,
        deliveryChg: 0,
        securedShippingFee: 29,
        // finalAmtToPay: mrpTotal-discountAmt+deliveryChg+securedShippingFee,
    }
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            console.log("hii from addToCart reducer");
            console.log(action.payload._id);
            // console.log(state.cartArray.some(item => item._id === action.payload._id));
            state.cartArray.push(action.payload);

        },
        updateQty: (state, action) => {
            state.cartArray[action.payload.index].qty = action.payload.newQty;
        },
        deleteItem: (state, action) => {
            state.cartArray.splice(action.payload.index, 1);
        },
        setCart: (state,action)=>{
            return {
                ...state,
                cartArray: action.payload
            };
        },
        resetCart: (state,action)=>{
            state.cartArray = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, updateQty, deleteItem, setCart, resetCart} = cartSlice.actions

export default cartSlice.reducer;
