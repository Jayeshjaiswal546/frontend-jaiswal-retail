import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import "./Footer.css"
import { FaHeart } from 'react-icons/fa';



export default function Footer() {
    let companyArr = [["Home","/"], ["Products","products"],  ["Categories", "categories"], ["About Us", "about-us"], ["Contact Us","contact-us"]];
    let supportArr = ["Documentation", "Forums", "Language Packs", "Release Status"];
    let downloadArr = ["iOS", "Android", "Windows", "MacOS"];
    let contactArr = ["F0, Left IT Wing, Electronic Complex, Indore (452010)", "9399795689", "www.jaiswalretail.com"];

    return (
        <div className='bg-[rgba(116,86,234,0.05)] mt-[100px]'>
            <div className='max-w-[1320px] mx-auto pb-[30px]'>
                <div className='grid grid-cols-4 py-[50px] px-[20px] footerCols'>
                    <div>
                        <ul className='ulfooter'>
                            <li>Company</li>
                            {companyArr.map((v,i)=><li key={i}><Link href={`/${v[1]}`} >{v[0]}</Link></li>)}
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li>Support</li>
                            {supportArr.map((v,i)=><li key={i}>{v}</li>)}
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li>Download</li>
                            {downloadArr.map((v,i)=><li key={i}>{v}</li>)}
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li>Contact Us</li>
                            {contactArr.map((v,i) => <li key={i}>{v}</li>)}
                        </ul>
                    </div>
                </div>
                <div className='flex justify-between border-t-2 pt-[30px] px-[20px] text-gray-500'>
                    <h1>Copyright @ 2025, <span className='text-blue-500'>Jaiswal Retail Pvt. Ltd. Indore </span>  All rights reserved.</h1>
                    <h1 className='flex justify-between items-center gap-[5px]'>Hand-crafted & made with <FaHeart className='text-red-500' /></h1>
                </div>
            </div>
        </div>
    )
}
