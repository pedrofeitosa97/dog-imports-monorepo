import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import AdminRoutes from './AdminRoutes'

import HomePage from '../pages/HomePage/HomePage'
import ProductListingPage from '../pages/ProductListingPage/ProductListingPage'
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage'
import CartPage from '../pages/CartPage/CartPage'
import FavoritesPage from '../pages/FavoritesPage/FavoritesPage'

import LoginPage from '../pages/admin/LoginPage/LoginPage'
import DashboardPage from '../pages/admin/DashboardPage/DashboardPage'
import ProductsListPage from '../pages/admin/ProductsListPage/ProductsListPage'
import ProductCreatePage from '../pages/admin/ProductCreatePage/ProductCreatePage'
import ProductEditPage from '../pages/admin/ProductEditPage/ProductEditPage'
import CategoryPage from '../pages/admin/CategoryPage/CategoryPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<ProductListingPage />} />
          <Route path="/produtos/:slug" element={<ProductDetailPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/marcas/:brand" element={<ProductListingPage />} />
          <Route path="/categorias/:category" element={<ProductListingPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<LoginPage />} />
        </Route>

        <Route element={<AdminRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/produtos" element={<ProductsListPage />} />
            <Route path="/admin/produtos/novo" element={<ProductCreatePage />} />
            <Route path="/admin/produtos/:id/editar" element={<ProductEditPage />} />
            <Route path="/admin/categorias" element={<CategoryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
