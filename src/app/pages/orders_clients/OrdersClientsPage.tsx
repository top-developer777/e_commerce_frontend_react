import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { Orders } from './components/Orders'
import { Returns } from './components/Returns'
import { OrderProcessing } from './components/OrderProcessing'
import { ProductReviews } from './components/ProductReviews'
import { OrdersClientsHeader } from './OrdersClientsHeader'
import { CustomerAction } from './components/CustomerAction'

const ocBreadCrumbs: Array<PageLink> = [
]

const OrdersClientsPage = () => (
  <Routes>
    <Route
      element={
        <>
          <OrdersClientsHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='orders'
        element={
          <>
            <PageTitle breadcrumbs={ocBreadCrumbs}>Orders</PageTitle>
            <Orders />
          </>
        }
      />
      <Route
        path='returns'
        element={
          <>
            <PageTitle breadcrumbs={ocBreadCrumbs}>Returns</PageTitle>
            <Returns />
          </>
        }
      />
      <Route
        path='order-processing'
        element={
          <>
            <PageTitle breadcrumbs={ocBreadCrumbs}>Order Processing</PageTitle>
            <OrderProcessing />
          </>
        }
      />
      <Route
        path='product-reviews'
        element={
          <>
            <PageTitle breadcrumbs={ocBreadCrumbs}>Product Reviews</PageTitle>
            <ProductReviews />
          </>
        }
      />
      <Route
        path='customers_actions'
        element={
          <>
            <PageTitle breadcrumbs={ocBreadCrumbs}>Customers & Actions</PageTitle>
            <CustomerAction />
          </>
        }
      />
      <Route index element={<Navigate to='/orders/orders' />} />
    </Route>
  </Routes>
)

export default OrdersClientsPage