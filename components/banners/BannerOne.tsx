"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import Loader from "../others/Loader"

interface BannerData {
  id: number
  title: string
  subtitle: string
  description: string
  buttonText: string
  link: string
  image: string
}

const BannerTwo = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint
        const response = await fetch("https://localhost:7240/api/Banners/secondary")

        if (!response.ok) {
          throw new Error("Failed to fetch banner data")
        }

        const data = await response.json()

        // Transform API data to match component structure
        const transformedData = {
          id: data.id || 1,
          title: data.title || "Shop the latest",
          subtitle: data.subtitle || "tech gadgets",
          description:
            data.description || "From smartphones to smart home devices, find everything you need right here.",
          buttonText: data.buttonText || "Shop Now",
          link: data.link || "/shop",
          image: data.image || "/images/banner/gaming-laptop.png",
        }

        setBannerData(transformedData)
      } catch (err) {
        console.error("Error fetching banner data:", err)
        setError(err instanceof Error ? err.message : "Failed to load banner")

        // Fallback data
        setBannerData({
          id: 1,
          title: "Shop the latest",
          subtitle: "tech gadgets",
          description: "From smartphones to smart home devices, find everything you need right here.",
          buttonText: "Shop Now",
          link: "/shop",
          image: "/images/banner/gaming-laptop.png",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  if (loading) {
    return (
      <section className="bg-gradient-to-b bg-gray-600 to-gray-200 dark:bg-gray-900">
        <div className="relative max-w-screen-xl mx-auto p-4 md:p-8 py-16">
          <Loader />
        </div>
      </section>
    )
  }

  if (!bannerData) {
    return (
      <section className="bg-gradient-to-b bg-gray-600 to-gray-200 dark:bg-gray-900">
        <div className="relative max-w-screen-xl mx-auto p-4 md:p-8 py-16 text-center">
          <p className="text-white">Error loading banner: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-b bg-gray-600 to-gray-200 dark:bg-gray-900">
      <div className="relative max-w-screen-xl mx-auto p-4 md:p-8 overflow-hidden flex flex-col-reverse lg:block">
        <div className="max-w-7xl mx-auto text-center lg:text-left">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-1/2 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">{bannerData.title}</span>{" "}
                  <span className="block text-blue-500 dark:text-blue-600 xl:inline">{bannerData.subtitle}</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {bannerData.description}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href={bannerData.link}
                      className="w-full flex items-center justify-center px-12 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      {bannerData.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="w-full h-[20rem] lg:h-full lg:absolute lg:inset-y-0 lg:right-0 lg:top-15 lg:w-1/2">
          <div className="relative w-full h-full">
            <Image
              className="h-56 w-full object-contain sm:h-72 md:h-96 lg:w-full lg:h-full"
              src={bannerData.image || "/placeholder.svg"}
              fill
              alt="Banner"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default BannerTwo
