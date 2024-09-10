import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function DentalClinicLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Dental Clinic</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to Lobodent Dental Clinic: Where Your Smile Shines Brighter
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  From routine checkups to advanced cosmetic treatments, our dedicated team of professionals is here to give you the healthy, radiant smile you deserve. 
                  Step into our clinic and experience personalized care tailored to your comfort and needs, all in a welcoming and modern environment.
                  </p>
                </div>
              </div>
              <Image
                alt="Dentist"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                src="/dentist.png"
                width={750}
                height={1056}
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Our Services</h2>
            <div className="grid gap-6 lg:grid-cols-3">
            <Card>
  <CardHeader>
    <CardTitle>Dental Consultation</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Receive personalized dental advice and care tailored to your oral health needs.</p>
    <Image
      alt="Dental Consultation"
      className="rounded-lg mt-4"
      src="/services/consultation.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Dental Cleaning</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Keep your smile bright and your teeth healthy with professional dental cleaning.</p>
    <Image
      alt="Dental Cleaning"
      className="rounded-lg mt-4"
      src="/services/cleaning.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Dental Fillings</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Restore damaged teeth and maintain a natural look with our high-quality fillings.</p>
    <Image
      alt="Dental Fillings"
      className="rounded-lg mt-4"
      src="/services/fillings.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Orthodontic Treatment/Braces</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Achieve a straighter smile with our advanced braces and orthodontic treatments.</p>
    <Image
      alt="Orthodontic Treatment"
      className="rounded-lg mt-4"
      src="/services/braces.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Wisdom Tooth Removal</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Experience safe and effective wisdom tooth extraction to prevent future dental issues.</p>
    <Image
      alt="Wisdom Tooth Removal"
      className="rounded-lg mt-4"
      src="/services/wisdom.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Root Canal Treatment</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Save your natural teeth and alleviate pain with expert root canal treatments.</p>
    <Image
      alt="Root Canal Treatment"
      className="rounded-lg mt-4"
      src="/services/root-canal.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Tooth Extraction</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Remove problematic teeth with minimal discomfort and optimal care.</p>
    <Image
      alt="Tooth Extraction"
      className="rounded-lg mt-4"
      src="/services/extraction.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Laser Teeth Whitening</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Brighten your smile with our safe and effective laser teeth whitening treatments.</p>
    <Image
      alt="Laser Teeth Whitening"
      className="rounded-lg mt-4"
      src="/services/whitening.png"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Removable Partial Denture (Pustiso)</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Regain your confidence with custom-fitted, removable partial dentures.</p>
    <Image
      alt="Removable Partial Denture"
      className="rounded-lg mt-4"
      src="/services/denture.png"
      width={400}
      height={300}
    />
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Veneers, Crowns, and Bridges</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Enhance your smile and restore damaged teeth with veneers, crowns, and bridges.</p>
    <Image
      alt="Veneers, Crowns, and Bridges"
      className="rounded-lg mt-4"
      src="/services/crowns.jpg"
      width={400}
      height={300}
    />
  </CardContent>
</Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Dental Clinic. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
