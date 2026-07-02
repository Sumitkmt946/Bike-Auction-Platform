import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiAddLine, RiEditLine, RiDeleteBin6Line, RiMotorbikeFill, RiArrowLeftLine } from 'react-icons/ri';
import api from '../../api/axios';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ManageBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchBikes();
  }, []);

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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeleting(id);
    try {
      await api.delete(`/bikes/${id}`);
      setBikes((prev) => prev.filter((b) => b._id !== id));
      toast.success(`"${name}" deleted successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete bike');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-2">
            <RiArrowLeftLine /> Back to Admin
          </Link>
          <h1 className="text-3xl font-extrabold text-white">
            Manage <span className="gradient-text">Bikes</span>
          </h1>
        </div>
        <Link to="/admin/bikes/create" className="btn-primary flex items-center gap-2">
          <RiAddLine /> Add New Bike
        </Link>
      </div>

      {/* Bikes List */}
      {bikes.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <RiMotorbikeFill className="text-6xl text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400 mb-2">No bikes added yet</h3>
          <p className="text-sm text-slate-500 mb-6">Start by adding your first motorcycle</p>
          <Link to="/admin/bikes/create" className="btn-primary inline-flex items-center gap-2">
            <RiAddLine /> Add Bike
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <div key={bike._id} className="glass rounded-2xl overflow-hidden group">
              {/* Image */}
              <div className="h-40 bg-slate-800 relative overflow-hidden">
                {bike.images?.[0] ? (
                  <img
                    src={bike.images[0]}
                    alt={bike.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <RiMotorbikeFill className="text-4xl text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1">{bike.name}</h3>
                <p className="text-sm text-slate-400">
                  {bike.brand} · {bike.model} · {bike.year}
                </p>
                <p className="text-lg font-bold gradient-text mt-2">{formatCurrency(bike.startingPrice)}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/30">
                  <Link
                    to={`/admin/bikes/${bike._id}/edit`}
                    className="flex-1 btn-secondary flex items-center justify-center gap-1.5 text-sm py-2"
                  >
                    <RiEditLine /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(bike._id, bike.name)}
                    disabled={deleting === bike._id}
                    className="flex-1 btn-danger flex items-center justify-center gap-1.5 text-sm py-2"
                  >
                    {deleting === bike._id ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>
                        <RiDeleteBin6Line /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
