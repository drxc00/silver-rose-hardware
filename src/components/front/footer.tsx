import { MapPin, Phone } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <div className="w-full">
      <div className="bg-sidebar border-t flex flex-col md:flex-row justify-between p-4 md:p-10 items-center gap-6">
        <div className="mb-4 md:mb-0">
          <Image
            src="/logo.png"
            alt="Logo"
            priority
            width={200}
            style={{ objectFit: "contain" }}
            height={200}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="flex items-center text-muted-foreground gap-2 font-bold">
              <Phone className="w-4 h-4" />
              <span>Contact Us</span>
            </h1>
            <ul className="text-muted-foreground text-sm">
              <li>8818-8948 8892-5479</li>
              <li>TELEFAX: 8894-3082</li>
              <li>buy@silverrosehardware.com</li>
            </ul>
          </div>
          <div>
            <h1 className="flex items-center text-muted-foreground gap-2 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Branches</span>
            </h1>
            <ul className="text-muted-foreground text-sm">
              <li className="break-words">
                7627 Dela Rosa St. Makati City 1200
              </li>
              <li className="break-words">
                G-9 & G-10 Rada Regency, Rada cor. Dela Rosa St., Makati City
              </li>
              <li className="break-words">
                G-25 Cityland Makati Executive Tower III, Gil Puyat Ave., Makati
                City
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-foreground flex flex-col sm:flex-row justify-between py-4 px-4 md:px-10 items-center text-primary-foreground text-sm gap-2">
        <div className="text-center sm:text-left">
          <h1>&copy; 2025 Silver Rose Hardware</h1>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-4">
          <p>Privacy</p>
          <p>Terms and Conditions</p>
          <p>Sitemap</p>
        </div>
      </div>
    </div>
  );
}
