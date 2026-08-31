import type { PluralForms } from "@/lib/i18n/plural";

/**
 * English is the source of truth for the message shape. `fr` and `ar` are typed
 * as `Messages`, so a missing or misspelled key fails the build. (No `as const`
 * here on purpose — values widen to `string`/`number` so translations type-check.)
 */
export const en = {
  brand: "Med Shop",

  meta: {
    homeTitle: "Med Shop — High-quality caps, free delivery to your door",
    homeDescription:
      "Authentic caps from the brands you love — checked by hand and delivered across Morocco with cash on delivery.",
    shopTitle: "Shop all caps",
    shopDescription:
      "Browse every cap in stock — filter by brand, size, colour and price. Cash on delivery across Morocco.",
    categoryTitle: "{name} caps",
    categoryDescription:
      "Shop authentic {name} caps at Med Shop — checked by hand, cash on delivery across Morocco.",
    orderConfirmedTitle: "Order confirmed",
  },

  language: {
    switchLabel: "Change language",
    ar: "العربية",
    fr: "Français",
    en: "English",
  },

  nav: {
    shop: "Shop",
    cart: "Cart",
    phone: "06 00 02 90 60",
  },

  breadcrumb: {
    home: "Home",
    shop: "Shop",
  },

  common: {
    addToCart: "Add to Cart",
    added: "Added ✓",
    orderNow: "Order Now",
    outOfStock: "Out of Stock",
    checkout: "Checkout",
    keepShopping: "Keep Shopping",
    shopCaps: "Shop Caps",
    shopAllCaps: "Shop all caps",
    viewAll: "View all",
    edit: "Edit",
    total: "Total",
    subtotal: "Subtotal",
    delivery: "Delivery",
    free: "Free",
    summary: "Summary",
    size: "Size",
    quantity: "Quantity",
    all: "All",
    home: "Home",
  },

  home: {
    heroBadge: "New Season",
    heroTitle: "Shop caps from {brands} you love",
    heroTitleBrands: "brands",
    heroSubtitle:
      "Browse our collection by brand and find your next favorite cap — high-quality pieces, checked by hand before they ship.",
    heroRating: "Trusted by shoppers across Morocco",
    heroMainAlt: "Caps on display in the showroom",
    heroAccentAlt: "Stacked caps",
    authenticTitle: "Good quality",
    authenticSubtitle: "A range of brands",
    freeDeliveryBadge: "Free delivery across Morocco",
    codBadge: "Cash on delivery",
    trustCod: "Cash on delivery — no online payment needed.",
    trustDelivery: "Delivered to your door across Morocco.",
    trustAuthentic: "High-quality pieces.",
    browseKicker: "Browse",
    browseTitle: "Shop by brand",
    showroomKicker: "In the shop",
    showroomTitle: "Every cap, checked by hand before it ships",
    showroomAlt: "Inside the Med Shop showroom",
    bestSellersKicker: "Fan favorites",
    bestSellersTitle: "Best sellers",
    bestsellerBadge: "Bestseller",
    newArrivalsKicker: "Just in",
    newArrivalsTitle: "New arrivals",
  },

  testimonials: {
    kicker: "Customer reviews",
    title: "What our customers say",
    reviewsLabel: "{count} reviews",
    items: [
      {
        name: "Yassine B.",
        city: "Casablanca",
        rating: 5,
        quote:
          "Top quality and super fast delivery. The Nike cap was exactly like the photos.",
      },
      {
        name: "Mehdi K.",
        city: "Rabat",
        rating: 5,
        quote:
          "First order and I'm won over. Paying on delivery is really reassuring.",
      },
      {
        name: "Ayoub M.",
        city: "Marrakech",
        rating: 4,
        quote:
          "Great customer service, quick to reply on WhatsApp. The Adidas cap is now my daily.",
      },
      {
        name: "Imane R.",
        city: "Oujda",
        rating: 5,
        quote:
          "Finally a serious shop for branded caps in Morocco. Highly recommend.",
      },
      {
        name: "Othmane L.",
        city: "Fès",
        rating: 5,
        quote:
          "Order arrived in 3 days, well packed. The New Era is even better in person.",
      },
      {
        name: "Hamza T.",
        city: "Tanger",
        rating: 4,
        quote:
          "Good value and several brands in one place. I've already ordered twice.",
      },
    ],
  },

  stock: {
    soldOut: "Sold out",
    sellingFast: "Selling fast",
    lastOne: "Last one",
    onlyLeft: { one: "Only 1 left", other: "Only {count} left" } as PluralForms,
    urgencyLastOne: "Last one — order now",
    urgencySellingFast: "Selling fast — {count} left",
    urgencyOnlyLeft: {
      one: "Only 1 left",
      other: "Only {count} left",
    } as PluralForms,
    urgencyOutOfStock: "Out of stock",
  },

  listing: {
    collectionKicker: "Collection",
    allCapsTitle: "All caps",
    searchPlaceholder: "Search caps…",
    searchLabel: "Search caps",
    resultsFor: {
      zero: "No results for “{query}”",
      one: "{count} result for “{query}”",
      two: "{count} results for “{query}”",
      few: "{count} results for “{query}”",
      many: "{count} results for “{query}”",
      other: "{count} results for “{query}”",
    } as PluralForms,
    countOfTotal: {
      one: "{count} of {total} cap",
      two: "{count} of {total} caps",
      few: "{count} of {total} caps",
      many: "{count} of {total} caps",
      other: "{count} of {total} caps",
    } as PluralForms,
    caps: {
      zero: "{count} caps",
      one: "{count} cap",
      two: "{count} caps",
      few: "{count} caps",
      many: "{count} caps",
      other: "{count} caps",
    } as PluralForms,
    noMatchTitle: "No caps match these filters",
    noMatchSubtitle: "Try adjusting or clearing a filter.",
    filterSort: "Sort",
    filterPrice: "Price",
    filterSize: "Size",
    allSort: "Newest",
    allPrices: "All Prices",
    allSizes: "All Sizes",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    priceUnder: "{price}dh and under",
    prevPage: "Previous page",
    nextPage: "Next page",
    pagination: "Pagination",
  },

  product: {
    similarTitle: "Similar Products",
    freeDelivery: "Free delivery, right to your door",
    bundleHint: "Order more than one cap and save {amount}.",
    sizeOutOfStock: "{size} is out of stock — pick another size.",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    showPhoto: "Show photo {n}",
    showVideo: "Show video",
    photoCount: "{current} / {total}",
    prevProducts: "Previous products",
    nextProducts: "Next products",
  },

  cart: {
    emptyTitle: "Your cart is empty",
    emptySubtitle: "Add a few caps to get started.",
    title: "Cart",
    items: {
      zero: "{count} items",
      one: "{count} item",
      two: "{count} items",
      few: "{count} items",
      many: "{count} items",
      other: "{count} items",
    } as PluralForms,
    remove: "Remove",
    codNote: "Cash on delivery — no online payment needed.",
    deliveryNote: "Delivered to your door across Morocco.",
  },

  checkout: {
    title: "Checkout",
    codPill: "Cash on delivery — pay when your order arrives",
    stepDetails: "Delivery details",
    stepConfirm: "Confirm order",
    detailsHeading: "Delivery Details",
    guestNote: "Guest checkout — no account needed.",
    fullName: "Full name",
    phonePlaceholder: "6XX XXX XXX",
    phoneHint: "9 digits, without the leading 0",
    address: "Address",
    city: "City",
    postalCode: "Postal code",
    reviewCta: "Review order",
    confirmHeading: "Confirm your order",
    confirmNote: "Check your details before we send this to our team.",
    name: "Name",
    phone: "Phone",
    placing: "Placing order…",
    confirmCta: "Confirm order",
    orderSummary: "Order Summary",
    deliveryNote: "Delivered to your door across Morocco.",
    genericError: "Something went wrong placing your order. Please try again.",
  },

  checkoutErrors: {
    generic: "Something went wrong. Please try again.",
    cartEmpty: "Your cart is empty.",
    tooManyItems: "Your cart has too many items.",
    invalidName: "Enter your full name.",
    invalidPhone: "Enter a valid phone number.",
    invalidAddress: "Enter your delivery address.",
    invalidCity: "Enter your city.",
    invalidPostalCode: "Enter a valid postal code.",
    invalidCountry: "Enter a valid country.",
    rateLimited:
      "You've placed several orders just now. Please wait {wait} or call us to finish.",
    invalidQuantity: "That quantity isn't valid.",
    itemUnavailable: "One of your items is no longer available.",
    notEnoughStock:
      "{product} ({size}) doesn't have enough stock left. Please update your cart.",
    placeFailed: "Something went wrong placing your order. Please try again.",
  },

  waitUnits: {
    minutes: {
      one: "{count} minute",
      two: "{count} minutes",
      few: "{count} minutes",
      many: "{count} minutes",
      other: "{count} minutes",
    } as PluralForms,
    seconds: {
      one: "{count} second",
      two: "{count} seconds",
      few: "{count} seconds",
      many: "{count} seconds",
      other: "{count} seconds",
    } as PluralForms,
    aMoment: "a moment",
  },

  success: {
    kicker: "Order received",
    thanks: "Thanks, {name}",
    confirmedLine:
      "Order {number} is confirmed. We'll call you at {phone} to arrange delivery — pay in cash when your order arrives.",
    orderDetailsHeading: "Order details",
    orderNumber: "Order number",
    date: "Date",
    payment: "Payment",
    cod: "Cash on delivery",
    deliveryToHeading: "Delivery to",
    name: "Name",
    phone: "Phone",
    address: "Address",
    itemsHeading: "Items in this order",
    deliveryLine: "Delivered to your door across Morocco.",
    questionsTitle: "Questions about your order?",
    questionsSubtitle: "Our team is happy to help — reach out any time.",
    chatWhatsApp: "Chat on WhatsApp",
    payOnArrival: "You'll only pay when your order arrives.",
    whatsappMessage: "Hello, I have a question about my order {number}.",
    location: "Oujda, Morocco",
  },

  footer: {
    tagline:
      "Caps from the brands you love, delivered across Morocco with cash on delivery.",
    shopHeading: "Shop",
    allCaps: "All caps",
    contactHeading: "Contact",
    whyHeading: "Why Med Shop",
    cod: "Cash on delivery",
    deliveryMorocco: "Delivery across Morocco",
    location: "Oujda, Morocco",
    rights: "© {year} Med Shop. All rights reserved.",
    contactDeveloper: "Contact the site developer",
    instagram: "Instagram",
    facebook: "Facebook",
  },

  errorPages: {
    notFoundCode: "404",
    notFoundTitle: "We couldn't find that",
    notFoundSubtitle:
      "The product or page may have been renamed, sold out, or never existed.",
    browseAllCaps: "Browse all caps",
    home: "Home",
    errorKicker: "Something broke",
    errorTitle: "This page didn't load",
    errorSubtitle:
      "A temporary hiccup on our end. Try again, or head back to the shop.",
    tryAgain: "Try again",
    backToShop: "Back to shop",
    reference: "Reference: {digest}",
    genericTitle: "Something went wrong",
    genericBody: "The page failed to load. Please try again in a moment.",
  },

  whatsapp: {
    fabLabel: "Contact us on WhatsApp",
    defaultMessage: "Hello, I'm interested in a Med Shop cap.",
  },
};

export type Messages = typeof en;
