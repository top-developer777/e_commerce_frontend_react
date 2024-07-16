import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import Select, { MultiValue } from 'react-select'
import { createShipments, getAllProducts, getAllSuppliers, getShipments } from './_request';
import { Shipment } from '../../models/shipment';
import { Suppliers } from '../../models/supplier';

const shippingStatus = [
  {
    "value": "Customs",
    "label": "Customs"
  },
  {
    "value": "Arrived",
    "label": "Arrived"
  },
  {
    "value": 'New',
    "label": "New"
  },
  {
    "value": 'Shipped',
    "label": "Shipped"
  }
];
const fakeShipingType = [
  { value: 'Train', label: 'Train' },
  { value: 'Airplain', label: 'Airplain' },
  { value: 'Sea', label: 'Sea' },
]

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

const fakeshippings = [
  {
    "id": 1,
    "shippingType": "Standard Shipping",
    "picture": "https://via.placeholder.com/100",
    "productName": "Wireless Mouse",
    "quantity": 50,
    "price": 20.99,
    "total": 1049.50,
    "stock": 200,
    "salesPerDay": 10,
    "imports": "China",
    "unitsPerBox": 25,
    "supplier": {
      "name": "Tech Supplies Ltd.",
      "wechat": "techsupplies123"
    },
    "recommendedReorderQuantity": 100,
    "numberOfBoxes": 2,
    "orderSent": "2024-06-01",
    "payment": "Paid",
    "trackingNumber": "123456789",
    "arrivedAtAgent": "2024-06-05",
    "author": "John Doe"
  },
  {
    "id": 2,
    "shippingType": "Express Shipping",
    "picture": "https://via.placeholder.com/100",
    "productName": "Bluetooth Headphones",
    "quantity": 30,
    "price": 49.99,
    "total": 1499.70,
    "stock": 120,
    "salesPerDay": 15,
    "imports": "Vietnam",
    "unitsPerBox": 15,
    "supplier": {
      "name": "Audio Gear Inc.",
      "wechat": "audiogear456"
    },
    "recommendedReorderQuantity": 50,
    "numberOfBoxes": 2,
    "orderSent": "2024-06-02",
    "payment": "Pending",
    "trackingNumber": "987654321",
    "arrivedAtAgent": "2024-06-06",
    "author": "Jane Smith"
  },
  {
    "id": 3,
    "shippingType": "International Shipping",
    "picture": "https://via.placeholder.com/100",
    "productName": "Laptop",
    "quantity": 20,
    "price": 899.99,
    "total": 17999.80,
    "stock": 30,
    "salesPerDay": 5,
    "imports": "Romania",
    "unitsPerBox": 5,
    "supplier": {
      "name": "Electronics Hub",
      "wechat": "electronichub001"
    },
    "recommendedReorderQuantity": 40,
    "numberOfBoxes": 4,
    "orderSent": "2024-06-04",
    "payment": "Pending",
    "trackingNumber": "321654987",
    "arrivedAtAgent": "2024-06-08",
    "author": "Michael Brown"
  }
]

interface Shipping {
  id: number;
  shippingType: string;
  picture: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  stock: number;
  salesPerDay: number;
  imports: string;
  unitsPerBox: number;
  supplier: {
    name: string;
    wechat: string;
  }
  recommendedReorderQuantity: number;
  numberOfBoxes: number;
  orderSent: string;
  payment: string;
  trackingNumber: string;
  arrivedAtAgent: string;
  author: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const Icon: React.FC<{
  payment: string;
}> = props => (
  <>
    {
      props.payment == "Paid" ?
        <div>
          <span className="badge badge-light-success fw-bold fs-7 p-2">
            <i className='bi bi-check2-circle text-success fw-bold'></i>&nbsp;
            {props.payment}
          </span>
        </div>
        : props.payment == "Pending" ?
          <div>
            <span className="badge badge-light-warning fw-bold fs-7 p-2">
              <i className='bi bi-slash-circle text-warning fw-bold'></i>&nbsp;
              {props.payment}
            </span>
          </div>
          : <div>

          </div>
    }
  </>
)

const StatusBadge: React.FC<{
  status: string;
}> = props => (
  <>
    {
      props.status == "Customs" ?
        <div>
          <span className="badge badge-light-danger fw-bold fs-7 p-2">
            {props.status}
          </span>
        </div>
        : props.status == "Arrived" ?
          <div>
            <span className="badge badge-light-success fw-bold fs-7 p-2">
              {props.status}
            </span>
          </div>
          : props.status == "New" ?
            <div>
              <span className="badge badge-light-dark text-gray-800 fw-bold fs-7 p-2">
                {props.status}
              </span>
            </div>
            : props.status == "Shipped" ?
              <div>
                <span className="badge badge-light-warning fw-bold fs-7 p-2">
                  {props.status}
                </span>
              </div>
              : <div>

              </div>
    }
  </>
)

const TableProductPlanner: React.FC<{
  editID?: number;
  confirm: () => void;
  productName: string;
  selectedProductID: number;
  shippings: Shipping[];
  setEditID: React.Dispatch<React.SetStateAction<number>>;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Shipping>>;
  setSelectedProductID: React.Dispatch<React.SetStateAction<number>>;
}> = props => {
  return (
    <table className="table table-rounded table-hover table-striped table-row-bordered border gy-7 gs-7">
      <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
          <th className='text-center align-content-center px-1'>shipping type</th>
          <th className='text-center align-content-center px-1'>Picture</th>
          <th className='text-start align-content-center px-1 col-md-2'>Product name</th>
          <th className='text-center align-content-center px-0'>Quantity</th>
          <th className='text-center align-content-center px-1'>Price</th>
          <th className='text-center align-content-center px-1'>Total</th>
          <th className='text-center align-content-center px-1'>Stock</th>
          <th className='text-center align-content-center px-1'>Sales<br />per day</th>
          <th className='text-center align-content-center px-1'>Imports</th>
          <th className='text-center align-content-center px-1'>Nr pf<br />units<br />perbox</th>
          <th className='text-center align-content-center px-1 py-0'>Supplier Name<br />/ WeChat</th>
          <th className='text-center align-content-center px-1 py-0'>Recommended<br />quantity for<br />reordering</th>
          <th className='text-center align-content-center px-1'>Number<br />of boxes</th>
          <th className='text-center align-content-center px-0'>Order Sent</th>
          <th className='text-center align-content-center px-1'>Payment</th>
          <th className='text-center align-content-center px-1'>Tracking Number</th>
          <th className='text-center align-content-center px-1'>Arrived at agent</th>
          <th className='text-center align-content-center px-1'>Author</th>
        </tr>
      </thead>
      <tbody>
        {
          props.shippings.map((shipping, index) =>
            <tr key={`planner${index}`} className='py-1 cursor-pointer' onClick={() => props.setSelectedProduct(props.shippings[index])}>
              <td className='align-content-center text-center'>
                {
                  shipping.shippingType
                }
              </td>
              <td className='align-content-center py-3 px-0'>
                <div className='p-2 align-content-center text-center'>
                  {
                    shipping.picture.length > 0 ? <img width={60} height={60} src={shipping.picture} alt={`${shipping.id}`} />
                      :
                      <div>
                        No Image
                      </div>
                  }
                </div>
              </td>
              <td className='text-start align-content-center'>
                {
                  index == props.editID ?
                    <div className='d-flex flex-row-fluid align-content-center'>
                      <input
                        type="text"
                        className="form-control form-control-solid py-2"
                        placeholder="Product Name"
                        value={props.productName}
                        onChange={e => props.setProductName(e.target.value)}
                      />
                      <a className='btn btn-white btn-sm p-0 align-content-center' onClick={() => props.confirm()}>
                        <i className="bi bi-check-lg fs-3 p-1"></i>
                      </a>
                    </div>
                    :
                    <>
                      {
                        shipping.productName
                      }
                      <a className='btn btn-white btn-sm p-0' onClick={() => props.setEditID(index)}>
                        <i className="bi bi-pencil-square fs-3 p-1"></i>
                      </a>
                    </>
                }

              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.quantity.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  formatCurrency(shipping.price)
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  formatCurrency(shipping.total)
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.stock.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.salesPerDay.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.imports
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.unitsPerBox.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.supplier.name
                }<br />
                {
                  shipping.supplier.wechat
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.recommendedReorderQuantity.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.numberOfBoxes.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.orderSent.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                <Icon payment={shipping.payment} />
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.trackingNumber
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.arrivedAtAgent
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipping.author
                }
              </td>
            </tr>
          )
        }
      </tbody>
    </table>
  )
}

const TableShipment: React.FC<{
  shipments: Shipment[];
  setSelectedShipment: React.Dispatch<React.SetStateAction<number>>;
  setEditShipement: React.Dispatch<React.SetStateAction<Shipment | undefined>>;
}> = props => {
  return (
    <table className="table table-rounded table-hover table-striped table-row-bordered border gy-7 gs-7" id='table-shipment'>
      <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
          <th className='align-content-center'>Supplier Name</th>
          <th className='align-content-center'>Shipping Type</th>
          <th className='text-center align-content-center px-1'>Created Date</th>
          <th className='text-center align-content-center px-1'>Status</th>
          <th className='text-center align-content-center px-1'>Note</th>
          <th className='text-center align-content-center px-1'>Estimated Date</th>
          <th className='text-center align-content-center px-1'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          props.shipments.map((shipment, index) =>
            <tr className='py-1 cursor-pointer' key={`shipment${index}`}>
              <td className='align-content-center' onClick={() => props.setSelectedShipment(index)}>{shipment.supplier_name}</td>
              <td className='align-content-center' onClick={() => props.setSelectedShipment(index)}>{shipment.type}</td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                { shipment.date.toLocaleString() }
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                <StatusBadge status={shipment.status} />
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                { shipment.note }
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                { shipment.expect_date.toLocaleString() }
              </td>
              <td className='text-center align-content-center'>
                <a className='btn btn-white btn-active-light-danger btn-sm p-2' data-bs-toggle="modal" data-bs-target="#editShipmentModal" onClick={() => props.setEditShipement(shipment)}>
                  <i className="bi text-danger bi-slash-circle fs-3 p-1"></i>
                </a>
              </td>
            </tr>
          )
        }
      </tbody>
    </table>
  )
}

export function ShippingManagement() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shippings, setshippings] = useState<Shipping[]>([]);
  const [shipingTypes, setShipingTypes] = useState<{ value: string; label: string; }[]>([]);
  const [editID, setEditID] = useState<number>(-1);
  const [productName, setProductName] = useState<string>('');
  const [selectedShipment, setSelectedShipment] = useState<number>(-1);
  const [editShipement, setEditShipement] = useState<Shipment>();
  const [selectedProductID, setSelectedProductID] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Shipping>(fakeshippings[0]);
  const [products, setProducts] = useState<{ [key: string]: string }[]>([]);
  const [totalProducts, setTotalProducts] = useState<{ [key: string]: string }[]>([]);
  const [numProducts, setNumProducts] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<{ value: string; label: string; }[]>([]);

  useEffect(() => {
    setShipingTypes(fakeShipingType);
    setshippings(fakeshippings);
    setSelectedProduct(fakeshippings[0]);
    getShipments()
      .then(res => setShipments(res.data))
      .catch(e => console.error(e));
    getAllSuppliers(1, 100)
      .then(res => {
        setSuppliers(res.data.map((dat: Suppliers) => { return { value: dat.name, label: `${dat.group} / ${dat.name}`} }))
      })
  }, [])
  useEffect(() => {
    if (editID != -1) {
      setProductName(shippings[editID]['productName'])
    }
  }, [editID, shippings]);
  useEffect(() => {
    setSelectedProductID(0);
  }, [selectedShipment]);
  useEffect(() => {
    getAllProducts()
      .then(res => {
        const data = res.data;
        const products = data.map((datum: { [key: string]: string }) => {
          return { value: datum.ean, label: datum.product_name }
        });
        setTotalProducts(products);
        setProducts(products);
      })
      .catch(e => console.error(e));
  }, []);

  const confirm = () => {
    setshippings(shippings.map((shipping, index) => {
      if (index == editID) {
        const obj = shipping
        obj.productName = productName
        return obj
      } else {
        return shipping
      }
    }
    ))
    setEditID(-1);
  }
  const loadMoreProducts = () => {
    const size = products.length;
    const newProducts = totalProducts.slice(0, size + 10);
    setProducts(newProducts);
  }
  const handleSave = () => {
    const nameComp = document.querySelector('#createShipmentModal input[name="name"]') as HTMLInputElement;
    const delivery_dateComp = document.querySelector('#createShipmentModal input[name="delivery_date"]') as HTMLInputElement;
    const typeComp = document.querySelector('#createShipmentModal input[name="type"][type="hidden"]') as HTMLInputElement;
    const productsComp = document.querySelectorAll('#createShipmentModal input[name="products"][type="hidden"]') as unknown as HTMLInputElement[];
    const quantityComp = document.querySelectorAll('#createShipmentModal input[name="numProduct"][type="number"]') as unknown as HTMLInputElement[];
    const statusComp = document.querySelector('#createShipmentModal input[name="status"][type="hidden"]') as HTMLInputElement;
    const noteComp = document.querySelector('#createShipmentModal textarea[name="note"]') as HTMLInputElement;
    const name = nameComp.value;
    const delivery_date = delivery_dateComp.value;
    const type = typeComp.value;
    const products: string[] = [];
    const quantity: number[] = [];
    if (quantityComp.length)
      quantityComp.forEach(p => quantity.push(parseInt(p.value)));
    if (productsComp.length)
      productsComp.forEach(p => products.push(p.value));
    const status = statusComp.value;
    const note = noteComp.value;
    const now = new Date();
    if (!name || !delivery_date || !(products.length) || !(quantity.length)) return;
    const data = {
      date: now.toISOString().split('T')[0],
      expect_date: delivery_date,
      type: type,
      product_name_list: products,
      quantity_list: quantity,
      supplier_name: name,
      status: status,
      note: note,
    }
    createShipments(data)
      .then(res => {
        console.log(res);
        const closeBtn = document.querySelector('#createShipmentModal button[data-bs-dismiss="modal"]') as HTMLInputElement;
        closeBtn.click();
      })
      .catch(e => console.error(e));
  }
  const filterByShippingType = (shippingType: MultiValue<{ value: string, label: string }> = []) => {
    const values = shippingType.map(type => type.value);
    const filter = shipingTypes.map(type => {
      if (values.findIndex(value => value === type.label) >= 0) return type.label;
    }).filter(value => value !== undefined).join(', ');
    const trs = document.querySelectorAll('table#table-shipment > tbody > tr');
    trs.forEach(tr => {
      const type = tr.querySelector('td:nth-child(3)')?.textContent;
      if (type && type.indexOf(filter) === -1) tr.setAttribute('style', 'display: none');
      else tr.setAttribute('style', 'display: table-row');
    });
  }

  return (
    <Content>
      {
        selectedShipment === -1 ?
          <>
            <div className="row">
              <div className="col-md-6">
                <button className="btn btn-light-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createShipmentModal">
                  <i className="bi bi-plus-circle"></i>Create Shipment
                </button>
              </div>
              <div className="col-md-3 align-content-center text-end">Filter By Shipping Type:</div>
              <div className="col-md-3">
                <Select
                  className='react-select-styled react-select-solid react-select-sm'
                  options={shipingTypes}
                  isMulti
                  isSearchable={false}
                  onChange={e => filterByShippingType(e)}
                  placeholder="Select shipping types"
                />
              </div>
            </div>
            <TableShipment shipments={shipments} setSelectedShipment={setSelectedShipment} setEditShipement={setEditShipement} />
          </>
          :
          <>
            <div className="row">
              <div className="col-md-12">
                <button className="btn btn-sm btn-primary" onClick={() => setSelectedShipment(-1)}>
                  <i className="bi bi-backspace-fill"></i> Back to Shipment List
                </button>
              </div>
            </div>
            <div className='row'>
              <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
                <div className="card-header pt-4 w-full">
                  <div>
                    <h3 className="text-gray-800 card-title align-content-center">Order Dashboard</h3>
                  </div>
                  {/* <div>
                    <button type='button' className='btn btn-light btn-light-primary p-3' onClick={() => setEditID(-2)}>
                      <i className="bi bi-cloud-arrow-down"></i>
                      Download Invoice
                    </button>
                    <button type='button' className='btn btn-light btn-light-primary mx-6' onClick={() => setEditID(-2)}>
                      <i className="bi bi-diagram-2"></i>
                      Generate Order Agent
                    </button>
                  </div> */}
                </div>
                <div className="card-body p-6">
                  <div className='row mb-2'>
                    <div className='col-md-4'>
                      <span className='text-gray-700'>Total Units</span><br />
                      <h4 className='text-gray-900 text-hover-primary'>
                        {
                          selectedProduct && (selectedProduct.numberOfBoxes * selectedProduct.unitsPerBox).toLocaleString()
                        }
                      </h4>
                    </div>
                    <div className='col-md-8'>
                      <span className='text-gray-700'>Shiping Type</span><br />
                      <div className='col-md-4'>
                        <Select
                          className='react-select-styled react-select-solid react-select-sm'
                          classNamePrefix='react-select'
                          options={shipingTypes}
                          placeholder='Select Shiping Type'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-2'>
                    <div className='col-md-4'>
                      <span className='text-gray-700'>Total Boxes</span><br />
                      <h4 className='text-gray-900 text-hover-primary'>
                        {
                          selectedProduct && selectedProduct.numberOfBoxes.toLocaleString()
                        }
                      </h4>
                    </div>
                    <div className='col-md-8'>
                      <span className='text-gray-700'>Agent</span><br />
                      <div className='col-md-4'>
                        <Select
                          className='react-select-styled react-select-solid react-select-sm'
                          classNamePrefix='react-select'
                          options={fakeAgent}
                          placeholder='Select an Agent'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row mb-2'>
                    <div className='col-md-4'>
                      <span className='text-gray-700'>Total</span><br />
                      <h4 className='text-gray-900 text-hover-primary'>
                        {
                          selectedProduct && formatCurrency(selectedProduct.total)
                        }
                      </h4>
                    </div>
                    <div className='col-md-8'>
                      <span className='text-gray-700'>Tracking Number</span><br />
                      <input
                        type="text"
                        className="form-control form-control-solid p-2"
                        placeholder="Tracking Number"
                        value={selectedProduct?.trackingNumber}
                        onChange={e => setSelectedProduct({ ...selectedProduct, trackingNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-4'>
                      <span className='text-gray-700'>Total Volume</span><br />
                      <h4 className='text-gray-900 text-hover-primary'>
                        483,223,223
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 table-responsive">
                <TableProductPlanner selectedProductID={selectedProductID} setSelectedProduct={setSelectedProduct} setSelectedProductID={setSelectedProductID} confirm={confirm} setEditID={setEditID} editID={editID} setProductName={setProductName} productName={productName} shippings={shippings} />
              </div>
            </div>
          </>
      }
      <div className="modal fade" id='createShipmentModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Create Shipment</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="" method='post' id='editProductForm'>
                <label className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Supplier Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='name'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={suppliers}
                      placeholder='Select a supplier'
                      noOptionsMessage={e => `No more suppliers including "${e.inputValue}"`}
                      defaultValue={suppliers[0] ?? null}
                    />
                  </div>
                </label>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Shipping Type:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='type'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={shipingTypes}
                      placeholder='Select shipping type'
                      isSearchable={false}
                      noOptionsMessage={e => `No more shipping type${e.inputValue}`}
                      defaultValue={{ value: 'Train', label: 'Train' }}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Products:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='products'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={products}
                      placeholder='Select products'
                      isMulti
                      onMenuScrollToBottom={loadMoreProducts}
                      noOptionsMessage={e => `No products including "${e.inputValue}"`}
                      hideSelectedOptions
                      value={products.filter(product => numProducts.findIndex(ean => ean === product.value) >= 0)}
                      onChange={product => setNumProducts(product.map(p => p.value))}
                    />
                  </div>
                </div>
                {!!numProducts.length && <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Number of products:</div>
                  <div className="d-flex ms-auto mr-0 w-75 flex-column">
                    {numProducts.map(ean => (
                      <div className="d-flex w-100" key={`numProduct${ean}`}>
                        <div className="d-flex align-items-center p-2 me-auto" style={{ width: '75%' }}>
                          <div className="d-block overflow-hidden" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {products.find(p => p.value === ean)?.label}
                          </div>
                        </div>
                        <div className="d-flex m-0" style={{ width: '20%', minWidth: '50px' }}><input type="number" name='numProduct' defaultValue={1} min={1} className='form-control' /></div>
                        <div className="d-flex m-0">
                          <button className="btn btn-light-primary btn-sm" onClick={() => setNumProducts(numProducts.filter(prod => prod !== ean))}><i className="bi bi-dash-circle"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>}
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Shipment Status:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='status'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={shippingStatus}
                      placeholder='Select shipment status'
                      isSearchable={false}
                      noOptionsMessage={e => `No more shipping status${e.inputValue}`}
                      defaultValue={shippingStatus[2]}
                    />
                  </div>
                </div>
                <label className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Expected Delivery Date:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="date" className="form-control" name='delivery_date' placeholder="Expected Delivery Date" />
                    </div>
                  </div>
                </label>
                <label className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Note (Optional):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <textarea className="form-control" name='note' placeholder="Note" rows={3} />
                    </div>
                  </div>
                </label>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="bi bi-x"></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}><i className="bi bi-save"></i>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id='editShipmentModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Create Shipment</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editShipement && <form action="" method='post' id='editProductForm'>
                <label className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Supplier Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='name'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={suppliers}
                      placeholder='Select a supplier'
                      noOptionsMessage={e => `No more suppliers including "${e.inputValue}"`}
                      defaultValue={suppliers.find(sup => sup.value === editShipement.supplier_name)}
                    />
                  </div>
                </label>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Shipping Type:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='type'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={shipingTypes}
                      placeholder='Select shipping type'
                      isSearchable={false}
                      defaultValue={fakeShipingType.find(type => editShipement.type === type.value)}
                      noOptionsMessage={e => `No more shipping type${e.inputValue}`}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Products:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='products'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={products}
                      placeholder='Select products'
                      isMulti
                      onMenuScrollToBottom={loadMoreProducts}
                      noOptionsMessage={e => `No products including "${e.inputValue}"`}
                      hideSelectedOptions
                      onChange={product => setNumProducts(product.map(p => p.value))}
                      value={products.filter(type => editShipement.product_name_list.findIndex(item => item === type.value))}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Number of products:</div>
                  <div className="d-flex ms-auto mr-0 w-75 flex-column">
                    {editShipement.product_name_list.map((ean, index) => (
                      <div className="d-flex w-100" key={`numProduct${ean}`}>
                        <div className="d-flex align-items-center p-2 w-auto me-auto">
                          <div className="d-block overflow-hidden" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {products.find(p => p.value === `${ean}`)?.label}
                          </div>
                        </div>
                        <div className="d-flex m-0" style={{ width: '20%' }}>
                          <input type="number" name='numProduct' defaultValue={editShipement.quantity_list[index]} min={1} className='form-control' />
                        </div>
                        <div className="d-flex m-0">
                          <button className="btn btn-primary btn-sm" onClick={() => setNumProducts(numProducts.filter(prod => prod !== ean))}><i className="bi bi-dash-circle"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Shipment Status:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='status'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={shippingStatus}
                      placeholder='Select shipment status'
                      isSearchable={false}
                      noOptionsMessage={e => `No more shipping status${e.inputValue}`}
                      defaultValue={shippingStatus.filter(status => status.value === editShipement.status)}
                    />
                  </div>
                </div>
                <label className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Expected Delivery Date:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="date" className="form-control" name='delivery_date' placeholder="Expected Delivery Date" min={0} defaultValue={editShipement.expect_date} />
                    </div>
                  </div>
                </label>
                <label className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Note (Optional):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <textarea className="form-control" name='note' placeholder="Note" rows={3} defaultValue={editShipement.note} />
                    </div>
                  </div>
                </label>
              </form>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="bi bi-x"></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}><i className="bi bi-save"></i>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}