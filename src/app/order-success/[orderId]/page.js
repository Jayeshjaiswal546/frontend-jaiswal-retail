"use client"
import { backendBaseUrl } from '@/app/api/api';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

export default function OrderSuccess() {
    let { orderId } = useParams();
    let [orderDetails, setOrderDetails] = useState();
    let router = useRouter();


    useEffect(() => {
        // if (!cart.length) {
        //     router.replace('products');
        // }
        axios.get(`${backendBaseUrl}/order/view-order/${orderId}`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                console.log(finalRes.data);
                setOrderDetails(finalRes.data);
                // router.push(`/order-summary/${finalRes.data}`);
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");

            })
    }, []);

    let shippingDetails = orderDetails?.shippingDetails;
    let dateObj = new Date(orderDetails?.createdAt);
    // let date = dateObj.toISOString().split("T")[0];  
    let time = dateObj.toTimeString().split(" ")[0];


    return (
        <div>
            <div className='mx-auto max-w-[1460px]'>
                {
                    orderDetails ?
                        <div className='p-[20px]'>
                            <div>
                                <h1 className='text-green-500 text-[30px] flex items-center gap-[20px]'><FaCheck /> Thank you, your order has been placed.</h1>
                                <h2 className='text-[20px]'>Order Id: {orderId} </h2>
                                <h2>We will send you shipping confirmation email as soon as your order ships.</h2>
                            </div>
                            <div className='flex justify-between mx-auto p-[20px]'>
                                <div>
                                    <h1 className='text-[20px] font-bold'>Shipping Address</h1>
                                    <div className='ps-[20px]'>
                                        <h1>{shippingDetails.name}</h1>
                                        <h1>{shippingDetails.phone}</h1>
                                        <h1>{shippingDetails.email}</h1>
                                    </div>
                                    <br />
                                    <div className='ps-[20px]'>
                                        <h1>{shippingDetails.flatHouseNo}, {shippingDetails.areaStreet},</h1>
                                        <h1>({shippingDetails.landmark}) {shippingDetails.pincode}</h1>
                                        <h1>{shippingDetails.city}, {shippingDetails.state}</h1>
                                        <h1>{shippingDetails.country}</h1>
                                    </div>
                                </div>
                                <div>
                                    <h1 className='text-[20px] font-bold'>Payment Method</h1>
                                    <div className='ps-[20px]'>
                                        {
                                            orderDetails.isPaymentModeOnline ?
                                            <>
                                            <h1><img src='/images/razorpay-logo.png' className='w-[100px]' /></h1>
                                            <h1>Transaction Id: {orderDetails.transactionDetails.razorpay_payment_id}</h1>
                                            </>
                                                                                                :
                                                <h1>Cash On Delivery</h1>
                                        }


                                    </div>

                                </div>
                                <div>
                                    <h1 className='text-[20px] font-bold'>Date & Time</h1>
                                    <div className='ps-[20px]'>
                                        <h1>{dateObj.toDateString()} {time}</h1>
                                    </div>
                                </div>
                            </div>

                            <h1 className='text-[20px] font-bold ps-[20px]'>Order Summary</h1>

                            <div className='w-[1350px] grid grid-cols-3 mx-auto'>
                                <div className=' col-span-2'>
                                    {
                                        orderDetails.cart.map((v, i) => <CartRow prop={v} index={i} key={i} />)
                                    }

                                </div>
                                <div className='p-[5px]'>
                                    <CartSummary orderDetails={orderDetails} />
                                </div>
                            </div>



                        </div>
                        :
                        <Skeleton variant="rectangular" height={150} className='mt-[20px]' />
                }

            </div>
        </div>
    )
}

function CartRow({ prop, index }) {
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
                        <h2>Qty: {prop.qty}</h2>


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

function CartSummary({ orderDetails }) {

    return (
        <>
            <div className='shadow-lg p-[10px]'>
                <div className='flex flex-col gap-[20px] my-[10px]'>
                    <div className='flex justify-between  items-center'>
                        <h1>Total Items Price</h1>
                        <h2>&#8377;{orderDetails.mrpTotal}</h2>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1>Discount</h1>
                        <h2>- &#8377; {orderDetails.discountAmt}</h2>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1>Delivery Charges</h1>
                        {
                            orderDetails.deliveryChg ?
                                <h2>&#8377; {orderDetails.deliveryChg}</h2>
                                :
                                <h2><span className='text-green-500'>FREE</span></h2>
                        }
                    </div>
                    <div className='flex justify-between items-center'>
                        <h1>Secured Packaging Fee</h1>
                        <h2>&#8377; {orderDetails.securedShippingFee}</h2>
                    </div>

                    <div className='flex justify-between items-center font-bold py-[10px] border-y-2 border-black'>
                        <h1>Total Amount</h1>
                        <h2 className='text-[25px] text-violet-500 font-bold'>&#8377; {orderDetails.finalAmtToPay}</h2>
                    </div>
                 
                </div>
            </div>
        </>
    )
}