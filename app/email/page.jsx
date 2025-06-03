'use client';
import { useSession } from "next-auth/react";
import EmailSender from '@/app/[locale]/components/EmailSender';

const Home = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Send an Email</h1>
      <EmailSender />
    </div>
  );
};

export default Home;