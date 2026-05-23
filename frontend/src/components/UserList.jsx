import { deleteUser } from '../api';

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function UserList({ users, loading, onEdit, onChanged }) {
  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await deleteUser(user._id);
      onChanged();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) {
    return <p className="text-center text-slate-500 py-8">Loading users...</p>;
  }

  if (users.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500">
        No users yet. Add your first user using the form above.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">DOB</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-medium text-slate-800">{u.name}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{u.phone}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{formatDate(u.dob)}</td>
              <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                <button
                  onClick={() => onEdit(u)}
                  className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u)}
                  className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
