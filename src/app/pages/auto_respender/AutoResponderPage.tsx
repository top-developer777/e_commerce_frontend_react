import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Campaigns } from './components/Campaigns'
import { Products } from './components/Products'
import { Orders } from './components/Orders'
import { AutoResponderHeader } from './AutoResponderHeader'

const autoResponderBreadCrumbs: Array<PageLink> = [
]

const InventoryManagePage = () => (
  <Routes>
    <Route
      element={
        <>
          <AutoResponderHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='campaigns'
        element={
          <>
            <PageTitle breadcrumbs={autoResponderBreadCrumbs}>Campaigns</PageTitle>
            <Campaigns />
          </>
        }
      />
      <Route
        path='products'
        element={
          <>
            <PageTitle breadcrumbs={autoResponderBreadCrumbs}>Products</PageTitle>
            <Products />
          </>
        }
      />
      <Route
        path='orders'
        element={
          <>
            <PageTitle breadcrumbs={autoResponderBreadCrumbs}>Orders</PageTitle>
            <Orders />
          </>
        }
      />
      <Route index element={<Navigate to='/inventory-management/products' />} />
    </Route>
  </Routes>
)

export default InventoryManagePage