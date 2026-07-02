import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import api from '../../api/axios';
import AuctionForm from '../../components/admin/AuctionForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function EditAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionRes, bikesRes] = await Promise.all([
          api.get(`/auctions/${id}`),
          api.get('/bikes'),
        ]);
        setAuction(auctionRes.data.auction || auctionRes.data);
        setBikes(bikesRes.data.bikes || bikesRes.data || []);
      } catch {
        toast.error('Failed to load auction data');
        navigate('/admin/auctions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.put(`/auctions/${id}`, data);
      toast.success('Auction updated successfully!');
      navigate('/admin/auctions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update auction');
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
          Edit <span className="gradient-text">Auction</span>
        </h1>
        <AuctionForm initialData={auction} bikes={bikes} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  );
}
