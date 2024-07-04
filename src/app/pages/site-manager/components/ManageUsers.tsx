import { useEffect, useMemo, useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/content'
import { User } from '../../../modules/apps/user-management/users-list/core/_models';
import { KTCard, KTCardBody } from '../../../../_metronic/helpers';
import { ColumnInstance, Row, useTable } from 'react-table';
import { usersColumns } from '../../../modules/apps/user-management/users-list/table/columns/_columns';
import { CustomHeaderColumn } from '../../../modules/apps/user-management/users-list/table/columns/CustomHeaderColumn';
import { CustomRow } from '../../../modules/apps/user-management/users-list/table/columns/CustomRow';
import { UsersListPagination } from '../../../modules/apps/user-management/users-list/components/pagination/UsersListPagination';
import { UsersListLoading } from '../../../modules/apps/user-management/users-list/components/loading/UsersListLoading';
import { useListView } from '../../../modules/apps/user-management/users-list/core/ListViewProvider';
import { UsersListGrouping } from '../../../modules/apps/user-management/users-list/components/header/UsersListGrouping';
import { UsersListToolbar } from '../../../modules/apps/user-management/users-list/components/header/UserListToolbar';

export const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageNumber, setPageNumber] = useState<number>(1);
  const {selected} = useListView();
  const data = useMemo(() => users, [users]);
  const columns = useMemo(() => usersColumns, []);

  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
  })

  const fetchData = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_APP_API_URL}/users/?page=${pageNumber}&items_per_page=10`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch(error => {
        setLoading(false);
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content>
      <KTCard>
        <div className='card-header border-0 pt-6'>
          <div className='card-toolbar'>
            {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />}
          </div>
        </div>
        <KTCardBody className='py-4'>
          <div className='table-responsive'>
            <table
              id='kt_table_users'
              className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
              {...getTableProps()}
            >
              <thead>
                <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                  {headers.map((column: ColumnInstance<User>) => (
                    <CustomHeaderColumn key={column.id} column={column} />
                  ))}
                </tr>
              </thead>
              <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map((row: Row<User>, i) => {
                    prepareRow(row)
                    return <CustomRow row={row} key={`row-${i}-${row.id}`} />
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                        No matching records found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <UsersListPagination />
          {isLoading && <UsersListLoading />}
        </KTCardBody>
      </KTCard>
    </Content>
  )
}