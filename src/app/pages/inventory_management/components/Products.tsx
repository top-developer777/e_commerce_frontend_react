import { useEffect, useState } from 'react'
import Select from 'react-select';
import { Content } from '../../../../_metronic/layout/components/content'
import { getAllProducts } from './_request'
import { SalesInformation } from './SalesInform'
import { OrdersInformation } from './OrdersInform'
import { Product } from '../../models/product'
import { darkModeStyles } from '../../../../_metronic/partials';

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
      <div className="card-header pt-6 w-full">
        <div>
          <h3 className="text-gray-800 card-title align-content-center fw-bold">Return Dashboard</h3>
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
                <tr key={`invenvReturns${index}`}>
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
      <div className="card-header pt-6 w-full">
        <div>
          <h3 className="text-gray-800 card-title align-content-center fw-bold">Shipment Information</h3>
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
                <tr key={`inventorycalcshipmentlist${index}`}>
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
    setShipments([])
    setReturns([])
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
      <SalesInformation className='card-xl-stretch mb-5 mb-xl-8' product={product} />
      <OrdersInformation className='card-xl-stretch mb-5 mb-xl-8' product={product} orders={[]} />
      <ReturnsInformation returns={returns} />
      <ShipmentInformation shipments={shipments} />
    </div>
  )
}

interface CalculateProduct extends Product {
  sales_per_day: number;
  quantity: number;
  stock_imports: string[];
  type: number;
  imports_stock: string[];
  days_stock: number[];
}

const ShipmentType: React.FC<{ type: number }> = ({ type }) => {
  switch (type) {
    case 1:
      return <span className='fs-1' title='Air'>🛫</span>
    case 2:
      return <span className='fs-1' title='Train'>🚆</span>
    case 3:
      return <span className='fs-1' title='Sea'>🚢</span>
    default:
      return <span className='fs-1' title='All'>❌</span>
  }
}

export function Products() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [products, setProducts] = useState<CalculateProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedProductID, setSelectedProductID] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState<number>(0);
  // const [checkedMethods, setCheckedMethods] = useState<string[]>(['Train', 'Airplain', 'Ship']);
  // const [weight, setWeight] = useState<{ from: string, to: string }>({ from: '0', to: '1' });
  // const [vWeight, setVWeight] = useState<{ from: string, to: string }>({ from: '0', to: '1' });
  const shippingMethods: { value: number, label: string }[] = [{ value: 0, label: 'All' }, { value: 1, label: 'Air' }, { value: 2, label: 'Train' }, { value: 3, label: 'Sea' }];
  const [checkedMethod, setCheckedMethod] = useState<number>(0);
  const [stockDays, setStockDays] = useState<number>(0);
  const [importStock, setImportStock] = useState<number>(0);

  setInterval(() => {
    if (localStorage.getItem('kt_theme_mode_value') === 'dark') setIsDarkMode(true);
    else setIsDarkMode(false);
  }, 100);
  useEffect(() => {
    getAllProducts()
      .then(res => {
        setProducts(res.data);
        setTotalProducts(res.data.length);
        setTotalPages(res.data.length ? Math.ceil(res.data.length / limit) : 1);
      })
      .catch(err => console.error(err))
  }, [limit]);


  // const handleFilterProduct = () => {
  //   const w = { from: parseFloat(weight.from), to: parseFloat(weight.to) };
  //   const v = { from: parseFloat(vWeight.from), to: parseFloat(vWeight.to) };
  //   if (!Number.isNaN(w.from && w.to && v.from && v.to) && w.from > w.to || v.from > v.to) return;
  //   let shippingType = checkedMethods.join('%2C');
  //   shippingType = shippingType.replace('Train', '1');
  //   shippingType = shippingType.replace('Airplain', '2');
  //   shippingType = shippingType.replace('Ship', '3');
  //   getFilteredProducts(shippingType, w.from, w.to, v.from, v.to)
  //     .then(res => {
  //       setProducts(res.data);
  //       setTotalProducts(res.data.length);
  //       setTotalPages(res.data.length ? Math.ceil(res.data.length / limit) : 1);
  //     })
  //     .catch(err => console.log(err))
  // }
  const handleFilterProduct = () => {
    getAllProducts(checkedMethod, stockDays, importStock)
      .then(res => {
        setProducts(res.data);
        setTotalProducts(res.data.length);
        setTotalPages(res.data.length ? Math.ceil(res.data.length / limit) : 1);
      })
      .catch(err => console.error(err))
  }
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
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
    if (endPage < totalPages - 1) {
      pageNumbers.push(<span key='end-elipsis'>...</span>);
    }
    if (totalPages > 1) {
      pageNumbers.push(
        <button key={`page${totalPages}`} type='button' className={`btn ${currentPage === totalPages ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      );
    }
    return pageNumbers;
  }
  // const handleChangeMethods = () => {
  //   const inputs = document.querySelectorAll('.method-panel li input[type="checkbox"]') as unknown as HTMLInputElement[];
  //   const checkedMethods = [];
  //   if (inputs) for (const input of inputs) {
  //     if (input.checked) checkedMethods.push(input.value);
  //   }
  //   setCheckedMethods(checkedMethods);
  // }

  return (
    <Content>
      {
        selectedProductID == -1 ?
          <>
            <div className="row py-2">
              <div className="col-md-2 align-content-center fw-bold text-end">
                Shipment Type
              </div>
              <div className="col-md-2">
                <Select
                  className='react-select-styled react-select-solid react-select-sm w-100'
                  isSearchable={false}
                  theme={isDarkMode ? darkModeStyles : undefined}
                  options={shippingMethods}
                  isClearable={false}
                  defaultValue={shippingMethods[0]}
                  onChange={(e) => setCheckedMethod(e?.value ?? 0)}
                />
              </div>
              <div className="col-md-1 align-content-center fw-bold text-end">Days Stock</div>
              <div className="col-md-2"><input type="number" className="form-control" value={stockDays} onChange={(e) => setStockDays(parseInt(e.target.value))} /></div>
              <div className="col-md-1 align-content-center fw-bold text-end">Imports Stock</div>
              <div className="col-md-2"><input type="number" className="form-control" value={importStock} onChange={(e) => setImportStock(parseInt(e.target.value))} /></div>
              <div className="col-md-2 align-content-center">
                <button className="btn btn-light-primary btn-sm" onClick={handleFilterProduct}>
                  <i className="bi bi-filter"></i> Filter
                </button>
              </div>
            </div>
            {/* <div className="row py-2">
              <div className="col-md-4">
                <div className="dropdown">
                  <div data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                    <input type="text" className="form-control" placeholder="Select shipping type" readOnly value={checkedMethods.join(', ')} />
                  </div>
                  <form className="dropdown-menu p-4 w-100">
                    <ul className="list-group method-panel">
                      {['Train', 'Airplain', 'Ship'].map((item, index) => (
                        <li className="list-group-item" key={`delivMethod${index}`}>
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
                  <div className='d-flex' data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                    <div className="d-flex align-items-center pe-3 text-nowrap">Weight:</div>
                    <div className="d-flex">
                      <input type="text" className="form-control" readOnly value={`${weight.from} ~ ${weight.to} kg`} />
                    </div>
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
                  <div data-bs-toggle="dropdown" style={{ display: 'flex' }} aria-expanded="false" data-bs-auto-close="outside">
                    <div className="d-flex align-items-center pe-3 text-nowrap">Volumetric Weight:</div>
                    <div className="d-flex">
                      <input type="text" className="form-control" readOnly value={`${vWeight.from} ~ ${vWeight.to} kg`} />
                    </div>
                  </div>
                  <form className="dropdown-menu p-4" style={{ width: '120%' }}>
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
                <button type='button' className='btn btn-light-primary btn-sm' onClick={handleFilterProduct}>
                  <i className="bi bi-funnel"></i>
                  Filter
                </button>
              </div>
            </div> */}
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
                <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200 text-center">
                  <th className='text-start'>Product</th>
                  <th>Quantity</th>
                  <th>Stock Imports</th>
                  <th>Days in stock</th>
                  <th>Shipping Type</th>
                  <th>Sales per day</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((product, index) => {
                    if (index < (currentPage - 1) * limit) return;
                    if (index > currentPage * limit) return;
                    return (
                      <tr key={`inventCalc${index}`}>
                        <td className='align-content-center'>
                          <div className="d-flex">
                            <div className="d-flex align-items-center" onClick={() => setSelectedProductID(index)}>
                              {
                                <img className='rounded-2' width={60} height={60} src={product.image_link ?? '/media/products/0.png'} alt={product.product_name} />
                              }
                            </div>
                            <div className="d-flex flex-column ms-2" onClick={() => setSelectedProductID(index)}>
                              {product.product_name}
                            </div>
                          </div>
                        </td>
                        <td className='align-content-center text-center' onClick={() => setSelectedProductID(index)}>{parseInt(`${product.quantity}`) ? product.quantity : 0}</td>
                        <td className='align-content-center' onClick={() => setSelectedProductID(index)}>{product.stock_imports ? <div>{`${product.stock_imports[0]} (${parseFloat(product.stock_imports[1]).toFixed(1)})`} <br /> {product.stock_imports[2]}</div> : ''}</td>
                        <td className='align-content-center text-nowrap' onClick={() => setSelectedProductID(index)}>{product.day_stock[0]} (days stock)<br />{product.day_stock[1]} (import)</td>
                        <td className='align-content-center text-center' onClick={() => setSelectedProductID(index)}><ShipmentType type={product.type} /></td>
                        <td className='align-content-center text-center' onClick={() => setSelectedProductID(index)}>{product.sales_per_day}</td>
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