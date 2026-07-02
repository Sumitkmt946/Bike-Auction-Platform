import { useState, useEffect } from 'react';
import { RiMotorbikeFill, RiImageLine } from 'react-icons/ri';

export default function BikeForm({ initialData, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    description: '',
    startingPrice: '',
    images: '',
  });
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        brand: initialData.brand || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        description: initialData.description || '',
        startingPrice: initialData.startingPrice || '',
        images: Array.isArray(initialData.images) ? initialData.images.join(', ') : initialData.images || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (!form.model.trim()) errs.model = 'Model is required';
    if (!form.year || form.year < 1900 || form.year > 2100) errs.year = 'Year must be between 1900 and 2100';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.startingPrice || Number(form.startingPrice) <= 0) errs.startingPrice = 'Price must be greater than 0';
    if (!form.images.trim()) errs.images = 'At least one image URL is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      year: Number(form.year),
      startingPrice: Number(form.startingPrice),
      images: form.images.split(',').map((url) => url.trim()).filter(Boolean),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Bike Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Royal Enfield Classic 350"
          className={`input-dark ${errors.name ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
      </div>

      {/* Brand + Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Brand <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. Royal Enfield"
            className={`input-dark ${errors.brand ? 'border-red-500/50' : ''}`}
          />
          {errors.brand && <p className="text-xs text-red-400 mt-1">{errors.brand}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Model <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="e.g. Classic 350"
            className={`input-dark ${errors.model ? 'border-red-500/50' : ''}`}
          />
          {errors.model && <p className="text-xs text-red-400 mt-1">{errors.model}</p>}
        </div>
      </div>

      {/* Year + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Year <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="year"
            min="1900"
            max="2100"
            value={form.year}
            onChange={handleChange}
            className={`input-dark ${errors.year ? 'border-red-500/50' : ''}`}
          />
          {errors.year && <p className="text-xs text-red-400 mt-1">{errors.year}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Starting Price (₹) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="startingPrice"
            min="1"
            step="1"
            value={form.startingPrice}
            onChange={handleChange}
            placeholder="e.g. 50000"
            className={`input-dark ${errors.startingPrice ? 'border-red-500/50' : ''}`}
          />
          {errors.startingPrice && <p className="text-xs text-red-400 mt-1">{errors.startingPrice}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the bike condition, features, mileage, etc."
          className={`input-dark resize-none ${errors.description ? 'border-red-500/50' : ''}`}
        />
        {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
          <RiImageLine /> Image URLs (comma-separated) <span className="text-red-400">*</span>
        </label>
        <textarea
          name="images"
          rows="2"
          value={form.images}
          onChange={handleChange}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          className={`input-dark resize-none ${errors.images ? 'border-red-500/50' : ''}`}
        />
        {errors.images && <p className="text-xs text-red-400 mt-1">{errors.images}</p>}
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
            <RiMotorbikeFill />
            {initialData ? 'Update Bike' : 'Create Bike'}
          </>
        )}
      </button>
    </form>
  );
}
