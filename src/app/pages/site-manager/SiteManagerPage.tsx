import { Navigate, Routes, Route, Outlet } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { ManageUsers } from './components/ManageUsers'
import { SiteManagerHeader } from './SiteManagerHeader'

const siteManagerCrumbs: Array<PageLink> = [
  // {
  //   title: 'Lost & Damaged',
  //   path: '/pay-back/lost-damaged',
  //   isSeparator: false,
  //   isActive: false,
  // }
]

const SiteManagerPage = () => (
  <Routes>
    <Route
      element={
        <>
          <SiteManagerHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='manage-users'
        element={
          <>
            <PageTitle breadcrumbs={siteManagerCrumbs}>Manage Users</PageTitle>
            <ManageUsers />
          </>
        }
      />
      <Route index element={<Navigate to='/site-manager/manage-users' />} />
    </Route>
  </Routes>
)

export default SiteManagerPage