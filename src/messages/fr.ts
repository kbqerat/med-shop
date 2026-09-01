import type { Messages } from "@/messages/en";
import type { PluralForms } from "@/lib/i18n/plural";

export const fr: Messages = {
  brand: "Med Shop",

  meta: {
    homeTitle: "Med Shop — Casquettes de haute qualité, livraison gratuite à domicile",
    homeDescription:
      "Des casquettes authentiques des marques que vous aimez — vérifiées à la main et livrées partout au Maroc avec paiement à la livraison.",
    shopTitle: "Toutes les casquettes",
    shopDescription:
      "Parcourez toutes les casquettes en stock — filtrez par marque, taille, couleur et prix. Paiement à la livraison partout au Maroc.",
    categoryTitle: "Casquettes {name}",
    categoryDescription:
      "Achetez des casquettes {name} authentiques chez Med Shop — vérifiées à la main, paiement à la livraison partout au Maroc.",
    orderConfirmedTitle: "Commande confirmée",
  },

  language: {
    switchLabel: "Changer de langue",
    ar: "العربية",
    fr: "Français",
    en: "English",
  },

  nav: {
    shop: "Boutique",
    cart: "Panier",
    phone: "06 00 02 90 60",
  },

  breadcrumb: {
    home: "Accueil",
    shop: "Boutique",
  },

  common: {
    addToCart: "Ajouter au panier",
    added: "Ajouté ✓",
    orderNow: "Commander",
    outOfStock: "Rupture de stock",
    checkout: "Commander",
    keepShopping: "Continuer mes achats",
    shopCaps: "Voir les casquettes",
    shopAllCaps: "Voir toutes les casquettes",
    viewAll: "Tout voir",
    edit: "Modifier",
    total: "Total",
    subtotal: "Sous-total",
    delivery: "Livraison",
    free: "Gratuite",
    summary: "Récapitulatif",
    size: "Taille",
    quantity: "Quantité",
    all: "Tout",
    home: "Accueil",
  },

  home: {
    heroBadge: "🧢 Casquette Lacoste 2027",
    heroTitle: "Casquette {brand} 2027",
    heroTitleBrands: "Lacoste",
    heroSubtitle:
      "Qualité premium · style moderne · pour tout le monde. Vérifiée à la main et expédiée rapidement partout au Maroc.",
    heroRating: "La confiance des acheteurs partout au Maroc",
    heroMainAlt: "Casquette Lacoste 2027 exposée",
    heroAccentAlt: "Casquettes empilées",
    offersKicker: "🔥 Offres",
    offers: [
      { label: "Casquette", price: "150 DH" },
      { label: "Casquettes", price: "250 DH" },
      { label: "Casquettes", price: "350 DH" },
    ],
    orderNote: "📩 Pour commander, écrivez-nous directement.",
    authenticTitle: "Qualité premium",
    authenticSubtitle: "Style moderne",
    freeDeliveryBadge: "Livraison gratuite partout au Maroc",
    codBadge: "Paiement à la livraison",
    trustCod: "Paiement à la livraison — aucun paiement en ligne.",
    trustDelivery: "Livraison gratuite partout au Maroc 🇲🇦",
    trustAuthentic: "Qualité premium · style moderne · pour tout le monde.",
    browseKicker: "Parcourir",
    browseTitle: "Acheter par marque",
    showroomKicker: "En boutique",
    showroomTitle: "Chaque casquette, vérifiée à la main avant l'envoi",
    showroomAlt: "À l'intérieur du showroom Med Shop",
  },

  testimonials: {
    kicker: "Avis clients",
    title: "Ce que disent nos clients",
    reviewsLabel: "{count} avis",
    items: [
      {
        name: "Yassine B.",
        city: "Casablanca",
        rating: 5,
        quote:
          "Qualité au top et livraison super rapide. La casquette Nike était exactement comme sur les photos.",
      },
      {
        name: "Mehdi K.",
        city: "Rabat",
        rating: 5,
        quote:
          "Première commande et je suis conquis. Le paiement à la livraison rassure vraiment.",
      },
      {
        name: "Ayoub M.",
        city: "Marrakech",
        rating: 4,
        quote:
          "Très bon service client, réponse rapide sur WhatsApp. La casquette Adidas est devenue mon quotidien.",
      },
      {
        name: "Imane R.",
        city: "Oujda",
        rating: 5,
        quote:
          "Enfin une boutique sérieuse pour les casquettes de marque au Maroc. Je recommande à 100%.",
      },
      {
        name: "Othmane L.",
        city: "Fès",
        rating: 5,
        quote:
          "Commande reçue en 3 jours, bien emballée. La New Era est encore mieux en vrai.",
      },
      {
        name: "Hamza T.",
        city: "Tanger",
        rating: 4,
        quote:
          "Bon rapport qualité-prix et plusieurs marques au même endroit. J'ai déjà commandé deux fois.",
      },
    ],
  },

  stock: {
    soldOut: "Épuisé",
    sellingFast: "Part vite",
    lastOne: "Dernier exemplaire",
    onlyLeft: {
      one: "Plus qu'1 en stock",
      other: "Plus que {count} en stock",
    } as PluralForms,
    urgencyLastOne: "Dernier exemplaire — commandez vite",
    urgencySellingFast: "Part vite — {count} restantes",
    urgencyOnlyLeft: {
      one: "Plus qu'1 en stock",
      other: "Plus que {count} en stock",
    } as PluralForms,
    urgencyOutOfStock: "Rupture de stock",
  },

  listing: {
    collectionKicker: "Collection",
    allCapsTitle: "Toutes les casquettes",
    searchPlaceholder: "Rechercher une casquette…",
    searchLabel: "Rechercher une casquette",
    resultsFor: {
      zero: "Aucun résultat pour « {query} »",
      one: "{count} résultat pour « {query} »",
      two: "{count} résultats pour « {query} »",
      few: "{count} résultats pour « {query} »",
      many: "{count} résultats pour « {query} »",
      other: "{count} résultats pour « {query} »",
    } as PluralForms,
    countOfTotal: {
      one: "{count} casquette sur {total}",
      two: "{count} casquettes sur {total}",
      few: "{count} casquettes sur {total}",
      many: "{count} casquettes sur {total}",
      other: "{count} casquettes sur {total}",
    } as PluralForms,
    caps: {
      zero: "{count} casquette",
      one: "{count} casquette",
      two: "{count} casquettes",
      few: "{count} casquettes",
      many: "{count} casquettes",
      other: "{count} casquettes",
    } as PluralForms,
    noMatchTitle: "Aucune casquette ne correspond à ces filtres",
    noMatchSubtitle: "Essayez d'ajuster ou d'effacer un filtre.",
    filterSort: "Trier",
    filterPrice: "Prix",
    filterSize: "Taille",
    allSort: "Plus récentes",
    allPrices: "Tous les prix",
    allSizes: "Toutes les tailles",
    sortPriceAsc: "Prix : croissant",
    sortPriceDesc: "Prix : décroissant",
    priceUnder: "{price} dh et moins",
    prevPage: "Page précédente",
    nextPage: "Page suivante",
    pagination: "Pagination",
  },

  product: {
    similarTitle: "Produits similaires",
    freeDelivery: "Livraison gratuite, directement chez vous",
    bundleHint: "Commandez plus d'une casquette et économisez {amount}.",
    sizeOutOfStock: "{size} est en rupture — choisissez une autre taille.",
    prevPhoto: "Photo précédente",
    nextPhoto: "Photo suivante",
    showPhoto: "Voir la photo {n}",
    showVideo: "Voir la vidéo",
    photoCount: "{current} / {total}",
  },

  cart: {
    emptyTitle: "Votre panier est vide",
    emptySubtitle: "Ajoutez quelques casquettes pour commencer.",
    title: "Panier",
    items: {
      zero: "{count} article",
      one: "{count} article",
      two: "{count} articles",
      few: "{count} articles",
      many: "{count} articles",
      other: "{count} articles",
    } as PluralForms,
    remove: "Retirer",
    codNote: "Paiement à la livraison — aucun paiement en ligne.",
    deliveryNote: "Livré chez vous partout au Maroc.",
  },

  checkout: {
    title: "Commander",
    codPill: "Paiement à la livraison — payez à la réception",
    stepDetails: "Coordonnées de livraison",
    stepConfirm: "Confirmer la commande",
    detailsHeading: "Coordonnées de livraison",
    guestNote: "Commande sans compte — aucune inscription nécessaire.",
    fullName: "Nom complet",
    phonePlaceholder: "6XX XXX XXX",
    phoneHint: "9 chiffres, sans le 0 initial",
    address: "Adresse",
    city: "Ville",
    reviewCta: "Vérifier la commande",
    confirmHeading: "Confirmez votre commande",
    confirmNote: "Vérifiez vos informations avant l'envoi à notre équipe.",
    name: "Nom",
    phone: "Téléphone",
    placing: "Envoi en cours…",
    confirmCta: "Confirmer la commande",
    orderSummary: "Récapitulatif de la commande",
    deliveryNote: "Livré chez vous partout au Maroc.",
    genericError:
      "Une erreur est survenue lors de la commande. Veuillez réessayer.",
  },

  checkoutErrors: {
    generic: "Une erreur est survenue. Veuillez réessayer.",
    cartEmpty: "Votre panier est vide.",
    tooManyItems: "Votre panier contient trop d'articles.",
    invalidName: "Saisissez votre nom complet.",
    invalidPhone: "Saisissez un numéro de téléphone valide.",
    invalidAddress: "Saisissez votre adresse de livraison.",
    invalidCity: "Saisissez votre ville.",
    invalidCountry: "Saisissez un pays valide.",
    rateLimited:
      "Vous avez passé plusieurs commandes à l'instant. Patientez {wait} ou appelez-nous pour finaliser.",
    invalidQuantity: "Cette quantité n'est pas valide.",
    itemUnavailable: "L'un de vos articles n'est plus disponible.",
    notEnoughStock:
      "{product} ({size}) n'a plus assez de stock. Veuillez mettre à jour votre panier.",
    placeFailed:
      "Une erreur est survenue lors de la commande. Veuillez réessayer.",
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
      one: "{count} seconde",
      two: "{count} secondes",
      few: "{count} secondes",
      many: "{count} secondes",
      other: "{count} secondes",
    } as PluralForms,
    aMoment: "un instant",
  },

  success: {
    kicker: "Commande reçue",
    thanks: "Merci, {name}",
    confirmedLine:
      "Nous avons bien reçu votre commande, désormais en préparation. Nous vous appellerons au {phone} sous peu pour confirmer les détails de livraison — paiement en espèces à la réception.",
    orderDetailsHeading: "Détails de la commande",
    orderNumber: "Numéro de commande",
    date: "Date",
    payment: "Paiement",
    cod: "Paiement à la livraison",
    deliveryToHeading: "Livraison à",
    name: "Nom",
    phone: "Téléphone",
    address: "Adresse",
    itemsHeading: "Articles de cette commande",
    deliveryLine: "Livré chez vous partout au Maroc.",
    questionsTitle: "Des questions sur votre commande ?",
    questionsSubtitle:
      "Notre équipe est là pour vous aider — contactez-nous à tout moment.",
    chatWhatsApp: "Discuter sur WhatsApp",
    payOnArrival: "Vous ne payez qu'à la réception de votre commande.",
    whatsappMessage: "Bonjour, j'ai une question à propos de ma commande {number}.",
    location: "Oujda, Maroc",
  },

  footer: {
    tagline:
      "Des casquettes des marques que vous aimez, livrées partout au Maroc avec paiement à la livraison.",
    shopHeading: "Boutique",
    allCaps: "Toutes les casquettes",
    contactHeading: "Contact",
    whyHeading: "Pourquoi Med Shop",
    cod: "Paiement à la livraison",
    deliveryMorocco: "Livraison partout au Maroc",
    location: "Oujda, Maroc",
    rights: "© {year} Med Shop. Tous droits réservés.",
    contactDeveloper: "Contacter le développeur du site",
    instagram: "Instagram",
    facebook: "Facebook",
  },

  errorPages: {
    notFoundCode: "404",
    notFoundTitle: "Introuvable",
    notFoundSubtitle:
      "Ce produit ou cette page a peut-être été renommé, épuisé, ou n'a jamais existé.",
    browseAllCaps: "Voir toutes les casquettes",
    home: "Accueil",
    errorKicker: "Un souci est survenu",
    errorTitle: "Cette page ne s'est pas chargée",
    errorSubtitle:
      "Un incident temporaire de notre côté. Réessayez, ou revenez à la boutique.",
    tryAgain: "Réessayer",
    backToShop: "Retour à la boutique",
    reference: "Référence : {digest}",
    genericTitle: "Une erreur est survenue",
    genericBody: "La page ne s'est pas chargée. Veuillez réessayer dans un instant.",
  },

  whatsapp: {
    fabLabel: "Contactez-nous sur WhatsApp",
    defaultMessage: "Bonjour, je suis intéressé(e) par une casquette Med Shop.",
  },
};
