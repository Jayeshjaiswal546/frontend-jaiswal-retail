"use client"
import { backendBaseUrl } from '@/app/api/api';
import { handleAddToCart } from '@/app/products/page';
import { Rating, Skeleton } from '@mui/material'
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

export default function ProductDetails() {

    let [productDetail, setProductDetail] = useState();
    let [thumbnailSrc, setThumbnailSrc] = useState();

    let { id } = useParams();
    useEffect(() => {
        getProducts();
    }, [])

    function getProducts() {
        axios.get(`${backendBaseUrl}/product/view-product/${id}`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                console.log(finalRes);
                setProductDetail(finalRes.data);
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");
            })
    }

    useEffect(() => {
        if (productDetail) {
            setThumbnailSrc(productDetail.thumbnail.startsWith("http") ? `${productDetail.thumbnail}` : `${backendBaseUrl}/uploads/${productDetail.thumbnail}`);
        }

    }, [productDetail])

    let handleImageHover = (path) => {
        setThumbnailSrc(path.startsWith("http") ? `${path}` : `${backendBaseUrl}/uploads/${path}`)
    }

    const user = useSelector((state) => state.user.token);
    const cart = useSelector((state => state.cart.cartArray));
    const router = useRouter();
    const dispatch = useDispatch();



    return (
        <div>
            <div className='mx-auto max-w-[1460px]'>
            <ToastContainer/>
                <div className={`w-[1100px] ${productDetail ? 'shadow-lg' : ''} mx-auto my-[50px] grid grid-cols-11`}>
                    {
                        productDetail ?
                            <>
                                <div className='py-[10px] px-[12px] flex flex-col justify-between'>
                                    <img onMouseEnter={() => handleImageHover(productDetail.thumbnail)}
                                        src={productDetail.thumbnail.startsWith("http") ? `${productDetail.thumbnail}` : `${backendBaseUrl}/uploads/${productDetail.thumbnail}`} className='hover:scale-[105%] w-[100%] shadow-lg cursor-pointer' />
                                    {
                                        productDetail.images.map((v, i) =>
                                            <img onMouseEnter={() => handleImageHover(v)}
                                                src={v.startsWith("http") ? `${v}` : `${backendBaseUrl}/uploads/${v}`} className='hover:scale-[105%]  w-[100%] shadow-lg cursor-pointer' key={i} />)
                                    }


                                </div>
                                <div className='col-span-6 p-[10px]'>
                                    <img src={thumbnailSrc} className='w-[100%]' />
                                </div>
                                <div className='col-span-4 p-[10px] flex flex-col gap-[20px]'>
                                    <div className='flex justify-between'>
                                        <h2 className='text-gray-500 text-[15px]'>{productDetail.brand}</h2>
                                        <Rating name="read-only" value={Math.floor(productDetail.rating)} readOnly size="small" />
                                    </div>
                                    <h1 className='font-bold text-[30px]'>{productDetail.title}</h1>

                                    <h2 className='text-justify'>{productDetail.description}</h2>
                                    <h2 className='font-bold text-[25px]'>
                                        <span className='text-gray-500 font-normal line-through'>&#8377;{Math.floor(productDetail.mrp)}</span>   &#8377;{Math.floor(productDetail.mrp - (productDetail.mrp * productDetail.discountPercentage / 100))}
                                    </h2>
                                    <div>
                                        <h1 className='text-green-500'>{productDetail.availabilityStatus ? 'In Stock' : 'Out of Stock'}</h1>
                                        <h2>{productDetail.shippingInformation}</h2>
                                        <h2>{productDetail.warrantyInformation}</h2>
                                    </div>
                                    <button onClick={() => handleAddToCart(router, user, cart, productDetail, toast, dispatch)} className='text-[rgba(0,21,109,255)] text-[20px] hover:text-white hover:bg-[rgba(0,21,109,255)] mt-[10px] rounded-sm border-2 border-[rgba(0,21,109,255)] font-bold w-full py-[5px]'>Add to Cart</button>

                                </div>
                            </>
                            :
                            <Skeleton variant="rectangular" height={400} className='my-[4px] col-span-11' />
                    }


                </div>

            </div>
        </div>
    )
}




//  <div className='shadow-lg'>
//                 <Link href={`/product-details/${prop._id}`}><img src={prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`} /></Link>
//                 <div className='p-[10px]'>
// <div className='flex justify-between'>
//     <h2 className='text-gray-500 text-[13px]'>{prop.brand}</h2>
//     <Rating name="read-only" value={Math.floor(prop.rating)} readOnly size="small" />
// </div>
//                     <h1 className='font-bold'>{prop.title}</h1>
//                     {/* <h2>The Sports Sneakers in Off White and Red combine style and functionality, making them a fashionable choice for sports enthusiasts. The red and off-white color combination adds a bold and energetic touch.</h2> */}
//                     <h2 className='font-bold text-[20px]'>
//                         <span className='text-gray-500 font-normal line-through'>&#8377;{Math.floor(prop.mrp)}</span>  &#8377;{Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100))}
//                     </h2>
//                     <button onClick={handleAddToCart} className='text-[rgba(0,21,109,255)] hover:text-white hover:bg-[rgba(0,21,109,255)] mt-[10px] rounded-sm border-2 border-[rgba(0,21,109,255)] font-bold w-full py-[5px]'>Add to Cart</button>
//                 </div>
//             </div>