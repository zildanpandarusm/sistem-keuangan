import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Pendapatan from './pages/Pendapatan';
import Pengeluaran from './pages/Pengeluaran';
import Karyawan from './pages/Karyawan';
import Hutang from './pages/Hutang';
import Pengguna from './pages/Users';
import Login from './components/Login';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="pendapatan" element={<Pendapatan />} />
          <Route path="pengeluaran" element={<Pengeluaran />} />
          <Route path="karyawan" element={<Karyawan />} />
          <Route path="hutang" element={<Hutang />} />
          <Route path="users" element={<Pengguna />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
