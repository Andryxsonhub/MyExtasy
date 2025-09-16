// src/pages/Entrar.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../hooks/useAuth';

const Entrar: React.FC = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://myextasyclub-backend.onrender.com/api/login', {
        email: email,
        password: password,
      });

      const { token } = response.data;
      localStorage.setItem('authToken', token);
      setIsLoggedIn(true);
      
      // --- AQUI ESTÁ A MUDANÇA ---
      navigate('/home'); // Redireciona para a nova página Home

    } catch (caughtError: unknown) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      if (axios.isAxiosError(caughtError)) {
        errorMessage = caughtError.response?.data?.message || 'E-mail ou senha inválidos.';
      } else if (caughtError instanceof Error) {
        errorMessage = caughtError.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">Entrar na Sua Conta</h1>
          <p className="text-gray-400">Bem-vindo de volta! Faça o login para continuar.</p>
        </div>
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email" className="text-gray-300">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                required
                className="mt-2"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="mt-2"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full text-white" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Não tem uma conta?{' '}
            <Link to="/cadastrar" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Entrar;