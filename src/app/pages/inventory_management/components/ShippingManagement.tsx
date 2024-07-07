import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
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

const fakeShipments = [
  {
    "shipment_name": "Express Delivery",
    "createAt": "2024-06-17",
    "nr": 1,
    "new": 0,
    "awb": "AWB123456789",
    "status": "Customs",
    "note": "Handle with care",
    "est_date": "2024-06-20"
  },
  {
    "shipment_name": "Standard Shipping",
    "createAt": "2024-06-15",
    "nr": 2,
    "new": 12,
    "awb": "AWB987654321",
    "status": "Customs",
    "note": "Left at front door",
    "est_date": "2024-06-18"
  },
  {
    "shipment_name": "Overnight Express",
    "createAt": "2024-06-16",
    "nr": 3,
    "new": 0,
    "awb": "AWB456123789",
    "status": "Arrived",
    "note": "Urgent delivery",
    "est_date": "2024-06-17"
  },
  {
    "shipment_name": "International Cargo",
    "createAt": "2024-06-14",
    "nr": 4,
    "new": 0,
    "awb": "AWB321654987",
    "status": "New",
    "note": "Documents attached",
    "est_date": "2024-06-22"
  },
  {
    "shipment_name": "International Cargo",
    "createAt": "2024-06-14",
    "nr": 4,
    "new": 0,
    "awb": "AWB321654987",
    "status": "Shipped",
    "note": "Documents attached",
    "est_date": "2024-06-22"
  }
];

interface Shipment {
  shipment_name: string;
  createAt: string;
  nr: number;
  new: number;
  awb: string;
  status: string;
  note: string;
  est_date: string;
}

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
            <tr className='py-1 cursor-pointer' onClick={() => props.setSelectedProduct(props.shippings[index])}>
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
}> = props => {
  return (
    <table className="table table-rounded table-hover table-striped table-row-bordered border gy-7 gs-7">
      <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
          <th className='align-content-center'>Shipment Name</th>
          <th className='text-center align-content-center px-1'>Created Date</th>
          <th className='text-center align-content-center px-1 col-md-2'>Nr.</th>
          <th className='text-center align-content-center px-0'>New</th>
          <th className='text-center align-content-center px-1'>AWB</th>
          <th className='text-center align-content-center px-1'>Status</th>
          <th className='text-center align-content-center px-1'>Note</th>
          <th className='text-center align-content-center px-1'>Estimated Date</th>
          <th className='text-center align-content-center px-1'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          props.shipments.map((shipment, index) =>
            <tr className='py-1 cursor-pointer' onClick={() => props.setSelectedShipment(index)} key={`shipment${index}`}>
              <td className='align-content-center'>
                {
                  shipment.shipment_name
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipment.createAt.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipment.nr.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipment.new.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipment.awb
                }
              </td>
              <td className='text-center align-content-center'>
                <StatusBadge status={shipment.status} />
              </td>
              <td className='text-center align-content-center'>
                {
                  shipment.note
                }
              </td>
              <td className='text-center align-content-center'>
                {
                  shipment.est_date.toLocaleString()
                }
              </td>
              <td className='text-center align-content-center'>
                <a className='btn btn-white btn-active-light-danger btn-sm p-2'>
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
  const [shipingTypes, setShipingTypes] = useState<{ value: number; label: string; }[]>([]);
  const [editID, setEditID] = useState<number>(-1);
  const [productName, setProductName] = useState<string>('');
  const [selectedShipment, setSelectedShipment] = useState<number>(-1);
  const [selectedProductID, setSelectedProductID] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Shipping>(fakeshippings[0]);

  useEffect(() => {
    setShipments(fakeShipments);
    setShipingTypes(fakeShipingType);
    setshippings(fakeshippings);
    setSelectedProduct(fakeshippings[0]);
  }, [])

  useEffect(() => {
    if (editID != -1) {
      setProductName(shippings[editID]['productName'])
    }
  }, [editID, shippings])

  useEffect(() => {
    setSelectedProductID(0);
  }, [selectedShipment])

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

  return (
    <Content>
      {
        selectedShipment == -1 ?
          <TableShipment shipments={shipments} setSelectedShipment={setSelectedShipment} />
          :
          <div className='row'>
            <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
              <div className="card-header pt-4 w-full">
                <div>
                  <h3 className="text-gray-800 card-title align-content-center">Order Dashboard</h3>
                </div>
                <div>
                  <button type='button' className='btn btn-light btn-light-primary p-3' onClick={() => setEditID(-2)}>
                    <i className="bi bi-cloud-arrow-down"></i>
                    Download Invoice
                  </button>
                  <button type='button' className='btn btn-light btn-light-primary mx-6' onClick={() => setEditID(-2)}>
                    <i className="bi bi-diagram-2"></i>
                    Generate Order Agent
                  </button>
                </div>
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
            <TableProductPlanner selectedProductID={selectedProductID} setSelectedProduct={setSelectedProduct} setSelectedProductID={setSelectedProductID} confirm={confirm} setEditID={setEditID} editID={editID} setProductName={setProductName} productName={productName} shippings={shippings} />
          </div>
      }
    </Content>
  )
}