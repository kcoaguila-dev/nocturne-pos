import { AppRouter } from './app/router';
import { AuthProvider } from '@/features/auth/api/useAuth';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
