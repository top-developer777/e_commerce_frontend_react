import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { getAllProducts } from './_request'
import { SalesInformation } from './SalesInform'
import { OrdersInformation } from './OrdersInform'

const Pagination = (props) => {
  return (
    <div className='pagination'>

    </div>
  )
}

const fakeShipments = [
  {
    "shipment_id": "SH123456",
    "shipment_name": "Electronics Batch 1",
    "destination": "New York, USA",
    "last_updated": "2024-06-10T15:30:00Z",
    "created": "2024-06-05T10:00:00Z",
    "qty_shipped": 500,
    "qty_received": 450,
    "shipment_status": "In Transit"
  },
  {
    "shipment_id": "SH789012",
    "shipment_name": "Furniture Batch 3",
    "destination": "Los Angeles, USA",
    "last_updated": "2024-06-12T12:00:00Z",
    "created": "2024-06-08T09:00:00Z",
    "qty_shipped": 300,
    "qty_received": 300,
    "shipment_status": "Delivered"
  }
]

const fakeReturns = [
  {
    "return_type": "Damaged Item",
    "quantity": 10,
    "rate": 66.7,
    "summary": "150 units returned due to defects",
  },
  {
    "return_type": "Defective Item",
    "quantity": 5,
    "rate": 33.3,
    "summary": "Entire shipment returned due to incorrect specifications",
  }
]

const fakeSeriesSales = [
  {
    name: 'Sales',
    data: [0, 0, 0, 25, 78, 0, 50, 0, 25, 25, 0, 27],
  }
]

const fakeCategoriesSales = ['19/05/2024', '21/05/2024', '23/05/2024', '25/05/2024', '27/05/2024', '29/05/2024', '31/05/2024', '02/06/2024', '04/06/2024', '06/06/2024', '08/06/2024', '10/06/2024']

const fakeSeriesOrders = [
  {
    name: 'average',
    data: [1.6, 1.8, 1.2, 1.3, 1.9, 1.8, 2.2, 2.3, 1.9, 1.2, 1.8, 1.6],
  },
]

const fakeCategoriesOrders = ['19/05/2024', '21/05/2024', '23/05/2024', '25/05/2024', '27/05/2024', '29/05/2024', '31/05/2024', '02/06/2024', '04/06/2024', '06/06/2024', '08/06/2024', '10/06/2024']

const ReturnsInformation = props => {
  return (
    <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
      <div className="card-header pt-4 w-full">
        <div>
          <h3 className="text-gray-800 card-title align-content-center">Order Dashboard</h3>
        </div>
        <div>
        </div>
      </div>
      <div className="card-body p-6">
        <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th className='col-md-2 text-center'>Return Type</th>
              <th className='col-md-1 text-center'>Return Rate</th>
              <th className='col-md-7'>Summary</th>
              <th className='col-md-3 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              props.returns.map((_return, index) => 
                <tr key={index}>
                  <td className='align-content-center text-center'>
                    {
                      _return.return_type
                    }
                  </td>
                  <td className='align-content-center text-center'>
                    {
                      _return.rate
                    } %<br />
                    {
                      _return.quantity
                    } Complaint
                  </td>
                  <td className='align-content-center'>
                    {
                      _return.summary
                    }
                  </td>
                  <td className='align-content-center text-center'>
                    <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-150px">
                      See Details
                    </button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

const ShipmentInformation = props => {
  return (
    <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
      <div className="card-header pt-4 w-full">
        <div>
          <h3 className="text-gray-800 card-title align-content-center">Shipment Information</h3>
        </div>
        <div>
          
        </div>
      </div>
      <div className="card-body p-6">
        <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover">
          <thead>
              <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                <th className='col-md-1'>Shipment ID</th>
                <th className='col-md-2'>Shipment Name</th>
                <th className='col-md-2'>Destination</th>
                <th className='col-md-2'>Last Updated</th>
                <th className='col-md-2'>Created</th>
                <th className='col-md-2'>Qty Shipped</th>
                <th className='col-md-2'>Qty Received</th>
                <th className='col-md-2'>Shipment Status</th>
              </tr>
          </thead>
          <tbody>
            {
              props.shipments.map((shipment, index) => 
                <tr key={index}>
                  <td className='align-content-center'>
                    {
                      shipment.shipment_id
                    }
                  </td>
                  <td className='align-content-center'>
                    {
                      shipment.shipment_name
                    }
                  </td>
                  <td className='align-content-center'>
                    {
                      shipment.destination
                    }
                  </td>
                  <td className='align-content-center'>
                    {
                      shipment.last_updated
                    }
                  </td>
                  <td className='align-content-center'>
                    {
                      shipment.created
                    }
                  </td>
                  <td className='align-content-center'>
                    {
                      shipment.qty_shipped
                    }
                  </td>
                  <td className='align-content-center'>
                    {
                      shipment.qty_received
                    }
                  </td>
                  <td className='align-content-center'>
                    {
                      shipment.shipment_status
                    }
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

const DetailedProduct = props => {
  const [shipments, setShipments] = useState([]);
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    setShipments(fakeShipments)
    setReturns(fakeReturns)
  }, [])

  return (
    <div>
      <SalesInformation className='card-xl-stretch mb-5 mb-xl-8' series={JSON.stringify(fakeSeriesSales)} categories={JSON.stringify(fakeCategoriesSales)} />
      <OrdersInformation className='card-xl-stretch mb-5 mb-xl-8' series={JSON.stringify(fakeSeriesOrders)} categories={JSON.stringify(fakeCategoriesOrders)} />
      <ReturnsInformation returns={returns} />
      <ShipmentInformation shipments={shipments} />
    </div>
  )
}

export function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    getAllProducts(currentPage, limit)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.log(err))
  }, []);

  return (
    <Content>
      {
        selectedProductID == -1 ?
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
                2
              </button>
              <button type='button' className='btn btn-light p-2 px-3 mx-1 fs-7'>
                3
              </button>
              <button type='button' className='btn btn-light p-2 px-3 mx-1 fs-7'>
                ...
              </button>
              <button type='button' className='btn btn-light p-2 px-3 mx-1 fs-7'>
                11
              </button>
              <button type='button' className='btn btn-light p-2 px-3 mx-1 fs-7'>
                <i className="bi bi-chevron-double-right"></i>
              </button>
              <div className='align-content-center mx-10'>
                Total: {
                  573
                }
              </div>
            </div>
            <div>
              <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
                <i className="bi bi-cart-plus"></i>
                Add Product
              </button>
            </div>
          </div>
          <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover">
            <thead>
                <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                    <th style={{width: '100px'}}><div className="form-check form-check-custom form-check-solid">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                    </div></th>
                    <th className='col-md-1'>Photo</th>
                    <th className='col-md-8'>Name</th>
                    <th className='col-md-2'>Price / Stock</th>
                    <th className='col-md-2'>Status</th>
                </tr>
            </thead>
            <tbody>
              {
                products.map((product, index) => 
                  <tr key={index} onClick={() => setSelectedProductID(index)}>
                    <td className='align-content-center'>
                      <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                    </td>
                    <td className='align-content-center'>
                      {
                        JSON.parse(product.images).length > 0 ? <img width={80} height={80} src={JSON.parse(product.images)[0]["url"]} alt={product.name} />
                        : 
                        <div>
                          No Image
                        </div>
                      }
                    </td>
                    <td className='align-content-center py-0'>
                      <div className='row mb-2'>
                        <div className='col-md-1 text-gray-800 fw-bold'>
                          Name: 
                        </div>
                        <div className='col-md-11 text-gray-800 fw-bold'>
                          {product.name} 
                        </div>
                      </div>
                      <div className='row mb-4'>
                        <div className='col-md-1 text-gray-800 fw-bold'>
                          Brand: 
                        </div>
                        <div className='col-md-1 text-gray-900 fw-bold'>
                          {product.brand}
                        </div>
                      </div>
                      <div className='row mb-2'>
                        <div className='col-md-4'>
                          <div className='row'>
                            <div className='col-md-5 text-gray-800 fw-bold'>
                              Part Number: 
                            </div>
                            <div className='col-md-4 text-gray-800 fw-bold'>
                              {product.part_number}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-8'>
                          <div className='row'>
                            <div className='col-md-3 text-gray-800 fw-bold'>
                              Part Number Key:
                            </div>
                            <div className='col-md-4 text-gray-800 fw-bold'>
                              {product.part_number_key}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='align-content-center'>
                      <div className='row mb-2'>
                        {product.sale_price} {product.currency}
                      </div>
                      <div className='row mb-2'>
                        Stock: {JSON.parse(product.stock)[0]["value"]}
                      </div>
                    </td>
                    <td className='align-content-center'>
                      <div className="form-check form-switch form-check-custom form-check-solid">
                        <input className="form-check-input" type="checkbox" value="" id="flexSwitchChecked" checked="checked" />
                      </div>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </>
        :
        <>
          <DetailedProduct product={products[selectedProductID]} />
        </>
      }
    </Content>
  )
}