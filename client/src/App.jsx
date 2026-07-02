import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuctionList from './pages/AuctionList';
import AuctionDetail from './pages/AuctionDetail';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import StaticPage from './pages/StaticPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBikes from './pages/admin/ManageBikes';
import CreateBike from './pages/admin/CreateBike';
import EditBike from './pages/admin/EditBike';
import ManageAuctions from './pages/admin/ManageAuctions';
import CreateAuction from './pages/admin/CreateAuction';
import EditAuction from './pages/admin/EditAuction';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          {/* Toast notifications — dark theme */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />

          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/info/:pageId" element={<StaticPage />} />

              {/* Protected Routes */}
              <Route
                path="/auctions"
                element={
                  <ProtectedRoute>
                    <AuctionList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auctions/:id"
                element={
                  <ProtectedRoute>
                    <AuctionDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bikes"
                element={
                  <AdminRoute>
                    <ManageBikes />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bikes/create"
                element={
                  <AdminRoute>
                    <CreateBike />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bikes/:id/edit"
                element={
                  <AdminRoute>
                    <EditBike />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/auctions"
                element={
                  <AdminRoute>
                    <ManageAuctions />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/auctions/create"
                element={
                  <AdminRoute>
                    <CreateAuction />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/auctions/:id/edit"
                element={
                  <AdminRoute>
                    <EditAuction />
                  </AdminRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
