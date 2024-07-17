import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { LostDamaged } from './components/LostDamaged'
import { Returns } from './components/Returns'
import { PayBackHeader } from './PayBackHeader'

const paybackBreadCrumbs: Array<PageLink> = [
]

const PayBackPage = () => (
  <Routes>
    <Route
      element={
        <>
          <PayBackHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='lost-damaged'
        element={
          <>
            <PageTitle breadcrumbs={paybackBreadCrumbs}>Lost & Damaged</PageTitle>
            <LostDamaged />
          </>
        }
      />
      <Route
        path='returns'
        element={
          <>
            <PageTitle breadcrumbs={paybackBreadCrumbs}>Returns</PageTitle>
            <Returns />
          </>
        }
      />
      <Route index element={<Navigate to='/inventory-management/products' />} />
    </Route>
  </Routes>
)

export default PayBackPage