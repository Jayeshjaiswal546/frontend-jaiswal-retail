"use client"
import React, { useState, useEffect } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
export default function DynamicSlider() {
    var settings = {
        // dots: true,
        fade: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        pauseOnHover: false,
    };

    return (
        <div>
            <div className='max-w-[1460px] mx-auto' >
                <Slider {...settings}>
                    <div>
                        <img src="/images/slide1.png"  />
                    </div>
                    <div>
                        <img src="/images/slide2.png" />
                    </div>
                    <div>
                        <img src="/images/slide3.png" />
                    </div>
                    <div>
                        <img src="/images/slide4.png" />
                    </div>
                    <div>
                        <img src="/images/slide5.png" />
                    </div>   
                    <div>
                        <img src="/images/slide6.png" />
                    </div>   
                </Slider>
            </div>
        </div>
    )
}

