"use client"
import HomeSlider from "./HomeSlider";
import { useSelector, useDispatch } from 'react-redux'
import { addUserToken, removeUserToken } from "./redux/reducers/userSlice";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductCard, UpdateCartOnServer } from "./products/page";
import axios from "axios";
import { backendBaseUrl } from "./api/api";
import { ToastContainer } from "react-toastify";
import Link from "next/link";


export default function Home() {
  const user = useSelector((state) => state.user.token);
  const cart = useSelector((state => state.cart.cartArray));
  const dispatch = useDispatch();


  return (
    <>
      <HomeSlider />
      <BrowseProducts />
    </>
  );
}

function BrowseProducts() {
  let [productArray, setProductArray] = useState([]);

  const user = useSelector((state) => state.user.token);
  const cart = useSelector((state => state.cart.cartArray));

  useEffect(() => {
    console.log(cart);
    console.log("changes happen in cart in products page");
    UpdateCartOnServer(user, cart);
  }, [cart]);

  useEffect(() => {
    getProducts();
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

  return (
    <div className='max-w-[1460px] mx-auto my-[50px]' >
      <ToastContainer />
      <h1 className="text-[25px] font-bold text-center my-[50px]">Browse Products</h1>
      <div className='col-span-5 grid grid-cols-5 gap-[20px] p-[10px]'>
        {productArray.length != 0
          ?
          productArray.slice(0, 49).map((v, i) => v.availabilityStatus ? <ProductCard prop={v} index={i} key={i} /> : '')
          :
          <>
            {Array.from({ length: 25 }).map((_, i) => <Skeleton variant="rectangular" width={270} height={350} key={i} />)}
          </>
        }
      </div>
      <div className="flex justify-center items-center my-[40px]">
        <Link href="/products">
          <button className="px-[20px] py-[4px] bg-black text-white">View More</button>
        </Link>
      </div>
    </div>
  )
}
