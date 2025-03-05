import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AboutUsPage() {
  return (
    <div className="bg-gray-50 w-full">
      <main>
        <section className="py-16 md:py-24 lg:py-32">
          <div className="mx-auto grid gap-16 px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
                About Silver Rose Hardware
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                A Trusted Provider of Comprehensive Hardware Solutions
              </p>
            </div>

            <div className="mx-auto w-full max-w-4xl space-y-12">
              <div className="bg-card rounded-sm border p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Our Commitment to Excellence
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Silver Rose Hardware stands as a premier provider of
                    sophisticated hardware solutions, serving discerning clients
                    including homeowners, professional contractors, and
                    commercial enterprises. Our comprehensive inventory
                    encompasses an extensive range of premium tools,
                    construction materials, and home improvement resources,
                    meticulously curated to meet the most demanding project
                    requirements.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    With an unwavering commitment to quality and customer
                    satisfaction, we have established ourselves as an industry
                    leader. Our strategic approach combines premium product
                    offerings, competitive pricing, and unparalleled technical
                    expertise to deliver exceptional value to our clientele.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  Distinguishing Characteristics
                </h2>
                <ul className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Premium Product Selection",
                      description:
                        "Curated inventory featuring industry-leading brands and professional-grade equipment.",
                    },
                    {
                      title: "Technical Expertise",
                      description:
                        "Specialized consultation from industry-trained professionals with comprehensive product knowledge.",
                    },
                    {
                      title: "Strategic Pricing",
                      description:
                        "Competitive pricing models ensuring optimal value without compromising quality standards.",
                    },
                    {
                      title: "Strategic Accessibility",
                      description:
                        "Strategically located branches in Makati providing convenient access to comprehensive hardware solutions.",
                    },
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="bg-card border rounded-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h3 className="text-xl font-semibold  mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 lg:py-32 bg-white">
          <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 px-4 md:px-6">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Operational Locations</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 text-primary" /> Branch Locations
                  </h3>
                  {[
                    {
                      name: "Main Branch",
                      address: "7627 Dela Rosa St., Makati City, 1200",
                    },
                    {
                      name: "Rada Branch",
                      address:
                        "G-9 & G-10 Rada Regency, Rada cor. Dela Rosa St., Makati City",
                    },
                    {
                      name: "Cityland Makati Branch",
                      address:
                        "G-25 Cityland Makati Executive Tower III, Gil Puyat Ave., Makati City",
                    },
                  ].map((branch, index) => (
                    <div key={index} className="mb-3">
                      <p className="font-medium ">{branch.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {branch.address}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Mobile:</strong> 0919-522-4112
                    </p>
                    <p>
                      <strong>Landline:</strong> 8818-8948, 8892-5479
                    </p>
                    <p>
                      <strong>Telefax:</strong> 8894-3082
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Monday - Saturday:</strong> 7:30 AM – 8:30 PM
                    </p>
                    <p>
                      <strong>Sunday:</strong> 8:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/contact" passHref>
                  <Button className="w-full gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Our Business Solutions Team
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d73482.78213321077!2d121.00984481818385!3d14.544108312966296!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c973278dd009%3A0x7bad81c12a861c89!2sSilver%20Rose%20Hardware!5e0!3m2!1sen!2sph!4v1741183004724!5m2!1sen!2sph"
                  width="100%"
                  height="600"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
