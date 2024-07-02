import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { AdminHeader } from './AdminHeader'
import { Dashboard } from './components/Dashboard'

const alertsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Settings',
    path: '/admin/settings',
    isSeparator: false,
    isActive: false,
  }
]

const AdminPage = () => (
  <Routes>
    <Route
      element={
        <>
          <AdminHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='dashboard'
        element={
          <>
            <PageTitle breadcrumbs={alertsBreadCrumbs}>Dashboard</PageTitle>
            <Dashboard />
          </>
        }
      />
      <Route index element={<Navigate to='/inventory-management/products' />} />
    </Route>
  </Routes>
)

export default AdminPage