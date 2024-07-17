import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Products } from './components/Products'
import { Planner } from './components/Planner'
import { ShippingManagement } from './components/ShippingManagement'
import { WarehouseManagement } from './components/WarehouseManagement'
import { Suppliers } from './components/Suppliers'
import { InventoryManageHeader } from './InventoryManageHeader'

const inventoryManBreadCrumbs: Array<PageLink> = [
]

const InventoryManagePage = () => (
  <Routes>
    <Route
      element={
        <>
          <InventoryManageHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='products'
        element={
          <>
            <PageTitle breadcrumbs={inventoryManBreadCrumbs}>Products</PageTitle>
            <Products />
          </>
        }
      />
      <Route
        path='planner'
        element={
          <>
            <PageTitle breadcrumbs={inventoryManBreadCrumbs}>Planner</PageTitle>
            <Planner />
          </>
        }
      />
      <Route
        path='shipping-management'
        element={
          <>
            <PageTitle breadcrumbs={inventoryManBreadCrumbs}>Shipping Management</PageTitle>
            <ShippingManagement />
          </>
        }
      />
      <Route
        path='warehouse'
        element={
          <>
            <PageTitle breadcrumbs={inventoryManBreadCrumbs}>Warehouse Management</PageTitle>
            <WarehouseManagement />
          </>
        }
      />
      <Route
        path='suppliers'
        element={
          <>
            <PageTitle breadcrumbs={inventoryManBreadCrumbs}>Suppliers</PageTitle>
            <Suppliers />
          </>
        }
      />
      <Route index element={<Navigate to='/inventory-management/products' />} />
    </Route>
  </Routes>
)

export default InventoryManagePage