import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/buy',
        destination: '/personal#buy',
        permanent: false,
      },
      {
        source: '/sell',
        destination: '/personal#sell',
        permanent: false,
      },
      {
        source: '/convert',
        destination: '/convert-crypto',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth/signup',
        permanent: true,
      },
      {
        source: '/career',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/join',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/join-our-team',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/jobs',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/card',
        destination: '/cards',
        permanent: false,
      },
      {
        source: '/waitlist',
        destination: '/personal#card',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
