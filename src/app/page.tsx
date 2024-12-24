 
// src/app/page.tsx

"use client"
import Image from 'next/image';
import { useState } from 'react';
import VerifyEmailPage from './verifyemail/page';
import { Meteors } from "@/components/ui/meteors";
import { AnimatedTestimonialsDemo } from '@/components/images';

export default function HomePage() {
  const [showVerifyEmail] = useState(true);

  return (
    <div className="min-h-screen w-full p-6 md:p-8 flex items-center justify-center overflow-y-auto  ">
      <div className="w-full max-w-7xl relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-xl">
          <Meteors number={20} />
          <div className="px-4 sm:px-8 py-6 md:py-8 flex flex-col lg:flex-row gap-8">
            {/* Left side - Animated Testimonials */}
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <AnimatedTestimonialsDemo />
            </div>
            {/* Right side - Verify Email */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex justify-center lg:justify-end items-center">
              {showVerifyEmail && <VerifyEmailPage />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}