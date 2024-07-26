import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import Select, { MultiValue } from 'react-select'
import { createShipments, getAllProducts, getShipments } from './_request';
import { Shipment } from '../../models/shipment';
import { getWarehouses } from '../../dashboard/components/_request';
import { WarehouseType } from '../../models/warehouse';
import { Product } from '../../models/product';

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
          <th className='text-center align-content-center px-1'>Shipping type</th>
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
  setEditShipment: React.Dispatch<React.SetStateAction<Shipment | undefined>>;
}> = props => {
  return (
    <table className="table table-rounded table-hover table-striped table-row-bordered border gy-7 gs-7" id='table-shipment'>
      <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
          <th className='align-content-center'>Agent Name</th>
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
              <td className='align-content-center' onClick={() => props.setSelectedShipment(index)}>{shipment.agent_name}</td>
              <td className='align-content-center' onClick={() => props.setSelectedShipment(index)}>{shipment.type}</td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                {shipment.date.toLocaleString()}
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                <StatusBadge status={shipment.status} />
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                {shipment.note}
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                {shipment.expect_date ? shipment.expect_date.toLocaleString() : ''}
              </td>
              <td className='text-center align-content-center'>
                <a className='btn btn-white btn-active-light-danger btn-sm p-2' data-bs-toggle="modal" data-bs-target="#editShipmentModal" onClick={() => props.setEditShipment(shipment)}>
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
  const [editShipment, setEditShipment] = useState<Shipment>();
  const [selectedProductID, setSelectedProductID] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Shipping>(fakeshippings[0]);
  const [products, setProducts] = useState<{ value: string, label: string }[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  interface SelectedProduct {
    ean: string;
    quantity: number;
    supplier_name: string;
    item: string;
    pdf_sent: boolean;
    pay_url: string;
    tracking: string;
    arrive_agent: boolean;
    wechat_group: string;
    pp: string;
    each_status: string;
    shipment_name: string;
    box_number: number;
    document: string;
    add_date: string;
    date_agent: string;
    SID: string;
    GID: string;
    date_port: string;
    newid: string;
  }
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: SelectedProduct
  }>({});
  // const [agents, setAgents] = useState<{ value: string; label: string; }[]>([]);
  const [warehouses, setWarehouses] = useState<{ value: string; label: string; }[]>([]);

  useEffect(() => {
    setShipingTypes(fakeShipingType);
    setshippings(fakeshippings);
    setSelectedProduct(fakeshippings[0]);
    getShipments()
      .then(res => setShipments(res.data))
      .catch(e => console.error(e));
    getWarehouses()
      .then(res => res.data)
      .then(res => {
        const dict = res.map((data: WarehouseType) => {
          return { value: data.name, label: data.name }
        });
        setWarehouses(dict);
      })
      .catch(e => console.error(e));
  }, []);
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
        setAllProducts(data);
        const products = data.map((datum: { [key: string]: string }) => {
          return { value: datum.ean, label: datum.product_name }
        });
        setProducts(products);
      })
      .catch(e => console.error(e));
  }, []);
  useEffect(() => {
    if (editShipment) {
      const dict: { [key: number]: SelectedProduct } = {};
      for (let i = 0; i < editShipment.ean.length; i++) {
        dict[i + 1] = {
          ean: editShipment.ean[i],
          quantity: editShipment.quantity[i],
          supplier_name: editShipment.supplier_name[i],
          item: editShipment.item[i],
          pdf_sent: editShipment.pdf_sent[i],
          pay_url: editShipment.pay_url[i],
          tracking: editShipment.tracking[i],
          arrive_agent: editShipment.arrive_agent[i],
          wechat_group: editShipment.wechat_group[i],
          pp: editShipment.pp[i],
          each_status: editShipment.each_status[i],
          shipment_name: editShipment.shipment_name[i],
          box_number: editShipment.box_number[i],
          document: editShipment.document[i],
          add_date: editShipment.add_date[i],
          date_agent: editShipment.date_agent[i],
          SID: editShipment.SID[i],
          GID: editShipment.GID[i],
          date_port: editShipment.date_port[i],
          newid: editShipment.newid[i],
        }
      }
      setSelectedProducts(dict);
    } else {
      setSelectedProducts({});
    }
  }, [editShipment])

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
  const handleSave = () => {
    let id = 'createShipmentModal';
    if (editShipment) id = 'editShipmentModal';
    const nameComp = document.querySelector(`#${id} input[name="shipment_name"]`) as HTMLInputElement;
    const agentComp = document.querySelector(`#${id} input[name="agent"]`) as HTMLInputElement;
    const delivery_dateComp = document.querySelector(`#${id} input[name="delivery_date"]`) as HTMLInputElement;
    const typeComp = document.querySelector(`#${id} input[name="type"][type="hidden"]`) as HTMLInputElement;
    const statusComp = document.querySelector(`#${id} input[name="status"][type="hidden"]`) as HTMLInputElement;
    const warehouseComp = document.querySelector(`#${id} input[name="warehouse"]`) as HTMLInputElement;
    const noteComp = document.querySelector(`#${id} textarea[name="note"]`) as HTMLInputElement;
    const name = nameComp.value;
    const agent = agentComp.value;
    const warehouse = warehouseComp.value;
    const delivery_date = delivery_dateComp.value;
    const type = typeComp.value;
    const status = statusComp.value;
    const note = noteComp.value;
    const now = new Date();
    // if (!name || !delivery_date) return;
    type keyType = 'ean' | 'quantity' | 'supplier_name' | 'item' | 'pdf_sent' | 'pay_url' | 'tracking' | 'arrive_agent'
      | 'wechat_group' | 'pp' | 'each_status' | 'shipment_name' | 'box_number' | 'document' | 'add_date' | 'date_agent'
      | 'SID' | 'GID' | 'date_port' | 'newid';
    let firstKey;
    for (const key in selectedProducts) {
      firstKey = key.toString();
      break;
    }
    if (!firstKey) return;
    const products: { [key: string]: (string | number | boolean)[] } = {};
    Object.keys(selectedProducts[parseInt(firstKey)]).map(key => {
      products[key] = Object.values(selectedProducts).map(product => product[key as keyType]);
    });
    const data = {
      agent: agent,
      date: now.toISOString().split('T')[0],
      expect_date: delivery_date,
      type: type,
      title: name,
      status: status,
      note: note,
      warehouse: warehouse,
      ...products
    }
    createShipments(data)
      .then(res => {
        console.log(res);
        const closeBtn = document.querySelector(`#${id} button[data-bs-dismiss="modal"]`) as HTMLInputElement;
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
                <button className="btn btn-light-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createShipmentModal" onClick={() => setEditShipment(undefined)}>
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
            <TableShipment shipments={shipments} setSelectedShipment={setSelectedShipment} setEditShipment={setEditShipment} />
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
                    <h3 className="text-gray-800 card-title align-content-center">Details of {shipments[selectedShipment].title}</h3>
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
                        {selectedProduct && (selectedProduct.numberOfBoxes * selectedProduct.unitsPerBox).toLocaleString()}
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
        <div className="modal-dialog modal-dialog modal-dialog-scrollable modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Create Shipment</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="" method='post' id='editProductForm'>
                <div className="row">
                  <div className="col-md-1"></div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Shipment Name:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='shipment_name' placeholder="Shipment Name" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Shipping Type:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
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
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Shipment Status:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
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
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Warehouse:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <Select
                              name='warehouse'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={warehouses}
                              placeholder='Select a warehouse'
                              noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                              defaultValue={warehouses[0] ?? null}
                            />
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Expected Delivery Date:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="date" className="form-control" name='delivery_date' placeholder="Expected Delivery Date" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Agent Name:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            {/* <Select
                              name='name'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={agents}
                              placeholder='Select an agent'
                              noOptionsMessage={e => `No more agents including "${e.inputValue}"`}
                              defaultValue={agents[0] ?? null}
                            /> */}
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='agent' placeholder="Agent Name" />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Note (Optional):</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <textarea className="form-control" name='note' placeholder="Note" rows={3} />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <hr />
                    <h1>Products</h1>
                    <div className="row">
                      <div className="col-md-12 overflow-auto">
                        <table className='table table-bordered table-hover w-100 text-nowrap' style={{ overflowY: 'visible' }}>
                          <thead>
                            <tr className="py-1 fs-4 fw-bold text-center">
                              <th></th>
                              <th></th>
                              <th style={{ minWidth: '500px' }}>Product</th>
                              <th>Quantity</th>
                              <th>Supplier</th>
                              <th>Item</th>
                              <th>PDF sent</th>
                              <th>Pay URL</th>
                              <th>Tracking</th>
                              <th>Arrive to Agent</th>
                              <th>Wechat Group</th>
                              <th>PP</th>
                              <th>Each Status</th>
                              <th>Shipment Name</th>
                              <th>Box Number</th>
                              <th>Document</th>
                              <th>Created Date</th>
                              <th>Date to Agent</th>
                              <th>SID</th>
                              <th>GID</th>
                              <th>Date to Port</th>
                              <th>New ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(selectedProducts).map((index) => (
                              <tr className="py-1 fw-bold" key={`tr${index}`}>
                                <td className='align-content-center'>
                                  <button type='button' className="btn btn-light-danger btn-sm d-flex" onClick={() => {
                                    const newProArr = { ...selectedProducts };
                                    delete newProArr[parseInt(index)];
                                    setSelectedProducts(newProArr);
                                  }}>
                                    <i className="bi bi-trash-fill"></i>
                                  </button>
                                </td>
                                <td style={{ minWidth: '50px' }}>
                                  <img src={allProducts.find(product => product.ean === selectedProducts[parseInt(index)].ean)?.image_link ?? ''} alt="" width={35} />
                                </td>
                                <td>
                                  <Select
                                    name='products'
                                    className='react-select-styled react-select-solid react-select-sm w-100'
                                    options={products}
                                    placeholder='Select a product'
                                    noOptionsMessage={e => `No products including "${e.inputValue}"`}
                                    hideSelectedOptions
                                    captureMenuScroll={true}
                                    menuPlacement={'auto'}
                                    menuPortalTarget={document.querySelector('#createShipmentModal') as HTMLElement}
                                    value={products.find(product => product.value === selectedProducts[parseInt(index)].ean)}
                                    onChange={product => setSelectedProducts({
                                      ...selectedProducts,
                                      [parseInt(index)]: {
                                        ean: product?.value ?? '',
                                        quantity: 1,
                                        supplier_name: '',
                                        item: '',
                                        pdf_sent: false,
                                        pay_url: '',
                                        tracking: '',
                                        arrive_agent: false,
                                        wechat_group: '',
                                        pp: '',
                                        each_status: '',
                                        shipment_name: '',
                                        box_number: 0,
                                        document: '',
                                        add_date: '',
                                        date_agent: '',
                                        SID: '',
                                        GID: '',
                                        date_port: '',
                                        newid: '',
                                      }
                                    })}
                                  />
                                </td>
                                <td>
                                  <input type="number" name='numProduct' value={selectedProducts[parseInt(index)].quantity} min={1} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].quantity = parseInt(e.target.value);
                                    setSelectedProducts(newProducts);
                                  }} className='form-control form-control-sm d-flex' />
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].supplier_name} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].supplier_name = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].item} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].item = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td className='align-content-center'>
                                  <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                    <input className="form-check-input" type="checkbox" checked={selectedProducts[parseInt(index)].pdf_sent} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].pdf_sent = e.target.checked;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </div>
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].pay_url} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].pay_url = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].tracking} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].tracking = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td className='align-content-center'>
                                  <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                    <input className="form-check-input" type="checkbox" checked={selectedProducts[parseInt(index)].arrive_agent} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].arrive_agent = e.target.checked;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </div>
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].wechat_group} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].wechat_group = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].pp} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].pp = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].each_status} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].each_status = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].shipment_name} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].shipment_name = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].box_number} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].box_number = parseInt(e.target.value);
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].document} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].document = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="date" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].add_date} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].add_date = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="date" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].date_agent} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].date_agent = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].SID} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].SID = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].GID} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].GID = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="date" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].date_port} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].date_port = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].newid} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].newid = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                              </tr>
                            ))}
                            {(() => {
                              const objects = Object.keys(selectedProducts);
                              const len = objects.length;
                              const num = (len ? parseInt(objects[len - 1]) + 1 : 1).toString();
                              return (
                                <tr className="py-1 fw-bold" key={`tr${num}`}>
                                  <td style={{ minWidth: '50px' }}></td>
                                  <td style={{ minWidth: '50px' }}></td>
                                  <td>
                                    <Select
                                      name='products'
                                      className='react-select-styled react-select-solid react-select-sm w-100'
                                      options={products}
                                      placeholder='Select a product'
                                      noOptionsMessage={e => `No products including "${e.inputValue}"`}
                                      hideSelectedOptions
                                      captureMenuScroll={true}
                                      menuPlacement={'auto'}
                                      menuPortalTarget={document.querySelector('#createShipmentModal') as HTMLElement}
                                      onChange={product => setSelectedProducts({
                                        ...selectedProducts,
                                        [parseInt(num)]: {
                                          ean: product?.value ?? '',
                                          quantity: 1,
                                          supplier_name: '',
                                          item: '',
                                          pdf_sent: false,
                                          pay_url: '',
                                          tracking: '',
                                          arrive_agent: false,
                                          wechat_group: '',
                                          pp: '',
                                          each_status: '',
                                          shipment_name: '',
                                          box_number: 0,
                                          document: '',
                                          add_date: '',
                                          date_agent: '',
                                          SID: '',
                                          GID: '',
                                          date_port: '',
                                          newid: '',
                                        }
                                      })}
                                    />
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              )
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-1"></div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="bi bi-x"></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}><i className="bi bi-plus"></i>Create</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id='editShipmentModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Shipment</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {!!editShipment && <form action="" method='post' id='editProductForm'>
                <div className="row">
                  <div className="col-md-1"></div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Shipment Name:</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='shipment_name' defaultValue={editShipment.title} placeholder="Shipment Name" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Shipping Type:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <Select
                              name='type'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={shipingTypes}
                              placeholder='Select shipping type'
                              isSearchable={false}
                              noOptionsMessage={e => `No more shipping type${e.inputValue}`}
                              defaultValue={shipingTypes.find(type => type.value == editShipment.type)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Shipment Status:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <Select
                              name='status'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={shippingStatus}
                              placeholder='Select shipment status'
                              isSearchable={false}
                              noOptionsMessage={e => `No more shipping status${e.inputValue}`}
                              defaultValue={shippingStatus.find(status => status.value == editShipment.status)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Warehouse:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='warehouse' defaultValue={editShipment.warehouse} placeholder="Warehouse" />
                            </div>
                            <Select
                              name='status'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={warehouses}
                              placeholder='Select a warehouse'
                              noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                              defaultValue={warehouses.find(house => house.value == editShipment.warehouse)}
                            />
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Expected Delivery Date:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="date" className="form-control" name='delivery_date' defaultValue={editShipment.expect_date?.split('T')[0]} placeholder="Expected Delivery Date" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Agent Name:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            {/* <Select
                              name='name'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={agents}
                              placeholder='Select an agent'
                              noOptionsMessage={e => `No more agents including "${e.inputValue}"`}
                              defaultValue={agents[0] ?? null}
                            /> */}
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='agent' defaultValue={editShipment.agent_name} placeholder="Agent Name" />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-25">Note (Optional):</div>
                          <div className="d-flex ms-auto mr-0 w-75">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <textarea className="form-control" name='note' placeholder="Note" defaultValue={editShipment.note ?? ''} rows={3} />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <hr />
                    <h1>Products</h1>
                    <div className="row">
                      <div className="col-md-12 overflow-auto">
                        <table className='table table-bordered table-hover w-100 text-nowrap' style={{ overflowY: 'visible' }}>
                          <thead>
                            <tr className="py-1 fs-4 fw-bold text-center">
                              <th></th>
                              <th style={{ minWidth: '500px' }}>Product</th>
                              <th>Quantity</th>
                              <th>Supplier</th>
                              <th>Item</th>
                              <th>PDF sent</th>
                              <th>Pay URL</th>
                              <th>Tracking</th>
                              <th>Arrive to Agent</th>
                              <th>Wechat Group</th>
                              <th>PP</th>
                              <th>Each Status</th>
                              <th>Shipment Name</th>
                              <th>Box Number</th>
                              <th>Document</th>
                              <th>Created Date</th>
                              <th>Date to Agent</th>
                              <th>SID</th>
                              <th>GID</th>
                              <th>Date to Port</th>
                              <th>New ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(selectedProducts).map((index) => (
                              <tr className="py-1 fw-bold" key={`tr${index}`}>
                                <td className='align-content-center'>
                                  <button type='button' className="btn btn-light-danger btn-sm d-flex" onClick={() => {
                                    const newProArr = { ...selectedProducts };
                                    delete newProArr[parseInt(index)];
                                    setSelectedProducts(newProArr);
                                  }}>
                                    <i className="bi bi-trash-fill"></i>
                                  </button>
                                </td>
                                <td>
                                  <Select
                                    name='products'
                                    className='react-select-styled react-select-solid react-select-sm w-100'
                                    options={products}
                                    placeholder='Select a product'
                                    noOptionsMessage={e => `No products including "${e.inputValue}"`}
                                    hideSelectedOptions
                                    captureMenuScroll={true}
                                    menuPlacement={'auto'}
                                    menuPortalTarget={document.querySelector('#createShipmentModal') as HTMLElement}
                                    value={products.find(product => product.value === selectedProducts[parseInt(index)].ean)}
                                    onChange={product => setSelectedProducts({
                                      ...selectedProducts,
                                      [parseInt(index)]: {
                                        ean: product?.value ?? '',
                                        quantity: 1,
                                        supplier_name: '',
                                        item: '',
                                        pdf_sent: false,
                                        pay_url: '',
                                        tracking: '',
                                        arrive_agent: false,
                                        wechat_group: '',
                                        pp: '',
                                        each_status: '',
                                        shipment_name: '',
                                        box_number: 0,
                                        document: '',
                                        add_date: '',
                                        date_agent: '',
                                        SID: '',
                                        GID: '',
                                        date_port: '',
                                        newid: '',
                                      }
                                    })}
                                  />
                                </td>
                                <td>
                                  <input type="number" name='numProduct' value={selectedProducts[parseInt(index)].quantity} min={1} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].quantity = parseInt(e.target.value);
                                    setSelectedProducts(newProducts);
                                  }} className='form-control form-control-sm d-flex' />
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].supplier_name} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].supplier_name = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].item} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].item = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td className='align-content-center'>
                                  <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                    <input className="form-check-input" type="checkbox" checked={selectedProducts[parseInt(index)].pdf_sent} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].pdf_sent = e.target.checked;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </div>
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].pay_url} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].pay_url = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].tracking} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].tracking = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td className='align-content-center'>
                                  <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                    <input className="form-check-input" type="checkbox" checked={selectedProducts[parseInt(index)].arrive_agent} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].arrive_agent = e.target.checked;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </div>
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].wechat_group} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].wechat_group = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '200px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].pp} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].pp = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].each_status} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].each_status = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].shipment_name} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].shipment_name = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].box_number} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].box_number = parseInt(e.target.value);
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].document} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].document = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="date" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].add_date.split('T')[0]} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].add_date = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="date" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].date_agent.split('T')[0]} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].date_agent = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].SID} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].SID = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].GID} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].GID = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td>
                                  <input type="date" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].date_port.split('T')[0]} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].date_port = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                                <td style={{ minWidth: '100px' }}>
                                  <input type="text" className='form-control form-control-sm' value={selectedProducts[parseInt(index)].newid} onChange={(e) => {
                                    const newProducts = { ...selectedProducts };
                                    newProducts[parseInt(index)].newid = e.target.value;
                                    setSelectedProducts(newProducts);
                                  }} />
                                </td>
                              </tr>
                            ))}
                            {(() => {
                              const objects = Object.keys(selectedProducts);
                              const len = objects.length;
                              const num = (len ? parseInt(objects[len - 1]) + 1 : 1).toString();
                              return (
                                <tr className="py-1 fw-bold" key={`tr${num}`}>
                                  <td style={{ minWidth: '50px' }}></td>
                                  <td>
                                    <Select
                                      name='products'
                                      className='react-select-styled react-select-solid react-select-sm w-100'
                                      options={products}
                                      placeholder='Select a product'
                                      noOptionsMessage={e => `No products including "${e.inputValue}"`}
                                      hideSelectedOptions
                                      captureMenuScroll={true}
                                      menuPlacement={'auto'}
                                      menuPortalTarget={document.querySelector('#createShipmentModal') as HTMLElement}
                                      onChange={product => setSelectedProducts({
                                        ...selectedProducts,
                                        [parseInt(num)]: {
                                          ean: product?.value ?? '',
                                          quantity: 1,
                                          supplier_name: '',
                                          item: '',
                                          pdf_sent: false,
                                          pay_url: '',
                                          tracking: '',
                                          arrive_agent: false,
                                          wechat_group: '',
                                          pp: '',
                                          each_status: '',
                                          shipment_name: '',
                                          box_number: 0,
                                          document: '',
                                          add_date: '',
                                          date_agent: '',
                                          SID: '',
                                          GID: '',
                                          date_port: '',
                                          newid: '',
                                        }
                                      })}
                                    />
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              )
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-1"></div>
                </div>
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