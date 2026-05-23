import { useEffect, useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { getUsers } from './api';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [loadError, setLoadError] = useState('');

  const fetchUsers = async () => {
    setLoadError('');
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setLoadError(
        err.response?.data?.error ||
          'Could not reach the API. Make sure the backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaved = () => {
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 mt-1">Simple MERN CRUD demo (React + Node + MongoDB)</p>
        </header>

        <UserForm
          editingUser={editingUser}
          onSaved={handleSaved}
          onCancelEdit={() => setEditingUser(null)}
        />

        {loadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {loadError}
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-3">
            All Users {users.length > 0 && <span className="text-slate-400 text-sm">({users.length})</span>}
          </h2>
          <UserList
            users={users}
            loading={loading}
            onEdit={(u) => {
              setEditingUser(u);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onChanged={fetchUsers}
          />
        </section>

        <footer className="text-center text-xs text-slate-400 pt-4">
          MERN CRUD Project &middot; Semester Project
        </footer>
      </div>
    </div>
  );
}
