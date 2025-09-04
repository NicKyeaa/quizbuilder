'use client';
import dynamic from 'next/dynamic';

const ClientQuestionManager = dynamic(
  () => import('./ClientQuestionManager').then((m) => m.default),
  {
    ssr: false,
  }
);

export default function ClientLoader() {
  return <ClientQuestionManager />;
}
