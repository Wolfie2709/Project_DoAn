"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useCartStore from "@/store/cartStore"
import { formatPrice } from "@/lib/formatPrice"
import { useAuthStore } from "@/store/authStore"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import CartItemsDetails from "@/components/carts/CartItemsDetails"
import { CreditCard, Building2, Smartphone, QrCode, Copy } from "lucide-react"

const FinalConfirmationForm = () => {
  const router = useRouter()
  const [shippingData, setShippingData] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { getTotalPrice, getTax, getShippingFee, getTotalAmount, cartItems, clearCart } = useCartStore()
  const { customer, customerDetails, setCustomerDetails } = useAuthStore()
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const initialize = async () => {
      const fetchCustomerDetails = async () => {
        if (customer) {
          try {
            const res = await fetch(`https://localhost:7240/api/Customers/${customer.customerId}`)
            if (!res.ok) throw new Error("Failed to fetch customer details")
            const data = await res.json()

            console.log("📦 API response data:", data)

            setCustomerDetails({
              email: data.email ?? "",
              phone: data.phoneNumber ?? "",
              address: data.address ?? "",
            })
          } catch (err) {
            console.error("Error fetching customer details:", err)
          }
        }
      }

      await fetchCustomerDetails()

      // Try to get shipping data from multiple sources
      let parsedData = null

      // First, try to get from localStorage
      const storedData = localStorage.getItem("shippingFormData")
      if (storedData) {
        parsedData = JSON.parse(storedData)
        console.log("📦 Found shipping data in localStorage:", parsedData)
      }

      // If no localStorage data, try to get from completed order (user came back)
      if (!parsedData) {
        const completedOrderData = localStorage.getItem("completedOrder")
        if (completedOrderData) {
          const orderData = JSON.parse(completedOrderData)
          console.log("📦 Found completed order data:", orderData)
          // Extract shipping data if available
          if (orderData.shippingData) {
            parsedData = orderData.shippingData
          }
        }
      }

      // If still no data, reconstruct from customer details
      if (!parsedData && customer) {
        console.log("📦 Reconstructing shipping data from customer details")
        const customerData = useAuthStore.getState().customerDetails

        if (customerData) {
          // Parse address if it exists
          const addressParts = customerData.address?.split(",") || []

          parsedData = {
            firstName: customer.fullName?.split(" ")[0] || "",
            lastName: customer.fullName?.split(" ").slice(1).join(" ") || "",
            email: customerData.email || "",
            phone: customerData.phone || "",
            home_address: addressParts[0]?.trim() || "",
            city: addressParts[1]?.trim() || "",
            zip: addressParts[2]?.trim() || "",
            country: addressParts[3]?.trim() || "",
          }

          // Save this reconstructed data back to localStorage
          localStorage.setItem("shippingFormData", JSON.stringify(parsedData))
          console.log("📦 Reconstructed and saved shipping data:", parsedData)
        }
      }

      if (parsedData) {
        const latest = useAuthStore.getState().customerDetails
        if (latest) {
          parsedData.email = latest.email || parsedData.email
          parsedData.phone = latest.phone || parsedData.phone
          parsedData.address = latest.address || parsedData.address
        }

        console.log("✅ Final merged shippingData:", parsedData)
        setShippingData(parsedData)
      }
    }

    initialize()
  }, [customer])

  const handleFormSubmit = async () => {
    if (!shippingData || !customer || !paymentMethod || cartItems.length === 0) {
      alert("Please make sure all information is filled and cart is not empty.")
      return
    }

    const order = {
      CustomerId: customer.customerId,
      Address: `${shippingData?.home_address ?? ""}, ${shippingData?.city ?? ""}, ${shippingData?.zip ?? ""}, ${shippingData?.country ?? ""}`,
      EstimateDate: new Date().toISOString(),
      Note: shippingData?.note ?? "",
      ReceiverName: `${shippingData?.firstName ?? ""} ${shippingData?.lastName ?? ""}`,
      ReceiverPhone: shippingData?.phone ?? "",
      ReceiverEmail: shippingData?.email ?? "",
      productList: cartItems.map((item: any) => ({
        ProductId: item.productId,
        Amount: item.quantity,
        OriginalPrice: item.price,
        DiscountedPrice: item.discountedPrice ?? item.price,
      })),
    }

    try {
      setIsSubmitting(true)

      const res = await fetch("https://localhost:7240/api/Orders", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const contentType = res.headers.get("Content-Type")
        let errorText = "Unknown error"

        if (contentType?.includes("application/json")) {
          const errorData = await res.json()
          errorText = errorData.message || JSON.stringify(errorData)
        } else {
          errorText = await res.text()
        }

        console.error("Order API validation error:", errorText)
        alert(`Failed to place order: ${errorText}`)
        return
      }

      const orderResponse = await res.json()

      // Store order details for the completion page - using EXACT same format as displayed
      const completedOrderDetails = {
        orderId: orderResponse.orderId || `ORD-${Date.now()}`,
        customerName: `${shippingData?.firstName ?? ""} ${shippingData?.lastName ?? ""}`,
        email: shippingData?.email ?? "",
        total: getTotalAmount(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        items: cartItems.map((item: any) => ({
          name: item.name || item.title || "Product",
          quantity: item.quantity,
          price: item.price,
        })),
        // Store shipping data and cart items for potential back navigation
        shippingData: shippingData,
        cartItems: cartItems, // Store cart items to restore if user comes back
        paymentMethod: paymentMethod,
      }

      localStorage.setItem("completedOrder", JSON.stringify(completedOrderDetails))
      // DON'T clear cart here - let the completion page handle it when user actually leaves
      // clearCart?.()

      router.push("/checkout-completed")
    } catch (err) {
      console.error(err)
      alert("Failed to place order: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const renderPaymentDetails = () => {
    if (!paymentMethod) return null

    switch (paymentMethod) {
      case "credit_card":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Credit Card Payment</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You will be redirected to our secure payment processor to complete your credit card payment.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ✓ Secure SSL encryption
                  <br />✓ Visa, Mastercard, American Express accepted
                  <br />✓ Instant payment confirmation
                </p>
              </div>
            </div>
          </div>
        )

      case "paypal":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PayPal Payment</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You will be redirected to PayPal to complete your payment securely.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ✓ PayPal Buyer Protection
                  <br />✓ Pay with PayPal balance or linked cards
                  <br />✓ No need to share card details
                </p>
              </div>
            </div>
          </div>
        )

      case "bank_transfer":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bank Transfer Details</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</p>
                    <p className="text-gray-900 dark:text-white">TechBazer Bank</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("TechBazer Bank")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</p>
                    <p className="text-gray-900 dark:text-white font-mono">1234-5678-9012-3456</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("1234-5678-9012-3456")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</p>
                    <p className="text-gray-900 dark:text-white">TechBazer Ltd.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("TechBazer Ltd.")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Reference</p>
                    <p className="text-gray-900 dark:text-white font-mono">TB-{Date.now().toString().slice(-6)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`TB-${Date.now().toString().slice(-6)}`)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">QR Code for Mobile Banking</p>
                </div>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Scan with your mobile banking app</p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Please include the reference number in your transfer description. Your
                  order will be processed within 24 hours after payment confirmation.
                </p>
              </div>
            </div>
          </div>
        )

      case "cash_on_delivery":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cash on Delivery</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Pay with cash when your order is delivered to your doorstep.
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  ✓ No advance payment required
                  <br />✓ Inspect your order before payment
                  <br />✓ Additional COD fee: $2.99
                  <br />✓ Available for orders under $500
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount to Pay:</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${(getTotalAmount() + 2.99).toFixed(2)} (including COD fee)
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isMounted) {
    return <div className="text-gray-900 dark:text-white">Loading...</div>
  }

  return (
    <div className="bg-gray-100 dark:bg-slate-950 p-4 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form Content */}
        <div className="space-y-8">
          {/* Personal Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <p className="text-gray-800 dark:text-white">
                  {shippingData?.firstName} {shippingData?.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <p className="text-gray-800 dark:text-white">{shippingData?.email}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Shipping Address</h2>
            <p className="text-gray-800 dark:text-white">
              {shippingData?.home_address}, {shippingData?.city}, {shippingData?.zip}, {shippingData?.country}
            </p>
            <p className="text-gray-800 dark:text-white mt-2">Phone: {shippingData?.phone}</p>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
            <CartItemsDetails />
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">${formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
                <span className="text-gray-900 dark:text-white">${formatPrice(getShippingFee())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Tax:</span>
                <span className="text-gray-900 dark:text-white">${formatPrice(getTax())}</span>
              </div>
              {paymentMethod === "cash_on_delivery" && (
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">COD Fee:</span>
                  <span className="text-gray-900 dark:text-white">$2.99</span>
                </div>
              )}
              <Separator className="dark:bg-gray-600" />
              <div className="flex justify-between">
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Total:</span>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  ${formatPrice(paymentMethod === "cash_on_delivery" ? getTotalAmount() + 2.99 : getTotalAmount())}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <Label htmlFor="paymentMethod" className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Payment Method
            </Label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 dark:bg-gray-700 dark:text-white rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Payment Method --</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>

            <Button
              onClick={handleFormSubmit}
              disabled={isSubmitting || !paymentMethod}
              className={`w-full text-xl mt-6 py-6 px-12 rounded-full focus:outline-none hover:ring-2 
                ${isSubmitting || !paymentMethod ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"}`}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>

        {/* Right Column - Payment Details */}
        <div className="space-y-8">
          {paymentMethod ? (
            <div className="sticky top-4">{renderPaymentDetails()}</div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <CreditCard className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Select Payment Method</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Choose a payment method to see the payment details and instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FinalConfirmationForm
