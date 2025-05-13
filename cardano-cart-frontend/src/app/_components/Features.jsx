"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import "./Carousel.css"
import carouselData from "./Carouseldata.json"

const Carousel = () => {
  const listRef = useRef(null)
  const carouselRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const handleNavigation = (direction) => {
   

    const carousel = carouselRef.current
    if (!carousel) return

    // Remove any existing animation classes
    carousel.classList.remove("next", "prev")
    

    // Add the appropriate animation class
    if (direction === "next") {
      
      carousel.classList.add("next")
    } else {
      carousel.classList.add("prev")
    }

    // Wait for animation to complete before updating DOM
    setTimeout(() => {
      const listHTML = listRef.current
      if (!listHTML) {
        setIsAnimating(false)
        return
      }

      const items = listHTML.querySelectorAll(".item")

      if (direction === "next") {
        // Move the first item to the end
        const firstItem = items[0]
        listHTML.appendChild(firstItem)

        // Update index
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.items.length)
      } else {
        // Move the last item to the beginning
        const lastItem = items[items.length - 1]
        listHTML.prepend(lastItem)

        // Update index
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselData.items.length - 1 : prevIndex - 1))
      }

      // Remove animation class
      carousel.classList.remove("next", "prev")
      setIsAnimating(false)
    }, 600) // Match this to your animation duration
  }
  const toggleDetail = (show) => {
    const carousel = carouselRef.current
    if (!carousel) return

    carousel.classList.remove("next", "prev")

    if (show) {
      carousel.classList.add("showDetail")
    } else {
      carousel.classList.remove("showDetail")
    }
  }

  useEffect(() => {
    // Set up event listeners
    const nextButton = document.getElementById("next")
    const prevButton = document.getElementById("prev")
    const seeMoreButtons = document.querySelectorAll(".seeMore")
    const backButton = document.getElementById("back")

    // Define event handlers
    const handleNextClick = () => handleNavigation("next")
    const handlePrevClick = () => handleNavigation("prev")
    const handleSeeMoreClick = () => toggleDetail(true)
    const handleBackClick = () => toggleDetail(false)

    // Add event listeners
    if (nextButton) nextButton.addEventListener("click", handleNextClick)
    if (prevButton) prevButton.addEventListener("click", handlePrevClick)

    seeMoreButtons.forEach((button) => {
      button.addEventListener("click", handleSeeMoreClick)
    })

    if (backButton) backButton.addEventListener("click", handleBackClick)

    // Clean up event listeners
    return () => {
      if (nextButton) nextButton.removeEventListener("click", handleNextClick)
      if (prevButton) prevButton.removeEventListener("click", handlePrevClick)

      seeMoreButtons.forEach((button) => {
        button.removeEventListener("click", handleSeeMoreClick)
      })

      if (backButton) backButton.removeEventListener("click", handleBackClick)
    }
  }, [index]) // Empty dependency array means this runs once on mount
 function nextSlide() {
  setIndex((prevIndex) => (prevIndex + 1) % carouselData.items.length);
}

function prevSlide() {
  setIndex((prevIndex) => (prevIndex - 1 + carouselData.items.length) % carouselData.items.length);
}

  

  return (
    <div className="carousel" ref={carouselRef}>
      <div className="features"><h1>Featured Products</h1></div>
      <div className="list" ref={listRef}>
        {carouselData.items.map((item, index) => (                                                                                                                
          <div key={index} className="item">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} width={300} height={330} />
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

