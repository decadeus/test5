'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const BackLink = ({ children }) => {
  const pathname = usePathname();
  const segments = pathname.split('/');
  segments.pop();
  const previousPathname = segments.join('/');

  return (
    <Link href={previousPathname}>
      {children}
    </Link>
  );
};

export default BackLink;