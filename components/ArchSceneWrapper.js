'use client';

import dynamic from 'next/dynamic';

const ArchScene = dynamic(() => import('./ArchScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full rounded-md bg-slate-900 flex items-center justify-center"><p className="text-slate-400 text-sm">Loading 3D scene...</p></div>,
});

export default function ArchSceneWrapper() {
  return <ArchScene />;
}
