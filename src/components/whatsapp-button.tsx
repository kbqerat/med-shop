"use client";

import { WhatsAppIcon } from "@/components/icons";
import { useMessages } from "@/context/i18n";

const PHONE_INTERNATIONAL = "212600029060";

export function WhatsAppButton() {
  const { whatsapp } = useMessages();
  const href = `https://wa.me/${PHONE_INTERNATIONAL}?text=${encodeURIComponent(
    whatsapp.defaultMessage
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.fabLabel}
      className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
