import type { Metadata } from 'next';
import AuthLayoutClient from './AuthLayoutClient';

export const metadata: Metadata = {
  title: 'Secure Access & Sign In | Coincashy',
  description: 'Sign in to Coincashy or create an account. Regulated European crypto-fiat settlement, virtual IBANs, and institutional OTC trading.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
