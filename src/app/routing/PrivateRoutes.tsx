import { lazy, FC, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import SiteManagerPage from '../pages/site-manager/SiteManagerPage'
import DashboardManagePage from '../pages/dashboard/DashboardManagePage'
import EmagManagePage from '../pages/emag/EmagManagePage'

const PrivateRoutes = () => {
  const ConfigPage = lazy(() => import('../pages/config/ConfigPage'))
  const InventoryManagePage = lazy(() => import('../pages/inventory_management/InventoryManagePage'))
  const OrdersClientsPage = lazy(() => import('../pages/orders_clients/OrdersClientsPage'))
  const AlertsPage = lazy(() => import('../pages/alerts/AlertsPage'))
  const PayBackPage = lazy(() => import('../pages/pay_back/PayBackPage'))
  const AutoResponderPage = lazy(() => import('../pages/auto_respender/AutoResponderPage'))
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />

        <Route
          path='dashboard/*'
          element={
            <SuspensedView>
              <DashboardManagePage />
            </SuspensedView>
          }
        />

        <Route
          path='config/*'
          element={
            <SuspensedView>
              <ConfigPage />
            </SuspensedView>
          }
        />
        <Route
          path='orders/*'
          element={
            <SuspensedView>
              <OrdersClientsPage />
            </SuspensedView>
          }
        />
        <Route
          path='inventory-management/*'
          element={
            <SuspensedView>
              <InventoryManagePage />
            </SuspensedView>
          }
        />
        <Route
          path='emag/*'
          element={
            <SuspensedView>
              <EmagManagePage />
            </SuspensedView>
          }
        />
        <Route
          path='alerts/*'
          element={
            <SuspensedView>
              <AlertsPage />
            </SuspensedView>
          }
        />
        <Route
          path='pay-back/*'
          element={
            <SuspensedView>
              <PayBackPage />
            </SuspensedView>
          }
        />
        <Route
          path='auto-respender/*'
          element={
            <SuspensedView>
              <AutoResponderPage />
            </SuspensedView>
          }
        />
        <Route
          path='site-manager/*'
          element={
            <SuspensedView>
              <SiteManagerPage />
            </SuspensedView>
          }
        />
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
