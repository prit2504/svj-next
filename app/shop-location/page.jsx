// app/address/page.jsx
"use client";

export default function AddressPage() {
  return (
    <div className="bg-gradient-to-br from-[#fffdf9] via-[#fdf7f2] to-[#fffaf5] text-gray-800 min-h-screen flex flex-col">


      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-700 mb-4">
          Visit Our Shop
        </h1>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-2xl">
          Shamal Bechor Pole, Vithhal Mandir Lane, B/h Bank Of Baroda, Mandvi,
          Vadodara. 390001
        </p>
      </section>

      {/* Google Map */}
      <section className="flex justify-center px-4 ">
        <div className="w-full max-w-5xl h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://maps.google.com/maps?q=22.300777,73.210083&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>


    </div>
  );
}
