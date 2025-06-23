"use client"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import Loader from "../others/Loader"

interface BannerData {
  id: number
  title: string
  description: string
  buttonText: string
  link: string
  image: string
  smallBannerTitle?: string
  smallBannerDescription?: string
  smallBannerImage?: string
  smallBannerLink?: string
}

function HeroBannerTwo() {
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint for hero banners
        const response = await fetch("https://localhost:7240/api/Banners/hero")

        if (!response.ok) {
          throw new Error("Failed to fetch banner data")
        }

        const data = await response.json()

        // Transform API data to match component structure
        const transformedData = {
          id: data.id || 1,
          title: data.title || "Discover the Latest in Tech",
          description: data.description || "Explore our wide range of gadgets and electronics",
          buttonText: data.buttonText || "Shop Now",
          link: data.link || "/shop",
          image: data.image || "/images/products/apple-watch-9-removebg-preview.png",
          smallBannerTitle: data.smallBannerTitle || "Special Summer Sale",
          smallBannerDescription: data.smallBannerDescription || "Get up to 50% off on Headphones!",
          smallBannerImage: data.smallBannerImage || "/images/products/senheiser-removebg-preview.png",
          smallBannerLink: data.smallBannerLink || "/shop?category=Headphones",
        }

        setBannerData(transformedData)
      } catch (err) {
        console.error("Error fetching banner data:", err)
        setError(err instanceof Error ? err.message : "Failed to load banner")

        // Fallback data
        setBannerData({
          id: 1,
          title: "Discover the Latest in Tech",
          description: "Explore our wide range of gadgets and electronics",
          buttonText: "Shop Now",
          link: "/shop",
          image: "/images/products/apple-watch-9-removebg-preview.png",
          smallBannerTitle: "Special Summer Sale",
          smallBannerDescription: "Get up to 50% off on Headphones!",
          smallBannerImage: "/images/products/senheiser-removebg-preview.png",
          smallBannerLink: "/shop?category=Headphones",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-gray-500 to-gray-800 text-white lg:py-8">
        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8">
          <Loader />
        </div>
      </section>
    )
  }

  if (!bannerData) {
    return (
      <section className="bg-gradient-to-r from-gray-500 to-gray-800 text-white lg:py-8">
        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 text-center">
          <p className="text-red-400">Error loading banner: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-gray-500 to-gray-800 text-white lg:py-8">
      <div className="max-w-screen-xl mx-auto relative overflow-hidden py-16 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-8">
        {/* Big main banner */}
        <div className="px-4 relative z-10 lg:col-span-2">
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="lg:w-full text-center md:text-start">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 mt-2 md:mt-0">{bannerData.title}</h1>
              <p className="text-lg lg:text-xl mb-8">{bannerData.description}</p>
              <div className="flex items-center justify-center md:justify-start">
                <Link
                  href={bannerData.link}
                  className="bg-blue-500 hover:bg-blue-600 text-lg text-white py-4 px-10 rounded-full flex items-center gap-2"
                >
                  <ArrowRight /> {bannerData.buttonText}
                </Link>
              </div>
            </div>
            <div className="relative h-[20rem] md:h-[30rem] w-full lg:mt-0">
              <Image
                src={bannerData.image || "/placeholder.svg"}
                alt="Tech Gadgets"
                fill
                className="w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

        {/* Smaller banner */}
        <div className="lg:col-span-1 bg-white text-black dark:bg-slate-900 dark:text-white p-4 rounded-md shadow-md space-y-2 py-6 text-center">
          <h2 className="text-3xl font-bold">{bannerData.smallBannerTitle}</h2>
          <div className="relative w-full h-60">
            <Image
              src={bannerData.smallBannerImage || "/placeholder.svg?height=240&width=240"}
              alt="product"
              fill
              className="object-contain"
            />
          </div>
          <p className="my-4 text-lg font-medium">{bannerData.smallBannerDescription}</p>
          <Link
            href={bannerData.smallBannerLink || "/shop"}
            className="py-3 px-8 block w-fit whitespace-nowrap mx-auto rounded-full bg-blue-500 hover:bg-blue-600 text-white text-lg"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroBannerTwo
