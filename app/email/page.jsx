// pages/index.jsx
import EmailSender from '@/app/[locale]/components/EmailSender';

const Home = () => {
  return (
    <div>
      <h1>Send an Email</h1>
      <EmailSender />
    </div>
  );
};

export default Home;