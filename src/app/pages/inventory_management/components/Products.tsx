import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { getAllProducts, getFilteredProducts } from './_request'
import { SalesInformation } from './SalesInform'
import { OrdersInformation } from './OrdersInform'
import { Product } from '../../models/product'

// const Pagination = (props) => {
//   return (
//     <div className='pagination'>

//     </div>
//   )
// }

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

interface Return {
  return_type: string;
  rate: number;
  quantity: number;
  summary: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

const ReturnsInformation: React.FC<{
  returns: Return[];
}> = props => {
  return (
    <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
      <div className="card-header pt-4 w-full">
        <div>
          <h3 className="text-gray-800 card-title align-content-center">Return Dashboard</h3>
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

interface Shipment {
  shipment_id: string;
  shipment_name: string;
  destination: string;
  last_updated: string;
  created: string;
  qty_shipped: number;
  qty_received: number;
  shipment_status: string;
}

const ShipmentInformation: React.FC<{
  shipments: Shipment[];
}> = props => {
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
                <tr key={`inventorycalcproductlist${index}`}>
                  <td className='align-content-center'>{shipment.shipment_id}</td>
                  <td className='align-content-center'>{shipment.shipment_name}</td>
                  <td className='align-content-center'>{shipment.destination}</td>
                  <td className='align-content-center'>{shipment.last_updated}</td>
                  <td className='align-content-center'>{shipment.created}</td>
                  <td className='align-content-center'>{shipment.qty_shipped}</td>
                  <td className='align-content-center'>{shipment.qty_received}</td>
                  <td className='align-content-center'>{shipment.shipment_status}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DetailedProduct: React.FC<{ product: Product, setSelectedProductID: React.Dispatch<React.SetStateAction<number>> }> = ({ product, setSelectedProductID }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);

  useEffect(() => {
    setShipments(fakeShipments)
    setReturns(fakeReturns)
  }, []);

  return (
    <div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type='button' className='btn btn-light btn-light-primary btn-pull-right p-2 px-3 mx-1 fs-7' onClick={() => setSelectedProductID(-1)}>
          <i className="bi bi-backspace-fill"></i> Back to Product List
        </button>
      </div>
      <div className="card mb-5">
        <div className='card-header border-0 pt-3'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Product Information</span>
          </h3>
        </div>
        <div className='card-body py-0'>
          <div className="row">
            <div className="col-md-12"><a href={`https://amazon.com/dp/${product.model_name}}`} target='_blank'>https://amazon.com/dp/${product.model_name}</a></div>
          </div>
          <div className="row py-2">
            <div className="col-md-4 fw-bold">Price: {formatCurrency(parseFloat(product.price))}</div>
            <div className="col-md-4">Variation Name: {product.variation_name_1688}</div>
            <div className="col-md-4">PCS/CTN: {product.pcs_ctn}</div>
          </div>
          <div className="row py-2">
            <div className="col-md-4">Weight: {product.weight}</div>
            <div className="col-md-4">Dimensions: {product.dimensions}</div>
            <div className="col-md-4">Supplier: <a href="#">WeChat {product.supplier_id}</a></div>
          </div>
        </div>
      </div>
      <SalesInformation className='card-xl-stretch mb-5 mb-xl-8' series={JSON.stringify(fakeSeriesSales)} product={product} categories={JSON.stringify(fakeCategoriesSales)} />
      <OrdersInformation className='card-xl-stretch mb-5 mb-xl-8' product={product} />
      <ReturnsInformation returns={returns} />
      <ShipmentInformation shipments={shipments} />
    </div>
  )
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedProductID, setSelectedProductID] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [checkedMethods, setCheckedMethods] = useState<string[]>(['Train', 'Airplain', 'Ship']);
  const [weight, setWeight] = useState<{ from: string, to: string }>({ from: '0', to: '1' });
  const [vWeight, setVWeight] = useState<{ from: string, to: string }>({ from: '0', to: '1' });

  useEffect(() => {
    getAllProducts()
      .then(res => {
        setProducts(res.data);
        setTotalProducts(res.data.length);
        setTotalPages(res.data.length ? Math.ceil(res.data.length / limit) : 1);
      })
      .catch(err => console.log(err))
  }, [limit]);


  const handleFilterProduct = () => {
    const w = { from: parseFloat(weight.from), to: parseFloat(weight.to) };
    const v = { from: parseFloat(vWeight.from), to: parseFloat(vWeight.to) };
    if (!Number.isNaN(w.from && w.to && v.from && v.to) && w.from > w.to || v.from > v.to) return;
    let shippingType = checkedMethods.join('%2C');
    shippingType = shippingType.replace('Train', '1');
    shippingType = shippingType.replace('Airplain', '2');
    shippingType = shippingType.replace('Ship', '3');
    getFilteredProducts(shippingType, w.from, w.to, v.from, v.to)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.log(err))
  }
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    pageNumbers.push(
      <button key='page1' type='button' className={`btn ${currentPage === 1 ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(1)}>1</button>
    );
    if (startPage > 2) {
      pageNumbers.push(<>...</>);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button key={`page${i}`} type='button' className={`btn ${currentPage === i ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(i)}>{i}</button>
      );
    }
    if (endPage < totalPages - 1) {
      pageNumbers.push(<>...</>);
    }
    if (totalPages > 1) {
      pageNumbers.push(
        <button key={`page${totalPages}`} type='button' className={`btn ${currentPage === totalPages ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      );
    }
    return pageNumbers;
  }
  const handleChangeMethods = () => {
    const inputs = document.querySelectorAll('.method-panel li input[type="checkbox"]') as unknown as HTMLInputElement[];
    const checkedMethods = [];
    if (inputs) for (const input of inputs) {
      if (input.checked) checkedMethods.push(input.value);
    }
    setCheckedMethods(checkedMethods);
  }

  return (
    <Content>
      {
        selectedProductID == -1 ?
          <>
            <div className="row py-2">
              <div className="col-md-4">
                <div className="dropdown">
                  <div data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                    <input type="text" className="form-control" placeholder="Select shipping type" readOnly value={checkedMethods.join(', ')} />
                  </div>
                  <form className="dropdown-menu p-4 w-100">
                    <ul className="list-group method-panel">
                      {['Train', 'Airplain', 'Ship'].map((item, index) => (
                        <li className="list-group-item" key={`method${index}`}>
                          <label className='d-flex align-items-center cursor-pointer'>
                            <div className="d-flex pe-3">
                              <input type="checkbox" value={item} defaultChecked={true} onChange={handleChangeMethods} />
                            </div>
                            <div className="d-flex text-nowrap ps-3 flex-column">{item}</div>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </form>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dropdown">
                  <div data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                    <input type="text" className="form-control" readOnly value={`${weight.from} ~ ${weight.to} kg`} />
                  </div>
                  <form className="dropdown-menu p-4" style={{ width: '150%' }}>
                    <div className="d-flex align-items-stretch flex-wrap w-100 h-100 weight-panel">
                      <div className="d-flex align-items-center" style={{ width: '39%' }}>
                        <input type="number" className='form-control' value={weight.from} onChange={(e) => setWeight({ ...weight, from: e.target.value })} />
                      </div>
                      <div className="d-flex align-items-center px-1 m-auto">~</div>
                      <div className="d-flex align-items-center" style={{ width: '39%' }}>
                        <input type="number" className='form-control' value={weight.to} onChange={(e) => setWeight({ ...weight, to: e.target.value })} />
                      </div>
                      <div className="d-flex align-items-center ps-1 m-auto">kg</div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dropdown">
                  <div data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                    <input type="text" className="form-control" readOnly value={`${vWeight.from} ~ ${vWeight.to} kg`} />
                  </div>
                  <form className="dropdown-menu p-4" style={{ width: '150%' }}>
                    <div className="d-flex align-items-stretch flex-wrap w-100 h-100 vWeight-panel">
                      <div className="d-flex align-items-center" style={{ width: '39%' }}>
                        <input type="number" className='form-control' value={vWeight.from} onChange={(e) => setVWeight({ ...vWeight, from: e.target.value })} />
                      </div>
                      <div className="d-flex align-items-center px-1 m-auto">~</div>
                      <div className="d-flex align-items-center" style={{ width: '39%' }}>
                        <input type="number" className='form-control' value={vWeight.to} onChange={(e) => setVWeight({ ...vWeight, to: e.target.value })} />
                      </div>
                      <div className="d-flex align-items-center ps-1 m-auto">kg</div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-2 align-content-center">
                <button type='button' className='btn btn-primary' onClick={handleFilterProduct}>
                  <i className="bi bi-funnel"></i>
                  Filter
                </button>
              </div>
            </div>
            <div className='d-flex flex-row justify-content-between mb-4'>
              <div className='d-flex flex-row '>
                <button type='button' key={-1} className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <i className="bi bi-chevron-double-left"></i>
                </button>
                {renderPageNumbers()}
                <button type='button' key="+1" className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <i className="bi bi-chevron-double-right"></i>
                </button>
                <div className='align-content-center mx-10'>
                  Total: {totalProducts}
                </div>
              </div>
            </div>
            <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover">
              <thead>
                <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                  <th style={{ width: '100px' }}><div className="form-check form-check-custom form-check-solid">
                    <input className="form-check-input" type="checkbox" value="" />
                  </div></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock (Days Left in Stock)</th>
                  <th>Barcode Title</th>
                  <th>Masterbox Title</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((product, index) => {
                    if (index < (currentPage - 1) * limit) return;
                    if (index > currentPage * limit) return;
                    return (
                      <tr key={`product${index}`}>
                        <td className='align-content-center'>
                          <input className="form-check-input" type="checkbox" value={index} />
                        </td>
                        <td className='align-content-center'>
                          <div className="d-flex">
                            <div className="d-flex align-items-center" onClick={() => setSelectedProductID(index)}>
                              {
                                product.image_link
                                  ? <img className='rounded-2' width={60} height={60} src={product.image_link} alt={product.product_name} />
                                  : <div> No Image </div>
                              }
                            </div>
                            <div className="d-flex flex-column ms-2">
                              <div className="d-flex align-items-center">
                                <span className='d-flex'><a href={`https://amazon.com/dp/${product.model_name}`} target='_blank'>{product.model_name}</a></span>
                              </div>
                              <div className="d-flex" onClick={() => setSelectedProductID(index)}>{product.product_name}</div>
                              <div className="d-flex"><a href={product.link_address_1688} target='_blank'>1688 Link</a></div>
                            </div>
                          </div>
                        </td>
                        <td className='align-content-center' onClick={() => setSelectedProductID(index)}>{formatCurrency(parseFloat(product.price))}</td>
                        <td className='align-content-center' onClick={() => setSelectedProductID(index)}>{product.stock} ({product.day_stock} days)</td>
                        <td className='align-content-center' onClick={() => setSelectedProductID(index)}>{product.barcode_title}</td>
                        <td className='align-content-center' onClick={() => setSelectedProductID(index)}>{product.masterbox_title}</td>
                        {/* <td className='align-content-center'>
                        <div className="form-check form-switch form-check-custom form-check-solid">
                          <input className="form-check-input" type="checkbox" value="" id="flexSwitchChecked" defaultChecked={true} readOnly={true} />
                        </div>
                      </td> */}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </>
          :
          <>
            <DetailedProduct product={products[selectedProductID]} setSelectedProductID={setSelectedProductID} />
          </>
      }
    </Content>
  )
}