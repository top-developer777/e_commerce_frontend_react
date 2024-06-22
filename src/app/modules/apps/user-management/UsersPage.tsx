import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'
import { Overview } from '../../accounts/components/Overview'
import { Settings } from '../../accounts/components/settings/Settings'


const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'User Management',
    path: 'teams',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='teams'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Team Members</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
        <Route
          path='settings'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Team Members</PageTitle>
              <Overview />
            </>
          }
        />
        <Route
          path='edit'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Team Members</PageTitle>
              <Settings />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/account-manage/account/teams' />} />
    </Routes>
  )
}

export default UsersPage
