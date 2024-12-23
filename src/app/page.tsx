// src/app/page.tsx
"use client"
import Image from 'next/image';
import { useState } from 'react';
import VerifyEmailPage from './verifyemail/page';
import DashboardPage from './dashboard/page';
import { Meteors } from "@/components/ui/meteors";
import { AnimatedTestimonialsDemo } from '@/components/images';

export default function HomePage() {
  const [showVerifyEmail] = useState(true);

  return (
    <div className="min-h-screen w-full p-0 flex items-center justify-center">
      <div className="w-full max-w-7xl relative">
        <div className="absolute inset-0 h-[75%] w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <Meteors number={20} />
          <div className="px-8 py-2 flex flex-col md:flex-row">
            {/* {/* Left side - Animated Testimonials (75%) /} */}
            <div className="w-full md:w-[75%] mb-4 md:mb-0">
              <AnimatedTestimonialsDemo />
            </div>
            {/* {/ Right side - Verify Email (30%) */} 
            <div className="w-full md:w-[30%] flex flex-col justify-center items-end  mt-8 mr-8 mb-4 md:mb-0">
              {showVerifyEmail && <VerifyEmailPage />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}