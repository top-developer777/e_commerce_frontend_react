import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Select from 'react-select'
import { Content } from '../../../../_metronic/layout/components/content'
import { deleteProduct, getAllProducts, getProductAmount, getProductInfo, getWarehouses } from './_request'
import { Product } from '../../models/product'
import { SalesInformation } from '../../inventory_management/components/SalesInform'
import { OrdersInformation } from '../../inventory_management/components/OrdersInform'
import { addProductRequest, editProductRequest, getAllSuppliers } from '../../inventory_management/components/_request'
import { Suppliers } from '../../models/supplier'
import { WarehouseType } from '../../models/warehouse';
import { getAllMarketplaces } from '../../config/components/_request'
import { interMKP } from '../../config/components/Integrations'
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_APP_API_URL

// const fakeShipments = [
//   {
//     "shipment_id": "SH123456",
//     "shipment_name": "Electronics Batch 1",
//     "destination": "New York, USA",
//     "last_updated": "2024-06-10T15:30:00Z",
//     "created": "2024-06-05T10:00:00Z",
//     "qty_shipped": 500,
//     "qty_received": 450,
//     "shipment_status": "In Transit"
//   },
//   {
//     "shipment_id": "SH789012",
//     "shipment_name": "Furniture Batch 3",
//     "destination": "Los Angeles, USA",
//     "last_updated": "2024-06-12T12:00:00Z",
//     "created": "2024-06-08T09:00:00Z",
//     "qty_shipped": 300,
//     "qty_received": 300,
//     "shipment_status": "Delivered"
//   }
// ]

// const fakeReturns = [
//   {
//     "return_type": "Damaged Item",
//     "quantity": 10,
//     "rate": 66.7,
//     "summary": "150 units returned due to defects",
//   },
//   {
//     "return_type": "Defective Item",
//     "quantity": 5,
//     "rate": 33.3,
//     "summary": "Entire shipment returned due to incorrect specifications",
//   }
// ]

const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
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
          <h3 className="text-gray-800 card-title align-content-center">Refunded</h3>
        </div>
        <div>
        </div>
      </div>
      <div className="card-body p-6">
        <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th className='text-center'>Refunded Reason ID</th>
              <th className='text-center'>Refunded Number</th>
            </tr>
          </thead>
          <tbody>
            {
              props.returns.map((_return, index) =>
                <tr key={`return${index}`}>
                  <td className='align-content-center text-center'>{_return.refunded_reason_id}</td>
                  <td className='align-content-center text-center'>{_return.refunded_number}</td>
                  {/* <td className='align-content-center text-center'>
                    <button type="button" className="btn btn-sm btn-light btn-light-primary fs-6 w-150px">
                      See Details
                    </button>
                  </td> */}
                </tr>
              )
            }
            {props.returns.length === 0 && <tr><td className='align-content-center text-center' colSpan={2}>There are no returns.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const ShipmentInformation: React.FC<{
  shipments: Shipment[];
}> = props => {
  return (
    <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
      <div className="card-header pt-6 w-full">
        <div>
          <h3 className="text-gray-800 card-title align-content-center">Shipment Information</h3>
        </div>
        <div>

        </div>
      </div>
      <div className="card-body p-6">
        <table className="table table-rounded table-row-bordered border gy-7 gs-7 cursor-pointer table-hover text-center">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th>Shipment ID</th>
              <th>Shipment Date</th>
              <th>Shipment Quantity</th>
              <th>Supplier Name</th>
              <th>Shipment Status</th>
              <th>Shipment Product Quantity</th>
            </tr>
          </thead>
          <tbody>
            {props.shipments.map((shipment, index) =>
              <tr key={`shipment${index}`}>
                <td className='align-content-center'>{shipment.shipment_id}</td>
                <td className='align-content-center'>{shipment.shipment_date}</td>
                <td className='align-content-center'>{shipment.shipment_quantity}</td>
                <td className='align-content-center'>{shipment.supplier_name}</td>
                <td className='align-content-center'>{shipment.shipment_status}</td>
                <td className='align-content-center'>{shipment.shipment_product_quantity}</td>
              </tr>
            )}
            {props.shipments.length === 0 && <tr><td colSpan={6}>No shipments for this product.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface Shipment {
  shipment_id: string;
  shipment_date: string;
  shipment_quantity: number;
  supplier_name: string;
  shipment_status: string;
  shipment_product_quantity: number;
}

interface Return {
  refunded_reason_id: string;
  refunded_number: number;
}

const DetailedProduct: React.FC<{ product: Product | undefined }> = ({ product }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  // const [seriesSales, setSeriesSales] = useState<{ name: string, data: number[] }[]>([]);
  // const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<{
    order_id: number;
    order_date: string;
    quantity_orders: number;
    order_status: number;
  }[]>([]);
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProductInfo(product?.ean ?? '')
      .then(res => {
        if (res.data !== '') {
          const data = res.data.sales_info as [{ date_string: string, sales: number }];
          const catigories: string[] = [];
          const series: number[] = [];
          data.forEach(datum => {
            catigories.push(datum.date_string);
            series.push(datum.sales);
          });
          // setSeriesSales([{ name: 'Sales', data: series }]);
          // setCategories(catigories);
          setShipments(res.data.shipments_info);
          setOrders(res.data.orders_info);
          const returns = [];
          const returnsInfo = res.data.returns_info;
          for (const key in returnsInfo) {
            if (key !== 'total') returns.push({ refunded_reason_id: key, refunded_number: returnsInfo[key] })
          }
          setReturns(returns);
        }
      })
      .catch(e => console.error(e));
    getAllSuppliers()
      .then(res => setSuppliers(res.data))
      .catch(e => console.error(e));
  }, [product?.ean]);

  if (!product) return <></>;
  return (
    <div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type='button' className='btn btn-light btn-light-primary btn-pull-right p-2 px-3 mx-1 fs-7' onClick={() => navigate('./../')}>
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
          <div className="row py-2">
            <div className="col-md-12">
              Product Name: <b>{product.product_name}</b>
            </div>
          </div>
          <div className="row py-2">
            <div className="col-md-4 fw-bold">Sale Price: {formatCurrency(parseFloat(product.sale_price ?? '0'))}</div>
            <div className="col-md-4">Part Number Key: {product.part_number_key}</div>
            <div className="col-md-4">Stock: {product.stock}</div>
          </div>
          <div className="row py-2 mb-8">
            <div className="col-md-4">Weight: {product.weight}</div>
            <div className="col-md-4">Dimensions: {product.dimensions}</div>
            <div className="col-md-4">Supplier: {suppliers.find(supp => supp.id === product.supplier_id)?.name}</div>
          </div>
        </div>
      </div>
      <SalesInformation className='card-xl-stretch mb-5 mb-xl-8' product={product} />
      <OrdersInformation className='card-xl-stretch mb-5 mb-xl-8' product={product} orders={orders} />
      <ReturnsInformation returns={returns} />
      <ShipmentInformation shipments={shipments} />
    </div>
  )
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [changed, setChanged] = useState<boolean>(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(50);
  const [editProduct, setEditProduct] = useState<Product>();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [suppliers, setSuppliers] = useState<{ [key: string]: string | number }[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<{ value: string, label: string }[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [addSupplier, setAddSupplier] = useState<string>('');
  const [editSupplier, setEditSupplier] = useState<string>('');
  const [marketPlaces, setMarketPlaces] = useState<interMKP[]>([]);
  const [warehouses, setWarehouses] = useState<{ value: number, label: string }[]>([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getAllProducts(currentPage, limit)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error(err));
  }, [currentPage, limit, changed]);
  useEffect(() => {
    getProductAmount()
      .then(res => {
        setTotalProducts(res.data);
        setTotalPages(res.data ? Math.ceil(res.data / limit) : 1);
      })
  }, [limit, products.length]);
  useEffect(() => {
    getAllSuppliers()
      .then(res => {
        setSuppliers(res.data);
        if (!res.data.length) return;
        setAddSupplier(res.data[0].id);
        setSupplierOptions(res.data.map((datum: Suppliers) => {
          return { value: `${datum.id}`, label: `${datum.group} / ${datum.name} (${datum.wechat})` }
        }))
      })
      .catch(e => console.error(e));
    getAllMarketplaces()
      .then(res => {
        setMarketPlaces(res.data)
      })
      .catch(e => console.error(e));
    getWarehouses()
      .then(res => res.data)
      .then(res => {
        setWarehouses(res.map((data: WarehouseType) => {
          return { value: data.id, label: data.name }
        }));
      })
      .catch(e => console.error(e));
  }, []);

  const filterSuppliers = (str: string) => {
    const filterTxt = str.toLowerCase();
    const lis = document.querySelectorAll('.supplier-panel li');
    for (const li of lis) {
      const content = li.textContent?.toLowerCase() ?? '';
      if (content.indexOf(filterTxt) < 0) {
        li.setAttribute('style', 'display: none');
      } else {
        li.setAttribute('style', 'display: block');
      }
    }
  }
  const handleFilterProduct = () => {
    const filterTextComp = document.querySelector('#filterText') as HTMLInputElement;
    const filterText = filterTextComp.value;
    getAllProducts(currentPage, limit, selectedSuppliers.join(','), filterText)
      .then(res => {
        setProducts(res.data);
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
  const handleChangeSuppliers = () => {
    const inputs = document.querySelectorAll('.supplier-panel li input[type="checkbox"]') as unknown as HTMLInputElement[];
    const selectedSuppliers = [];
    if (inputs) for (const input of inputs) {
      if (input.checked) selectedSuppliers.push(input.value);
    }
    setSelectedSuppliers(selectedSuppliers);
  }
  const clearSelection = () => {
    setSelectedSuppliers([]);
    const inputs = document.querySelectorAll('.supplier-panel li input[type="checkbox"]') as unknown as HTMLInputElement[];
    if (inputs) for (const input of inputs) {
      input.checked = false;
    }
  }
  const handleAddProduct = () => {
    const closeBtn = document.querySelector('#addProductModal .btn-close') as HTMLElement;
    const form = document.querySelector('#addProductModal form');
    const data: { [key: string]: string | number | boolean } = {};
    const inputs = form?.querySelectorAll('input');
    if (inputs) for (const input of inputs) {
      if (input.name === '') continue;
      data[input.name] = input.type === 'checkbox' ? input.checked : input.value.trim();
      // if (input.value === '') {
      //   modal?.classList.remove('show');
      //   setToast({ msg: 'All fields must be filled.', status: 'danger' });
      //   toastBtn.click();
      //   modal?.classList.add('show');
      //   setTimeout(() => {
      //     if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
      //   }, 5000);
      //   return;
      // }
    }
    if (data.image_link && !isValidURL(data.image_link as string)) {
      toast.error('Temp Image Link must be valid url.');
      return;
    }
    if (data.link_address_1688 && !isValidURL(data.link_address_1688 as string)) {
      toast.error('1688 Link must be valid url.');
      return;
    }
    data['warehouse_id'] = parseInt(data['warehouse_id'] as string);
    data['stock'] = parseInt(data['stock'] as string);
    data['supplier_id'] = parseInt(data['supplier_id'] as string);
    data['buy_button_rank'] = parseInt(data['buy_button_rank'] as string);
    addProductRequest(data)
      .then(() => {
        toast.success('Successfully created!');
        setChanged(!changed);
        handleFilterProduct();
        closeBtn?.click();
      })
      .catch(e => {
        toast.error('Something went wrong.');
        console.error(e);
      });
  }
  const handleEditProduct = () => {
    const closeBtn = document.querySelector('#editProductModal .btn-close') as HTMLElement;
    const form = document.querySelector('#editProductModal form');
    const data: { [key: string]: string | number | boolean } = {};
    const inputs = form?.querySelectorAll('input');
    if (inputs) for (const input of inputs) {
      if (input.name === '') continue;
      data[input.name] = input.type === 'checkbox' ? input.checked : input.value.trim();
      // if (input.value === '') {
      //   modal?.classList.remove('show');
      //   setToast({ msg: 'All fields must be filled.', status: 'danger' });
      //   toastBtn.click();
      //   modal?.classList.add('show');
      //   setTimeout(() => {
      //     if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
      //   }, 5000);
      //   return;
      // }
    }
    if (!!data.image_link && !isValidURL(data.image_link as string)) {
      toast.error('Temp Image Link must be valid url.');
      return;
    }
    if (!!data.link_address_1688 && !isValidURL(data.link_address_1688 as string)) {
      toast.error('1688 Link must be valid url.');
      return;
    }
    data['warehouse_id'] = parseInt(data['warehouse_id'] as string);
    data['stock'] = parseInt(data['stock'] as string);
    data['supplier_id'] = parseInt(data['supplier_id'] as string);
    data['buy_button_rank'] = parseInt(data['buy_button_rank'] as string);
    editProductRequest(editProduct?.id ?? 0, data)
      .then(() => {
        setChanged(!changed);
        handleFilterProduct();
        toast.success('Successfully edited!');
        closeBtn?.click();
        setEditProduct(undefined);
      })
      .catch(e => {
        toast.error('Something went wrong.');
        console.error(e);
      });
    setEditProduct(undefined);
  }
  const handleDeleteProduct = (id: number) => {
    deleteProduct(id)
      .then(() => setChanged(!changed))
      .catch(e => console.error(e));
  }

  return (
    <Content>
      {
        params.id && !isNaN(parseInt(params.id)) ?
          <>
            <DetailedProduct product={products.find(product => product.id === parseInt(params.id ?? ''))} />
          </>
          :
          <>
            <div className="row py-2">
              <div className="col-md-5">
                <input type="text" className="form-control" id='filterText' placeholder='Search products' />
              </div>
              <div className="col-md-5">
                <div className="dropdown">
                  <div className="input-group" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                    <span className="input-group-text" id="filter"><i className="bi bi-search"></i></span>
                    <input type="text" className="form-control" name='filter' placeholder="Search by supplier" onChange={(e) => filterSuppliers(e.target.value)} />
                    {selectedSuppliers.length === 0 && <></>}
                    {selectedSuppliers.length === 1 && <div className='d-absolute bg-white' style={{ top: '2px', right: '2px', bottom: '2px', width: '200px' }}>
                      <div className="d-flex align-items-center h-100 w-100">
                        <span className='d-flex ps-2' style={{ width: 'calc(100% - 22px)' }}>
                          Selected: a supplier
                        </span>
                        <span onClick={clearSelection} className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#999' }}>
                            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </span>
                      </div>
                    </div>}
                    {selectedSuppliers.length > 1 && <div className='d-absolute bg-white' style={{ top: '2px', right: '2px', bottom: '2px', width: '200px' }}>
                      <div className="d-flex align-items-center h-100 w-100">
                        <span className='d-flex ps-2' style={{ width: 'calc(100% - 22px)' }}>
                          Selected: {selectedSuppliers.length} suppliers
                        </span>
                        <span onClick={clearSelection} className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#999' }}>
                            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </span>
                      </div>
                    </div>}
                  </div>
                  <form className="dropdown-menu p-4 w-100">
                    <ul className="list-group supplier-panel">
                      {suppliers.length === 0 && <li className='list-group-item cursor-not-allowed'>No supplier</li>}
                      {suppliers.map(((supplier, index) => (
                        <li className="list-group-item" key={`productsupplier${index}`}>
                          <label className='d-flex align-items-center cursor-pointer'>
                            <div className="d-flex pe-3">
                              <input type="checkbox" value={supplier.id} onChange={handleChangeSuppliers} />
                            </div>
                            <div className="d-flex text-nowrap ps-3 flex-column">
                              <div className="d-flex">{supplier.group} / {supplier.name} ({supplier.wechat})</div>
                            </div>
                          </label>
                        </li>
                      )))}
                    </ul>
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
              <div>
                <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7' data-bs-toggle="modal" data-bs-target="#addProductModal">
                  <i className="bi bi-cart-plus"></i>
                  Add Product
                </button>
              </div>
            </div>
            <div className="row flex-shrink-1">
              <div className="col-md-12 table-responsive d-flex h-100">
                <table className="table table-rounded table-row-bordered border table-hover">
                  <thead>
                    <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                      {/* <th style={{ width: '100px' }}><div className="form-check form-check-custom form-check-solid">
                        <input className="form-check-input" type="checkbox" value="" />
                      </div></th> */}
                      <th className='px-3'>Product</th>
                      <th className='px-3'>Price</th>
                      <th className='px-3'>Stock</th>
                      <th className='px-3'>Barcode Title</th>
                      <th className='px-3'>Masterbox Title</th>
                      <th className='px-3'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.map(product =>
                        <tr key={`productlist${product.id}`}>
                          {/* <td className='align-content-center'>
                            <input className="form-check-input" type="checkbox" value={index} />
                          </td> */}
                          <td className='align-content-center px-3'>
                            <div className="d-flex">
                              <div className="d-flex align-items-center" onClick={() => navigate(`./${product.id}`)}>
                                {
                                  product.image_link
                                    ? <img className='rounded-2' width={60} height={60} src={product.image_link} alt={product.product_name} />
                                    : <div> No Image </div>
                                }
                              </div>
                              <div className="d-flex flex-column ms-2">
                                <div className="d-flex align-items-center">
                                  <span className='d-flex fw-bold'>{product.model_name}</span>
                                </div>
                                <div className="d-flex text-primary cursor-pointer" onClick={() => navigate(`./${product.id}`)}>{product.product_name}</div>
                                <div className="d-flex"><a href={product.link_address_1688} target='_blank'>{product.link_address_1688}</a></div>
                              </div>
                            </div>
                          </td>
                          <td className='align-content-center'>{formatCurrency(parseFloat(product.price))}</td>
                          <td className='align-content-center text-center'>{product.stock}</td>
                          <td className='align-content-center'>{product.barcode_title}</td>
                          <td className='align-content-center'>{product.masterbox_title}</td>
                          <td className="align-content-center px-3">
                            <div className="dropdown d-flex">
                              <i className="bi bi-three-dots-vertical btn btn-sm btn-secondary m-auto" style={{ borderRadius: '100%', paddingLeft: '0.6rem', paddingRight: '0.7rem', paddingTop: '0.8rem' }} data-bs-toggle="dropdown" aria-expanded="false"></i>
                              <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#editProductModal" onClick={() => {
                                  setEditProduct(product);
                                  setShowMore(false);
                                  setEditSupplier(`${product.supplier_id}`)
                                }}>Edit Product</a></li>
                                <li><a className="dropdown-item" href="#" onClick={() => handleDeleteProduct(product.id ?? 0)}>Delete Product</a></li>
                                <li><a className="dropdown-item" href="#" onClick={() => navigate(`./${product.id}`)}>Details</a></li>
                                <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#marketplaceModal" onClick={() => setSelectedProduct(product)}>Offer</a></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal fade" id='editProductModal' tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Product for {editProduct?.product_name}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {editProduct && <form action="" method='post' id='editProductForm'>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Product Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="product-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='product_name' defaultValue={editProduct.product_name} placeholder="Product Name" aria-label="Product Name" aria-describedby="product-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Model Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="model-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='model_name' defaultValue={editProduct.model_name} placeholder="Model Name" aria-label="Model Name" aria-describedby="model-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">EAN:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="ean"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='ean' defaultValue={editProduct.ean} placeholder="EAN" aria-label="EAN" aria-describedby="ean" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price"><i className="bi bi-link-45deg"></i></span>
                            <input type="number" className="form-control" name='price' defaultValue={parseFloat(editProduct.price)} placeholder="Price" aria-label="Price" aria-describedby="price" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Temp Image Link:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="temp-img-link"><i className="bi bi-link-45deg"></i></span>
                            <input type="url" className="form-control" name='image_link' defaultValue={editProduct.image_link} placeholder="Temp Image Link" aria-label="Temp Image Link" aria-describedby="temp-img-link" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Observation:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='observation' defaultValue={editProduct.observation} placeholder="Observation" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Warehouse:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <Select
                            name='warehouse_id'
                            className='react-select-styled react-select-solid react-select-sm w-100'
                            options={warehouses}
                            placeholder='Select a warehouse'
                            isSearchable={false}
                            noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                            defaultValue={warehouses.find(warehouse => warehouse.value === editProduct.warehouse_id)}
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Barcode Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="barcode-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='barcode_title' defaultValue={editProduct.barcode_title} placeholder="Barcode Title" aria-label="Barcode Title" aria-describedby="barcode-title" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Masterbox Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="masterbox-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='masterbox_title' defaultValue={editProduct.masterbox_title} placeholder="Masterbox Title" aria-label="Masterbox Title" aria-describedby="masterbox-title" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Link Address:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="link-address-1688"><i className="bi bi-link-45deg"></i></span>
                            <input type="url" className="form-control" name='link_address_1688' defaultValue={editProduct.link_address_1688} placeholder="Link address" aria-label="Link address" aria-describedby="link-address-1688" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price1688"><i className="bi bi-coin"></i></span>
                            <input type="number" className="form-control" name='price_1688' defaultValue={parseFloat(editProduct.price_1688)} placeholder="1688 Price" aria-label="1688 Price" aria-describedby="price1688" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Variation Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="variation-name-1688"><i className="bi bi-globe2"></i></span>
                            <input type="text" className="form-control" name='variation_name_1688' defaultValue={editProduct.variation_name_1688} placeholder="1688 Variation Name" aria-label="1688 Variation Name" aria-describedby="variation-name-1688" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Internal Shipping Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-coin"></i></span>
                            <input type="number" className="form-control" name='internal_shipping_price' defaultValue={parseFloat(editProduct.internal_shipping_price)} placeholder="Internal Shipping Price" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">PCS/CTN:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="pcs-ctn"><i className="bi bi-diagram-3"></i></span>
                            <input type="text" className="form-control" name='pcs_ctn' defaultValue={editProduct.pcs_ctn} placeholder="PCS/CTN" aria-label="PCS/CTN" aria-describedby="pcs-ctn" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Weight:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="weight"><i className="bi bi-tag-fill"></i></span>
                            <input type="number" className="form-control" name='weight' defaultValue={editProduct.weight} placeholder="Weight" aria-label="Weight" aria-describedby="weight" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Volumetric Weight:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="volumetric_weight"><i className="bi bi-tag-fill"></i></span>
                            <input type="number" className="form-control" name='volumetric_weight' defaultValue={editProduct.volumetric_weight} placeholder="Volumetric Weight" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Dimensions:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="dimensions"><i className="bi bi-unity"></i></span>
                            <input type="text" className="form-control" name='dimensions' defaultValue={editProduct.dimensions} placeholder="Width * Height * Length" aria-label="Dimensions" aria-describedby="dimensions" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Supplier:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="supplier-id"><i className="bi bi-chat-dots-fill"></i></span>
                            <Select
                              className='react-select-styled react-select-solid react-select-sm flex-grow-1'
                              options={supplierOptions}
                              placeholder='Select supplier'
                              noOptionsMessage={e => `No more suppliers including "${e.inputValue}"`}
                              defaultValue={supplierOptions.filter(option => option.value.indexOf(`${editProduct.supplier_id}`) >= 0)}
                              onChange={value => setEditSupplier(value?.value ?? '')}
                              isClearable={false}
                            />
                            <input type="hidden" name='supplier_id' value={editSupplier} />
                          </div>
                        </div>
                      </div>
                      {!showMore && <div className="d-flex align-items-center py-1 flex-column">
                        <button type='button' className='btn btn-light btn-light-primary btn-pull-right p-2 px-3 mx-1 fs-7' onClick={() => setShowMore(true)}>
                          <i className="bi bi-plus-circle"></i> More
                        </button>
                      </div>}
                      <span style={{ display: showMore ? 'block' : 'none' }}>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">English Name:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="en-name"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='english_name' defaultValue={editProduct.english_name} placeholder="English Name" aria-label="English Name" aria-describedby="en-name" required />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Romanian Name:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="ro-name"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='romanian_name' defaultValue={editProduct.romanian_name} placeholder="Romanian Name" aria-label="Romanian Name" aria-describedby="ro-name" required />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Material Name (EN):</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="en-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='material_name_en' defaultValue={editProduct.material_name_en} placeholder="Material Name (EN)" aria-label="Material Name (EN)" aria-describedby="en-mat-name" required />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Material Name (RO):</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="ro-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='material_name_ro' defaultValue={editProduct.material_name_ro} placeholder="Material Name (RO)" aria-label="Material Name (RO)" aria-describedby="ro-mat-name" required />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">HS Code:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="hs-code"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='hs_code' defaultValue={editProduct.hs_code} placeholder="HS Code" aria-label="HS Code" aria-describedby="hs-code" required />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Battery:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="form-check form-switch form-check-custom form-check-solid">
                              <input className="form-check-input" type="checkbox" id="battery" name='battery' defaultChecked={editProduct.battery} />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Default Usage:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="usage"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='default_usage' defaultValue={editProduct.default_usage} placeholder="Default Usage" aria-label="Default Usage" aria-describedby="usage" required />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Estimated Production Time:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="production-time"><i className="bi bi-coin"></i></span>
                              <input type="number" className="form-control" name='production_time' defaultValue={parseFloat(editProduct.production_time)} placeholder="Production Time" aria-label="Production Time" aria-describedby="production-time" required />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Discontinued:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="form-check form-switch form-check-custom form-check-solid">
                              <input className="form-check-input" type="checkbox" id="discontinued" name='discontinued' defaultChecked={editProduct.discontinued} />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1 flex-column">
                          <button type='button' className='btn btn-light btn-light-primary btn-pull-right p-2 px-3 mx-1 fs-7' onClick={() => setShowMore(false)}>
                            <i className="bi bi-dash-circle"></i> Less
                          </button>
                        </div>
                      </span>
                    </form>}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setEditProduct(undefined)}><i className='bi bi-trash'></i>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleEditProduct}><i className='bi bi-save'></i>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id='addProductModal' tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">Add Product</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form action="" method='post' id='addProductForm'>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Product Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="product-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='product_name' placeholder="Product Name" aria-label="Product Name" aria-describedby="product-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Part Number Key:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="part-number-key"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='part_number_key' placeholder="Part Number Key" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Model Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="model-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='model_name' placeholder="Model Name" aria-label="Model Name" aria-describedby="model-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">EAN:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="ean"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='ean' placeholder="EAN" aria-label="EAN" aria-describedby="ean" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price"><i className="bi bi-link-45deg"></i></span>
                            <input type="number" className="form-control" name='price' placeholder="Price" aria-label="Price" aria-describedby="price" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Temp Image Link:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="temp-img-link"><i className="bi bi-link-45deg"></i></span>
                            <input type="url" className="form-control" name='image_link' placeholder="Temp Image Link" aria-label="Temp Image Link" aria-describedby="temp-img-link" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Observation:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='observation' placeholder="Observation" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Warehouse:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <Select
                            name='warehouse_id'
                            className='react-select-styled react-select-solid react-select-sm w-100'
                            options={warehouses}
                            placeholder='Select a warehouse'
                            isSearchable={false}
                            noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Barcode Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="barcode-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='barcode_title' placeholder="Barcode Title" aria-label="Barcode Title" aria-describedby="barcode-title" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Masterbox Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="masterbox-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='masterbox_title' placeholder="Masterbox Title" aria-label="Masterbox Title" aria-describedby="masterbox-title" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Link Address:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="link-address-1688"><i className="bi bi-link-45deg"></i></span>
                            <input type="url" className="form-control" name='link_address_1688' placeholder="Link address" aria-label="Link address" aria-describedby="link-address-1688" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price1688"><i className="bi bi-coin"></i></span>
                            <input type="number" className="form-control" name='price_1688' defaultValue={0} placeholder="1688 Price" aria-label="1688 Price" aria-describedby="price1688" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Variation Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="variation-name-1688"><i className="bi bi-globe2"></i></span>
                            <input type="text" className="form-control" name='variation_name_1688' placeholder="1688 Variation Name" aria-label="1688 Variation Name" aria-describedby="variation-name-1688" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Internal Shipping Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-coin"></i></span>
                            <input type="number" className="form-control" name='internal_shipping_price' placeholder="Internal Shipping Price" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">PCS/CTN:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="pcs-ctn"><i className="bi bi-diagram-3"></i></span>
                            <input type="text" className="form-control" name='pcs_ctn' placeholder="PCS/CTN" aria-label="PCS/CTN" aria-describedby="pcs-ctn" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Weight:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="weight"><i className="bi bi-tag-fill"></i></span>
                            <input type="number" className="form-control" name='weight' defaultValue={0} placeholder="Weight" aria-label="Weight" aria-describedby="weight" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Volumetric Weight:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="volumetric_weight"><i className="bi bi-tag-fill"></i></span>
                            <input type="number" className="form-control" name='volumetric_weight' defaultValue={0} placeholder="Volumetric Weight" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Dimensions:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="dimensions"><i className="bi bi-unity"></i></span>
                            <input type="text" className="form-control" name='dimensions' placeholder="Width * Height * Length" aria-label="Dimensions" aria-describedby="dimensions" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Supplier:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="supplier-id"><i className="bi bi-chat-dots-fill"></i></span>
                            <Select
                              className='react-select-styled react-select-solid react-select-sm flex-grow-1'
                              options={supplierOptions}
                              placeholder='Select suppliers'
                              noOptionsMessage={e => `No more suppliers including "${e.inputValue}"`}
                              defaultValue={supplierOptions[0]}
                              onChange={value => setAddSupplier(value?.value ?? '')}
                            />
                            <input type="hidden" name='supplier_id' value={addSupplier} />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">English Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="en-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='english_name' placeholder="English Name" aria-label="English Name" aria-describedby="en-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Romanian Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="ro-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='romanian_name' placeholder="Romanian Name" aria-label="Romanian Name" aria-describedby="ro-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Material Name (EN):</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="en-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='material_name_en' placeholder="Material Name (EN)" aria-label="Material Name (EN)" aria-describedby="en-mat-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Material Name (RO):</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="ro-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='material_name_ro' placeholder="Material Name (RO)" aria-label="Material Name (RO)" aria-describedby="ro-mat-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">HS Code:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="hs-code"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='hs_code' placeholder="HS Code" aria-label="HS Code" aria-describedby="hs-code" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Battery:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="form-check form-switch form-check-custom form-check-solid">
                            <input className="form-check-input" type="checkbox" id="battery" name='battery' defaultChecked={false} />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Default Usage:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="usage"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='default_usage' placeholder="Default Usage" aria-label="Default Usage" aria-describedby="usage" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Estimated Production Time:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="production-time"><i className="bi bi-coin"></i></span>
                            <input type="number" className="form-control" name='production_time' placeholder="Production Time" aria-label="Production Time" aria-describedby="production-time" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Discontinued:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="form-check form-switch form-check-custom form-check-solid">
                            <input className="form-check-input" type="checkbox" id="discontinued" name='discontinued' defaultChecked={false} />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className='bi bi-trash'></i>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddProduct}><i className='bi bi-save'></i>Add Product</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id='marketplaceModal' tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">{selectedProduct?.product_name}</h1>
                    <button type="button" className="btn-close" onClick={() => setSelectedProduct(undefined)} data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {!!selectedProduct && marketPlaces.filter(market => (selectedProduct.market_place ?? []).findIndex(mark => mark === market.marketplaceDomain) >= 0).map((marketplace, index) => <div className="d-flex align-items-center py-1" key={`marketplace${index}`}>
                      <div className="d-flex flex-center overflow-hidden" style={{ height: '50px', minWidth: '100px' }}>
                        <img className="rounded" style={{ width: '75%' }} alt={marketplace.marketplaceDomain} src={`${API_URL}/utils/${marketplace.image_url ?? ''}`} />
                      </div>
                      <div className="d-flex">{marketplace.title}</div>
                    </div>)}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedProduct(undefined)} data-bs-dismiss="modal"><i className='bi bi-trash'></i>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </>
      }
    </Content>
  )
}
