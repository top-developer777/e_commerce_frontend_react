import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Dashboard } from './components/Dashboard'
import { Settings } from './components/Settings'
import { AlertsHeader } from './AlertsHeader'

const alertsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Dashboard',
    path: '/alerts/dashboard',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Settings',
    path: '/alerts/settings',
    isSeparator: false,
    isActive: false,
  }
]

const InventoryManagePage = () => (
  <Routes>
    <Route
      element={
        <>
          <AlertsHeader />
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
      <Route
        path='settings'
        element={
          <>
            <PageTitle breadcrumbs={alertsBreadCrumbs}>Settings</PageTitle>
            <Settings />
          </>
        }
      />
      <Route index element={<Navigate to='/inventory-management/products' />} />
    </Route>
  </Routes>
)

export default InventoryManagePage