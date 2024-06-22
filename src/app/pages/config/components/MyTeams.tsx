import {ListViewProvider, useListView} from '../../../../app/modules/apps/user-management/users-list/core/ListViewProvider'
import {QueryRequestProvider} from '../../../../app/modules/apps/user-management/users-list/core/QueryRequestProvider'
import {QueryResponseProvider} from '../../../../app/modules/apps/user-management/users-list/core/QueryResponseProvider'
import {UsersListHeader} from '../../../../app/modules/apps/user-management/users-list/components/header/UsersListHeader'
import { UsersTable } from '../../../../app/modules/apps/user-management/users-list/table/UsersTable'
import {UserEditModal} from '../../../../app/modules/apps/user-management/users-list/user-edit-modal/UserEditModal'
import {KTCard} from '../../../../_metronic/helpers'
import { Content } from '../../../../_metronic/layout/components/content'

const UsersList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

export function MyTeams() {
  return (
    <QueryRequestProvider>
      <QueryResponseProvider>
        <ListViewProvider>
          <Content>
            <UsersList />
          </Content>
        </ListViewProvider>
      </QueryResponseProvider>
    </QueryRequestProvider>
  )
}
