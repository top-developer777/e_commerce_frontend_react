import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { getAllProducts, getProductAmout, editProductRequest, addProductRequest } from './_request'
import { SalesInformation } from './SalesInform'
import { OrdersInformation } from './OrdersInform'

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

const fakeSeriesOrders = [
  {
    name: 'average',
    data: [1.6, 1.8, 1.2, 1.3, 1.9, 1.8, 2.2, 2.3, 1.9, 1.2, 1.8, 1.6],
  },
]

const fakeCategoriesOrders = ['19/05/2024', '21/05/2024', '23/05/2024', '25/05/2024', '27/05/2024', '29/05/2024', '31/05/2024', '02/06/2024', '04/06/2024', '06/06/2024', '08/06/2024', '10/06/2024']

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
};

const ReturnsInformation: React.FC<{
  returns: Return[];
}> = props => {
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

export interface Product {
  id?: number;
  name: string;
  images: string;
  brand: string;
  part_number: string;
  part_number_key: string;
  sale_price: number;
  currency: number;
  stock: string;
  barcode?: string;
  url: string;
  weight: string;
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
            <div className="col-md-12"><a href="https://amazon.com/dp/B0XLFX8JXK" target='_blank'>https://amazon.com/dp/B0XLFX8JXK</a></div>
          </div>
          <div className="row py-2">
            <div className="col-md-4 fw-bold">Price: {formatCurrency(product.sale_price)}</div>
            <div className="col-md-4">Variation Name: Variation Name</div>
            <div className="col-md-4">PCS/CTN: 0 / 0</div>
          </div>
          <div className="row py-2">
            <div className="col-md-4">Weight: {product.weight}</div>
            <div className="col-md-4">Dimensions: 25 * 15 * 30</div>
            <div className="col-md-4">Supplier: <a href="#">WeChat</a></div>
          </div>
        </div>
      </div>
      <SalesInformation className='card-xl-stretch mb-5 mb-xl-8' series={JSON.stringify(fakeSeriesSales)} product={product} categories={JSON.stringify(fakeCategoriesSales)} />
      <OrdersInformation className='card-xl-stretch mb-5 mb-xl-8' series={JSON.stringify(fakeSeriesOrders)} product={product} categories={JSON.stringify(fakeCategoriesOrders)} />
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
  const [editProduct, setEditProduct] = useState<Product>();
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    getAllProducts(currentPage, limit)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.log(err))
  }, [currentPage, limit]);

  useEffect(() => {
    getProductAmout()
      .then(res => {
        setTotalProducts(res.data);
        setTotalPages(res.data ? Math.ceil(res.data / limit) : 1);
      })
  }, [limit, products.length]);

  const handleAddProduct = () => {
    const form = document.querySelector('#addProductModal form');
    const data: { [key: string]: string | number | boolean } = {};
    const inputs = form?.querySelectorAll('input');
    if (inputs) for (const input of inputs) {
      data[input.name] = input.type === 'text' ? input.value : input.checked;
    }
    addProductRequest(data)
      .then(res => {
        if (res.status === 200) {
          alert('Success to create!');
        } else {
          alert('Failed to create!');
        }
      });
    const closeBtn = document.querySelector('#addProductModal .btn-close') as HTMLElement;
    closeBtn?.click();
  }

  const handleEditProduct = () => {
    const form = document.querySelector('#editProductModal form');
    const data: { [key: string]: string | number | boolean } = {};
    const inputs = form?.querySelectorAll('input');
    if (inputs) for (const input of inputs) {
      data[input.name] = input.type === 'text' ? input.value : input.checked;
    }
    editProductRequest(editProduct?.id ?? 0, data)
      .then(res => {
        if (res.status === 200) {
          alert('Success to edit!');
        } else {
          alert('Failed to edit!');
        }
      });
    const closeBtn = document.querySelector('#editProductModal .btn-close') as HTMLElement;
    closeBtn?.click();
    setEditProduct(undefined);
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
  };

  return (
    <Content>
      {
        selectedProductID == -1 ?
          <>
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
                  <th>Price / Stock</th>
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
                      <td className='align-content-center' /* onClick={() => setSelectedProductID(index)} */>
                        <div className="d-flex">
                          <div className="d-flex align-items-center">
                            <a href={product.url}>
                              {
                                (JSON.parse(product.images) && JSON.parse(product.images).length > 0)
                                  ? <img className='rounded-2' width={80} height={80} src={JSON.parse(product.images)[0]["url"]} alt={product.name} />
                                  : <div> No Image </div>
                              }
                            </a>
                          </div>
                          <div className="d-flex flex-column ms-2">
                            <div className="d-flex align-items-center">
                              <span className='d-flex'><a href={`https://amazon.com/dp/${product.part_number_key}`} target='_blank'>{product.part_number_key}</a></span>
                            </div>
                            <div className="d-flex">Jewelry Packaging Gift Box 2.5*2.5*3cm</div>
                            <div className="d-flex"></div>
                          </div>
                        </div>
                      </td>
                      <td className='align-content-center'>{formatCurrency(product.sale_price)} / {JSON.parse(product.stock)[0].value}</td>
                      <td className='align-content-center'>{product.barcode ?? 'Barcode Title'}</td>
                      <td className='align-content-center'>Masterbox Title</td>
                      {/* <td className='align-content-center'>
                        <div className="form-check form-switch form-check-custom form-check-solid">
                          <input className="form-check-input" type="checkbox" value="" id="flexSwitchChecked" defaultChecked={true} readOnly={true} />
                        </div>
                      </td> */}
                      <td className="align-content-center">
                        <div className="d-flex align-items-center flex-column">
                          <a href='#'
                            onClick={() => {
                              setEditProduct(product);
                              setShowMore(false);
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
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Product for {editProduct?.name}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {editProduct && <form action="" method='post' id='editProductForm'>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Product Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="product-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='name' defaultValue={editProduct.part_number_key} placeholder="Product Name" aria-label="Product Name" aria-describedby="product-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Model Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="model-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='model_name' defaultValue={editProduct.part_number_key} placeholder="Model Name" aria-label="Model Name" aria-describedby="model-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">SKU:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="sku"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='sku' defaultValue={'SKU'} placeholder="SKU" aria-label="SKU" aria-describedby="sku" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='price' defaultValue={editProduct.sale_price} placeholder="Price" aria-label="Price" aria-describedby="price" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Temp Image Link:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="temp-img-link"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='temp_img_link' defaultValue={editProduct.url} placeholder="Temp Image Link" aria-label="Temp Image Link" aria-describedby="temp-img-link" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Barcode Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="barcode-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='barcode_title' defaultValue={editProduct.barcode} placeholder="Barcode Title" aria-label="Barcode Title" aria-describedby="barcode-title" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Masterbox Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="masterbox-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='masterbox_title' defaultValue={'Masterbox Title'} placeholder="Masterbox Title" aria-label="Masterbox Title" aria-describedby="masterbox-title" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Link Address:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="link-address-1688"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='link_address_1688' defaultValue={editProduct?.url} placeholder="Link address" aria-label="Link address" aria-describedby="link-address-1688" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price1688"><i className="bi bi-coin"></i></span>
                            <input type="text" className="form-control" name='price1688' defaultValue={editProduct?.sale_price} placeholder="1688 Price" aria-label="1688 Price" aria-describedby="price1688" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Variation Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="variation-name-1688"><i className="bi bi-globe2"></i></span>
                            <input type="text" className="form-control" name='variation_name_1688' defaultValue={editProduct?.url} placeholder="1688 Variation Name" aria-label="1688 Variation Name" aria-describedby="variation-name-1688" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">PCS/CTN:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="pcs-ctn"><i className="bi bi-diagram-3"></i></span>
                            <input type="text" className="form-control" name='pcs_ctn' defaultValue={editProduct?.url} placeholder="PCS/CTN" aria-label="PCS/CTN" aria-describedby="pcs-ctn" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Weight:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="weight"><i className="bi bi-tag-fill"></i></span>
                            <input type="text" className="form-control" name='weight' defaultValue={parseFloat(editProduct?.weight ?? '')} placeholder="Weight" aria-label="Weight" aria-describedby="weight" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Dimensions:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="dimensions"><i className="bi bi-unity"></i></span>
                            <input type="text" className="form-control" name='dimensions' defaultValue={'25 * 25 * 25'} placeholder="Width * Height * Length" aria-label="Dimensions" aria-describedby="dimensions" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Supplier Group:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="supplier-group"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='supplier_group' defaultValue={'Supplier Group'} placeholder="Supplier Group" aria-label="Supplier Group" aria-describedby="supplier-group" />
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
                              <input type="text" className="form-control" name='en_name' defaultValue={editProduct.name} placeholder="English Name" aria-label="English Name" aria-describedby="en-name" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Romanian Name:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="ro-name"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='ro_name' defaultValue={editProduct.name} placeholder="Romanian Name" aria-label="Romanian Name" aria-describedby="ro-name" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Material Name (EN):</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="en-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='en_mat_name' defaultValue={'Material Name (EN)'} placeholder="Material Name (EN)" aria-label="Material Name (EN)" aria-describedby="en-mat-name" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Material Name (RO):</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="ro-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='ro_mat_name' defaultValue={'Material Name (RO)'} placeholder="Material Name (RO)" aria-label="Material Name (RO)" aria-describedby="ro-mat-name" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">HS Code:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="hs-code"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='hs_code' defaultValue={'HS Code'} placeholder="HS Code" aria-label="HS Code" aria-describedby="hs-code" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Battery:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="form-check form-switch form-check-custom form-check-solid">
                              <input className="form-check-input" type="checkbox" id="battery" name='battery' defaultChecked={false} readOnly={true} />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Default Usage:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="usage"><i className="bi bi-chat-dots-fill"></i></span>
                              <input type="text" className="form-control" name='usage' defaultValue={'Commercial'} placeholder="Default Usage" aria-label="Default Usage" aria-describedby="usage" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Supplier Name:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="supplier-name"><i className="bi bi-coin"></i></span>
                              <input type="text" className="form-control" name='supplier_name' defaultValue={'Supplier Name'} placeholder="Supplier Name" aria-label="Supplier Name" aria-describedby="supplier-name" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Supplier WeChat:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="supplier-wechat"><i className="bi bi-coin"></i></span>
                              <input type="text" className="form-control" name='supplier_wechat' defaultValue={"Supplier WeChat"} placeholder="Supplier WeChat" aria-label="Supplier WeChat" aria-describedby="supplier-wechat" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Estimated Production Time:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text" id="production-time"><i className="bi bi-coin"></i></span>
                              <input type="text" className="form-control" name='production_time' defaultValue={'Production Time'} placeholder="Production Time" aria-label="Production Time" aria-describedby="production-time" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Discontinued:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="form-check form-switch form-check-custom form-check-solid">
                              <input className="form-check-input" type="checkbox" id="discounted" name='discounted' defaultChecked={false} readOnly={true} />
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
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setEditProduct(undefined)}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleEditProduct}>Save changes</button>
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
                            <input type="text" className="form-control" name='name' placeholder="Product Name" aria-label="Product Name" aria-describedby="product-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Model Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="model-name"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='model_name' placeholder="Model Name" aria-label="Model Name" aria-describedby="model-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">SKU:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="sku"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='sku' placeholder="SKU" aria-label="SKU" aria-describedby="sku" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='price' placeholder="Price" aria-label="Price" aria-describedby="price" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Temp Image Link:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="temp-img-link"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='temp_img_link' placeholder="Temp Image Link" aria-label="Temp Image Link" aria-describedby="temp-img-link" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Barcode Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="barcode-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='barcode_title' placeholder="Barcode Title" aria-label="Barcode Title" aria-describedby="barcode-title" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Masterbox Title:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="masterbox-title"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='masterbox_title' placeholder="Masterbox Title" aria-label="Masterbox Title" aria-describedby="masterbox-title" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Link Address:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="link-address-1688"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control" name='link_address_1688' placeholder="Link address" aria-label="Link address" aria-describedby="link-address-1688" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Price:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="price1688"><i className="bi bi-coin"></i></span>
                            <input type="text" className="form-control" name='price1688' defaultValue={0} placeholder="1688 Price" aria-label="1688 Price" aria-describedby="price1688" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">1688 Variation Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="variation-name-1688"><i className="bi bi-globe2"></i></span>
                            <input type="text" className="form-control" name='variation_name_1688' placeholder="1688 Variation Name" aria-label="1688 Variation Name" aria-describedby="variation-name-1688" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">PCS/CTN:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="pcs-ctn"><i className="bi bi-diagram-3"></i></span>
                            <input type="text" className="form-control" name='pcs_ctn' placeholder="PCS/CTN" aria-label="PCS/CTN" aria-describedby="pcs-ctn" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Weight:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="weight"><i className="bi bi-tag-fill"></i></span>
                            <input type="text" className="form-control" name='weight' defaultValue={0} placeholder="Weight" aria-label="Weight" aria-describedby="weight" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Dimensions:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="dimensions"><i className="bi bi-unity"></i></span>
                            <input type="text" className="form-control" name='dimensions' placeholder="Width * Height * Length" aria-label="Dimensions" aria-describedby="dimensions" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Supplier Group:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="supplier-group"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='supplier_group' placeholder="Supplier Group" aria-label="Supplier Group" aria-describedby="supplier-group" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">English Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="en-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='en_name' placeholder="English Name" aria-label="English Name" aria-describedby="en-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Romanian Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="ro-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='ro_name' placeholder="Romanian Name" aria-label="Romanian Name" aria-describedby="ro-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Material Name (EN):</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="en-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='en_mat_name' placeholder="Material Name (EN)" aria-label="Material Name (EN)" aria-describedby="en-mat-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Material Name (RO):</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="ro-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='ro_mat_name' placeholder="Material Name (RO)" aria-label="Material Name (RO)" aria-describedby="ro-mat-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">HS Code:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="hs-code"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='hs_code' placeholder="HS Code" aria-label="HS Code" aria-describedby="hs-code" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Battery:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="form-check form-switch form-check-custom form-check-solid">
                            <input className="form-check-input" type="checkbox" id="battery" name='battery' defaultChecked={false} readOnly={true} />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Default Usage:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="usage"><i className="bi bi-chat-dots-fill"></i></span>
                            <input type="text" className="form-control" name='usage' placeholder="Default Usage" aria-label="Default Usage" aria-describedby="usage" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Supplier Name:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="supplier-name"><i className="bi bi-coin"></i></span>
                            <input type="text" className="form-control" name='supplier_name' placeholder="Supplier Name" aria-label="Supplier Name" aria-describedby="supplier-name" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Supplier WeChat:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="supplier-wechat"><i className="bi bi-coin"></i></span>
                            <input type="text" className="form-control" name='supplier_wechat' placeholder="Supplier WeChat" aria-label="Supplier WeChat" aria-describedby="supplier-wechat" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Estimated Production Time:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="input-group">
                            <span className="input-group-text" id="production-time"><i className="bi bi-coin"></i></span>
                            <input type="text" className="form-control" name='production_time' placeholder="Production Time" aria-label="Production Time" aria-describedby="production-time" />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="d-flex fw-bold w-25">Discontinued:</div>
                        <div className="d-flex ms-auto mr-0 w-75">
                          <div className="form-check form-switch form-check-custom form-check-solid">
                            <input className="form-check-input" type="checkbox" id="discounted" name='discounted' defaultChecked={false} readOnly={true} />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Save changes</button>
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
    </Content>
  )
}