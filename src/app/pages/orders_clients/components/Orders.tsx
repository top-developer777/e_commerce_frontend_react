import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { getAllOrders } from './_request'
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

interface Order {
  id: number;
  image_url: string;
  delivery_mode: string;
  detailed_payment_method: string;
  status: number;
  shipping_tax: string;
}

const StatusBadge: React.FC<{ status: number }> = props => (
  <>
    {
      props.status == 2 ?
        <div>
          <span className="badge badge-light-success fw-bold fs-7 p-2">
            <i className='bi bi-check2-circle text-success fw-bold'></i>&nbsp;
            Completed
          </span>
        </div>
        : props.status == 8 ?
          <div>
            <span className="badge badge-light-danger fw-bold fs-7 p-2">
              <i className='bi bi-slash-circle text-danger fw-bold'></i>&nbsp;
              Canceled
            </span>
          </div>
          : props.status == 0 ?
            <div>
              <span className="badge badge-light-warning fw-bold fs-7 p-2">
                <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
                New
              </span>
            </div>
            : props.status == 3 ?
              <div>
                <span className="badge badge-light-warning fw-bold fs-7 p-2">
                  <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
                  Received
                </span>
              </div>
              : props.status == 1 ?
                <div>
                  <span className="badge badge-light-warning fw-bold fs-7 p-2">
                    <i className='bi bi-hourglass text-warning fw-bold'></i>&nbsp;
                    Processing
                  </span>
                </div>
                : props.status == 7 ?
                  <div>
                    <span className="badge badge-light-warning fw-bold fs-7 p-2">
                      <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
                      Incompleted
                    </span>
                  </div>
                  : props.status == 4 ?
                    <div>
                      <span className="badge badge-light-secondary fw-bold fs-7 p-2">
                        <i className='bi bi-repeat fw-bold'></i>&nbsp;
                        Returned
                      </span>
                    </div>
                    : props.status == 6 ?
                      <div>
                        <span className="badge badge-light-danger fw-bold fs-7 p-2">
                          <i className='bi bi-x-circle text-danger fw-bold'></i>&nbsp;
                          Errors
                        </span>
                      </div>
                      : props.status == 5 ?
                        <div>
                          <span className="badge badge-light-warning fw-bold fs-7 p-2">
                            <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
                            Not Completed
                          </span>
                        </div>
                        : <div>

                        </div>
    }
  </>
)

const OrderTable: React.FC<{
  orders: Order[],
  setEditID?: React.Dispatch<React.SetStateAction<number>>,
}> = props => {
  const handleEdit = (id: number) => {
    if (props.setEditID) {
      props.setEditID(id);
    }
  }
  return (
    <>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div className='d-flex flex-row '>
          <button type='button' className='btn btn-light p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <button type='button' className='btn btn-light p-2 px-3 mx-1 fs-7'>
            1
          </button>
          <button type='button' className='btn btn-light p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-chevron-double-right"></i>
          </button>
          <div className='align-content-center mx-10'>
            Total: {
              4
            }
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <div>
        <table className="table table-rounded table-row-bordered border gy-7 gs-7">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th className='align-content-center'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              </th>
              <th className='col-md-1 align-content-center text-center'>Order ID</th>
              <th className='col-md-1 align-content-center text-center'>Products</th>
              <th className='col-md-1 align-content-center text-center'>Platform</th>
              <th className='col-md-2 align-content-center text-center px-1'>Invoice</th>
              <th className='col-md-2 align-content-center text-center px-1'>Delivery</th>
              <th className='col-md-1 align-content-center text-center'>Status</th>
              <th className='col-md-1 align-content-center text-center py-0'>Payment Method</th>
              <th className='col-md-1 align-content-center text-center py-0'>Shipping Method</th>
              <th className='col-md-1 align-content-center text-center'>Total Value</th>
              <th className='col-md-1 align-content-center text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              props.orders.map((order: Order, index: number) =>
                <tr>
                  <td className='align-content-center'>
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                  </td>
                  <td className='align-content-center text-center '>
                    {
                      order.id
                    }
                  </td>
                  <td className='align-content-center text-center'>
                    <img src={order.image_url} alt='Product' />

                  </td>
                  <td className='align-content-center text-center'>
                    {
                      order.delivery_mode
                    }
                  </td>
                  <td className='align-content-center text-center'>
                    <button type='button' className='btn btn-light btn-light-primary p-1 px-3'>
                      <i className="bi bi-file-earmark-plus"></i>
                      Quick Create
                    </button>
                  </td>
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
                    {
                      order.detailed_payment_method
                    }
                  </td>
                  <td className='align-content-center text-center'>
                    {
                      order.shipping_tax
                    }
                  </td>
                  <td className='align-content-center text-center'>
                    {
                      order.shipping_tax.toLocaleString()
                    } RON
                  </td>
                  <td className='align-content-center text-center'>
                    <a className='btn btn-white btn-sm p-0' onClick={() => handleEdit(index)}>
                      <i className="bi bi-pencil-square fs-3 p-1"></i>
                    </a>
                  </td>
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
  searchText: string,
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
}> = props => {
  return (
    <div>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7 fs-7'>
            <i className="bi bi-circle fs-8"></i>
            Not Completed
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7 fs-7'>
            <i className="bi bi-slash-circle fs-8"></i>
            Canceled
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7'>
            <i className="bi bi-file-earmark-plus fs-8"></i>
            New
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7'>
            <i className="bi bi-stack fs-8"></i>
            Received
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7'>
            <i className="bi bi-hourglass fs-8"></i>
            Processing
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7'>
            <i className="bi bi-check2-circle fs-8"></i>
            Completed
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7'>
            <i className="bi bi-circle fs-8"></i>
            Incomplete
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7'>
            <i className="bi bi-repeat fs-8"></i>
            Returned
          </button>
          <button type='button' className='btn btn-light p-1 px-3 mx-1 fs-7'>
            <i className="bi bi-x-circle fs-8"></i>
            Errors
          </button>
        </div>
        <button type='button' className='btn btn-light btn-light-primary p-1 px-3 mx-1'>
          <i className="bi bi-search"></i>
          Advanced Search
        </button>
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
  const [orders, SetOrders] = useState([])
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllOrders(1)
      .then(async res => {
        SetOrders(res.data)
      })
  }, [])

  return (
    <Content>
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <OrderTable orders={orders} />
    </Content>
  )
}
