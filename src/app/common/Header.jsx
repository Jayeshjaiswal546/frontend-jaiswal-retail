import React from 'react'
import { FaCartShopping } from "react-icons/fa6";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserToken } from '../redux/reducers/userSlice';
import { resetCart } from '../redux/reducers/cartSlice';



export default function Header() {
  const user = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const cart = useSelector((state => state.cart.cartArray));


  return (
    <div className="bg-white shadow-lg sticky top-0 z-[99] text-gray-500" >
      <div className='flex justify-between px-[10px] py-[5px] h-[60px] items-center max-w-[1460px] mx-auto'>
        <Link href="/">
          <img src='/images/jaiswal-retail-blue.png' className='w-[350px]' />
        </Link>
        <ul className='flex gap-[50px] items-center'>
          <li><Link href="/">Home</Link></li>
          <li>
            <Link href="/products">
              Products
            </Link>
          </li>
          <li>
            <Link href={user ? '/my-orders' : '/auth/login'}>
              My Orders
            </Link>
          </li>
          <li>About Us</li>
          <li>Contact Us</li>
          <div className='relative'>
            <Link href={user ? '/cart' : '/auth/login'}>
              <FaCartShopping className='text-[30px] text-black' />
              <div className='p-[2px] bg-blue-500 text-white flex justify-center items-center rounded-[50%] w-[20px] h-[20px] text-[12px] absolute bottom-[80%] left-[60%]'>
                {cart.length}
              </div>
            </Link>
          </div>
          {
            user ?
              <button onClick={() => {
                dispatch(removeUserToken(),
                  dispatch(resetCart()),
                  localStorage.removeItem('jaiswal-retail-userToken'),
                  localStorage.removeItem('jaiswal-retail-userCart'),
                )
              }} className=' text-red-500  py-[5px]'>Logout</button>
              :
              <Link href="/auth/login">
                <button className=' text-blue-500  py-[5px]'>Login</button>
              </Link>
          }




        </ul>
      </div>
    </div>
  )
}
