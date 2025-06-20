'use client';

import { MantineProvider } from '@mantine/core';

export function MantineWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  );
}
