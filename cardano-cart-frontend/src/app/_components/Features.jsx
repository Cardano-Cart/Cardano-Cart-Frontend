"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import "./Carousel.css"
import carouselData from "./Carouseldata.json"

const Carousel = () => {
  const listRef = useRef(null)
  const carouselRef = useRef(null)
  const [index, setIndex] = useState(0)
 function nextSlide() {
  setIndex((prevIndex) => (prevIndex + 1) % carouselData.items.length);
}

function prevSlide() {
  setIndex((prevIndex) => (prevIndex - 1 + carouselData.items.length) % carouselData.items.length);
}

  useEffect(() => {
    const nextButton = document.getElementById("next")

    const prevButton = document.getElementById("prev")
    const carousel = carouselRef.current
    const listHTML = listRef.current
    const seeMoreButtons = document.querySelectorAll(".seeMore")
    const backButton = document.getElementById("back")

    let unAcceppClick

    const showSlider = (type) => {
      if (!listHTML || !carousel) return

      nextButton.style.pointerEvents = "none"
      prevButton.style.pointerEvents = "none"

      carousel.classList.remove("next", "prev")
      const items = listHTML.querySelectorAll(".carousel .list .item")
      let newIndex = index;
      if (type === "next") {
        nextSlide()
        listHTML.appendChild(items[0]);
        carousel.classList.add("next")
        newIndex = (index + 1) % items.length;
      } else {
        prevSlide()
        listHTML.prepend(items[items.length - 1]);
        newIndex = (index - 1 + items.length) % items.length;
        carousel.classList.add("prev")
      }

      clearTimeout(unAcceppClick)
      unAcceppClick = setTimeout(() => {
        nextButton.style.pointerEvents = "auto"
        prevButton.style.pointerEvents = "auto"
      }, 1000)
    }

    nextButton.addEventListener("click", () => showSlider("next"))
    prevButton.addEventListener("click", () => showSlider("prev"))

    seeMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        carousel.classList.remove("next", "prev")
        carousel.classList.add("showDetail")
      })
    })

    backButton.addEventListener("click", () => {
      carousel.classList.remove("showDetail")
    })

    return () => {
      nextButton.removeEventListener("click", () => showSlider("next"))
      prevButton.removeEventListener("click", () => showSlider("prev"))
      seeMoreButtons.forEach((button) => {
        button.removeEventListener("click", () => {})
      })
      backButton.removeEventListener("click", () => {})
    }
  }, [])

  return (
    <div className="carousel" ref={carouselRef}>
      <div className="features"><h1>Featured Products</h1></div>
      <div className="list" ref={listRef}>
        {carouselData.items.map((item, index) => (                                                                                                                
          <div key={index} className="item">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} width={400} height={430} />
            <div className="introduce">
              <div className="title">{item.title}</div>
              <div className="topic">{item.topic}</div>
              <div className="des">{item.description}</div>
              <button className="seeMore">SEE MORE &#8599;</button>
            </div>
            <div className="detail">
              <div className="title">{item.detailTitle}</div>
              <div className="des">{item.detailDescription}</div>
              <div className="specifications">
                {item.specifications.map((spec, specIndex) => (
                  <div key={specIndex}>
                    <p>{spec.name}</p>
                    <p>{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="checkout">
                <button>{item.addToCartText}</button>
                <button>{item.checkoutText}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="arrows">
        <button id="prev">&lt;</button>
        <button id="next">&gt;</button>
        <button id="back">See All &#8599;</button>
      </div>
    </div>
  )
}

export default Carousel

