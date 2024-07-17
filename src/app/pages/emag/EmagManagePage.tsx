import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { EmagManageHeader } from './EmagManageHeader'
import { EmagOrders } from './components/orders'

const inventoryManBreadCrumbs: Array<PageLink> = [
]

const EmagManagePage = () => (
  <Routes>
    <Route
      element={
        <>
          <EmagManageHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='orders'
        element={
          <>
            <PageTitle breadcrumbs={inventoryManBreadCrumbs}>Products</PageTitle>
            <EmagOrders />
          </>
        }
      />
      <Route index element={<Navigate to='/emag/orders' />} />
    </Route>
  </Routes>
)

export default EmagManagePage