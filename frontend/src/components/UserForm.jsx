import { useEffect, useState } from 'react';
import { createUser, updateUser } from '../api';

const emptyForm = { name: '', email: '', phone: '', dob: '' };

const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');

const validate = ({ name, email, phone, dob }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  else if (name.trim().length > 50) errors.name = 'Name cannot exceed 50 characters';

  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Please enter a valid email';

  if (!phone.trim()) errors.phone = 'Phone is required';
  else if (!/^[0-9]{10,15}$/.test(phone.trim()))
    errors.phone = 'Phone must be 10-15 digits only';

  if (!dob) errors.dob = 'Date of birth is required';
  else if (new Date(dob) > new Date()) errors.dob = 'DOB cannot be in the future';

  return errors;
};

export default function UserForm({ editingUser, onSaved, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name || '',
        email: editingUser.email || '',
        phone: editingUser.phone || '',
        dob: toDateInput(editingUser.dob),
      });
      setErrors({});
      setServerError('');
    } else {
      setForm(emptyForm);
      setErrors({});
      setServerError('');
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser._id, form);
      } else {
        await createUser(form);
      }
      setForm(emptyForm);
      onSaved();
    } catch (err) {
      setServerError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
      errors[field] ? 'border-red-400' : 'border-slate-300'
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 space-y-4 border border-slate-200"
    >
      <h2 className="text-xl font-semibold text-slate-800">
        {editingUser ? 'Edit User' : 'Add New User'}
      </h2>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={inputClass('name')}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass('email')}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={inputClass('phone')}
            placeholder="03001234567"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 10)}
            className={inputClass('dob')}
          />
          {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-md shadow"
        >
          {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-md"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
