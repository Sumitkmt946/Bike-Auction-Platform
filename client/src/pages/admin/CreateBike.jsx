import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import api from '../../api/axios';
import BikeForm from '../../components/admin/BikeForm';
import toast from 'react-hot-toast';

export default function CreateBike() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/bikes', data);
      toast.success('Bike created successfully!');
      navigate('/admin/bikes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bike');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <Link to="/admin/bikes" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4">
        <RiArrowLeftLine /> Back to Bikes
      </Link>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
          Add New <span className="gradient-text">Bike</span>
        </h1>
        <BikeForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
