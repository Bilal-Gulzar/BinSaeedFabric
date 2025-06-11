"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"

interface ImageMagnifyProps {
  src: string
  alt: string
  width: number
  height: number
  magnifyWidth?: number
  magnifyHeight?: number
  zoomFactor?: number
}

const CustomImageMagnify: React.FC<ImageMagnifyProps> = ({
  src,
  alt,
  width,
  height,
  magnifyWidth = 1200,
  magnifyHeight = 1800,
  zoomFactor = 2.5,
}) => {
  const [showZoom, setShowZoom] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setShowZoom(true)
  }

  const handleMouseLeave = () => {
    setShowZoom(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imgRef.current) {
      const { left, top, width, height } = imgRef.current.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      setPosition({ x, y })
    }
  }

  return (
    <div className="relative" style={{ width, height }}>
      <div
        ref={imgRef}
        className="relative w-full h-full cursor-zoom-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" sizes={`${width}px`} priority />
      </div>

      {showZoom && (
        <div
          className="absolute top-0 left-full ml-4 border border-gray-200 bg-white overflow-hidden z-10"
          style={{ width: width, height: height }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: `${zoomFactor * 100}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
    </div>
  )
}

export default CustomImageMagnify
