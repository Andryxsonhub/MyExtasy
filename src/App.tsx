// src/App.tsx
// --- CORRIGIDO (Layout agora esconde Header/Footer na página da Live) ---

import { useEffect } from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// --- ★★★ 1. IMPORTAÇÃO NOVA ★★★ ---
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthProvider";
import api from './services/api';

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explorar from "./pages/Explorar";
import Lives from "./pages/Lives";
import { Loja } from "./pages/Loja";
import Planos from "./pages/Planos";
import Entrar from "./pages/Entrar";
import Sugestoes from "./pages/Sugestoes";
import UserProfilePage from "./pages/UserProfilePage";
import LivePage from './pages/Live';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import RegistrationFlow from "./components/registration/RegistrationFlow";
import TermosDeUso from './pages/TermosDeUso';
import ExplorePage from "./pages/ExplorePage";
import MediaViewPage from "./pages/MediaViewPage";

const queryClient = new QueryClient();

// (Componente GithubCallbackHandler não muda)
const GithubCallbackHandler = () => {
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

  useEffect(() => {
    const authenticateWithCode = async (code: string) => {
      try {
        const response = await api.post('/auth/github/callback', { code });
        const { token } = response.data;
        if (token) {
          localStorage.setItem('authToken', token);
          setIsLoggedIn(true);
          navigate('/home');
        } else {
          throw new Error("Token não recebido do servidor.");
        }
      } catch (error) {
        console.error("Erro durante a autenticação com GitHub:", error);
        navigate('/entrar', { state: { error: 'Falha na autenticação com o GitHub.' } });
      }
    };
    const code = searchParams.get('code');
    if (code) { authenticateWithCode(code); }
    else { navigate('/entrar', { state: { error: 'Código de autorização do GitHub não encontrado.' } }); }
  }, [navigate, searchParams, setIsLoggedIn]);

    return <div className="flex justify-center items-center h-screen bg-background"><p className="text-white text-xl animate-pulse">Autenticando...</p></div>;
};

// (Componente AppRoutes não muda)
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/github/callback" element={<GithubCallbackHandler />} />
            <Route path="/" element={<Index />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/cadastrar" element={<RegistrationFlow />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
            <Route path="/lives" element={<ProtectedRoute><Lives /></ProtectedRoute>} />
            <Route path="/live/:roomName" element={<ProtectedRoute><LivePage /></ProtectedRoute>} />
            <Route path="/sugestoes" element={<ProtectedRoute><Sugestoes /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/meu-perfil" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/:mediaType/:id" element={<ProtectedRoute><MediaViewPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

// --- ★★★ 2. NOVO COMPONENTE DE LAYOUT ★★★ ---
// Criamos este componente para que ele possa usar 'useLocation'
const AppLayout: React.FC = () => {
  const location = useLocation();
  // Verifica se a URL atual é a página da live
  const isLivePage = location.pathname.startsWith('/live/');

  return (
    <AuthProvider>
      {/* Só mostra o Header se NÃO for a página da live */}
      {!isLivePage && <Header />}

      <div className="flex flex-col min-h-screen">
        {/*           Se for a Live, <main> não tem padding-top e ocupa a tela toda.
          Se NÃO for a Live, <main> tem o padding-top do header.
        */}
        <main className={`flex-grow ${isLivePage ? '' : 'pt-16'}`}>
          <AppRoutes />
        </main>
        
        {/* Só mostra o Footer se NÃO for a página da live */}
        {!isLivePage && <Footer />}
      </div>
    </AuthProvider>
  );
};


// --- ★★★ 3. APP.TSX ATUALIZADO ★★★ ---
// O App agora só renderiza os 'Providers' e o novo 'AppLayout'
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner position="top-center" />
                <BrowserRouter>
                    {/* Trocamos o conteúdo antigo por este componente */}
                    <AppLayout />
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;