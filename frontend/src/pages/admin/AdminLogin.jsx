import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (error) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">TM</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Área Administrativa</h2>
            <p className="text-gray-600">Entre com suas credenciais</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-700">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="Digite seu usuário"
                  value={credentials.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Digite sua senha"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 hover:from-purple-700 hover:via-cyan-600 hover:to-teal-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Credenciais padrão:</strong><br />
                Usuário: admin<br />
                Senha: tm123admin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;