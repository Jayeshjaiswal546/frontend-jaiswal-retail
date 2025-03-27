"use client"
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify'
import { deleteItem, resetCart, updateQty } from '../../redux/reducers/cartSlice';
import { CartItemsSummaryRow } from '../../shipping-info/page';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { backendBaseUrl } from '@/app/api/api';
import { Skeleton } from '@mui/material';
import { showSpinner } from '@/app/functions/respondToUser';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { UpdateCartOnServer } from '@/app/products/page';

export default function page() {
    const user = useSelector((state) => state.user.token);
    const cart = useSelector((state => state.cart.cartArray));
    let [orderDetails, setOrderDetails] = useState();
    let router = useRouter();
    let { orderId } = useParams();
    console.log("below is the order id");
    console.log(orderId);
    let shippingDetails = orderDetails?.shippingDetails;
    let [isProccedClicked, setIsProceedClicked] = useState(false);
    let [isRzpScriptLoaded, setIsRzpScriptLoaded] = useState(false);
    const dispatch = useDispatch();
    const { error, isLoading, Razorpay } = useRazorpay();

    useEffect(() => {
        console.log("changes happen in cart in cart page");
        UpdateCartOnServer(user, cart);
    }, [cart]);

    const handlePayment = () => {
        setIsProceedClicked(false);
        const options = {
            key: "rzp_test_NLvkxR2W8EVXZB",
            amount: orderDetails?.finalAmtToPay * 100, // Amount in paise
            currency: "INR",
            name: "Jaiswal Retail Pvt. Ltd.",
            description: `Payment for your order at Jaiswal Retail Pvt. Ltd. Indore. Order ID: ${orderId}.`,
            order_id: orderDetails?.transactionDetails.razorpay_order_id, // Generate order_id on server
            handler: (response) => {
                // console.log(response);
                // alert("Payment Successful!");
                axios.post(`${backendBaseUrl}/order/place-prepaid-order/${orderId}`, { razorpay_response: response })
                    .then(res => res.data)
                    .then(finalRes => {
                        console.log(finalRes.message);
                        console.log(finalRes.data);
                        if (finalRes.status) {
                            dispatch(resetCart());
                            router.replace(`/order-success/${orderId}`);
                        } else {
                            setIsProceedClicked(false);
                        }
                    }).catch((error) => {
                        console.log(error);
                        console.log("something went xrong in frontend");

                    })
            },
            prefill: {
                name: shippingDetails?.name,
                email: shippingDetails?.email,
                contact: shippingDetails?.phone,
            },
            theme: {
                color: "#F37254",
            },
        };
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    };

    useEffect(() => {
        if (!cart.length) {
            router.replace('products');
        }

        if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
            setIsRzpScriptLoaded(true);
        }
        axios.get(`${backendBaseUrl}/order/view-order/${orderId}`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                console.log(finalRes.data);
                setOrderDetails(finalRes.data);

            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");

            })
    }, []);

    let handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsProceedClicked(true);
        axios.get(`${backendBaseUrl}/order/place-cod-order/${orderId}`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                console.log(finalRes.data);
                if (finalRes.status) {
                    dispatch(resetCart());
                    router.replace(`/order-success/${orderId}`);
                } else {
                    setIsProceedClicked(false);
                }
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");

            })
    }

    return (
        <>
            <div className='max-w-[1460px] mx-auto'>
                <ToastContainer />
                <h1 className='font-bold text-[25px] mt-[30px]'>Order Summary</h1>
                <div className='w-[1350px] grid grid-cols-8 mx-auto'>
                    <div className='p-[5px] col-span-3'>
                        {
                            cart.map((v, i) => <CartItemsSummaryRow prop={v} index={i} key={i} />)
                        }

                    </div>
                    <div className=' col-span-5'>

                        <form className='p-[20px] flex flex-col gap-[10px]'>
                            {
                                orderDetails ?
                                    <>
                                        <div className='grid grid-cols-3'>
                                            <div className='col-span-2'>
                                                <h2 className='font-bold text-[17px]'>Deliver To: </h2>
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

                                            <div className='flex flex-col gap-[25px]'>
                                                <div>
                                                    <h2 className='font-bold text-[17px]'>Amount to Pay:</h2>
                                                    <div className='ps-[20px]'>
                                                        <h1 className='font-bold text-[20px] text-violet-600'> &#8377; {orderDetails.finalAmtToPay} /-</h1>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h2 className='font-bold text-[17px]'>Payment Mode:</h2>
                                                    <div className='ps-[20px]'>
                                                        {
                                                            orderDetails.isPaymentModeOnline ?
                                                                <h1><img src='/images/razorpay-logo.png' className='w-[100px]' /></h1>
                                                                :
                                                                <h1>Cash On Delivery</h1>
                                                        }


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            orderDetails.isPaymentModeOnline ?
                                                <>
                                                    {!isRzpScriptLoaded && <p>Loading Razorpay...</p>}
                                                    {error && <p>Error loading Razorpay: {error}</p>}
                                                    <button disabled={!isRzpScriptLoaded} onClick={(e) => { e.preventDefault(), setIsProceedClicked(true), handlePayment() }} className='bg-blue-500 py-[8px] text-white mt-[20px]'>
                                                        {showSpinner(isProccedClicked, `Proceed to Checkout`)}
                                                    </button>
                                                </>
                                                :
                                                <button onClick={handlePlaceOrder} className='bg-blue-500 py-[8px] text-white mt-[20px]'>
                                                    {showSpinner(isProccedClicked, `Place Order`)}
                                                </button>
                                        }



                                    </>
                                    :
                                    <>

                                        <div className='grid grid-cols-3'>
                                            <div className='col-span-2'>
                                                <Skeleton variant="rectangular" width={270} height={320} />

                                            </div>

                                            <div className='flex flex-col gap-[25px]'>
                                                <div>
                                                    <Skeleton variant="rectangular" height={60} />
                                                </div>
                                                <div>
                                                    <Skeleton variant="rectangular" height={60} />
                                                </div>
                                            </div>

                                        </div>

                                        <Skeleton variant="rectangular" className='mt-[20px]' height={60} />
                                    </>

                            }



                        </form>
                    </div>
                </div>




            </div>

        </>
    )
}



