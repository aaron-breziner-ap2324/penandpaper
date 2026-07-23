import Image from "next/image";
import { AARON_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-black bg-tan">
      <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-ink/70">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="flex items-center gap-2 font-display font-semibold text-ink">
            <Image
              src="/logo.png"
              alt="Pen & Paper"
              width={28}
              height={28}
              className="rounded-full border-2 border-black"
            />
            Pen &amp; Paper — Red de Tutores
          </p>
          <a
            href={`https://wa.me/${AARON_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-primary-dark transition-colors"
          >
            📲 Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
