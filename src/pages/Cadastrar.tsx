import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../hooks/useAuth';

const Cadastrar: React.FC = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // ETAPA 1: Tenta registar o utilizador com a rota correta.
      await api.post('/users/register', {
        name: name,
        email: email,
        password: password,
      });

      // ETAPA 2: Se o registo deu certo, faz o login para obter o token.
      const loginResponse = await api.post('/login', {
        email: email,
        password: password,
      });

      // ETAPA 3: Guarda o token, atualiza o estado de autenticação.
      const { token } = loginResponse.data;
      localStorage.setItem('authToken', token);
      setIsLoggedIn(true);

      // ETAPA 4: Redireciona para o perfil, agora autenticado.
      navigate('/meu-perfil');

    } catch (caughtError: unknown) {
      let errorMessage = 'Não foi possível criar a conta. Tente novamente.';
      if (typeof caughtError === 'object' && caughtError !== null && 'isAxiosError' in caughtError) {
        const axiosError = caughtError as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || 'Erro ao registar. Verifique os dados.';
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
          <h1 className="text-4xl font-extrabold text-white mb-2">Crie a Sua Conta</h1>
          <p className="text-gray-400">Rápido e fácil. Comece agora mesmo.</p>
        </div>
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="name" className="text-gray-300">Nome de Utilizador</Label>
              <Input
                id="name" type="text" placeholder="O seu nome de utilizador" required className="mt-2"
                value={name} onChange={(e) => { setName(e.target.value); setError(null); }} disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">E-mail</Label>
              <Input
                id="email" type="email" placeholder="seuemail@exemplo.com" required className="mt-2"
                value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <Input
                id="password" type="password" placeholder="••••••••" required className="mt-2"
                value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button type="submit" className="w-full text-white" disabled={isLoading}>
              {isLoading ? 'A finalizar...' : 'Registar'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Já tem uma conta?{' '}
            <Link to="/entrar" className="font-medium text-primary hover:underline">
              Faça o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastrar;

