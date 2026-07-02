import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import api from '../../api/axios';
import BikeForm from '../../components/admin/BikeForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function EditBike() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const { data } = await api.get(`/bikes/${id}`);
        setBike(data.bike || data);
      } catch {
        toast.error('Failed to load bike');
        navigate('/admin/bikes');
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.put(`/bikes/${id}`, data);
      toast.success('Bike updated successfully!');
      navigate('/admin/bikes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bike');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <Link to="/admin/bikes" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-4">
        <RiArrowLeftLine /> Back to Bikes
      </Link>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-white mb-6">
          Edit <span className="gradient-text">Bike</span>
        </h1>
        <BikeForm initialData={bike} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  );
}
