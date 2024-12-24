// src/app/page.tsx
"use client"
import Image from 'next/image';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import heavy components
const VerifyEmailPage = dynamic(() => import('./verifyemail/page'), {
  loading: () => <div>Loading...</div>
});

const Meteors = dynamic(() => import('@/components/ui/meteors').then(mod => mod.Meteors), {
  ssr: false
});

const AnimatedTestimonials = dynamic(
  () => import('@/components/images').then(mod => mod.AnimatedTestimonialsDemo),
  { ssr: false }
);

export default function HomePage() {
  const [showVerifyEmail] = useState(true);

  return (
    <div className="min-h-screen w-full p-6 md:p-8 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-7xl relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-xl">
          <Suspense fallback={<div>Loading meteors...</div>}>
            <Meteors number={20} />
          </Suspense>
          <div className="px-4 sm:px-8 py-6 md:py-8 flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <Suspense fallback={<div>Loading testimonials...</div>}>
                <AnimatedTestimonials />
              </Suspense>
            </div>
            <div className="w-full lg:w-1/3 xl:w-1/4 flex justify-center lg:justify-end items-center">
              {showVerifyEmail && (
                <Suspense fallback={<div>Loading verification...</div>}>
                  <VerifyEmailPage />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}