import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { getAllOrders } from './_request'
import Select from 'react-select'

const fakeShipingType = [
  {
    "value": 1,
    "label": "Standard Shipping"
  },
  {
    "value": 2,
    "label": "Express Shipping"
  },
  {
    "value": 3,
    "label": "Overnight Shipping"
  },
  {
    "value": 4,
    "label": "International Shipping"
  }
]

const fakeAgent = [
  {
    "value": 1,
    "label": "Customer Support Agent"
  },
  {
    "value": 2,
    "label": "Sales Agent"
  },
  {
    "value": 3,
    "label": "Technical Support Agent"
  },
  {
    "value": 4,
    "label": "Order Processing Agent"
  }
]

const fakeOrders = [
  {
    "order_id": "3702703423",
    "products": [
      {
        "Name": "Product 1",
        "url": "https://example.com/product1.jpg"
      },
      {
        "Name": "Product 2",
        "url": "https://example.com/product2.jpg"
      }
    ],
    "platform": "Amazon",
    "invoice": "INV-1001",
    "delivery": "2024-06-17",
    "status": "Returned",
    "payment": "Credit Card",
    "shipping": "Standard",
    "value": 2312.03
  },
  {
    "order_id": "6698739234",
    "products": [
      {
        "Name": "Product 3",
        "url": "https://example.com/product3.jpg"
      }
    ],
    "platform": "eBay",
    "invoice": "INV-1002",
    "delivery": "2024-06-18",
    "status": "Processing",
    "payment": "PayPal",
    "shipping": "Express",
    "value": 1122
  },
  {
    "order_id": "9892667823",
    "products": [
      {
        "Name": "Product 4",
        "url": "https://example.com/product4.jpg"
      },
      {
        "Name": "Product 5",
        "url": "https://example.com/product5.jpg"
      },
      {
        "Name": "Product 6",
        "url": "https://example.com/product6.jpg"
      }
    ],
    "platform": "Shopify",
    "invoice": "INV-1003",
    "delivery": "2024-06-19",
    "status": "Completed",
    "payment": "Debit Card",
    "shipping": "Overnight",
    "value": 323.80
  },
  {
    "order_id": "1223112532",
    "products": [
      {
        "Name": "Product 7",
        "url": "https://example.com/product7.jpg"
      }
    ],
    "platform": "Etsy",
    "invoice": "INV-1004",
    "delivery": "2024-06-20",
    "status": "Canceled",
    "payment": "Bank Transfer",
    "shipping": "Standard",
    "value": 12231
  }
]

const StatusBadge = props => (
  <>
    {
      props.status == "Completed" ?
      <div>
        <span className="badge badge-light-success fw-bold fs-7 p-2">
          <i className='bi bi-check2-circle text-success fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "Canceled" ?
      <div>
        <span className="badge badge-light-danger fw-bold fs-7 p-2">
          <i className='bi bi-slash-circle text-danger fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "New" ?
      <div>
        <span className="badge badge-light-warning fw-bold fs-7 p-2">
          <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "Received" ?
      <div>
        <span className="badge badge-light-warning fw-bold fs-7 p-2">
          <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "Processing" ?
      <div>
        <span className="badge badge-light-warning fw-bold fs-7 p-2">
          <i className='bi bi-hourglass text-warning fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "Incompleted" ?
      <div>
        <span className="badge badge-light-warning fw-bold fs-7 p-2">
          <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "Returned" ?
      <div>
        <span className="badge badge-light-secondary fw-bold fs-7 p-2">
          <i className='bi bi-repeat fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "Errors" ?
      <div>
        <span className="badge badge-light-danger fw-bold fs-7 p-2">
          <i className='bi bi-x-circle text-danger fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : props.status == "Not Completed" ?
      <div>
        <span className="badge badge-light-warning fw-bold fs-7 p-2">
          <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
          {props.status}
        </span>
      </div>
      : <div>
        
      </div>
    }
  </>
)

const OrderTable = props => (
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
                  <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
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
            props.orders.map((order, index) => 
              <tr>
                <td className='align-content-center'>
                  <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                </td>
                <td className='align-content-center text-center '>
                  {
                    order.order_id
                  }
                </td>
                <td className='align-content-center text-center'>
                  <img src={order.products[0]["url"]} alt='Product'/>
                  
                </td>
                <td className='align-content-center text-center'>
                  {
                    order.platform
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
                    order.payment
                  }
                </td>
                <td className='align-content-center text-center'>
                  {
                    order.shipping
                  }
                </td>
                <td className='align-content-center text-center'>
                  {
                    order.value.toLocaleString()
                  } RON
                </td>
                <td className='align-content-center text-center'>
                  <a className='btn btn-white btn-sm p-0' onClick={() => props.setEditID(index)}>
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

const SearchBar = props => {
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
  const [shipingTypes, setShipingTypes] = useState([]);
  const [trackingNumber, setTrackngNumber] = useState('');
  const [searchText, setSearchText] = useState('');
  
  useEffect(() => {
    // getAllOrders(1)
    //   .then(res => console.log(res.data))
    setShipingTypes(fakeShipingType)
    SetOrders(fakeOrders);
  }, [])

  return (
    <Content>
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <OrderTable orders={orders} />
    </Content>
  )
}
