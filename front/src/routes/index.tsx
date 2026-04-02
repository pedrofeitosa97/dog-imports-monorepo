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
import SearchPage from '../pages/SearchPage/SearchPage'
import AboutPage from '../pages/AboutPage/AboutPage'
import ReturnPolicyPage from '../pages/ReturnPolicyPage/ReturnPolicyPage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SizeGuidePage from '../pages/SizeGuidePage/SizeGuidePage'
import CustomerLoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import AccountPage from '../pages/AccountPage/AccountPage'

import LoginPage from '../pages/admin/LoginPage/LoginPage'
import DashboardPage from '../pages/admin/DashboardPage/DashboardPage'
import ProductsListPage from '../pages/admin/ProductsListPage/ProductsListPage'
import ProductCreatePage from '../pages/admin/ProductCreatePage/ProductCreatePage'
import ProductEditPage from '../pages/admin/ProductEditPage/ProductEditPage'
import CategoryPage from '../pages/admin/CategoryPage/CategoryPage'
import BannerPage from '../pages/admin/BannerPage/BannerPage'
import SettingsPage from '../pages/admin/SettingsPage/SettingsPage'
import PopupPage from '../pages/admin/PopupPage/PopupPage'

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
          <Route path="/busca" element={<SearchPage />} />
          <Route path="/marcas/:brand" element={<ProductListingPage />} />
          <Route path="/categorias/:category" element={<ProductListingPage />} />
          <Route path="/sobre-nos" element={<AboutPage />} />
          <Route path="/politica-de-trocas" element={<ReturnPolicyPage />} />
          <Route path="/guia-de-tamanhos" element={<SizeGuidePage />} />
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/minha-conta" element={<AccountPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
            <Route path="/admin/banners" element={<BannerPage />} />
            <Route path="/admin/configuracoes" element={<SettingsPage />} />
            <Route path="/admin/popups" element={<PopupPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
