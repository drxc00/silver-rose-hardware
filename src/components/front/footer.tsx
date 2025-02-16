import { MapPin, Phone, Pin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <div className="w-full">
      <div className="bg-[#D9D9D9] flex justify-between p-10 items-center">
        <div>
          <Image
            src="/logo.png"
            alt="Logo"
            priority
            width={200}
            style={{ objectFit: "contain" }}
            height={200}
          />
        </div>
        <div className="flex flex-row gap-6">
          <div>
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
              <li>7627 Dela Rosa St. Makati City 1200</li>
              <li>
                G-9 & G-10 Rada Regency, Rada cor. Dela Rosa St., Makati City
              </li>
              <li>
                G-25 Cityland Makati Executive Tower III, Gil Puyat Ave., Makati
                City
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-foreground flex justify-between py-4 px-10 items-center text-primary-foreground text-sm">
        <div>
          <h1>&copy; 2025 Silver Rose Hardware</h1>
        </div>
        <div className="flex gap-4">
          <p>Privacy</p>
          <p>Terms and Conditions</p>
          <p>Sitemap</p>
        </div>
      </div>
    </div>
  );
}
