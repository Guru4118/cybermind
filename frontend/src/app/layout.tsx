import './globals.css';
import { MantineWrapper } from './mantine-wrapper';

export const metadata = {
  title: 'Job Portal',
  description: 'Find jobs and talents with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineWrapper>{children}</MantineWrapper>
      </body>
    </html>
  );
}
