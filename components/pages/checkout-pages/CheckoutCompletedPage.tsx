"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useCartStore from "@/store/cartStore"

interface OrderDetails {
  orderId: string
  customerName: string
  email: string
  total: number
  estimatedDelivery: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingData?: any
  cartItems?: any[]
  paymentMethod?: string
}

const CheckoutCompletedPage = () => {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [countdown, setCountdown] = useState(10)
  const { clearCart } = useCartStore()

  useEffect(() => {
    console.log("CheckoutCompletedPage mounted")

    // Get order details from localStorage
    const storedOrderDetails = localStorage.getItem("completedOrder")
    console.log("Stored order details:", storedOrderDetails)

    if (storedOrderDetails) {
      try {
        const parsedDetails = JSON.parse(storedOrderDetails)

        // Ensure we use the EXACT same data format as FinalConfirmationForm
        if (parsedDetails.shippingData) {
          // Override customerName and email with exact same format from shipping data
          parsedDetails.customerName =
            `${parsedDetails.shippingData.firstName ?? ""} ${parsedDetails.shippingData.lastName ?? ""}`.trim()
          parsedDetails.email = parsedDetails.shippingData.email ?? ""
        }

        setOrderDetails(parsedDetails)
        console.log("Order details set with consistent formatting:", parsedDetails)

        // If there's shipping data in the order, restore it to localStorage
        // This ensures the form is populated if user navigates back
        if (parsedDetails.shippingData) {
          localStorage.setItem("shippingFormData", JSON.stringify(parsedDetails.shippingData))
          console.log("Restored shipping data to localStorage for potential back navigation")
        }

        // If there are cart items in the order, restore them to the cart store
        // This ensures the cart is populated if user navigates back
        if (parsedDetails.cartItems && parsedDetails.cartItems.length > 0) {
          // Restore cart items by adding them back to the store
          const cartStore = useCartStore.getState()
          // Clear current cart first, then add the stored items
          cartStore.clearCart()
          parsedDetails.cartItems.forEach((item: any) => {
            cartStore.addToCart(item)
          })
          console.log("Restored cart items for potential back navigation:", parsedDetails.cartItems)
        }
      } catch (error) {
        console.error("Error parsing order details:", error)
      }
    } else {
      console.log("No stored order details found, using fallback")
      setOrderDetails({
        orderId: `ORD-${Date.now()}`,
        customerName: "Valued Customer",
        email: "customer@example.com",
        total: 0,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        items: [],
      })
    }

    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Clear everything when auto-redirecting
          localStorage.removeItem("completedOrder")
          localStorage.removeItem("shippingFormData")
          clearCart?.()
          router.push("/shop")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, clearCart])

  const handleContinueShopping = () => {
    // Clear everything when manually navigating away
    localStorage.removeItem("completedOrder")
    localStorage.removeItem("shippingFormData")
    clearCart?.()
    router.push("/shop")
  }

  const handleGoHome = () => {
    // Clear everything when manually navigating away
    localStorage.removeItem("completedOrder")
    localStorage.removeItem("shippingFormData")
    clearCart?.()
    router.push("/")
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Thank you for your purchase, {orderDetails.customerName}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <Package className="h-5 w-5" />
              Order Details
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Number</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{orderDetails.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Name</p>
                <p className="text-lg text-gray-900 dark:text-white">{orderDetails.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-lg text-gray-900 dark:text-white">{orderDetails.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</p>
                <p className="text-lg text-gray-900 dark:text-white capitalize">
                  {orderDetails.paymentMethod?.replace("_", " ") || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ${orderDetails.total.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                <p className="text-lg text-gray-900 dark:text-white">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Card */}
        <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What happens next?</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Order Confirmation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You'll receive an email confirmation shortly with your order details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Processing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We'll start preparing your order for shipment within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Shipping</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleContinueShopping}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            size="lg"
          >
            <ShoppingBag className="h-5 w-5" />
            Continue Shopping
          </Button>
          <Button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Button>
        </div>

        {/* Auto-redirect Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You'll be automatically redirected to the shop in {countdown} seconds
          </p>
        </div>

        <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />

        {/* Support Information */}
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Need Help?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="mailto:support@techbazer.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@techbazer.com
            </a>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-500">|</span>
            <a href="tel:+1234567890" className="text-blue-600 dark:text-blue-400 hover:underline">
              +1 (234) 567-8900
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCompletedPage
