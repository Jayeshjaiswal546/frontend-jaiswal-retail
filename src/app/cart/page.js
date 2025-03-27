"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, updateQty } from '../redux/reducers/cartSlice';
import { inform, warn } from '../functions/notifyUser';
import { toast, ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { UpdateCartOnServer } from '../products/page';
import { showSpinner } from '../functions/respondToUser';
import { backendBaseUrl } from '../api/api';

export default function Cart() {
    const user = useSelector((state) => state.user.token);
    const cart = useSelector((state => state.cart.cartArray));
    let [isProccedClicked, setIsProceedClicked] = useState(false);
    
    useEffect(() => {
        console.log("changes happen in cart in cart page");
        UpdateCartOnServer(user, cart);
    }, [cart]);

    return (
        <>
            <div className='max-w-[1460px] mx-auto'>
                <ToastContainer />
                <h1 className='font-bold text-[25px] mt-[30px]'>Shopping Cart</h1>
                {
                    cart.length ?
                        <div className='w-[1350px] grid grid-cols-3 mx-auto'>
                            <div className=' col-span-2'>
                                {
                                    cart.map((v, i) => <CartRow prop={v} index={i} key={i} />)
                                }

                            </div>
                            <div className='p-[5px]'>
                                <CartSummary isProccedClicked={isProccedClicked} setIsProceedClicked={setIsProceedClicked}/>
                            </div>
                        </div>
                        :
                        <div className='h-[50vh] flex justify-center items-center'>
                            <h1>Cart is Empty</h1>
                        </div>

                }

            </div>

        </>
    )
}

function CartRow({ prop, index }) {
    const dispatch = useDispatch();
    const cart = useSelector((state => state.cart.cartArray));

    let increaseQty = () => {
        let newQty = cart[index].qty + 1;
        dispatch(updateQty({ index, newQty: newQty }));
    }
    let decreaseQty = () => {
        let newQty = cart[index].qty - 1;
        dispatch(updateQty({ index, newQty: newQty }));
    }

    let hanldeItemDelete = () => {
        dispatch(deleteItem({ index }));
        warn(toast, <h1><b>{prop.title}</b> <br />Removed from cart</h1>);

    }

    return (
        <>
            <div className='m-[5px] shadow-lg'>
                <div className='grid grid-cols-6'>
                    <div>
                        <img src={prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`} alt='product-image' />
                    </div>
                    <div className='col-span-4 p-[5px]'>
                        <h1 className='font-bold text-[18px]'>{prop.title}</h1>
                        <h1 className='text-gray-500'>{prop.brand}</h1>
                        <h2 className='text-green-500'>{prop.availabilityStatus ? 'In Stock' : 'Out of Stock'}</h2>
                        <h2 className='font-bold text-[20px]'>
                            <span className='text-gray-500 font-normal line-through'>&#8377;{Math.floor(prop.mrp)}</span>  &#8377;{Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100))}
                        </h2>
                        <div className='w-[70%] flex justify-between'>
                            <div className='flex border-2 border-yellow-500 w-[100px] justify-between items-center rounded-[20px] overflow-hidden'>
                                <button onClick={decreaseQty} disabled={prop.qty == 1 ? true : false} className='px-[10px]'>-</button>
                                <h1>{prop.qty}</h1>
                                <button onClick={increaseQty} className='px-[10px]'>+</button>
                            </div>
                            <button onClick={hanldeItemDelete} className='text-blue-500'>Delete</button>
                            <button className='text-blue-500'>Save For Later</button>
                        </div>

                    </div>
                    <div className='p-[5px]'>
                        <h1>Items Total</h1>
                        <h2 className='font-bold'>&#8377; {prop.qty * (Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100)))}</h2>
                    </div>
                </div>
            </div>
        </>
    )
}

function CartSummary({isProccedClicked,setIsProceedClicked}) {
    const cart = useSelector((state => state.cart.cartArray));

    let deliveryChg = 0;
    let packChg = 29;

    let totalprice = cart.reduce((accumulator, currentValue) => accumulator + Math.floor(currentValue.mrp) * currentValue.qty, 0);
    let discountAmt = cart.reduce((accumulator, currentValue) => accumulator + Math.ceil(Math.floor(currentValue.mrp) - (Math.floor(currentValue.mrp - (currentValue.mrp * currentValue.discountPercentage / 100)))) * currentValue.qty, 0);
    let totalCartVale = totalprice - discountAmt + deliveryChg + packChg;

    return (
        <>
            <div className='shadow-lg p-[10px]'>
                <h1 className='text-[25px] font-bold'>Cart Summary</h1>
                <div className='flex flex-col gap-[20px] my-[10px]'>
                    <div className='flex justify-between  items-center'>
                        <h1>Total Items Price</h1>
                        <h2>&#8377;{totalprice}</h2>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1>Discount</h1>
                        <h2>- &#8377; {discountAmt}</h2>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1>Delivery Charges</h1>
                        <h2><span className='text-green-500'>FREE </span><span className='line-through text-gray-500'>&#8377; 250</span> </h2>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1>Secured Packaging Fee</h1>
                        <h2>&#8377; 29</h2>
                    </div>

                    <div className='flex justify-between items-center font-bold py-[10px] border-y-2 border-black'>
                        <h1>Total Amount</h1>
                        <h2>&#8377; {totalCartVale}</h2>
                    </div>
                    <button className='bg-blue-500 text-white' onClick={()=>setIsProceedClicked(true)}>
                        <Link href="/shipping-info" className='w-full block py-[8px]'>
                            {showSpinner(isProccedClicked, `Proceed to Buy (${cart.length} items)`)}
                        </Link>
                    </button>
                </div>
            </div>
        </>
    )
}

export function calculateSummary(cart, cartSummary) {
    let mrpTotal = cart.reduce((accumulator, currentValue) => accumulator + Math.floor(currentValue.mrp) * currentValue.qty, 0);
    let discountAmt = cart.reduce((accumulator, currentValue) => accumulator + Math.ceil(Math.floor(currentValue.mrp) - (Math.floor(currentValue.mrp - (currentValue.mrp * currentValue.discountPercentage / 100)))) * currentValue.qty, 0);
    // let finalAmtToPay = totalprice - discountAmt + deliveryChg + packChg;

    // const mrpTotal = cart.reduce((sum, item) => sum + item.mrp, 0);
    // const discountAmt = cart.reduce((sum, item) => sum + item.discount, 0);
    return {
        mrpTotal,
        discountAmt,
        finalAmtToPay: mrpTotal - discountAmt + cartSummary.deliveryChg + cartSummary.securedShippingFee,
        deliveryChg: cartSummary.deliveryChg,
        securedShippingFee: cartSummary.securedShippingFee
    };
};

