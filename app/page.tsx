"use client"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  image: string
  variants: Array<{ name: string; image: string }>
}

interface SelectedProduct extends Product {
  variantsSelected: Record<string, number>
}

const products: Product[] = [
  {
    id: 1,
    name: "WAZABI EXOTICS 1.25G THC-A PREROLLS 50/PK JAR",
    price: "$0.00",
    image:
      "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/WAZABIINDDOREXOTICFLOWERPREROLLS-1.25g6.webp?v=1751651516",
    variants: [
      {
        name: "CHEM JONG UN (HYBRID)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Chem-Jong-Un.webp?v=1748978674",
      },
      {
        name: "DIVORCE CAKE (INDICA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Divorce-Cake.png?v=1748978674",
      },
      {
        name: "JEALOUS BANANA (HYBRID)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Jealous-Banana.png?v=1748978674",
      },
      {
        name: "JACK HERER (SATIVA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Jack-Herer.png?v=1748978674",
      },
      {
        name: "RANDY BUZZ (INDICA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Randy-Buzz.png?v=1748978674",
      },
      {
        name: "TRUMP (SATIVA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/T-Rump.png?v=1748978674",
      },
    ],
  },
  {
    id: 2,
    name: "WAZABI EXOTICS 2G HASH HOLE DOUBLE DROP PREROLLS 2CT 10/PK",
    price: "$0.00",
    image:
      "https://cdn.shopify.com/s/files/1/1953/5227/files/WAZABIEXOTICS2GHASHHOLEDOUBLEDROPPREROLLS10PK6Mylar.png?v=1749596372",
    variants: [
      {
        name: "BLUE ZUSHI + WATERMELON GUSH (HYBRID)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/BLUE-ZUSHI-WATERMELON-GUSH-HYBRID-Single_11zon.webp?v=1748979963",
      },
      {
        name: "GIRLFRIEND EXPERIENCE + ICE CREAM CAKE (INDICA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/GIRLFRIEND-EXPERIENCE-ICE-CREAM-CAKE-INDICA-Single_11zon_430x_37371bc7-109c-4a36-a855-749b395a8bdb.webp?v=1748979963",
      },
      {
        name: "PKL BALL PUNCH + TROPICANA COOKIES (SATIVA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/PKL-BALL-PUNCH-TROPICANA-COOKIES-SATIVA-Single_11zon_430x_ac1e4944-458f-4e0a-8d4c-b0b01813fb0c.webp?v=1748979963",
      },
      {
        name: "CHERRY BOMB + APPLE FRITTER (HYBRID)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Cherry_Bomb_Apple_Fritter_430x_a65b15ce-c194-4a0e-b4ae-98f35150b480.webp?v=1750453840",
      },
      {
        name: "HEAVY ON THE ZZZS + BAHAMA MAMA (INDICA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Heavy_on_the_zzzs_Bahama___Indica_430x_de6243f2-8084-4d32-a809-baffedb1d561.webp?v=1750453839",
      },
      {
        name: "GAS LEAK + ZAZA POP (SATIVA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Gas_Leak_Zaza_Pop___Sativa_430x_e7d61e03-c783-4565-9768-227335c59cc1.webp?v=1750453839",
      },
    ],
  },
  {
    id: 3,
    name: "WAZABI EXOTICS 2G ICE ON FIRE LIQUID DIAMOND PREROLLS 3X5/PK",
    price: "$0.00",
    image:
      "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/WAZABIEXOTICS2GHASHHOLEDOUBLEDROPPREROLLS10PK.png?v=1751480987",
    variants: [
      {
        name: "SNAPDRAGON (SATIVA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/01Sativa-Snapdragon.png?v=1751480987",
      },
      {
        name: "FROOTY BOOTY (SATIVA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/02Sativa-FrootyBooty.png?v=1751480987",
      },
      {
        name: "ICE CREAM MELT (INDICA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/06Indica-IceCreamMelt.png?v=1751480987",
      },
      {
        name: "FLIX N CHILL (INDICA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/05Indica-FlixN_Chill.png?v=1751480987",
      },
      {
        name: "BANANA PEEL (HYBRID)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/04Hybrid-BananaPeel.png?v=1751480987",
      },
      {
        name: "ZOUR GUSHERS (HYBRID)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/03Hybrid-ZourGushers.png?v=1751480987",
      },
    ],
  },
  {
    id: 4,
    name: "WAZABI EXOTICS 3.5 GRAMS TRICHOME-RICH EXOTIC FLOWER",
    price: "$0.00",
    image:
      "https://cdn.shopify.com/s/files/1/1953/5227/files/WAZABIEXOTICS3.5GRAMSTRICHOME-RICHEXOTICFLOWER.png?v=1749596993",
    variants: [
      {
        name: "HYPE TRAIN (SATIVA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/HYPE_TRAIN_SATIVA_110x110@2x.png?v=1748288292",
      },
      {
        name: "ZAP ZAP (SATIVA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/ZAP_ZAP_SATIVA_110x110@2x.png?v=1748979963",
      },
      {
        name: "UNICORN DUST (INDICA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/UNICORN_DUST_INDICA_110x110@2x.png?v=1748979963",
      },
      {
        name: "BUBBLE BUTT (INDICA)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/BUBBLE_BUTT_INDICA_110x110@2x.png?v=1748979963",
      },
      {
        name: "BUSHIDO BLAZE (HYBRID)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/BUSHIDO_BLAZE_HYBRID_110x110@2x.png?v=1748979963",
      },
      {
        name: "BLUE COOKIE (HYBRID)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/BLUE_COOKIE_HYBRID_110x110@2x.png?v=1748979963",
      },
    ],
  },
  {
    id: 5,
    name: "WAZABI EXOTICS DOUBLE DROP CALIFORNIA VS OREGON 1.5 GRAM PREROLLS 30/PK (2 IN 1 JAR)",
    price: "$0.00",
    image:
      "https://cdn.shopify.com/s/files/1/1953/5227/files/WAZABIEXOTICSDOUBLEDROPCALIFORNIAVSOREGON1.5GRAMPREROLLS25PK_2IN1JAR.png?v=1749596930",
    variants: [
      {
        name: "TRUMP OG + MOBY DICK (SATIVA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/TRUMPOG_MOBYDICK_SATIVA_110x110@2x.png?v=1743104003",
      },
      {
        name: "ZEN AF + PURPLE URKLE (INDICA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/ZENAF_PURPLEURKLE_INDICA_110x110@2x.png?v=1743104003",
      },
      {
        name: "CEREAL MILK + MULE FUEL (HYBRID)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/CEREALMILK_MULEFUEL_HYBRID_110x110@2x.png?v=1748282849",
      },
    ],
  },
  {
    id: 6,
    name: "WAZABI EXOTICS GOLD RESERVE MEMBERS ONLY 1G FLOWER JAR 15/PK - (3 IN 1 JAR)",
    price: "$0.00",
    image: "https://cdn.shopify.com/s/files/1/1953/5227/files/WAZABIZushiClubBackZushiClub.png?v=1734138927",
    variants: [
      {
        name: "(3 in 1)",
        image: "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/Zushi-Club-1-2_110x110@2x.png?v=1740428341",
      },
    ],
  },
  {
    id: 8,
    name: "WAZABI EXOTICS RED EYE 1G FLOWER BAG 7/PK",
    price: "$0.00",
    image:
      "https://cdn.shopify.com/s/files/1/1953/5227/files/WAZABI_INDOOR_EXOTIC_FLOWER_POP_1_PK_69bb71a0-cec0-4268-b59b-e400aa9bbcd4.png?v=1728426032",
    variants: [
      {
        name: "CHEM JONG UN (HYBRID)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-CHEM-JONG-UN-HYBRID_110x110@2x.png?v=1740429142",
      },
      {
        name: "DIVORCE CAKE (INDICA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-DIVORCE-CAKE-INDICA_110x110@2x.png?v=1748978069",
      },
      {
        name: "TRUMP (SATIVA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-JEALOUS-BANANA-HYBRID_110x110@2x.png?v=1748978069",
      },
      {
        name: "JEALOUS BANANA (HYBRID)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-JEALOUS-BANANA-HYBRID_110x110@2x.png?v=1748978069",
      },
      {
        name: "JACK HERER (SATIVA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-JACK-HERER-SATIVA_110x110@2x.png?v=1748978069",
      },
      {
        name: "KUNG FU PANDA (SATIVA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-KUNG-FU-PANDA-SATIVA_110x110@2x.png?v=1748978069",
      },
      {
        name: "RANDY BUZZ (INDICA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-RANDY-BUZZ-INDICA_110x110@2x.png?v=1748978069",
      },
      {
        name: "SPACE JELLO (HYBRID)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-JACK-HERER-SATIVA_110x110@2x.png?v=1748978069",
      },
      {
        name: "SUGARDADDY PURP (INDICA)",
        image:
          "https://cdn.shopify.com/s/files/1/0681/7654/3930/files/1G-_-SUGARDADDY-PURP-INDICA_110x110@2x.png?v=1748978069",
      },
    ],
  },
]

export default function ProductSurvey() {
  const [currentStep, setCurrentStep] = useState(0)
  const [thcALegal, setThcALegal] = useState<boolean | null>(null)
  const [customerType, setCustomerType] = useState<string>("")
  const [locationCount, setLocationCount] = useState<number>(0)
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rep: "",
  })

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("wazabi-survey-state")
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setCurrentStep(parsed.currentStep || 0)
        setThcALegal(parsed.thcALegal)
        setCustomerType(parsed.customerType || "")
        setLocationCount(parsed.locationCount || 0)
        setSelectedProducts(parsed.selectedProducts || {})
        setFormData(
          parsed.formData || {
            name: "",
            email: "",
            rep: "",
          },
        )
      } catch (error) {
        console.error("Error loading saved state:", error)
        localStorage.removeItem("wazabi-survey-state")
        setCurrentStep(0)
      }
    }
  }, [])

  // Save state to localStorage whenever state changes
  useEffect(() => {
    const stateToSave = {
      currentStep,
      thcALegal,
      customerType,
      locationCount,
      selectedProducts,
      formData: {
        ...formData,
        einFile: null,
        taxFile: null,
      },
    }
    localStorage.setItem("wazabi-survey-state", JSON.stringify(stateToSave))
  }, [currentStep, thcALegal, customerType, locationCount, selectedProducts, formData])

  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const updateProgressBar = () => {
    if (currentStep === 1) return 0
    if (currentStep >= 2 && currentStep < products.length + 2) return 50
    if (currentStep === products.length + 2) return 100
    return 0
  }

  const toast = (message: string, bgColor = "#10b981") => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 4000)
  }

  const handleRestart = () => {
    localStorage.removeItem("wazabi-survey-state")
    setCurrentStep(0)
    setThcALegal(null)
    setCustomerType("")
    setLocationCount(0)
    setSelectedProducts({})
    setFormData({
      name: "",
      email: "",
      rep: "",
    })
  }

  const convertImageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL("image/png")
        resolve(dataURL)
      }
      img.onerror = () => resolve("")
      img.src = url
    })
  }

  const generatePDF = async (orderNumber: number, invoiceId: string) => {
    const jsPDF = (await import("jspdf")).default
    const html2canvas = (await import("html2canvas")).default

    const formattedOrderNumber = String(orderNumber).padStart(3, "0")

    const invoiceContainer = document.createElement("div")
    invoiceContainer.id = "invoice-template"
    invoiceContainer.style.width = "210mm"
    invoiceContainer.style.padding = "10mm"
    invoiceContainer.style.fontFamily = "sans-serif"
    invoiceContainer.style.fontSize = "10px"
    invoiceContainer.style.color = "#000"
    invoiceContainer.style.background = "#fff"
    invoiceContainer.style.position = "absolute"
    invoiceContainer.style.left = "-9999px"
    invoiceContainer.style.top = "-9999px"

    const orderDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    let itemsHtml = ""

    for (const product of Object.values(selectedProducts)) {
      for (const [variant, qty] of Object.entries(product.variantsSelected)) {
        if (qty > 0) {
          const variantImageUrl = (product.variants.find((v) => v.name === variant) || {}).image || product.image
          const base64Image = await convertImageToBase64(variantImageUrl)

          itemsHtml += `
        <div class="break-inside-avoid" style="display: flex; align-items: center; margin-bottom: 10px;">
          <img src="${base64Image}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
          <div style="flex-grow: 1;">
            <div style="font-weight: bold;">${product.name}</div>
            <div style="color: #555;">${variant}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold;">${qty}</div>
            <div style="font-size: 9px; color: #777;">${product.price} each</div>
            <div style="font-weight: bold;">$${(Number.parseFloat(product.price.replace("$", "")) * qty).toFixed(2)}</div>
          </div>
        </div>
      `
        }
      }
    }

    invoiceContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="font-size: 24px; font-weight: bold;">Invoice #${formattedOrderNumber}</div>
      <div style="text-align: right;">
        <div>Order ID: ${invoiceId}</div>
        <div>Date: ${orderDate}</div> 
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="width: 100%;">
        <div style="font-weight: bold; margin-bottom: 5px; color: #333;">CUSTOMER DETAILS</div>
        <div>Bill To: ${formData.name}</div>
        <div>Ship To: ${formData.email}</div>
        <div>Sales Rep: ${formData.rep || "N/A"}</div>
        <div>Customer Type: ${customerType}</div>
        <div>Number of Locations: ${locationCount}</div>
        <div>THC-A Legal in State: ${thcALegal ? "Yes" : "No"}</div>
      </div>
    </div>

    <hr style="border-top: 1px solid grey; margin-top: 50px; margin-bottom: 50px;">

    <div id="invoice-items" style="margin-top:-60px;">
      ${itemsHtml}
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 20px; font-size: 14px; font-weight: bold;">
      Total: $${calculateTotal().toFixed(2)}
    </div>

    <hr style="border-top: 1px solid black; margin-top: 20px; margin-bottom: 20px;">

    <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
      <div>Thank you for shopping with us!</div>
      <div style="font-weight: bold; margin-top: 10px;">Flying Brands</div>
      <div>5800 Corporate Drive, Ste D1, Houston TX 77036, United States</div>
      <div>info@wazabilabs.com</div>
      <div>wazabilabs.com</div>
    </div>
  `

    document.body.appendChild(invoiceContainer)

    const canvas = await html2canvas(invoiceContainer, {
      scale: 2,
      scrollY: -window.scrollY,
      backgroundColor: "#ffffff",
      windowWidth: invoiceContainer.scrollWidth,
    })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft)
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    document.body.removeChild(invoiceContainer)

    return pdf
  }

  const sendEmailWithPDF = async (pdfUrl: string, orderNumber: number) => {
    try {
      console.log("📧 Sending email with PDF URL...")
      const res = await fetch("/api/invoices/send-invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl: pdfUrl,
          orderId: String(orderNumber).padStart(3, "0"),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("❌ Email sending failed:", errorData)
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }

      const responseData = await res.json()
      console.log("✅ Email sent successfully")
      toast("PDF sent to admin successfully!")
    } catch (err) {
      console.error("❌ Error sending PDF:", err)
      toast(`Error sending PDF: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  const handleProductSelect = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (selectedProducts[productId]) {
      const newSelected = { ...selectedProducts }
      delete newSelected[productId]
      setSelectedProducts(newSelected)
    } else {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: {
          ...product,
          variantsSelected: {},
        },
      }))
    }
  }

  const updateVariantQuantity = (productId: number, variantName: string, quantity: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        variantsSelected: {
          ...prev[productId].variantsSelected,
          [variantName]: Math.max(0, quantity),
        },
      },
    }))
  }

  const updateProductPrice = (productId: number, price: string) => {
    const cleanPrice = price.replace(/^0+(?=\d)/, "")
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        price: cleanPrice,
      },
    }))
  }

  const calculateTotal = () => {
    return Object.values(selectedProducts).reduce((total, product) => {
      const price = Number.parseFloat(product.price.replace("$", ""))
      const variantTotal = Object.values(product.variantsSelected).reduce((sum, qty) => sum + qty, 0)
      return total + price * variantTotal
    }, 0)
  }

  const handleNext = () => {
    if (currentStep >= 3 && currentStep < products.length + 2) {
      const product = products[currentStep - 3]
      const selected = selectedProducts[product.id]

      if (selected) {
        const price = Number.parseFloat(selected.price.replace("$", ""))
        const hasQuantity = Object.values(selected.variantsSelected).some((qty) => qty > 0)

        if (isNaN(price) || price <= 0) {
          toast("Please set a valid price.")
          return
        }

        if (!hasQuantity) {
          toast("Please select at least one quantity of any variant.")
          return
        }
      }
    }

    if (currentStep < products.length + 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Generate PDF first
      const pdf = await generatePDF(0, "temp") // Temporary values
      const pdfDataUrl = pdf.output("dataurlstring")

      const submissionData = {
        thcALegal,
        customerType,
        locationCount,
        formData: {
          ...formData,
        },
        selectedProducts,
        pdfData: pdfDataUrl, // Include PDF data
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save invoice data.")
      }

      const responseData = await response.json()
      const { id: invoiceId, orderNumber, pdfUrl } = responseData

      // Download PDF for user
      pdf.save(`Wazabi_Order_${String(orderNumber).padStart(3, "0")}_${new Date().toISOString().split("T")[0]}.pdf`)

      // Send email with PDF URL if available
      if (pdfUrl) {
        await sendEmailWithPDF(pdfUrl, orderNumber)
      } else {
        toast("Order saved but PDF upload failed. Please contact support.")
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast("Order placed successfully! PDF downloaded and sent to email.")

      localStorage.removeItem("wazabi-survey-state")
      setCurrentStep(0)
      setSelectedProducts({})
      setThcALegal(null)
      setCustomerType("")
      setLocationCount(0)
      setFormData({
        name: "",
        email: "",
        rep: "",
      })
    } catch (error) {
      console.error("Error placing order:", error)
      toast(`Error placing order: ${(error as Error).message || "Please try again."}`)
    }

    setIsLoading(false)
  }

  const selectCustomerType = (type: string) => {
    setCustomerType(type)
  }

  const insertLineBreaks = (text: string, wordsPerLine = 5) => {
    return text.split(" ").reduce((acc, word, index) => {
      return acc + word + ((index + 1) % wordsPerLine === 0 ? "\n" : " ")
    }, "")
  }

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <img
            src="https://cdn.shopify.com/s/files/1/0681/7654/3930/files/366ab00c-da4a-4487-9990-b70ee9b9c761_removalai_preview.png?v=1751664786"
            alt="Wazabi Logo"
            className="w-80 mb-4"
          />
        </div>
      )
    }

    if (currentStep === 1) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-0">
          <div className="flex justify-center mb-4">
            <img
              src="https://wazabilabs.com/wp-content/uploads/2024/10/Website-Logo.webp"
              alt="Wazabi Logo"
              className="h-20 object-contain"
            />
          </div>
          <h2 className="text-xl text-gray-700 mb-6">Is THC-A legal in your customer's state?</h2>
          <div className="flex justify-center gap-6">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                className="w-full bg-transparent border border-green-500 text-green-600 font-medium py-3 px-16 rounded-md text-base"
                onClick={() => {
                  setThcALegal(false)
                  setCurrentStep(2)
                }}
              >
                No
              </button>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-16 rounded-md text-base"
                onClick={() => {
                  setThcALegal(true)
                  setCurrentStep(2)
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-0">
          <h2 className="text-xl text-gray-700 mb-6">Select Customer Type</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div
              onClick={() => selectCustomerType("Store")}
              id="type-store"
              className={`cursor-pointer border-2 rounded-xl p-6 hover:border-green-500 w-[calc(50%-0.5rem)] md:w-40 text-center ${
                customerType === "Store" ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="mb-2">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 122.88 102.36"
                >
                  <defs>
                    <style>{`.cls-1{fillRule:evenodd;}`}</style>
                  </defs>
                  <title>store</title>
                  <path
                    className="cls-1 opacity-50"
                    d="M69.19,77.45a1.75,1.75,0,1,1-1.75,1.75,1.75,1.75,0,0,1,1.75-1.75ZM22.11,22.84H3.44v3a8.48,8.48,0,0,0,8.43,8.46c2.32,0,6.24-.95,7.77-2.49a8.45,8.45,0,0,0,2.47-6v-3Zm-17.81-3H22.64l3-16.93h-14L4.3,19.82ZM74.43,2.89,75.7,19.82H96.21L92.75,2.89ZM71.69,19.82,70.43,2.89h-18L51.18,19.82Zm-24.52,0L48.41,2.89H29.66l-3,16.93ZM96.74,2.89l3.45,16.93h18.29L110.57,2.89Zm4,20v3a8.45,8.45,0,0,0,2.47,6c1.53,1.54,5.45,2.49,7.77,2.49a8.48,8.48,0,0,0,8.43-8.46v-3ZM76,22.84v3a8.42,8.42,0,0,0,2.48,6c1.53,1.54,5.44,2.49,7.76,2.49s6.23-.95,7.76-2.49a8.42,8.42,0,0,0,2.48-6v-3Zm-24.82,0v3a8.42,8.42,0,0,0,2.48,6c1.53,1.54,5.44,2.49,7.76,2.49s6.23-.95,7.76-2.49a8.42,8.42,0,0,0,2.48-6v-3Zm-24.82,0v3a8.42,8.42,0,0,0,2.48,6c1.53,1.54,5.44,2.49,7.76,2.49s6.23-.95,7.76-2.49a8.42,8.42,0,0,0,2.48-6v-3Zm79.71,13.79c-1.25-.58-4.33-1.38-5.3-2.35a12,12,0,0,1-2.12-2.88,12,12,0,0,1-2.12,2.88c-2.14,2.14-7,3.46-10.29,3.46S78.11,36.42,76,34.28a12,12,0,0,1-2.12-2.88,12,12,0,0,1-2.12,2.88c-2.14,2.14-7,3.46-10.29,3.46s-8.15-1.32-10.29-3.46a12,12,0,0,1-2.12-2.88,12,12,0,0,1-2.12,2.88c-1.41,1.41-5.12,2.46-7.08,3q-.64.08-1.32.12V95.86a1.12,1.12,0,0,0,.33.79,1.15,1.15,0,0,0,.81.34h45V56.62a9.76,9.76,0,0,1,9.74-9.74H85.64a9.76,9.76,0,0,1,9.73,9.74V97h12.68a1.13,1.13,0,0,0,.8-.34h0a1.13,1.13,0,0,0,.32-.79V37.48c0-.11,0-.22,0-.32a24.62,24.62,0,0,1-3.11-.53ZM64.33,97H90.85V56.62a5.24,5.24,0,0,0-5.22-5.22H69.55a5.24,5.24,0,0,0-5.22,5.22V97ZM30,54.32h16.1a2.27,2.27,0,0,1,2.27,2.26V80.51a2.27,2.27,0,0,1-2.27-2.27H30a2.27,2.27,0,0,1-2.27-2.27V56.58A2.27,2.27,0,0,1,30,54.32Zm13.84,4.53H32.25v19.4H43.84V58.85ZM8.37,37a10.49,10.49,0,0,1-4.9-2.67A11.77,11.77,0,0,1,0,25.94V21.3H0a1.45,1.45,0,0,1,.17-.67L9.45.69A1.33,1.33,0,0,1,10.62,0h100.9a1.35,1.35,0,0,1,1.21.76l10,19.83a1.35,1.35,0,0,1,.19.63h0a.57.57,0,0,1,0,.13v4.58a11.77,11.77,0,0,1-3.47,8.34,10,10,0,0,1-4.91,2.64,2.6,2.6,0,0,1,.06.56V95.86a6.49,6.49,0,0,1-1.92,4.58h0a6.49,6.49,0,0,1-4.6,1.91H14.83a6.49,6.49,0,0,1-4.59-1.91h0a6.46,6.46,0,0,1-1.91-4.58V37.48a3.07,3.07,0,0,1,0-.53Z"
                  />
                </svg>
              </div>
              <div className="font-medium">Store</div>
            </div>
            <div
              onClick={() => selectCustomerType("Wholesale")}
              id="type-wholesale"
              className={`cursor-pointer border-2 rounded-xl p-6 hover:border-green-500 w-[calc(50%-0.5rem)] md:w-40 text-center ${
                customerType === "Wholesale" ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="mb-2">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  width="256"
                  height="256"
                  viewBox="0 0 256 256"
                >
                  <g
                    style={{
                      stroke: "none",
                      strokeWidth: 0,
                      strokeDasharray: "none",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter",
                      strokeMiterlimit: 10,
                      fill: "none",
                      fillRule: "nonzero",
                      opacity: 1,
                    }}
                    transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                  >
                    <path
                      d="M 41.919 13.311 h -7.308 H 28.21 h -6.75 h -7.308 H 7.75 H 1 c -0.552 0 -1 0.448 -1 1 v 20.459 v 20.459 v 20.46 c 0 0.553 0.448 1 1 1 h 20.459 h 20.459 c 0.552 0 1 -0.447 1 -1 v -20.46 V 34.771 V 14.311 C 42.919 13.759 42.471 13.311 41.919 13.311 z M 29.21 56.229 h 4.401 v 6.484 H 29.21 V 56.229 z M 34.611 54.229 H 28.21 h -5.75 V 35.771 h 4.75 v 7.484 c 0 0.552 0.448 1 1 1 h 6.401 c 0.552 0 1 -0.448 1 -1 v -7.484 h 5.308 v 18.459 H 34.611 z M 8.75 56.229 h 4.401 v 6.484 H 8.75 V 56.229 z M 14.152 54.229 H 7.75 H 2 V 35.771 h 4.75 v 7.484 c 0 0.552 0.448 1 1 1 h 6.401 c 0.552 0 1 -0.448 1 -1 v -7.484 h 5.308 v 18.459 H 14.152 z M 8.75 35.771 h 4.401 v 6.484 H 8.75 V 35.771 z M 29.21 35.771 h 4.401 v 6.484 H 29.21 V 35.771 z M 40.919 33.771 h -6.308 H 28.21 h -5.75 V 15.311 h 4.75 v 7.484 c 0 0.552 0.448 1 1 1 h 6.401 c 0.552 0 1 -0.448 1 -1 v -7.484 h 5.308 V 33.771 z M 33.611 15.311 v 6.484 H 29.21 v -6.484 H 33.611 z M 13.152 15.311 v 6.484 H 8.75 v -6.484 H 13.152 z M 2 15.311 h 4.75 v 7.484 c 0 0.552 0.448 1 1 1 h 6.401 c 0.552 0 1 -0.448 1 -1 v -7.484 h 5.308 v 18.459 h -6.308 H 7.75 H 2 V 15.311 z M 2 56.229 h 4.75 v 7.484 c 0 0.553 0.448 1 1 1 h 6.401 c 0.552 0 1 -0.447 1 -1 v -7.484 h 5.308 v 18.46 H 2 V 56.229 z M 40.919 74.689 H 22.459 v -18.46 h 4.75 v 7.484 c 0 0.553 0.448 1 1 1 h 6.401 c 0.552 0 1 -0.447 1 -1 v -7.484 h 5.308 V 74.689 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 59.2 71.51 c -0.271 0 -0.521 -0.11 -0.71 -0.3 c -0.19 -0.19 -0.29 -0.44 -0.29 -0.7 c 0 -0.13 0.02 -0.26 0.069 -0.39 c 0.061 -0.12 0.13 -0.221 0.221 -0.32 c 0.369 -0.37 1.04 -0.37 1.409 0 c 0.101 0.09 0.17 0.2 0.221 0.32 c 0.05 0.13 0.08 0.26 0.08 0.39 s -0.03 0.26 -0.08 0.38 c -0.051 0.12 -0.12 0.23 -0.221 0.32 c -0.09 0.1 -0.199 0.17 -0.319 0.22 S 59.33 71.51 59.2 71.51 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 89 45.438 H 74.383 V 26.594 c 0 -0.552 -0.447 -1 -1 -1 s -1 0.448 -1 1 v 9.626 h -2.984 v -9.626 c 0 -0.552 -0.447 -1 -1 -1 s -1 0.448 -1 1 v 31.583 h -4.104 L 53.123 39.258 c -0.175 -0.324 -0.513 -0.526 -0.881 -0.526 h -4.07 c -0.553 0 -1 0.448 -1 1 s 0.447 1 1 1 h 3.473 l 9.38 17.447 c -0.962 0.005 -1.913 0.114 -2.84 0.324 c -0.031 -0.033 -0.048 -0.073 -0.084 -0.102 l -4.723 -3.836 l 1.388 -1.565 c 0.366 -0.413 0.329 -1.045 -0.085 -1.411 c -0.413 -0.366 -1.045 -0.331 -1.411 0.085 l -4.117 4.643 c -0.366 0.413 -0.329 1.045 0.085 1.411 c 0.19 0.169 0.427 0.252 0.663 0.252 c 0.275 0 0.551 -0.113 0.748 -0.337 l 1.4 -1.579 l 3.9 3.168 c -0.712 0.303 -1.403 0.661 -2.059 1.089 L 53.308 60.7 c -1.301 0.851 -2.812 1.3 -4.368 1.3 h -0.768 c -0.553 0 -1 0.447 -1 1 s 0.447 1 1 1 h 0.768 c 1.946 0 3.835 -0.563 5.462 -1.625 l 0.582 -0.38 c 1.822 -1.189 3.934 -1.818 6.107 -1.818 h 6.308 v 9.593 h -2.067 c -0.367 -3.061 -2.974 -5.443 -6.132 -5.443 s -5.766 2.382 -6.133 5.443 h -4.894 c -0.553 0 -1 0.447 -1 1 s 0.447 1 1 1 h 4.976 c 0.584 2.805 3.075 4.92 6.051 4.92 s 5.466 -2.115 6.05 -4.92 h 2.149 v 3.92 c 0 0.553 0.447 1 1 1 s 1 -0.447 1 -1 v -4.92 V 59.177 V 38.22 h 2.984 v 8.217 c 0 0.553 0.447 1 1 1 H 89 c 0.553 0 1 -0.447 1 -1 C 90 45.885 89.553 45.438 89 45.438 z M 59.199 74.689 c -2.306 0 -4.182 -1.876 -4.182 -4.182 s 1.876 -4.182 4.182 -4.182 s 4.181 1.876 4.181 4.182 S 61.505 74.689 59.199 74.689 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 89 29.889 H 78.278 c -0.553 0 -1 0.448 -1 1 v 10.722 c 0 0.552 0.447 1 1 1 H 89 c 0.553 0 1 -0.448 1 -1 V 30.889 C 90 30.337 89.553 29.889 89 29.889 z M 88 40.611 h -8.722 v -8.722 H 88 V 40.611 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>
              <div className="font-medium">Wholesale</div>
            </div>
          </div>

          <div id="location-input" className={`mt-6 ${customerType ? "" : "hidden"}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">How many locations do you have?</label>
            <input
              type="number"
              id="location-count"
              min="1"
              value={locationCount || ""}
              onChange={(e) => setLocationCount(Number.parseInt(e.target.value) || 0)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  ;(e.target as HTMLInputElement).blur()
                  handleNext()
                }
              }}
              className="w-48 mx-auto p-3 border rounded-xl shadow-sm"
            />
          </div>
        </div>
      )
    }

    if (currentStep >= 3 && currentStep < products.length + 2) {
      const product = products[currentStep - 3]
      const isSelected = selectedProducts[product.id]

      return (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2">
            <div
              className={`product-card p-4 border rounded-xl bg-white shadow text-center cursor-pointer transition-all hover:bg-green-50 hover:border-green-500 ${
                isSelected ? "border-2 border-green-500 bg-green-50" : ""
              }`}
              onClick={() => handleProductSelect(product.id)}
            >
              <img src={product.image || "/placeholder.svg"} className="mx-auto mb-3 rounded" alt={product.name} />
              <h4 className="text-md font-semibold">{product.name}</h4>
              <p className="text-sm text-gray-600"></p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            {isSelected && (
              <div className="col-span-3 mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Set Product Price ($)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^\d+(\.\d{1,2})?$"
                  value={selectedProducts[product.id].price}
                  onFocus={(e) => {
                    e.target.select()
                  }}
                  onChange={(e) => {
                    const raw = e.target.value
                    if (/^\d*\.?\d{0,2}$/.test(raw)) {
                      updateProductPrice(product.id, raw)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      ;(e.target as HTMLInputElement).blur()
                    }
                  }}
                  className="w-full p-2 border rounded shadow-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {product.variants.map((variant) => {
                const qty = selectedProducts[product.id]?.variantsSelected[variant.name] || 0

                return (
                  <div key={variant.name} className={`variant-box ${isSelected ? "enabled" : ""}`}>
                    {variant.image && (
                      <img
                        src={variant.image || "/placeholder.svg"}
                        className="mb-1 rounded w-full h-24 object-cover"
                        alt={variant.name}
                      />
                    )}
                    <div className="text-xs mb-1">{variant.name}</div>
                    <div className="controls flex items-center justify-center gap-1 mt-1">
                      <button
                        className="dec bg-gray-200 px-2 rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isSelected) {
                            updateVariantQuantity(product.id, variant.name, qty - 1)
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => {
                          if (isSelected) {
                            const valStr = e.target.value
                            let val = 0
                            if (valStr === "") {
                              val = 0
                            } else if (valStr === "0") {
                              val = 0
                            } else {
                              val = Number.parseInt(valStr.replace(/^0+/, "")) || 0
                            }
                            updateVariantQuantity(product.id, variant.name, val)
                          }
                        }}
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = ""
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const val = Number.parseInt((e.target as HTMLInputElement).value) || 0
                            if (isSelected) {
                              updateVariantQuantity(product.id, variant.name, val)
                            }
                            ;(e.target as HTMLInputElement).blur()
                          }
                        }}
                        className="variant-qty no-spinner border rounded w-14 text-center text-xs px-1 py-1"
                      />
                      <button
                        className="inc bg-gray-200 px-2 rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isSelected) {
                            updateVariantQuantity(product.id, variant.name, qty + 1)
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Place Your Order</h2>
        <p className="text-sm text-gray-600 text-center mb-3">
          THC-A Legal in State: <strong>{thcALegal ? "Yes" : "No"}</strong>
        </p>

        <div className="space-y-4 mb-8">
          {Object.values(selectedProducts).map((product) => {
            const price = Number.parseFloat(product.price.replace("$", ""))
            return Object.entries(product.variantsSelected).map(([variant, qty]) => {
              if (qty > 0) {
                const total = price * qty
                const variantImage = (product.variants.find((v) => v.name === variant) || {}).image || product.image
                return (
                  <div
                    key={`${product.id}-${variant}`}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 rounded-xl border shadow-sm bg-white"
                  >
                    <div className="flex gap-3 md:flex-row">
                      <img
                        src={variantImage || "/placeholder.svg"}
                        className="w-16 h-16 rounded object-cover border"
                        alt={product.name}
                      />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-semibold text-sm break-words leading-snug">
                          {insertLineBreaks(product.name, 5)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{variant}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateVariantQuantity(product.id, variant, qty - 1)}
                          className="px-2 py-1 rounded bg-gray-200 text-sm"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm">{qty}</span>
                        <button
                          onClick={() => updateVariantQuantity(product.id, variant, qty + 1)}
                          className="px-2 py-1 rounded bg-gray-200 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-semibold text-blue-600 whitespace-nowrap text-right">
                        ${total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })
          })}
        </div>

        <div className="text-right font-bold text-lg text-green-600 mb-6">Total: ${calculateTotal().toFixed(2)}</div>

        <label className="block font-semibold mb-2 text-gray-700">Bill To:</label>
        <input
          type="text"
          placeholder="Enter Business Name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full mb-3 p-3 border rounded-xl shadow-sm"
        />
        <label className="block font-semibold mb-2 text-gray-700">Ship To:</label>
        <input
          type="text"
          placeholder="Enter Business Name"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full mb-3 p-3 border rounded-xl shadow-sm"
        />
        <label className="block font-semibold mb-2 text-gray-700">Sales Rep:</label>
        <input
          type="text"
          placeholder="Sales Representative Name"
          value={formData.rep}
          onChange={(e) => setFormData((prev) => ({ ...prev, rep: e.target.value }))}
          className="w-full mb-3 p-3 border rounded-xl shadow-sm"
        />
        <div className="flex flex-col md:flex-row md:space-x-4"></div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-xl font-semibold shadow"
        >
          {isLoading ? "Processing Order & Generating PDF..." : "Place Order"}
        </button>
      </div>
    )
  }

  const shouldShowNavButtons = () => {
    if (currentStep === 0 || currentStep === 1) return false
    if (currentStep === 2) return true
    if (currentStep === products.length + 2) return true
    return currentStep > 2
  }

  const shouldShowNextButton = () => {
    if (currentStep === 2) return customerType && locationCount > 0
    if (currentStep === products.length + 2) return false
    return currentStep > 2
  }

  const shouldShowBackButton = () => {
    return currentStep > 2 || currentStep === 2
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
      {showToast && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-lg text-white text-center px-4 py-2 rounded shadow z-50"
          style={{ backgroundColor: "#10b981" }}
        >
          {toastMessage}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-4xl h-[670px] md:h-[670px] sm:h-[560px] relative flex flex-col overflow-hidden">
        {currentStep > 0 && (
          <div className="step-dots mb-6 mt-4 relative flex justify-between flex-shrink-0">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-200 transform -translate-y-1/2 z-0"></div>
            <div
              className="step-progress absolute top-1/2 left-0 h-0.5 bg-red-600 transform -translate-y-1/2 z-10 transition-all duration-300"
              style={{ width: `${updateProgressBar()}%` }}
            ></div>
            {[0, 1, 2].map((step) => (
              <span
                key={step}
                className={`w-4 h-4 rounded-full z-20 ${
                  (currentStep === 1 && step === 0) ||
                  (currentStep >= 2 && currentStep < products.length + 2 && step === 1) ||
                  (currentStep === products.length + 2 && step === 2)
                    ? "bg-red-600"
                    : "bg-red-200"
                }`}
              />
            ))}

            <button
              onClick={handleRestart}
              className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors z-30"
              title="Restart Survey"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{renderStep()}</div>

        {shouldShowNavButtons() && (
          <div className="flex justify-between mt-6 pb-1 flex-shrink-0 relative z-50">
            {shouldShowBackButton() && (
              <button
                onClick={handleBack}
                className="text-sm text-gray-600 hover:text-black bg-gray-200 px-5 py-2 rounded-xl"
              >
                Back
              </button>
            )}
            {shouldShowNextButton() && (
              <button
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl shadow"
              >
                Next
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 text-sm font-medium">Processing Order & Generating PDF…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
