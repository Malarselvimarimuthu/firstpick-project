import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function SuspenseLayout() {
  return (
    <Suspense fallback={''}>
      <Outlet />
    </Suspense>
  );
}