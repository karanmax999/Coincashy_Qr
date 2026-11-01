import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import LeadCaptureContent from '@/components/Lead/LeadCaptureContent';

export const metadata: Metadata = {
  title: 'Join the Coincashy Network | Event Lead Capture',
  description: 'Connect with Coincashy at our events. Share your details and our team will follow up with you.',
  robots: {
    index: false, // Internal/event lead capture page doesn't need to compete in public SEO index
    follow: true,
  },
};

export default function LeadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#050608] text-[#F2F2F2] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#3E63DD] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-white/50 tracking-wider font-mono">LOADING COINCASHY...</span>
          </div>
        </div>
      }
    >
      <LeadCaptureContent />
    </Suspense>
  );
}
