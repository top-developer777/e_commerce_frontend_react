import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
// import { useAuth } from '../../../modules/auth';
import { getAllOrders, getOrderAmout } from './_request'
import { Order } from '../../models/order';
import { getAllProducts } from '../../inventory_management/components/_request';
import { Product } from '../../models/product';
// import Select from 'react-select'
// import { getProductImageByID } from '../../inventory_management/components/_request'

// const fakeShipingType = [
//   {
//     "value": 1,
//     "label": "Standard Shipping"
//   },
//   {
//     "value": 2,
//     "label": "Express Shipping"
//   },
//   {
//     "value": 3,
//     "label": "Overnight Shipping"
//   },
//   {
//     "value": 4,
//     "label": "International Shipping"
//   }
// ]

const StatusBadge: React.FC<{ status: number }> = props => (
  <>
    {props.status === 0
      ? <div>
        <span className="badge badge-secondary fw-bold fs-7 p-2">
          <i className='bi bi-slash-circle fw-bold'></i>&nbsp;
          Canceled
        </span>
      </div>
      : props.status === 1
        ? <div>
          <span className="badge badge-light-info fw-bold fs-7 p-2">
            <i className='bi bi-file-earmark-plus text-info fw-bold'></i>&nbsp;
            New
          </span>
        </div>
        : props.status == 2
          ? <div>
            <span className="badge badge-light-primary fw-bold fs-7 p-2">
              <i className='bi bi-hourglass text-primary fw-bold'></i>&nbsp;
              In progress
            </span>
          </div>
          : props.status == 3
            ? <div>
              <span className="badge badge-light-success fw-bold fs-7 p-2">
                <i className='bi bi-check2-circle text-success fw-bold'></i>&nbsp;
                Prepared
              </span>
            </div>
            : props.status === 4
              ? <div>
                <span className="badge badge-light-warning fw-bold fs-7 p-2">
                  <i className='bi bi-stack text-warning fw-bold'></i>&nbsp;
                  Finalized
                </span>
              </div>
              : props.status == 5
                ? <div>
                  <span className="badge badge-light-danger fw-bold fs-7 p-2">
                    <i className='bi bi-repeat text-danger fw-bold'></i>&nbsp;
                    Returned
                  </span>
                </div>
                : <div>

                </div>
    }
  </>
)

const OrderTable: React.FC<{
  orders: Order[],
  currentPage: number,
  totalPages: number,
  totalOrders: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setEditID?: React.Dispatch<React.SetStateAction<number>>,
}> = props => {
  const { currentPage, setCurrentPage } = props;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts()
      .then(res => setProducts(res.data))
      .catch(e => console.error(e))
  }, []);

  // const { currentUser } = useAuth();
  // const handleEdit = (id: number) => {
  //   if (props.setEditID) {
  //     props.setEditID(id);
  //   }
  // }
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(props.totalPages - 1, currentPage + 2);
    pageNumbers.push(
      <button key='page1' type='button' className={`btn ${currentPage === 1 ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(1)}>1</button>
    );
    if (startPage > 2) {
      pageNumbers.push(<span key='start-elipsis'>...</span>);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button key={`page${i}`} type='button' className={`btn ${currentPage === i ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(i)}>{i}</button>
      );
    }
    if (endPage < props.totalPages - 1) {
      pageNumbers.push(<span key='end-elipsis'>...</span>);
    }
    if (props.totalPages > 1) {
      pageNumbers.push(
        <button key={`page${props.totalPages}`} type='button' className={`btn ${currentPage === props.totalPages ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(props.totalPages)}>{props.totalPages}</button>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div className='d-flex flex-row '>
          <button type='button' key={-1} className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="bi bi-chevron-double-left"></i>
          </button>
          {renderPageNumbers()}
          <button type='button' key="+1" className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === props.totalPages}>
            <i className="bi bi-chevron-double-right"></i>
          </button>
          <div className='align-content-center mx-10'>
            Total: {props.totalOrders}
          </div>
        </div>
        {/* <div>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-cart-plus"></i>
            Add Order
          </button>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-repeat"></i>
            Add to process group
          </button>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-tags"></i>
            Tags
          </button>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-activity"></i>
            Actions
          </button>
        </div> */}
      </div>
      <div>
        <table className="table table-rounded table-row-bordered border gy-7 gs-7">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              {/* <th className='align-content-center'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              </th> */}
              <th className='col-md-1 align-content-center text-center'>Order ID</th>
              <th className='col-md-1 align-content-center text-center'>Products</th>
              <th className='col-md-1 align-content-center text-center'>Marketplace</th>
              {/* <th className='col-md-2 align-content-center text-center px-1'>Invoice</th> */}
              <th className='col-md-2 align-content-center text-center px-1'>AWB</th>
              <th className='col-md-1 align-content-center text-center'>Status</th>
              <th className='col-md-1 align-content-center text-center py-0'>Payment Method</th>
              <th className='col-md-1 align-content-center text-center py-0'>Shipping Tax</th>
              <th className='col-md-1 align-content-center text-center'>Customer</th>
              {/* {currentUser && parseInt(currentUser.role ?? '') > 2 && (
                <th className='col-md-1 align-content-center text-center'>Actions</th>
              )} */}
            </tr>
          </thead>
          <tbody>
            {
              props.orders.map((order: Order, index: number) =>
                <tr key={`order${index}`}>
                  {/* <td className='align-content-center'>
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                  </td> */}
                  <td className='align-content-center text-center '>{order.id}</td>
                  <td className='align-content-center text-center'>
                    {order.product_id.map(id => {
                      const product = products.find(product => product.id === id);
                      return <div key={`product${order.id}:${id}`}><a href='#'><img width={40} src={product?.image_link} alt={product?.model_name} /></a></div>
                    })}
                  </td>
                  <td className='align-content-center text-center'>
                    {order.market_place}
                  </td>
                  {/* <td className='align-content-center text-center'>
                    <button type='button' className='btn btn-light btn-light-primary p-1 px-3'>
                      <i className="bi bi-file-earmark-plus"></i>
                      Quick Create
                    </button>
                  </td> */}
                  <td className='align-content-center text-center'>
                    <button type='button' className='btn btn-light btn-light-primary p-1 px-3'>
                      <i className="bi bi-file-earmark-plus"></i>
                      Quick Create
                    </button>
                  </td>
                  <td className='align-content-center text-center'>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className='align-content-center text-center'>
                    {order.payment_mode}
                  </td>
                  <td className='align-content-center text-center'>
                    {order.shipping_tax}
                  </td>
                  <td className='align-content-center text-center'>
                    {order.customer_id}
                  </td>
                  {/* {currentUser && [3, 4].includes(parseInt(currentUser.role ?? '')) && (
                    <td className='align-content-center text-center'>
                      {(currentUser.role == '3' && [2, 3].includes(order.status)) ? '' : (
                        <a className='btn btn-white btn-sm p-0' onClick={() => handleEdit(index)}>
                          <i className="bi bi-pencil-square fs-3 p-1"></i>
                        </a>
                      )}
                    </td>
                  )} */}
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

const SearchBar: React.FC<{
  selectedStatus: number,
  searchText: string,
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
  setSelectedStatus: React.Dispatch<React.SetStateAction<number>>,
}> = props => {
  const handleChangeStatus = (status: number) => {
    if (status === props.selectedStatus) {
      props.setSelectedStatus(-1);
    } else {
      props.setSelectedStatus(status);
    }
  }
  return (
    <div>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div>
          <button type='button' className={`btn btn-secondary fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 0 ? ' active' : ''}`} onClick={() => handleChangeStatus(0)}>
            <i className="bi bi-slash-circle"></i>
            Canceled
          </button>
          <button type='button' className={`btn btn-light-info fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 1 ? ' active' : ''}`} onClick={() => handleChangeStatus(1)}>
            <i className="bi bi-file-earmark-plus"></i>
            New
          </button>
          <button type='button' className={`btn btn-light-primary fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 2 ? ' active' : ''}`} onClick={() => handleChangeStatus(2)}>
            <i className="bi bi-hourglass"></i>
            In progress
          </button>
          <button type='button' className={`btn btn-light-success fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 3 ? ' active' : ''}`} onClick={() => handleChangeStatus(3)}>
            <i className="bi bi-check2-circle"></i>
            Prepared
          </button>
          <button type='button' className={`btn btn-light-warning fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 4 ? ' active' : ''}`} onClick={() => handleChangeStatus(4)}>
            <i className="bi bi-stack"></i>
            Finalized
          </button>
          <button type='button' className={`btn btn-light-danger fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 5 ? ' active' : ''}`} onClick={() => handleChangeStatus(5)}>
            <i className="bi bi-repeat"></i>
            Returned
          </button>
        </div>
        {/* <button type='button' className='btn btn-light btn-light-primary p-1 px-3 mx-1'>
          <i className="bi bi-search"></i>
          Advanced Search
        </button> */}
      </div>
      <div className='mb-4'>
        <input
          type="text"
          className="form-control form-control-solid py-1"
          placeholder="Search..."
          value={props.searchText}
          onChange={e => props.setSearchText(e.target.value)}
        />
      </div>
    </div>
  )
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState<number>(50);
  const [selectedStatus, setSelectedStatus] = useState<number>(-1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [currentState, setCurrentState] = useState<[number, string]>([-1, ''])

  useEffect(() => {
    getOrderAmout()
      .then(res => {
        setTotalOrders(res.data);
        setTotalPages(res.data > 0 ? Math.floor(res.data / limit) : 1);
      })
  }, [limit]);
  useEffect(() => {
    if (currentState[0] !== selectedStatus || currentState[1] !== searchText) {
      setCurrentState([selectedStatus, searchText]);
      setCurrentPage(1);
    }
    getAllOrders(currentPage, limit)
      .then(async res => {
        setOrders(res.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, selectedStatus, searchText]);

  return (
    <Content>
      <SearchBar searchText={searchText} setSearchText={setSearchText} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
      <OrderTable orders={orders} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} totalOrders={totalOrders} />
    </Content>
  )
}
