import { toast } from 'react-toastify'
import Select from 'react-select'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ListViewProvider, useListView } from '../../../../app/modules/apps/user-management/users-list/core/ListViewProvider'
import { QueryRequestProvider } from '../../../../app/modules/apps/user-management/users-list/core/QueryRequestProvider'
import { QueryResponseProvider } from '../../../../app/modules/apps/user-management/users-list/core/QueryResponseProvider'
// import {UsersListHeader} from '../../../../app/modules/apps/user-management/users-list/components/header/UsersListHeader'
// import { UsersTable } from '../../../../app/modules/apps/user-management/users-list/table/UsersTable'
// import {UserEditModal} from '../../../../app/modules/apps/user-management/users-list/user-edit-modal/UserEditModal'
// import {KTCard} from '../../../../_metronic/helpers'
import { Content } from '../../../../_metronic/layout/components/content'
import { useEffect, useState } from 'react'
import { User } from '../../../modules/apps/user-management/users-list/core/_models'
import { addTeamMember, deleteTeamMember, editTeamMember, getTeamMembers, getUsers } from './_request'

// const UsersList = () => {
//   const {itemIdForUpdate} = useListView()
//   return (
//     <>
//       <KTCard>
//         <UsersListHeader />
//         <UsersTable />
//       </KTCard>
//       {itemIdForUpdate !== undefined && <UserEditModal />}
//     </>
//   )
// }

const roleStr2Num = (role: string): number => {
  if (role === 'Unallowed') return -1;
  if (role === 'Warehouse Staff') return 0;
  if (role === 'Product Manager') return 1;
  if (role === 'Order Agent') return 2;
  if (role === 'Customer Support') return 3;
  if (role === 'Administrator') return 4;
  return -1;
}

export function MyTeams() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userOptions, setUserOptions] = useState<{ value: number, label: string }[]>([]);
  const [editUser, setEditUser] = useState<User>();
  const [changed, setChanged] = useState<boolean>(false);
  const roleOptions = [
    { value: 4, label: 'Administrator' },
    { value: 3, label: 'Customer Support' },
    { value: 2, label: 'Order Agent' },
    { value: 1, label: 'Product Manager' },
    { value: 0, label: 'Warehouse Staff' },
    { value: -1, label: 'Unallowed' },
  ];

  useEffect(() => {
    getTeamMembers()
      .then(res => setUsers(res.data))
      .catch(e => console.error(e));
    getUsers()
      .then(res => setAllUsers(res.data.data))
      .catch(e => console.error(e));
  }, [changed])
  useEffect(() => {
    setUserOptions(allUsers.map(user => {
      return { value: user.id as number, label: `${user.full_name} (${user.email})` }
    }));
  }, [allUsers]);

  const handleAddUser = () => {
    if (!editUser) return;
    const closeBtn = document.querySelector('#addMember .btn-close') as HTMLButtonElement;
    addTeamMember({
      user_id: editUser.id ?? 0,
      email: editUser.email ?? '',
      full_name: editUser.full_name ?? '',
      username: editUser.username ?? '',
      created_at: (new Date()).toISOString().split('.')[0],
      updated_at: (new Date()).toISOString().split('.')[0],
      last_logged_in: (new Date()).toISOString().split('.')[0],
      role: roleStr2Num(editUser.role as string),
      hashed_password: 'password',
    })
      .then(() => {
        setChanged(!changed);
        toast.success('Successfully created!');
        closeBtn.click();
      })
      .catch(e => {
        console.error(e);
        toast.error('Something went wrong.');
      });
  }
  const handleEditUser = () => {
    if (!editUser) return;
    const closeBtn = document.querySelector('#editMember .btn-close') as HTMLButtonElement;
    editTeamMember(editUser.id ?? 0, {
      user_id: editUser.id ?? 0,
      email: editUser.email ?? '',
      full_name: editUser.full_name ?? '',
      username: editUser.username ?? '',
      created_at: (new Date()).toISOString().split('.')[0],
      updated_at: (new Date()).toISOString().split('.')[0],
      last_logged_in: (new Date()).toISOString().split('.')[0],
      role: roleStr2Num(editUser.role as string),
      hashed_password: 'password',
    })
      .then(() => {
        setChanged(!changed);
        toast.success('Successfully edited!');
        closeBtn.click();
      })
      .catch(e => {
        console.error(e);
        toast.error('Something went wrong.');
      });
  }
  const deleteUser = (id: number) => {
    deleteTeamMember(id)
      .then(() => setChanged(!changed))
      .catch(e => {
        toast.error('Something went wrong.');
        console.error(e);
      });
  }

  return (
    <QueryRequestProvider>
      <QueryResponseProvider>
        <ListViewProvider>
          <Content>
            <div className="row">
              <div className="col-md-12 text-end">
                <button className="btn btn-light-primary" data-bs-toggle="modal" data-bs-target="#addMember">
                  Add User
                </button>
              </div>
            </div>
            <div className="row mt-6">
              <div className="col-md-12 table-responsive">
                <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover">
                  <thead className='fw-bold text-center'>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Username</th>
                      <th>Joined Day</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={`teamuser${index}`}>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.username}</td>
                        <td>{user.joined_day}</td>
                        <td>
                          <a className='btn btn-white btn-active-light-primary btn-sm p-2' data-bs-toggle="modal" data-bs-target="#editMember" onClick={() => setEditUser(user)} title='Edit team member'>
                            <i className="bi bi-pencil-square fs-3 p-1"></i>
                          </a>
                          <a className='btn btn-white btn-active-light-danger btn-sm p-2' onClick={() => deleteUser(user.id ?? 0)} title='Delete team member'>
                            <i className="bi text-danger bi-slash-circle fs-3 p-1"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal fade" id='addMember' tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Add team member</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="fw-bold">Select User</div>
                    <Select
                      className='react-select-styled react-select-solid react-select-sm flex-grow-1'
                      options={userOptions}
                      placeholder='Select user'
                      noOptionsMessage={e => `No more users including "${e.inputValue}"`}
                      defaultValue={userOptions[0]}
                      onChange={value => setEditUser(allUsers.find(user => user.id === value?.value))}
                      isClearable={false}
                      menuPlacement='auto'
                      menuPortalTarget={document.querySelector('#addMember') as HTMLElement}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setEditUser(undefined)}><i className='bi bi-trash'></i>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddUser}><i className='bi bi-save'></i>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id='editMember' tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit team member</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">Full Name:</div>
                      <div className="col-md-6">
                        <input type="text" className="form-control" value={editUser?.full_name} onChange={e => setEditUser({ ...editUser, full_name: e.target.value })} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">Email:</div>
                      <div className="col-md-6">
                        <input type="text" className="form-control" value={editUser?.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">Role:</div>
                      <div className="col-md-6">
                        <Select
                          className='react-select-styled react-select-solid react-select-sm flex-grow-1'
                          options={roleOptions}
                          value={roleOptions.find(role => role.value == roleStr2Num(editUser?.role as string))}
                          onChange={value => setEditUser(users.find(user => user.id == value?.value))}
                          isClearable={false}
                          menuPlacement='auto'
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">Username:</div>
                      <div className="col-md-6">
                        <input type="text" className="form-control" value={editUser?.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setEditUser(undefined)}><i className='bi bi-trash'></i>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleEditUser}><i className='bi bi-save'></i>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </ListViewProvider>
      </QueryResponseProvider>
    </QueryRequestProvider>
  )
}
