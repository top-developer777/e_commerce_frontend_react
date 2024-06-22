import {Navigate, Routes, Route, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Account} from './components/Account'
import {MyTeams} from './components/MyTeams'
import {Integrations} from './components/Integrations'
import {ConfigHeader} from './ConfigHeader'

const configBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/config/account',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'My Teams',
    path: '/config/my-teams',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Integrations',
    path: '/config/integrations',
    isSeparator: false,
    isActive: false,
  },
]

const ConfigPage = () => (
  <Routes>
    <Route
      element={
        <>
          <ConfigHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='account'
        element={
          <>
            <PageTitle breadcrumbs={configBreadCrumbs}>Account</PageTitle>
            <Account />
          </>
        }
      />
      <Route
        path='my-teams'
        element={
          <>
            <PageTitle breadcrumbs={configBreadCrumbs}>My Teams</PageTitle>
            <MyTeams />
          </>
        }
      />
      <Route
        path='integrations'
        element={
          <>
            <PageTitle breadcrumbs={configBreadCrumbs}>Integrations</PageTitle>
            <Integrations />
          </>
        }
      />
      <Route index element={<Navigate to='/config/account' />} />
    </Route>
  </Routes>
)

export default ConfigPage
