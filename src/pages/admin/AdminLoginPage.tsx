import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center px-6">
      <div className="bg-white rounded-sm p-12 w-full max-w-md shadow-lg">
        <h1 className="font-serif text-4xl text-gray-800 mb-2 text-center tracking-wide">
          OUARDATIE
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm tracking-widest">ADMIN PANEL</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2 tracking-wide">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
              placeholder="admin@ouardatie.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2 tracking-wide">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-800 text-white text-sm tracking-widest hover:bg-gray-700 transition-all disabled:bg-gray-400"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
