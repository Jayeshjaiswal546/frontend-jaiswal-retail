"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify'
import { deleteItem, updateQty } from '../redux/reducers/cartSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { backendBaseUrl } from '../api/api';
import { calculateSummary } from '../cart/page';
import { showSpinner } from '../functions/respondToUser';

export default function page() {
    let router = useRouter();
    const cart = useSelector((state => state.cart.cartArray));
    const cartSummary = useSelector((state => state.cart.cartSummary));
    const user = useSelector((state) => state.user.token);
    let [isProccedClicked, setIsProceedClicked] = useState(false);


    useEffect(() => {
        if (!cart.length) {
            router.replace('products');
        }
    }, []);

    let shippingInfo = {};


    let hanldeShipAndModeSubmit = (e) => {
        e.preventDefault();
        setIsProceedClicked(true);
        // console.log(e.target.state.value);

        if (e.target.state.value == "") {
            alert("Please select state");
            setIsProceedClicked(false);
        } else {
            const formData = new FormData(e.target);
            formData.forEach((v, i) => {
                shippingInfo[i] = v;
            });
            // console.log("Below is the result");
            // console.log(shippingInfo);
            const tempObj = calculateSummary(cart, cartSummary);

            axios.post(`${backendBaseUrl}/order/create-order`, { shippingInfo, cart, ...tempObj, token: user })
                .then(res => res.data)
                .then(finalRes => {
                    console.log(finalRes.message);

                    router.push(`/order-summary/${finalRes.data.orderId}`);


                }).catch((error) => {
                    console.log(error);
                    console.log("something went xrong in frontend");
                    setIsProceedClicked(false);
                })
        }
    }

    return (
        <>
            <div className='max-w-[1460px] mx-auto'>
                <ToastContainer />
                <h1 className='font-bold text-[25px] mt-[30px]'>Shipping Information</h1>
                <div className='w-[1350px] grid grid-cols-8 mx-auto'>
                    <div className='p-[5px] col-span-3'>
                        {
                            cart.map((v, i) => <CartItemsSummaryRow prop={v} index={i} key={i} />)
                        }

                    </div>
                    <div className=' col-span-5'>

                        <form onSubmit={hanldeShipAndModeSubmit} className='p-[20px] flex flex-col gap-[10px]'>
                            <h2 className='font-bold text-[17px]'>Deliver To: </h2>

                            <label className='flex flex-col gap-[4px]'>
                                Name
                                <input name='name' type='text' className='px-[10px] py-[4px] outline-none flex-grow' required />
                            </label>
                            <label className='flex flex-col gap-[4px]'>
                                Phone
                                <input name='phone' type='text' className='px-[10px] py-[4px] outline-none flex-grow' required />
                            </label>
                            <label className='flex flex-col gap-[4px]'>
                                Email
                                <input name='email' type='email' className='px-[10px] py-[4px] outline-none flex-grow' required />
                            </label>
                            <label className='flex flex-col gap-[4px]'>
                                Address
                                <div className='grid grid-cols-2 gap-[10px]'>
                                    <input name='flatHouseNo' type='text' placeholder='Flat/House No./Building' className='px-[10px] py-[4px] outline-none flex-grow' required />
                                    <input name='areaStreet' type='text' placeholder='Area/Street/Sector' className='px-[10px] py-[4px] outline-none flex-grow' required />

                                    <input name='landmark' type='text' placeholder='Landmark' className='px-[10px] py-[4px] outline-none flex-grow' required />
                                    <input name='pincode' type='text' placeholder='Pincode' className='px-[10px] py-[4px] outline-none flex-grow' required />
                                    <input name='city' type='text' placeholder='Town/City' className='px-[10px] py-[4px] outline-none flex-grow' required />
                                    <select name='state' className='outline-none px-[7px] py-[4px]'>
                                        <option value="">Select State</option>
                                        <option value="AP">Andhra Pradesh</option>
                                        <option value="AR">Arunachal Pradesh</option>
                                        <option value="AS">Assam</option>
                                        <option value="BR">Bihar</option>
                                        <option value="CG">Chhattisgarh</option>
                                        <option value="GA">Goa</option>
                                        <option value="GJ">Gujarat</option>
                                        <option value="HR">Haryana</option>
                                        <option value="HP">Himachal Pradesh</option>
                                        <option value="JH">Jharkhand</option>
                                        <option value="KA">Karnataka</option>
                                        <option value="KL">Kerala</option>
                                        <option value="MP">Madhya Pradesh</option>
                                        <option value="MH">Maharashtra</option>
                                        <option value="MN">Manipur</option>
                                        <option value="ML">Meghalaya</option>
                                        <option value="MZ">Mizoram</option>
                                        <option value="NL">Nagaland</option>
                                        <option value="OD">Odisha</option>
                                        <option value="PB">Punjab</option>
                                        <option value="RJ">Rajasthan</option>
                                        <option value="SK">Sikkim</option>
                                        <option value="TN">Tamil Nadu</option>
                                        <option value="TG">Telangana</option>
                                        <option value="TR">Tripura</option>
                                        <option value="UP">Uttar Pradesh</option>
                                        <option value="UK">Uttarakhand</option>
                                        <option value="WB">West Bengal</option>
                                        <option value="DL">Delhi</option>
                                        <option value="JK">Jammu & Kashmir</option>
                                        <option value="LA">Ladakh</option>
                                        <option value="LD">Lakshadweep</option>
                                        <option value="PY">Puducherry</option>
                                    </select>
                                    <input name='country' type='text' value={'India'} className='px-[10px] py-[4px] outline-none ' readOnly required />
                                </div>
                            </label>

                            <label className='flex flex-col gap-[4px]'>
                                <h2 className='font-bold text-[17px] mt-[10px]'>Payment Mode</h2>
                                <div className='flex flex-col gap-[4px] ps-[10px]'>
                                    <div className='flex gap-[5px] items-between'><input type='radio' name='paymentMode' value='cod' required />Cash On Delivery</div>
                                    <div className='flex gap-[5px] items-between'><input type='radio' name='paymentMode' value='online' required />Online (<img src='/images/razorpay-logo.png' className='w-[100px]' />)</div>
                                </div>
                            </label>
                            <button className='bg-blue-500 py-[8px] text-white'>
                                {showSpinner(isProccedClicked, `Proceed`)}

                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export function CartItemsSummaryRow({ prop, index }) {
    return (
        <>
            <div className='m-[5px] shadow-lg'>
                <div className='grid grid-cols-8'>
                    <div className='col-span-2'>
                        <img src={prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`} alt='product-image' />
                    </div>
                    <div className='col-span-5 p-[5px]'>
                        <h1 className='font-bold text-[18px]'>{prop.title}</h1>
                        <h1 className='text-gray-500'>{prop.brand}</h1>
                        <h2>
                            <span className='text-gray-500 font-normal line-through'>&#8377;{Math.floor(prop.mrp)}</span>  &#8377;{Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100))}
                        </h2>
                        <h1>Item Total: &#8377;{Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100))} x {prop.qty} (Qty) = <b>&#8377; {prop.qty * (Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100)))}</b></h1>
                    </div>
                </div>
            </div>
        </>
    )
}
