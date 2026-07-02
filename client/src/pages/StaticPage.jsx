import { useParams } from 'react-router-dom';

export default function StaticPage() {
  const { pageId } = useParams();
  
  const content = {
    'help': { title: 'Help Center', body: 'Welcome to the BikeAuction Help Center. Here you can find answers to frequently asked questions about bidding, selling, and account management.' },
    'terms': { title: 'Terms of Service', body: 'By using BikeAuction, you agree to our Terms of Service. All bids placed are legally binding contracts.' },
    'privacy': { title: 'Privacy Policy', body: 'We take your privacy seriously. We only collect the necessary information to process your auctions and bids securely.' },
    'rules': { title: 'Bidding Rules', body: 'Bidding requires a registered account. All bids are final. The highest bidder at the end of the auction wins the motorcycle.' },
    'contact': { title: 'Contact Us', body: 'For support, please email us at summitkumawat8888@gmail.com or call +91 8696575495.' },
  };

  const data = content[pageId] || { title: 'Page Not Found', body: 'The page you are looking for does not exist.' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 fade-in min-h-[60vh]">
      <div className="glass rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-white mb-6 gradient-text">{data.title}</h1>
        <div className="text-slate-300 leading-relaxed text-lg">
          <p>{data.body}</p>
        </div>
      </div>
    </div>
  );
}
