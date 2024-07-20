import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { DashboardManageHeader } from './DashboardManageHeader'
import { DashboardPage } from './components/DashboardPage'
import { Products } from './components/Products'
import { WarehousesComponent } from './components/Warehouses'

const dashboardManBreadCrumbs: Array<PageLink> = [
  // {
  //   title: 'Products',
  //   path: '/dashboard/products',
  //   isSeparator: false,
  //   isActive: false,
  // },
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
      <Route
        path='warehouses'
        element={
          <>
            <PageTitle breadcrumbs={dashboardManBreadCrumbs}>Warehouses</PageTitle>
            <WarehousesComponent />
          </>
        }
      />
      <Route index element={<Navigate to='/dashboard/main' />} />
    </Route>
  </Routes>
)

export default DashboardManagePage