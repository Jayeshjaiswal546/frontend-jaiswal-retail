"use client"
import { Rating, Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { backendBaseUrl } from '../api/api';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQty } from '../redux/reducers/cartSlice';
import { error, inform, success } from '../functions/notifyUser';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Products() {

    let [productArray, setProductArray] = useState([]);
    let [categoryArray, setCategoryArray] = useState([]);
    let [currentCategory, setCurrentCategory] = useState();
    const user = useSelector((state) => state.user.token);
    const cart = useSelector((state => state.cart.cartArray));


    useEffect(() => {
        console.log(cart);
        console.log("changes happen in cart in products page");
        UpdateCartOnServer(user, cart);
    }, [cart]);

    useEffect(() => {
        getProducts();
        getCategories();
    }, [])

    function getProducts() {
        axios.get(`${backendBaseUrl}/product/view-product`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                setProductArray(finalRes.data);
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");
            })
    }

    function getCategories() {
        axios.get(`${backendBaseUrl}/admin/view-category`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                setCategoryArray(finalRes.data);
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");
            })
    }

    return (
        <div>
            <div className='mx-auto max-w-[1460px]'>
                <ToastContainer />
                <div className='grid grid-cols-6 items-start' >
                    <div className='p-[5px] sticky top-[60px] '>
                        <h1 className='text-[rgba(0,21,109,255)] '>Search by category</h1>

                        <ul className='text-[rgba(0,21,109,255)]'>
                            <li onClick={() => { getProducts(); setCurrentCategory('All') }} className={`${currentCategory == 'All' ? 'bg-[rgba(0,21,109,255)] text-white' : 'hover:bg-[rgba(0,21,109,0.9)]'} cursor-pointer hover:text-white py-[4px] px-[5px]`}>All</li>
                            {categoryArray.length != 0
                                ?
                                categoryArray.map((v, i) => v.categoryStatus ? <CategoryRow prop={v} index={i} key={i} setProductArray={setProductArray} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} /> : '')
                                :
                                <>
                                    <Skeleton variant="rectangular" height={40} className='my-[4px]' />
                                    <Skeleton variant="rectangular" height={40} className='my-[4px]' />
                                    <Skeleton variant="rectangular" height={40} className='my-[4px]' />
                                    <Skeleton variant="rectangular" height={40} className='my-[4px]' />
                                </>
                            }
                        </ul>
                    </div>
                    <div className='col-span-5 grid grid-cols-4 gap-[20px] p-[10px]'>
                        {productArray.length != 0
                            ?
                            productArray.map((v, i) => v.availabilityStatus ? <ProductCard prop={v} index={i} key={i} /> : '')
                            :
                            <>
                                <Skeleton variant="rectangular" width={270} height={350} />
                                <Skeleton variant="rectangular" width={270} height={350} />
                                <Skeleton variant="rectangular" width={270} height={350} />
                                <Skeleton variant="rectangular" width={270} height={350} />
                            </>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export function ProductCard({ prop }) {
    const dispatch = useDispatch();
    const cart = useSelector((state => state.cart.cartArray));
    const user = useSelector((state) => state.user.token);

    const router = useRouter();



    return (
        <>
            <div className='shadow-lg'>
                <Link href={`/product-details/${prop._id}`}><img src={prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`} /></Link>
                <div className='p-[10px]'>
                    <div className='flex justify-between'>
                        <h2 className='text-gray-500 text-[13px]'>{prop.brand}</h2>
                        <Rating name="read-only" value={Math.floor(prop.rating)} readOnly size="small" />
                    </div>
                    <h1 className='font-bold'>{prop.title}</h1>
                    {/* <h2>The Sports Sneakers in Off White and Red combine style and functionality, making them a fashionable choice for sports enthusiasts. The red and off-white color combination adds a bold and energetic touch.</h2> */}
                    <h2 className='font-bold text-[20px]'>
                        <span className='text-gray-500 font-normal line-through'>&#8377;{Math.floor(prop.mrp)}</span>  &#8377;{Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100))}
                    </h2>
                    <button onClick={() => handleAddToCart(router, user, cart, prop, toast, dispatch)} className='text-[rgba(0,21,109,255)] hover:text-white hover:bg-[rgba(0,21,109,255)] mt-[10px] rounded-sm border-2 border-[rgba(0,21,109,255)] font-bold w-full py-[5px]'>Add to Cart</button>
                </div>
            </div>
        </>
    )
}

function CategoryRow({ prop, setProductArray, currentCategory, setCurrentCategory }) {
    let handleCategoryClick = () => {
        console.log("category clicked");
        console.log(prop._id);
        setCurrentCategory(prop.categoryName);
        axios.get(`${backendBaseUrl}/product/view-product-by-category/${prop._id}`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                console.log(finalRes);
                setProductArray(finalRes.data);
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");
            })
    }
    return (
        <>
            <li onClick={handleCategoryClick} className={`${currentCategory == prop.categoryName ? 'bg-[rgba(0,21,109,255)] text-white' : 'hover:bg-[rgba(0,21,109,0.9)]'} cursor-pointer hover:text-white py-[4px] px-[10px]`}>{prop.categoryName}</li>
        </>
    )
}

export function UpdateCartOnServer(user, cart) {
    if (user) {
        axios.post(`${backendBaseUrl}/user/update-cart`, { token: user, cart })
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes);
                if (finalRes.status) {
                    localStorage.setItem('jaiswal-retail-userCart', JSON.stringify(finalRes.data));
                }
            }).catch(() => {
                console.log("Something went xrong in axios while updating cart on server.");
            })
    }
}

export function handleAddToCart(router, user, cart, prop, toast, dispatch) {
    if (!user) {
        router.push('/auth/login');
    } else {
        let presentIndex = cart.findIndex((item) => item._id === prop._id);
        let tempObj = { ...prop, qty: 1 };
        // console.log(presentIndex);
        if (presentIndex >= 0) {
            // console.log(cart[presentIndex]);
            let newQty = cart[presentIndex].qty + 1;
            // console.log(newQty);
            dispatch(updateQty({ index: presentIndex, newQty: newQty }));
            inform(toast, <h1><b>Already present in cart</b> <br />Quantiy increased to {newQty}.</h1>);
        } else {
            dispatch(addToCart(tempObj));
            success(toast, <h1><b>{prop.title}</b> <br />Added to cart</h1>);
        }
    }
}