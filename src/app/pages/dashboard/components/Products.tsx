import { useEffect, useState } from 'react'
import Select from 'react-select'
import { Content } from '../../../../_metronic/layout/components/content'
import { getAllProducts, getProductAmount, getRefundedInfo, getSalesInfo, getShipmentInfo } from './_request'
import { Product } from '../../models/product'
import { SalesInformation } from '../../inventory_management/components/SalesInform'
import { OrdersInformation } from '../../inventory_management/components/OrdersInform'
import { addProductRequest, editProductRequest, getAllSuppliers } from '../../inventory_management/components/_request'
import { Suppliers } from '../../models/supplier'

// const Pagination = (props) => {
//   return (
//     <div className='pagination'>

//     </div>
//   )
// }

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
      <div className="card-header pt-4 w-full">
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
            {props.shipments.length === 0 && <tr><td colSpan={5}>No shipments for this product.</td></tr>}
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

const DetailedProduct: React.FC<{ product: Product, setSelectedProductID: React.Dispatch<React.SetStateAction<number>> }> = ({ product, setSelectedProductID }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [returns, setReturns] = useState<Return[]>([]);
  const [seriesSales, setSeriesSales] = useState<{ name: string, data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getSalesInfo(product.id ?? 0)
      .then(res => {
        if (res.data !== '') {
          const data = res.data as [{ date_string: string, sales: number }];
          const catigories: string[] = [];
          const series: number[] = [];
          data.forEach(datum => {
            catigories.push(datum.date_string);
            series.push(datum.sales);
          });
          setSeriesSales([{ name: 'Sales', data: series }]);
          setCategories(catigories);
        }
      })
      .catch(e => console.error(e));
    getRefundedInfo(product.id ?? 0)
      .then(res => setReturns(res.data))
    getShipmentInfo(product.id ?? 0)
      .then(res => setShipments(res.data))
  }, [product.id]);

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
          <div className="row py-2 mb-8">
            <div className="col-md-4">Weight: {product.weight}</div>
            <div className="col-md-4">Dimensions: {product.dimensions}</div>
            <div className="col-md-4">Supplier: {product.supplier_id}</div>
          </div>
        </div>
      </div>
      <SalesInformation className='card-xl-stretch mb-5 mb-xl-8' series={JSON.stringify(seriesSales)} product={product} categories={JSON.stringify(categories)} />
      <OrdersInformation className='card-xl-stretch mb-5 mb-xl-8' product={product}  />
      <ReturnsInformation returns={returns} />
      <ShipmentInformation shipments={shipments} />
    </div>
  )
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedProductID, setSelectedProductID] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState(50);
  const [editProduct, setEditProduct] = useState<Product>();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [toast, setToast] = useState<{ msg: string, status: string }>({ msg: '', status: '' });
  const [totalPages, setTotalPages] = useState<number>(0);
  const [suppliers, setSuppliers] = useState<{ [key: string]: string | number }[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<{ value: string, label: string}[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [addSupplier, setAddSupplier] = useState<string>('');
  const [editSupplier, setEditSupplier] = useState<string>('');

  const toastBtn = document.querySelector('#toastBtn') as HTMLElement;
  const toastClose = document.querySelector('#toast button') as HTMLElement;

  useEffect(() => {
    getAllProducts(currentPage, limit)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.log(err));
  }, [currentPage, limit]);
  useEffect(() => {
    getProductAmount()
      .then(res => {
        setTotalProducts(res.data);
        setTotalPages(res.data ? Math.ceil(res.data / limit) : 1);
      })
  }, [limit, products.length]);
  useEffect(() => {
    getAllSuppliers(1, 1000)
      .then(res => {
        setSuppliers(res.data);
        setAddSupplier(res.data[0].id);
        setSupplierOptions(res.data.map((datum: Suppliers) => {
          return { value: `${datum.id}`, label: `${datum.group} / ${datum.name} (${datum.wechat})` }
        }))
      })
      .catch(e => console.log(e));
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
    getAllProducts(currentPage, limit, selectedSuppliers.join(','))
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
    const modal = document.querySelector('#addProductModal');
    const form = document.querySelector('#addProductModal form');
    const data: { [key: string]: string | number | boolean } = {};
    const inputs = form?.querySelectorAll('input');
    if (inputs) for (const input of inputs) {
      if (input.name === '') continue;
      data[input.name] = input.type === 'checkbox' ? input.checked : input.value;
      if (input.value === '') {
        modal?.classList.remove('show');
        setToast({ msg: 'All fields must be filled.', status: 'danger' });
        toastBtn.click();
        modal?.classList.add('show');
        setTimeout(() => {
          if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
        }, 5000);
        return;
      }
    }
    if (!isValidURL(data.image_link as string)) {
      modal?.classList.remove('show');
      setToast({ msg: 'Temp Image Link must be valid url.', status: 'danger' });
      toastBtn.click();
      modal?.classList.add('show');
      setTimeout(() => {
        if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
      }, 5000);
      return;
    }
    if (!isValidURL(data.link_address_1688 as string)) {
      modal?.classList.remove('show');
      setToast({ msg: '1688 Link must be valid url.', status: 'danger' });
      toastBtn.click();
      modal?.classList.add('show');
      setTimeout(() => {
        if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
      }, 5000);
      return;
    }
    addProductRequest(data)
      .then(res => {
        modal?.classList.remove('show');
        if (res.status === 200) {
          handleFilterProduct();
          setToast({ msg: 'Success to create!', status: 'success' });
        } else {
          setToast({ msg: 'Failed to create!', status: 'success' });
        }
        toastBtn.click();
        modal?.classList.add('show');
        setTimeout(() => {
          if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
        }, 5000);
      });
    const closeBtn = document.querySelector('#addProductModal .btn-close') as HTMLElement;
    closeBtn?.click();
  }
  const handleEditProduct = () => {
    const modal = document.querySelector('#editProductModal');
    const form = document.querySelector('#editProductModal form');
    const data: { [key: string]: string | number | boolean } = {};
    const inputs = form?.querySelectorAll('input');
    if (inputs) for (const input of inputs) {
      if (input.name === '') continue;
      data[input.name] = input.type === 'checkbox' ? input.checked : input.value;
      if (input.value === '') {
        modal?.classList.remove('show');
        setToast({ msg: 'All fields must be filled.', status: 'danger' });
        toastBtn.click();
        modal?.classList.add('show');
        setTimeout(() => {
          if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
        }, 5000);
        return;
      }
    }
    if (!isValidURL(data.image_link as string)) {
      modal?.classList.remove('show');
      setToast({ msg: 'Temp Image Link must be valid url.', status: 'danger' });
      toastBtn.click();
      modal?.classList.add('show');
      setTimeout(() => {
        if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
      }, 5000);
      return;
    }
    if (!isValidURL(data.link_address_1688 as string)) {
      modal?.classList.remove('show');
      setToast({ msg: '1688 Link must be valid url.', status: 'danger' });
      toastBtn.click();
      modal?.classList.add('show');
      setTimeout(() => {
        if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
      }, 5000);
      return;
    }
    editProductRequest(editProduct?.id ?? 0, data)
      .then(res => {
        modal?.classList.remove('show');
        if (res.status === 200) {
          handleFilterProduct();
          setToast({ msg: 'Success to edit!', status: 'success' });
        } else {
          setToast({ msg: 'Failed to edit!', status: 'success' });
        }
        toastBtn.click();
        modal?.classList.add('show');
        setTimeout(() => {
          if (document.querySelector('#toast')?.classList.contains('show')) toastClose.click();
        }, 5000);
      });
    const closeBtn = document.querySelector('#editProductModal .btn-close') as HTMLElement;
    closeBtn?.click();
    setEditProduct(undefined);
  }

  return (
    <Content>
      {
        selectedProductID == -1 ?
          <>
            <div className="row py-2">
              <div className="col-md-10">
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
                        <li className="list-group-item" key={`supplier${index}`}>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((product, index) =>
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
                      <td className="align-content-center">
                        <div className="d-flex align-items-center flex-column">
                          <a href='#'
                            onClick={() => {
                              setEditProduct(product);
                              setShowMore(false);
                              setEditSupplier(`${product.supplier_id}`)
                            }}
                            data-bs-toggle="modal" data-bs-target="#editProductModal"
                          >
                            Edit
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
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
                        <div className="d-flex fw-bold w-25">SKU:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="sku"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='sku' defaultValue={editProduct.sku} placeholder="SKU" aria-label="SKU" aria-describedby="sku" required />
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
                            <input type="number" className="form-control" name='weight' defaultValue={parseFloat(editProduct.weight)} placeholder="Weight" aria-label="Weight" aria-describedby="weight" required />
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
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setEditProduct(undefined)}><i className='bi bi-x'></i>Close</button>
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
                        <div className="d-flex fw-bold w-25">Model Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="model-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='model_name' placeholder="Model Name" aria-label="Model Name" aria-describedby="model-name" required />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">SKU:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="sku"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='sku' placeholder="SKU" aria-label="SKU" aria-describedby="sku" required />
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
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className='bi bi-x'></i>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddProduct}><i className='bi bi-save'></i>Add Product</button>
                  </div>
                </div>
              </div>
            </div>
          </>
          :
          <>
            <DetailedProduct product={products[selectedProductID]} setSelectedProductID={setSelectedProductID} />
          </>
      }
      <a className='d-none' href="#" id='toastBtn' data-bs-toggle="modal" data-bs-target="#toast"></a>
      <div className="modal fade" id='toast' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog rounded">
          <div className="modal-content">
            <div className={`modal-body text-white text-bg-${toast.status} rounded`}>{toast.msg}</div>
            <button type="button" className="btn btn-secondary d-none" data-bs-dismiss="modal"></button>
          </div>
        </div>
      </div>
    </Content>
  )
}
