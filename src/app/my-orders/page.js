"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, updateQty } from '../redux/reducers/cartSlice';
import { inform, warn } from '../functions/notifyUser';
import { toast, ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { UpdateCartOnServer } from '../products/page';
import { showSpinner } from '../functions/respondToUser';
import axios from 'axios';
import { backendBaseUrl } from '../api/api';
import OrderStatusSteppers from '../MUIComponents/stepper/page';

export default function page() {
    const user = useSelector((state) => state.user.token);
    let [ordersArray, setOrdersArray] = useState([]);

    useEffect(() => {
        axios.get(`${backendBaseUrl}/order/user-orders/${user}`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                console.log(finalRes.data);
                setOrdersArray(finalRes.data.reverse());
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");
            })
    }, []);

    return (
        <>
            <div className='max-w-[1460px] mx-auto'>
                <ToastContainer />
                <h1 className='font-bold text-[25px] mt-[30px]'>My Orders</h1>
                {
                    ordersArray.length ?
                        <>
                            <div className='max-w-[1350px] mx-auto flex flex-col gap-[20px]'>
                                {
                                    ordersArray.map((v, i) => <OrderRow prop={v} key={i} index={i} />)
                                }
                            </div>

                        </>
                        :
                        <div className='h-[50vh] flex justify-center items-center'>
                            <h1>No Orders Found</h1>
                        </div>

                }

            </div>

        </>
    )
}

function OrderRow({ prop }) {
    let dateObj = new Date(prop?.createdAt);
    let date = dateObj.toDateString();
    let time = dateObj.toTimeString().split(" ")[0];
    return (
        <>
            <div className='border-2 shadow-lg bg-white px-[30px] py-[20px] rounded-[25px] flex flex-col gap-[40px]'>

                <div className='flex justify-between'>
                    <div className='flex gap-[20px]'>
                        <div>
                            <h1 className='font-bold'>Order Id</h1>
                            <h2 className='px-[20px]'>#{prop.orderId}</h2>
                        </div>
                        <div>
                            <h1 className='font-bold'>Date & Time</h1>
                            <h2 className='px-[20px]'>{date} {time}</h2>
                        </div>
                        <div>
                            <h1 className='font-bold'>Total Amount</h1>
                            <h2 className='px-[20px] flex gap-[10px]'><span>&#8377; {prop.finalAmtToPay}/- </span>
                                {
                                    prop.isPaymentModeOnline ?
                                        (<img src='/images/razorpay-logo.png' className='w-[100px]' />)
                                        :
                                        <> (Cash On Delivery)</>
                                }
                            </h2>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1 className='font-bold'>Shipment Status</h1>
                            {
                                prop.shipmentStatus == 5 ?
                                    <img src='/images/cancelled.png' className='w-[120px]' />
                                    :
                                    <h2 className='px-[20px]'>{getOrderStatus(prop.shipmentStatus)}</h2>
                            }




                        </div>

                    </div>
                </div>

                <div className='flex gap-[10px]'>
                    {
                        prop.cart.map((v, i) => <OrderedItem prop={v} key={i} index={i} />)
                    }
                </div>
                {
                    prop.shipmentStatus == 5 ?
                        <></>
                        :
                        <div>
                            <OrderStatusSteppers currentKey={prop.shipmentStatus} />
                        </div>
                }

                <div className='flex justify-end'>
                    <Link href={`/view-order-details/${prop.orderId}`} >
                        <button className='py-[4px] px-[10px] bg-black text-white rounded-sm'>
                            View Details
                        </button>
                    </Link>

                </div>

            </div>
        </>
    )
}


function OrderedItem({ prop }) {
    return (
        <div className='shadow-lg rounded-[25px] relative'>
            <img src={prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`} className='w-[120px]' alt='product-image' />
            <h1 className=' absolute left-[90%]  top-[90%] z-[999]'>x{prop.qty}</h1>
        </div>
    )
}


function getOrderStatus(statusCode) {
    const statusEnum = {
        0: "Pending",
        1: "Prepare To Ship",
        2: "Shipped",
        3: "Out for Delivery",
        4: "Delivered",
        5: "Cancelled"
    };
    return statusEnum[statusCode] || "Invalid Status";
}