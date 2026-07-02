import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import api from '../../api/axios';
import AuctionForm from '../../components/admin/AuctionForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function CreateAuction() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const { data } = await api.get('/bikes');
        setBikes(data.bikes || data || []);
      } catch {
        toast.error('Failed to load bikes');
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/auctions', data);
      toast.success('Auction created successfully!');
      navigate('/admin/auctions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create auction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <Link to="/admin/auctions" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4">
        <RiArrowLeftLine /> Back to Auctions
      </Link>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
          Create <span className="gradient-text">Auction</span>
        </h1>
        <AuctionForm bikes={bikes} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  );
}
