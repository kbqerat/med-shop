import type { Messages } from "@/messages/en";
import type { PluralForms } from "@/lib/i18n/plural";

export const ar: Messages = {
  brand: "Med Shop",

  meta: {
    homeTitle: "Med Shop — قبعات جودة عالية، توصيل مجاني إلى باب منزلك",
    homeDescription:
      "قبعات أصلية من العلامات التي تحبّها — نتفحّصها يدويًا ونوصّلها إلى كل المغرب مع الدفع عند الاستلام.",
    shopTitle: "كل القبعات",
    shopDescription:
      "تصفّح كل القبعات المتوفرة — رشّح حسب العلامة والمقاس واللون والسعر. الدفع عند الاستلام في كل المغرب.",
    categoryTitle: "قبعات {name}",
    categoryDescription:
      "اشترِ قبعات {name} الأصلية من Med Shop — مفحوصة يدويًا، والدفع عند الاستلام في كل المغرب.",
    orderConfirmedTitle: "تم تأكيد الطلب",
  },

  language: {
    switchLabel: "تغيير اللغة",
    ar: "العربية",
    fr: "Français",
    en: "English",
  },

  nav: {
    shop: "المتجر",
    cart: "السلة",
    phone: "60 90 02 00 06",
  },

  breadcrumb: {
    home: "الرئيسية",
    shop: "المتجر",
  },

  common: {
    addToCart: "أضف إلى السلة",
    added: "تمت الإضافة ✓",
    orderNow: "اطلب الآن",
    outOfStock: "نفد المخزون",
    checkout: "إتمام الطلب",
    keepShopping: "متابعة التسوق",
    shopCaps: "تصفّح القبعات",
    shopAllCaps: "تصفّح كل القبعات",
    viewAll: "عرض الكل",
    edit: "تعديل",
    total: "المجموع",
    subtotal: "المجموع الفرعي",
    delivery: "التوصيل",
    free: "مجاني",
    summary: "ملخص طلبك",
    size: "المقاس",
    quantity: "الكمية",
    all: "الكل",
    home: "الرئيسية",
  },

  home: {
    heroBadge: "🧢 Casquette Lacoste 2027",
    heroTitle: "Casquette {brand} 2027",
    heroTitleBrands: "Lacoste",
    heroSubtitle:
      "✨ جودة ممتازة · ستايل عصري · مناسبة للجميع. مفحوصة يدويًا وتُشحن بسرعة إلى كل المغرب.",
    heroRating: "ثقة المتسوّقين في كل المغرب",
    heroMainAlt: "قبعة Lacoste 2027 معروضة",
    heroAccentAlt: "قبعات مرصوصة",
    offersKicker: "🔥 العروض",
    offers: [
      { label: "قبعة", price: "150 درهم" },
      { label: "2 قبعات", price: "250 درهم" },
      { label: "3 قبعات", price: "350 درهم" },
    ],
    orderNote: "📩 للطلب، راسلنا مباشرة.",
    authenticTitle: "جودة ممتازة",
    authenticSubtitle: "ستايل عصري",
    freeDeliveryBadge: "توصيل مجاني في كل أنحاء المغرب",
    codBadge: "التوصيل فابور",
    trustCod: "الدفع عند الاستلام — بدون أي دفع إلكتروني.",
    trustDelivery: "التوصيل مجاني لجميع أنحاء المغرب 🇲🇦",
    trustAuthentic: "جودة ممتازة · ستايل عصري · مناسبة للجميع.",
    browseKicker: "تصفّح",
    browseTitle: "تسوّق حسب علامة المنتوج",
    showroomKicker: "في متجرنا",
    showroomTitle: "كل قبعة، مفحوصة يدويًا قبل الشحن",
    showroomAlt: "داخل معرض Med Shop",
  },

  testimonials: {
    kicker: "آراء العملاء",
    title: "ماذا يقول زبناؤنا",
    reviewsLabel: "{count} تقييم",
    items: [
      {
        // فصحى
        name: "ياسين ب.",
        city: "الدار البيضاء",
        rating: 5,
        quote:
          "جودة ممتازة والتوصيل أسرع مما توقّعت، وصلني الطلب في أقل من 24 ساعة ومطابق للصور. سأطلب مرة أخرى بالتأكيد.",
      },
      {
        // دارجة
        name: "مهدي ك.",
        city: "الرباط",
        rating: 5,
        quote:
          "صراحة عجباتني بزاف، الخامة كتبان فيها الجودة والقياس مزيان. وصلتني في أقل من 24 ساعة، غادي نعاود نشري.",
      },
      {
        // دارجة
        name: "أيوب م.",
        city: "وجدة",
        rating: 4,
        quote:
          "المنتوج زوين والثمن معقول. التغليف مزيان وكلشي وصل بلا مشكل.",
      },
      {
        // فصحى
        name: "إيمان ر.",
        city: "وجدة",
        rating: 5,
        quote:
          "كنت مترددة في الطلب أونلاين، لكن الدفع عند الاستلام طمأنني. الرد على واتساب سريع والتعامل محترم، أنصح بهم.",
      },
      {
        // دارجة بحروف لاتينية
        name: "Othmane L.",
        city: "Oujda",
        rating: 5,
        quote:
          "Khedma nadia w l commande wselni f 24h. Sewwelt f WhatsApp 9bel ma nekhlless w jaweboni bzarba. Nsahkom bihom.",
      },
      {
        // دارجة بحروف لاتينية
        name: "Hamza T.",
        city: "Tanger",
        rating: 4,
        quote:
          "L'experience 3jbatni w l paiement 3nd l'istilam howa li khlani nkhtar.",
      },
    ],
  },

  stock: {
    soldOut: "نفد",
    sellingFast: "ينفد بسرعة",
    lastOne: "آخر قطعة",
    onlyLeft: {
      zero: "لم يبقَ شيء",
      one: "بقيت قطعة واحدة",
      two: "بقيت قطعتان",
      few: "بقيت {count} قطع",
      many: "بقيت {count} قطعة",
      other: "بقيت {count} قطعة",
    } as PluralForms,
    urgencyLastOne: "آخر قطعة — اطلب الآن",
    urgencySellingFast: "ينفد بسرعة — بقيت {count}",
    urgencyOnlyLeft: {
      zero: "لم يبقَ شيء",
      one: "بقيت قطعة واحدة",
      two: "بقيت قطعتان",
      few: "بقيت {count} قطع",
      many: "بقيت {count} قطعة",
      other: "بقيت {count} قطعة",
    } as PluralForms,
    urgencyOutOfStock: "نفد المخزون",
  },

  listing: {
    collectionKicker: "المجموعة",
    allCapsTitle: "كل القبعات",
    searchPlaceholder: "ابحث عن قبعة…",
    searchLabel: "ابحث عن قبعة",
    resultsFor: {
      zero: "لا نتائج لـ «{query}»",
      one: "نتيجة واحدة لـ «{query}»",
      two: "نتيجتان لـ «{query}»",
      few: "{count} نتائج لـ «{query}»",
      many: "{count} نتيجة لـ «{query}»",
      other: "{count} نتيجة لـ «{query}»",
    } as PluralForms,
    countOfTotal: {
      zero: "{count} من {total} قبعة",
      one: "{count} من {total} قبعة",
      two: "{count} من {total} قبعة",
      few: "{count} من {total} قبعات",
      many: "{count} من {total} قبعة",
      other: "{count} من {total} قبعة",
    } as PluralForms,
    caps: {
      zero: "{count} قبعة",
      one: "قبعة واحدة",
      two: "قبعتان",
      few: "{count} قبعات",
      many: "{count} قبعة",
      other: "{count} قبعة",
    } as PluralForms,
    noMatchTitle: "لا توجد قبعات تطابق هذه الفلاتر",
    noMatchSubtitle: "جرّب تعديل فلتر أو إزالته.",
    filterSort: "ترتيب",
    filterPrice: "السعر",
    filterSize: "المقاس",
    allSort: "الأحدث",
    allPrices: "كل الأسعار",
    allSizes: "كل المقاسات",
    sortPriceAsc: "السعر: من الأقل إلى الأعلى",
    sortPriceDesc: "السعر: من الأعلى إلى الأقل",
    priceUnder: "{price} د.م. فأقل",
    prevPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
    pagination: "ترقيم الصفحات",
  },

  product: {
    similarTitle: "منتجات مشابهة",
    freeDelivery: "توصيل مجاني، مباشرة إلى باب منزلك",
    bundleHint: "اطلب أكثر من قبعة ووفّر {amount}.",
    sizeOutOfStock: "{size} نفد من المخزون — اختر مقاسًا آخر.",
    prevPhoto: "الصورة السابقة",
    nextPhoto: "الصورة التالية",
    showPhoto: "عرض الصورة {n}",
    showVideo: "عرض الفيديو",
    photoCount: "{current} / {total}",
  },

  cart: {
    emptyTitle: "سلتك فارغة",
    emptySubtitle: "أضف بعض القبعات للبدء.",
    title: "السلة",
    items: {
      zero: "{count} منتج",
      one: "منتج واحد",
      two: "منتجان",
      few: "{count} منتجات",
      many: "{count} منتجًا",
      other: "{count} منتج",
    } as PluralForms,
    remove: "حذف",
    codNote: "الدفع عند الاستلام — بدون أي دفع إلكتروني.",
    deliveryNote: "توصيل مجاني إلى باب منزلك",
  },

  checkout: {
    title: "إتمام الطلب",
    codPill: "الدفع عند الاستلام — ادفع عند وصول طلبك",
    stepDetails: "بيانات التوصيل",
    stepConfirm: "تأكيد الطلب",
    detailsHeading: "بيانات التوصيل",
    guestNote: "طلب بدون حساب — لا حاجة للتسجيل.",
    // Checkout data-entry stays in French (Latin script) even on the Arabic site,
    // so names and addresses are written the way couriers read them.
    fullName: "Nom et prénom",
    phonePlaceholder: "6XX XXX XXX",
    phoneHint: "9 chiffres, sans le 0 initial",
    address: "Adresse",
    city: "Ville",
    reviewCta: "مراجعة الطلب",
    confirmHeading: "أكّد طلبك",
    confirmNote: "تحقّق من بياناتك قبل إرسالها إلى فريقنا.",
    name: "Nom",
    phone: "Téléphone",
    placing: "جارٍ الإرسال…",
    confirmCta: "تأكيد الطلب",
    orderSummary: "ملخّص الطلب",
    deliveryNote: "توصيل مجاني إلى باب منزلك",
    genericError: "حدث خطأ أثناء تنفيذ الطلب. يُرجى المحاولة من جديد.",
  },

  checkoutErrors: {
    generic: "حدث خطأ ما. يُرجى المحاولة من جديد.",
    cartEmpty: "سلتك فارغة.",
    tooManyItems: "سلتك تحتوي على عدد كبير جدًا من المنتجات.",
    invalidName: "أدخل اسمك الكامل.",
    invalidPhone: "أدخل رقم هاتف صالحًا.",
    invalidAddress: "أدخل عنوان التوصيل.",
    invalidCity: "أدخل مدينتك.",
    invalidCountry: "أدخل بلدًا صالحًا.",
    rateLimited:
      "لقد أجريت عدة طلبات للتو. انتظر {wait} أو اتصل بنا لإتمام الطلب.",
    invalidQuantity: "هذه الكمية غير صالحة.",
    itemUnavailable: "أحد منتجاتك لم يعد متوفرًا.",
    notEnoughStock:
      "{product} ({size}) لم يعد به مخزون كافٍ. يُرجى تحديث سلتك.",
    placeFailed: "حدث خطأ أثناء تنفيذ الطلب. يُرجى المحاولة من جديد.",
  },

  waitUnits: {
    minutes: {
      zero: "{count} دقيقة",
      one: "دقيقة واحدة",
      two: "دقيقتان",
      few: "{count} دقائق",
      many: "{count} دقيقة",
      other: "{count} دقيقة",
    } as PluralForms,
    seconds: {
      zero: "{count} ثانية",
      one: "ثانية واحدة",
      two: "ثانيتان",
      few: "{count} ثوانٍ",
      many: "{count} ثانية",
      other: "{count} ثانية",
    } as PluralForms,
    aMoment: "لحظة",
  },

  success: {
    kicker: "تم استلام الطلب",
    thanks: "شكرًا، {name}",
    confirmedLine:
      "توصّلنا بطلبك وهو الآن قيد التحضير. سنتصل بك على {phone} خلال وقت قصير لتأكيد تفاصيل التوصيل — والدفع نقدًا عند الاستلام.",
    orderDetailsHeading: "تفاصيل الطلب",
    orderNumber: "رقم الطلب",
    date: "التاريخ",
    payment: "الدفع",
    cod: "الدفع عند الاستلام",
    deliveryToHeading: "التوصيل إلى",
    name: "الاسم",
    phone: "الهاتف",
    address: "العنوان",
    itemsHeading: "منتجات هذا الطلب",
    deliveryLine: "توصيل مجاني إلى باب منزلك",
    questionsTitle: "أسئلة حول طلبك؟",
    questionsSubtitle: "فريقنا سعيد بمساعدتك — تواصل معنا في أي وقت.",
    chatWhatsApp: "الدردشة عبر واتساب",
    payOnArrival: "لن تدفع إلا عند وصول طلبك.",
    whatsappMessage: "مرحبًا، لديّ سؤال بخصوص طلبي {number}.",
    location: "وجدة، المغرب",
  },

  footer: {
    tagline:
      "قبعات من العلامات التي تحبّها، تُوصَّل إلى كل المغرب مع الدفع عند الاستلام.",
    shopHeading: "المتجر",
    allCaps: "كل القبعات",
    contactHeading: "تواصل معنا",
    whyHeading: "لماذا Med Shop",
    cod: "الدفع عند الاستلام",
    deliveryMorocco: "التوصيل إلى كل المغرب",
    location: "وجدة، المغرب",
    rights: "© {year} Med Shop. جميع الحقوق محفوظة.",
    contactDeveloper: "راسل مبرمج الموقع",
    instagram: "إنستغرام",
    facebook: "فيسبوك",
  },

  errorPages: {
    notFoundCode: "404",
    notFoundTitle: "لم نتمكن من العثور على ذلك",
    notFoundSubtitle:
      "قد يكون المنتج أو الصفحة قد أُعيدت تسميته، أو نفد، أو لم يكن موجودًا أصلًا.",
    browseAllCaps: "تصفّح كل القبعات",
    home: "الرئيسية",
    errorKicker: "حدث خلل",
    errorTitle: "تعذّر تحميل هذه الصفحة",
    errorSubtitle: "مشكلة مؤقتة من جهتنا. أعد المحاولة، أو ارجع إلى المتجر.",
    tryAgain: "أعد المحاولة",
    backToShop: "العودة إلى المتجر",
    reference: "المرجع: {digest}",
    genericTitle: "حدث خطأ ما",
    genericBody: "تعذّر تحميل الصفحة. يُرجى المحاولة بعد لحظة.",
  },

  whatsapp: {
    fabLabel: "تواصل معنا عبر واتساب",
    defaultMessage: "مرحبًا، أنا مهتم بقبعة Med Shop.",
  },
};
