import { useState, useEffect } from 'react';
import { RiAuctionLine } from 'react-icons/ri';

export default function AuctionForm({ initialData, bikes = [], onSubmit, loading }) {
  const [form, setForm] = useState({
    bike: '',
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      // Format datetime for datetime-local input
      const formatDT = (dt) => {
        if (!dt) return '';
        const d = new Date(dt);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60000);
        return local.toISOString().slice(0, 16);
      };

      setForm({
        bike: initialData.bike?._id || initialData.bike || '',
        startTime: formatDT(initialData.startTime),
        endTime: formatDT(initialData.endTime),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.bike) errs.bike = 'Please select a bike';
    if (!form.startTime) errs.startTime = 'Start time is required';
    if (!form.endTime) errs.endTime = 'End time is required';
    if (form.startTime && form.endTime && new Date(form.endTime) <= new Date(form.startTime)) {
      errs.endTime = 'End time must be after start time';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      bike: form.bike,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Bike Select */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Select Bike <span className="text-red-400">*</span>
        </label>
        <select
          name="bike"
          value={form.bike}
          onChange={handleChange}
          className={`input-dark ${errors.bike ? 'border-red-500/50' : ''}`}
        >
          <option value="">-- Choose a bike --</option>
          {bikes.map((bike) => (
            <option key={bike._id} value={bike._id}>
              {bike.name} — {bike.brand} {bike.model} ({bike.year})
            </option>
          ))}
        </select>
        {errors.bike && <p className="text-xs text-red-400 mt-1">{errors.bike}</p>}
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Start Time <span className="text-red-400">*</span>
        </label>
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className={`input-dark ${errors.startTime ? 'border-red-500/50' : ''}`}
        />
        {errors.startTime && <p className="text-xs text-red-400 mt-1">{errors.startTime}</p>}
      </div>

      {/* End Time */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          End Time <span className="text-red-400">*</span>
        </label>
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className={`input-dark ${errors.endTime ? 'border-red-500/50' : ''}`}
        />
        {errors.endTime && <p className="text-xs text-red-400 mt-1">{errors.endTime}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </span>
        ) : (
          <>
            <RiAuctionLine />
            {initialData ? 'Update Auction' : 'Create Auction'}
          </>
        )}
      </button>
    </form>
  );
}
