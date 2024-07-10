import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { DashboardManageHeader } from './DashboardManageHeader'
import { DashboardPage } from './components/DashboardPage'
import { Products } from './components/Products'

const dashboardManBreadCrumbs: Array<PageLink> = [
  {
    title: 'Dashboard',
    path: '/dashboard/main',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Products',
    path: '/dashboard/products',
    isSeparator: false,
    isActive: false,
  },
];

const DashboardManagePage = () => (
  <Routes>
    <Route
      element={
        <>
          <DashboardManageHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='main'
        element={
          <>
            <PageTitle breadcrumbs={dashboardManBreadCrumbs}>Dashboard</PageTitle>
            <DashboardPage />
          </>
        }
      />
      <Route
        path='products'
        element={
          <>
            <PageTitle breadcrumbs={dashboardManBreadCrumbs}>Products</PageTitle>
            <Products />
          </>
        }
      />
      <Route index element={<Navigate to='/dashboard/main' />} />
    </Route>
  </Routes>
)

export default DashboardManagePage