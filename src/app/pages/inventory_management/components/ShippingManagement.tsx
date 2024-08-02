import { useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import Select, { MultiValue } from 'react-select'
import { createShipments, deleteShipment, editProductRequest, getAllProducts, getAllSuppliers, getProductByID, getShipments, getShippingType, updateShipments } from './_request';
import { Shipment, ShippingProduct } from '../../models/shipment';
import { getWarehouses } from '../../dashboard/components/_request';
import { WarehouseType } from '../../models/warehouse';
import { Product } from '../../models/product';
import { getUsers } from '../../config/components/_request';
import { useAuth, UserModel } from '../../../modules/auth';
import { Suppliers } from '../../models/supplier';
import { toast } from 'react-toastify';

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
  handleDeleteShipment: (id: number) => void;
  setSelectedShipment: React.Dispatch<React.SetStateAction<number>>;
  setEditShipment: React.Dispatch<React.SetStateAction<Shipment | undefined>>;
}> = props => {
  return (
    <table className="table table-rounded table-hover table-striped table-row-bordered border gy-7 gs-7" id='table-shipment'>
      <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
          <th className='align-content-center'>Shipment Name</th>
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
              <td className='align-content-center' onClick={() => props.setSelectedShipment(index)}>{shipment.title}</td>
              <td className='align-content-center' onClick={() => props.setSelectedShipment(index)}>{shipment.agent}</td>
              <td className='align-content-center' onClick={() => props.setSelectedShipment(index)}>{shipment.type}</td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                {shipment.create_date ? (new Date(shipment.create_date)).toLocaleString() : ''}
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                <StatusBadge status={shipment.status} />
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                {shipment.note}
              </td>
              <td className='text-center align-content-center' onClick={() => props.setSelectedShipment(index)}>
                {shipment.delivery_date ? shipment.delivery_date.toLocaleString() : ''}
              </td>
              <td className='text-center align-content-center'>
                <a className='btn btn-white btn-active-light-info btn-sm p-2' data-bs-toggle="modal" data-bs-target="#editShipmentModal" onClick={() => props.setEditShipment(shipment)}>
                  <i className="bi bi-pencil-square fs-3 p-1"></i>
                </a>
                <a className='btn btn-white btn-active-light-danger btn-sm p-2' onClick={() => props.handleDeleteShipment(shipment.id ?? 0)}>
                  <i className="bi bi-ban text-danger fs-3 p-1"></i>
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
  const [users, setUsers] = useState<UserModel[]>([]);
  const [changed, setChanged] = useState<boolean>(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shippings, setshippings] = useState<Shipping[]>([]);
  const [shipingTypes, setShipingTypes] = useState<{ value: string; label: string; }[]>([]);
  const [selectedShippingTypes, setSelectedShippingTypes] = useState<{ [key: number]: string }>({});
  const [editID, setEditID] = useState<number>(-1);
  const [productName, setProductName] = useState<string>('');
  const [selectedShipment, setSelectedShipment] = useState<number>(-1);
  const [editShipment, setEditShipment] = useState<Shipment>();
  const [supplierOptions, setSupplierOptions] = useState<{ value: number, label: string }[]>([]);
  const [selectedProductID, setSelectedProductID] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Shipping>(fakeshippings[0]);
  const [editProduct, setEditProduct] = useState<Product>();
  const [products, setProducts] = useState<{ value: string, label: string }[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: ShippingProduct
  }>({});
  const [agents, setAgents] = useState<{ value: string; label: string; }[]>([]);
  const [warehouses, setWarehouses] = useState<{ value: string; label: string; }[]>([]);
  const [warehouses2, setWarehouses2] = useState<{ value: number; label: string; }[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (changed) {
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
          setWarehouses2(res.map((data: WarehouseType) => {
            return { value: data.id, label: data.name }
          }));
          setWarehouses(dict);
        })
        .catch(e => console.error(e));
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
      setChanged(false);
    }
  }, [changed]);
  useEffect(() => {
    if (editID != -1) {
      setProductName(shippings[editID]['productName'])
    }
  }, [editID, shippings]);
  useEffect(() => {
    setSelectedProductID(0);
  }, [selectedShipment]);
  useEffect(() => {
    getUsers()
      .then(res => res.data)
      .then(res => {
        const data = res.data;
        setUsers(data);
        setAgents(data.filter((user: UserModel) => user.role === 'Order Agent').map((user: UserModel) => {
          return { value: user.email, label: `${user.full_name} (${user.email})` }
        }));
      })
      .catch(e => console.error(e));
    getAllSuppliers()
      .then(res => {
        if (!res.data.length) return;
        setSupplierOptions(res.data.map((datum: Suppliers) => {
          return { value: datum.id, label: `${datum.group} / ${datum.name} (${datum.wechat})` }
        }))
      })
      .catch(e => console.error(e));
  }, []);
  useEffect(() => {
    if (editShipment) {
      const dict: { [key: number]: ShippingProduct } = {};
      for (let i = 0; i < editShipment.ean.length; i++) {
        dict[i + 1] = {
          ean: editShipment.ean[i],
          quantity: editShipment.quantity[i],
          item_per_box: editShipment.item_per_box[i],
          pdf_sent: editShipment.pdf_sent[i],
          pay_url: editShipment.pay_url[i],
          tracking: editShipment.tracking[i],
          arrive_agent: editShipment.arrive_agent[i],
          wechat_group: editShipment.wechat_group[i],
          pp: editShipment.pp[i],
          each_status: editShipment.each_status[i],
          box_number: editShipment.box_number[i],
          document: editShipment.document[i],
          date_added: editShipment.date_added[i],
          date_agent: editShipment.date_agent[i],
          user: editShipment.user[i],
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
    const awbComp = document.querySelector(`#${id} input[name="awb"]`) as HTMLInputElement;
    const vatComp = document.querySelector(`#${id} input[name="vat"]`) as HTMLInputElement;
    const customTaxComp = document.querySelector(`#${id} input[name="custom_taxes"]`) as HTMLInputElement;
    const shipmentCostComp = document.querySelector(`#${id} input[name="shipment_cost"]`) as HTMLInputElement;
    const noteComp = document.querySelector(`#${id} textarea[name="note"]`) as HTMLInputElement;
    const name = nameComp.value;
    const agent = agentComp.value;
    const warehouse = warehouseComp.value;
    const delivery_date = delivery_dateComp.value;
    const type = typeComp.value;
    const status = statusComp.value;
    const awb = awbComp.value;
    const vat = parseFloat(vatComp.value);
    const customTax = parseFloat(customTaxComp.value);
    const shipmentCost = parseFloat(shipmentCostComp.value);
    const note = noteComp.value;
    const now = new Date();
    // if (!name || !delivery_date) return;
    type keyType = 'ean' | 'quantity' | 'item_per_box' | 'pdf_sent' | 'pay_url' | 'tracking' | 'arrive_agent'
      | 'wechat_group' | 'pp' | 'each_status' | 'box_number' | 'document' | 'date_added' | 'date_agent'
      | 'user';
    let firstKey;
    for (const key in selectedProducts) {
      firstKey = key.toString();
      break;
    }
    let products: { [key: string]: (string | number | boolean)[] } = {};
    if (firstKey) {
      Object.keys(selectedProducts[parseInt(firstKey)]).map(key => {
        products[key] = Object.values(selectedProducts).map(product => product[key as keyType]);
      });
    } else {
      products = {
        ean: [],
        quantity: [],
        item_per_box: [],
        pdf_sent: [],
        pay_url: [],
        tracking: [],
        arrive_agent: [],
        wechat_group: [],
        pp: [],
        each_status: [],
        box_number: [],
        document: [],
        date_added: [],
        date_agent: [],
        user: [],
      }
    }
    const data = {
      agent: agent,
      create_date: editShipment ? editShipment.create_date : now.toISOString().split('T')[0],
      delivery_date: delivery_date,
      type: type,
      title: name,
      status: status,
      note: note,
      warehouse: warehouse,
      ...products,
      awb: awb,
      vat: vat,
      custom_taxes: customTax,
      shipment_cost: shipmentCost,
      ...products
    }
    if (id === 'createShipmentModal') {
      createShipments(data)
        .then(() => {
          setChanged(true);
          const closeBtn = document.querySelector(`#${id} button[data-bs-dismiss="modal"]`) as HTMLInputElement;
          closeBtn.click();
        })
        .catch(e => console.error(e));
    } else {
      updateShipments(editShipment?.id ?? 0, data)
        .then(() => {
          setChanged(true);
          const closeBtn = document.querySelector(`#${id} button[data-bs-dismiss="modal"]`) as HTMLInputElement;
          closeBtn.click();
        })
        .catch(e => console.error(e));
    }
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
  const handleDeleteShipment = (id: number) => {
    deleteShipment(id)
      .then(() => setChanged(true));
  }
  const handleSetEditProduct = (id: number) => {
    getProductByID(id)
      .then(res => res.data)
      .then(res => setEditProduct(res))
      .catch(e => console.error(e));
  }
  const handleEditProduct = () => {
    if (!editProduct) return;
    const closeBtn = document.querySelector('#editProductModal button[data-bs-target="#createShipmentModal"]') as HTMLButtonElement;
    editProductRequest(editProduct.id ?? 0, editProduct as unknown as { [key: string]: string | number | boolean })
      .then(res => {
        setEditProduct(res.data);
        setChanged(true);
        toast.success('Successfully edited.');
        closeBtn.click();
      })
      .catch(e => {
        toast.error('Something went wrong.');
        console.error(e);
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
            <TableShipment shipments={shipments} setSelectedShipment={setSelectedShipment} setEditShipment={setEditShipment} handleDeleteShipment={handleDeleteShipment} />
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
                        {!!selectedProduct && selectedProduct.numberOfBoxes.toLocaleString()}
                      </h4>
                    </div>
                    <div className='col-md-8'>
                      <span className='text-gray-700'>Agent</span><br />
                      <div className='col-md-4'>{!!selectedProduct}</div>
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
                      <div className="col-md-12">
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
                    </div>
                    <div className="row">
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
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Expected Delivery Date:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="date" className="form-control" name='delivery_date' defaultValue={(new Date()).toISOString().split('T')[0]} placeholder="Expected Delivery Date" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Agent Name:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <Select
                              name='agent'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={agents}
                              placeholder='Select an agent'
                              noOptionsMessage={e => `No more agents including "${e.inputValue}"`}
                              defaultValue={agents[0] ?? null}
                            />
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">AWB:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='awb' placeholder="AWB" />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">VAT:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='vat' placeholder="VAT" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Custom Taxes:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='custom_taxes' placeholder="Custom Taxes" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Shipment Cost:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='shipment_cost' placeholder="Shipment Cost" />
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
                              <th></th>
                              <th></th>
                              <th style={{ minWidth: '500px' }}>Product</th>
                              <th>Quantity</th>
                              <th>Cost</th>
                              <th>Total Cost</th>
                              <th>Item per box</th>
                              <th>PDF sent</th>
                              <th>Pay URL</th>
                              <th>Tracking</th>
                              <th>Arrive to Agent</th>
                              <th>Wechat Group</th>
                              <th>PP</th>
                              <th>Each Status</th>
                              <th>Box Number</th>
                              <th>Document</th>
                              <th>Created Date</th>
                              <th>Date to Agent</th>
                              <th>Username</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(selectedProducts).map((index) => {
                              const selectedProduct = selectedProducts[parseInt(index)];
                              const editProduct = allProducts.find(product => product.ean === selectedProduct.ean);
                              getShippingType(selectedProduct.ean)
                                .then(res => res.data)
                                .then(res => {
                                  switch (res.type as number) {
                                    default: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '' }); return;
                                    case 1: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '🛫' }); return;
                                    case 2: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '🚆' }); return;
                                    case 3: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '🚢' }); return;
                                  }
                                })
                                .catch(e => console.error(e));
                              return (
                                <tr className="py-1 fw-bold" key={`tr${index}`}>
                                  <td className='align-content-center'>
                                    <button type='button' className="btn btn-light-danger btn-sm d-flex" title='Unselect this Product' onClick={() => {
                                      const newProArr = { ...selectedProducts };
                                      delete newProArr[parseInt(index)];
                                      setSelectedProducts(newProArr);
                                    }}>
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </td>
                                  <td className='align-content-center'>
                                    <button type='button' className="btn btn-light-primary btn-sm d-flex" title='Edit this Product' onClick={() => handleSetEditProduct(editProduct?.id ?? 0)} data-bs-toggle="modal" data-bs-target="#editProductModal">
                                      <i className="bi bi-pencil-square"></i>
                                    </button>
                                  </td>
                                  <td className='fs-1' style={{ minWidth: '50px' }}>{selectedShippingTypes[parseInt(index)]}</td>
                                  <td style={{ minWidth: '50px' }}>
                                    <img src={editProduct?.image_link ?? ''} alt="" width={35} />
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
                                      value={products.find(product => product.value === selectedProduct.ean)}
                                      onChange={product => setSelectedProducts({
                                        ...selectedProducts,
                                        [parseInt(index)]: {
                                          ean: product?.value ?? '',
                                          quantity: 1,
                                          item_per_box: 1,
                                          pdf_sent: false,
                                          pay_url: '',
                                          tracking: '',
                                          arrive_agent: false,
                                          wechat_group: '',
                                          pp: '',
                                          each_status: '',
                                          box_number: 0,
                                          document: '',
                                          date_added: (new Date()).toISOString().split('T')[0],
                                          date_agent: (new Date()).toISOString().split('T')[0],
                                          user: currentUser?.id ?? 0,
                                        }
                                      })}
                                    />
                                  </td>
                                  <td>
                                    <input type="number" name='numProduct' value={selectedProduct.quantity} min={1} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].quantity = parseInt(e.target.value);
                                      setSelectedProducts(newProducts);
                                    }} className='form-control form-control-sm d-flex' />
                                  </td>
                                  <td className="align-content-center">${editProduct?.price}</td>
                                  <td className='align-content-center'>${(parseFloat(editProduct?.price ?? '0') * selectedProduct.quantity).toFixed(2)}</td>
                                  <td style={{ minWidth: '100px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.item_per_box} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].item_per_box = parseInt(e.target.value);
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td className='align-content-center'>
                                    <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                      <input className="form-check-input" type="checkbox" checked={selectedProduct.pdf_sent} onChange={(e) => {
                                        const newProducts = { ...selectedProducts };
                                        newProducts[parseInt(index)].pdf_sent = e.target.checked;
                                        setSelectedProducts(newProducts);
                                      }} />
                                    </div>
                                  </td>
                                  <td style={{ minWidth: '200px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.pay_url} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].pay_url = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td style={{ minWidth: '200px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.tracking} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].tracking = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td className='align-content-center'>
                                    <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                      <input className="form-check-input" type="checkbox" checked={selectedProduct.arrive_agent} onChange={(e) => {
                                        const newProducts = { ...selectedProducts };
                                        newProducts[parseInt(index)].arrive_agent = e.target.checked;
                                        setSelectedProducts(newProducts);
                                      }} />
                                    </div>
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.wechat_group} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].wechat_group = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td style={{ minWidth: '200px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.pp} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].pp = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.each_status} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].each_status = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.box_number} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].box_number = parseInt(e.target.value);
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.document} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].document = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="date" className='form-control form-control-sm' value={selectedProduct.date_added} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].date_added = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="date" className='form-control form-control-sm' value={selectedProduct.date_agent} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].date_agent = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td className='align-content-center' style={{ minWidth: '100px' }}>
                                    {users.find(user => user.id === selectedProduct.user)?.full_name}
                                  </td>
                                </tr>
                              )
                            })}
                            {(() => {
                              const objects = Object.keys(selectedProducts);
                              const len = objects.length;
                              const num = (len ? parseInt(objects[len - 1]) + 1 : 1).toString();
                              return (
                                <tr className="py-1 fw-bold" key={`tr${num}`}>
                                  <td style={{ minWidth: '50px' }}></td>
                                  <td style={{ minWidth: '50px' }}></td>
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
                                          item_per_box: 1,
                                          pdf_sent: false,
                                          pay_url: '',
                                          tracking: '',
                                          arrive_agent: false,
                                          wechat_group: '',
                                          pp: '',
                                          each_status: '',
                                          box_number: 0,
                                          document: '',
                                          date_added: (new Date()).toISOString().split('T')[0],
                                          date_agent: (new Date()).toISOString().split('T')[0],
                                          user: currentUser?.id ?? 0,
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
                      <div className="col-md-12">
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
                    </div>
                    <div className="row">
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
                              defaultValue={warehouses.find(house => house.value == editShipment.warehouse)}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Expected Delivery Date:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="date" className="form-control" name='delivery_date' defaultValue={editShipment.delivery_date?.split('T')[0]} placeholder="Expected Delivery Date" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Agent Name:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <Select
                              name='agent'
                              className='react-select-styled react-select-solid react-select-sm w-100'
                              options={agents}
                              placeholder='Select an agent'
                              noOptionsMessage={e => `No more agents including "${e.inputValue}"`}
                              defaultValue={agents.find(user => user.value === editShipment.agent)}
                            />
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">AWB:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='awb' defaultValue={editShipment.awb} placeholder="AWB" />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">VAT:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='vat' defaultValue={editShipment.vat} placeholder="VAT" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Custom Taxes:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='custom_taxes' defaultValue={editShipment.custom_taxes} placeholder="Custom Taxes" />
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-flex align-items-center py-1">
                          <div className="d-flex fw-bold w-50">Shipment Cost:</div>
                          <div className="d-flex ms-auto mr-0 w-50">
                            <div className="input-group">
                              <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                              <input type="text" className="form-control" name='shipment_cost' defaultValue={editShipment.shipment_cost} placeholder="Shipment Cost" />
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
                              <th></th>
                              <th></th>
                              <th></th>
                              <th style={{ minWidth: '500px' }}>Product</th>
                              <th>Quantity</th>
                              <th>Cost</th>
                              <th>Total Cost</th>
                              <th>Item per box</th>
                              <th>PDF sent</th>
                              <th>Pay URL</th>
                              <th>Tracking</th>
                              <th>Arrive to Agent</th>
                              <th>Wechat Group</th>
                              <th>PP</th>
                              <th>Each Status</th>
                              <th>Box Number</th>
                              <th>Document</th>
                              <th>Created Date</th>
                              <th>Date to Agent</th>
                              <th>Username</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(selectedProducts).map((index) => {
                              const selectedProduct = selectedProducts[parseInt(index)];
                              const editProduct = allProducts.find(product => product.ean === selectedProduct.ean);
                              getShippingType(selectedProduct.ean)
                                .then(res => res.data)
                                .then(res => {
                                  switch (res.type as number) {
                                    default: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '' }); return;
                                    case 1: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '🛫' }); return;
                                    case 2: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '🚆' }); return;
                                    case 3: setSelectedShippingTypes({ ...selectedShippingTypes, [parseInt(index)]: '🚢' }); return;
                                  }
                                })
                                .catch(e => console.error(e));
                              return (
                                <tr className="py-1 fw-bold" key={`tr${index}`}>
                                  <td className='align-content-center'>
                                    <button type='button' className="btn btn-light-danger btn-sm d-flex" title='Unselect this Product' onClick={() => {
                                      const newProArr = { ...selectedProducts };
                                      delete newProArr[parseInt(index)];
                                      setSelectedProducts(newProArr);
                                    }}>
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </td>
                                  <td className='align-content-center'>
                                    <button type='button' className="btn btn-light-primary btn-sm d-flex" title='Edit this Product' onClick={() => handleSetEditProduct(editProduct?.id ?? 0)} data-bs-toggle="modal" data-bs-target="#editProductModal">
                                      <i className="bi bi-pencil-square"></i>
                                    </button>
                                  </td>
                                  <td className='fs-1' style={{ minWidth: '50px' }}>{selectedShippingTypes[parseInt(index)]}</td>
                                  <td style={{ minWidth: '50px' }}>
                                    <img src={editProduct?.image_link ?? ''} alt="" width={35} />
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
                                      value={products.find(product => product.value === selectedProduct.ean)}
                                      onChange={product => setSelectedProducts({
                                        ...selectedProducts,
                                        [parseInt(index)]: {
                                          ean: product?.value ?? '',
                                          quantity: 1,
                                          item_per_box: 1,
                                          pdf_sent: false,
                                          pay_url: '',
                                          tracking: '',
                                          arrive_agent: false,
                                          wechat_group: '',
                                          pp: '',
                                          each_status: '',
                                          box_number: 0,
                                          document: '',
                                          date_added: '',
                                          date_agent: '',
                                          user: currentUser?.id ?? 0,
                                        }
                                      })}
                                    />
                                  </td>
                                  <td>
                                    <input type="number" name='numProduct' value={selectedProduct.quantity} min={1} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].quantity = parseInt(e.target.value);
                                      setSelectedProducts(newProducts);
                                    }} className='form-control form-control-sm d-flex' />
                                  </td>
                                  <td className="align-content-center">${editProduct?.price}</td>
                                  <td className='align-content-center'>${(parseFloat(editProduct?.price ?? '0') * selectedProduct.quantity).toFixed(2)}</td>
                                  <td style={{ minWidth: '100px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.item_per_box} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].item_per_box = parseInt(e.target.value);
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td className='align-content-center'>
                                    <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                      <input className="form-check-input" type="checkbox" checked={selectedProduct.pdf_sent} onChange={(e) => {
                                        const newProducts = { ...selectedProducts };
                                        newProducts[parseInt(index)].pdf_sent = e.target.checked;
                                        setSelectedProducts(newProducts);
                                      }} />
                                    </div>
                                  </td>
                                  <td style={{ minWidth: '200px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.pay_url} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].pay_url = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td style={{ minWidth: '200px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.tracking} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].tracking = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td className='align-content-center'>
                                    <div className="form-check form-switch form-check-custom form-check-solid m-auto" style={{ width: 'fit-content' }}>
                                      <input className="form-check-input" type="checkbox" checked={selectedProduct.arrive_agent} onChange={(e) => {
                                        const newProducts = { ...selectedProducts };
                                        newProducts[parseInt(index)].arrive_agent = e.target.checked;
                                        setSelectedProducts(newProducts);
                                      }} />
                                    </div>
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.wechat_group} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].wechat_group = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td style={{ minWidth: '200px' }}>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.pp} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].pp = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.each_status} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].each_status = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.box_number} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].box_number = parseInt(e.target.value);
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="text" className='form-control form-control-sm' value={selectedProduct.document} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].document = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="date" className='form-control form-control-sm' value={selectedProduct.date_added.split('T')[0]} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].date_added = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td>
                                    <input type="date" className='form-control form-control-sm' value={selectedProduct.date_agent.split('T')[0]} onChange={(e) => {
                                      const newProducts = { ...selectedProducts };
                                      newProducts[parseInt(index)].date_agent = e.target.value;
                                      setSelectedProducts(newProducts);
                                    }} />
                                  </td>
                                  <td className='align-content-center' style={{ minWidth: '100px' }}>
                                    {users.find(user => user.id === selectedProduct.user)?.full_name}
                                  </td>
                                </tr>
                              )
                            })}
                            {(() => {
                              const objects = Object.keys(selectedProducts);
                              const len = objects.length;
                              const num = (len ? parseInt(objects[len - 1]) + 1 : 1).toString();
                              return (
                                <tr className="py-1 fw-bold" key={`tr${num}`}>
                                  <td style={{ minWidth: '50px' }}></td>
                                  <td style={{ minWidth: '50px' }}></td>
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
                                          item_per_box: 1,
                                          pdf_sent: false,
                                          pay_url: '',
                                          tracking: '',
                                          arrive_agent: false,
                                          wechat_group: '',
                                          pp: '',
                                          each_status: '',
                                          box_number: 0,
                                          document: '',
                                          date_added: '',
                                          date_agent: '',
                                          user: currentUser?.id ?? 0,
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
              <button type="button" className="btn btn-secondary" onClick={() => setEditShipment(undefined)} data-bs-toggle="modal" data-bs-target="#createShipmentModal"><i className="bi bi-x"></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}><i className="bi bi-save"></i>Save changes</button>
            </div>
          </div>
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
                      <input type="text" className="form-control" name='product_name' value={editProduct.product_name ?? ''} onChange={e => setEditProduct({ ...editProduct, product_name: e.target.value })} placeholder="Product Name" aria-label="Product Name" aria-describedby="product-name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Model Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="model-name"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='model_name' value={editProduct.model_name ?? ''} onChange={e => setEditProduct({ ...editProduct, model_name: e.target.value })} placeholder="Model Name" aria-label="Model Name" aria-describedby="model-name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">EAN:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="ean"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='ean' value={editProduct.ean ?? ''} onChange={e => setEditProduct({ ...editProduct, ean: e.target.value })} placeholder="EAN" aria-label="EAN" aria-describedby="ean" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Price:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="price"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='price' value={parseFloat(editProduct.price ?? '0')} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} placeholder="Price" aria-label="Price" aria-describedby="price" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Temp Image Link:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="temp-img-link"><i className="bi bi-link-45deg"></i></span>
                      <input type="url" className="form-control" name='image_link' value={editProduct.image_link ?? ''} onChange={e => setEditProduct({ ...editProduct, image_link: e.target.value })} placeholder="Temp Image Link" aria-label="Temp Image Link" aria-describedby="temp-img-link" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Observation:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='observation' value={editProduct.observation ?? ''} onChange={e => setEditProduct({ ...editProduct, observation: e.target.value })} placeholder="Observation" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Warehouse:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='warehouse_id'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={warehouses2}
                      placeholder='Select a warehouse'
                      isSearchable={false}
                      noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                      value={warehouses2.find(warehouse => warehouse.value === editProduct.warehouse_id)}
                      onChange={e => setEditProduct({ ...editProduct, warehouse_id: e?.value })}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Barcode Title:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="barcode-title"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='barcode_title' value={editProduct.barcode_title ?? ''} onChange={e => setEditProduct({ ...editProduct, barcode_title: e.target.value })} placeholder="Barcode Title" aria-label="Barcode Title" aria-describedby="barcode-title" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Masterbox Title:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="masterbox-title"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='masterbox_title' value={editProduct.masterbox_title ?? ''} onChange={e => setEditProduct({ ...editProduct, masterbox_title: e.target.value })} placeholder="Masterbox Title" aria-label="Masterbox Title" aria-describedby="masterbox-title" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">1688 Link Address:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="link-address-1688"><i className="bi bi-link-45deg"></i></span>
                      <input type="url" className="form-control" name='link_address_1688' value={editProduct.link_address_1688 ?? ''} onChange={e => setEditProduct({ ...editProduct, link_address_1688: e.target.value })} placeholder="Link address" aria-label="Link address" aria-describedby="link-address-1688" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">1688 Price:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="price1688"><i className="bi bi-coin"></i></span>
                      <input type="number" className="form-control" name='price_1688' value={parseFloat(editProduct.price_1688 ?? '')} onChange={e => setEditProduct({ ...editProduct, price_1688: e.target.value })} placeholder="1688 Price" aria-label="1688 Price" aria-describedby="price1688" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">1688 Variation Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="variation-name-1688"><i className="bi bi-globe2"></i></span>
                      <input type="text" className="form-control" name='variation_name_1688' value={editProduct.variation_name_1688 ?? ''} onChange={e => setEditProduct({ ...editProduct, variation_name_1688: e.target.value })} placeholder="1688 Variation Name" aria-label="1688 Variation Name" aria-describedby="variation-name-1688" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Internal Shipping Price:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-coin"></i></span>
                      <input type="number" className="form-control" name='internal_shipping_price' value={parseFloat(editProduct.internal_shipping_price ?? '0')} onChange={e => setEditProduct({ ...editProduct, internal_shipping_price: e.target.value })} placeholder="Internal Shipping Price" />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">PCS/CTN:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="pcs-ctn"><i className="bi bi-diagram-3"></i></span>
                      <input type="text" className="form-control" name='pcs_ctn' value={editProduct.pcs_ctn ?? ''} onChange={e => setEditProduct({ ...editProduct, pcs_ctn: e.target.value })} placeholder="PCS/CTN" aria-label="PCS/CTN" aria-describedby="pcs-ctn" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Weight:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="weight"><i className="bi bi-tag-fill"></i></span>
                      <input type="number" className="form-control" name='weight' value={editProduct.weight ?? 0} onChange={e => setEditProduct({ ...editProduct, weight: e.target.value })} placeholder="Weight" aria-label="Weight" aria-describedby="weight" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Volumetric Weight:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="volumetric_weight"><i className="bi bi-tag-fill"></i></span>
                      <input type="number" className="form-control" name='volumetric_weight' value={editProduct.volumetric_weight ?? 0} onChange={e => setEditProduct({ ...editProduct, volumetric_weight: e.target.value })} placeholder="Volumetric Weight" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Dimensions:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="dimensions"><i className="bi bi-unity"></i></span>
                      <input type="text" className="form-control" name='dimensions' value={editProduct.dimensions ?? ''} onChange={e => setEditProduct({ ...editProduct, dimensions: e.target.value })} placeholder="Width * Height * Length" aria-label="Dimensions" aria-describedby="dimensions" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Supplier:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="supplier-id"><i className="bi bi-chat-dots-fill"></i></span>
                      <Select
                        name='supplier_id'
                        className='react-select-styled react-select-solid react-select-sm flex-grow-1'
                        options={supplierOptions}
                        placeholder='Select supplier'
                        noOptionsMessage={e => `No more suppliers including "${e.inputValue}"`}
                        value={supplierOptions.filter(option => option.value === editProduct.supplier_id)}
                        onChange={e => setEditProduct({ ...editProduct, supplier_id: e?.value ?? 0 })}
                        isClearable={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">English Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="en-name"><i className="bi bi-chat-dots-fill"></i></span>
                      <input type="text" className="form-control" name='english_name' value={editProduct.english_name ?? ''} onChange={e => setEditProduct({ ...editProduct, english_name: e.target.value })} placeholder="English Name" aria-label="English Name" aria-describedby="en-name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Romanian Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="ro-name"><i className="bi bi-chat-dots-fill"></i></span>
                      <input type="text" className="form-control" name='romanian_name' value={editProduct.romanian_name ?? ''} onChange={e => setEditProduct({ ...editProduct, romanian_name: e.target.value })} placeholder="Romanian Name" aria-label="Romanian Name" aria-describedby="ro-name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Material Name (EN):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="en-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                      <input type="text" className="form-control" name='material_name_en' value={editProduct.material_name_en ?? ''} onChange={e => setEditProduct({ ...editProduct, material_name_en: e.target.value })} placeholder="Material Name (EN)" aria-label="Material Name (EN)" aria-describedby="en-mat-name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Material Name (RO):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="ro-mat-name"><i className="bi bi-chat-dots-fill"></i></span>
                      <input type="text" className="form-control" name='material_name_ro' value={editProduct.material_name_ro ?? ''} onChange={e => setEditProduct({ ...editProduct, material_name_ro: e.target.value })} placeholder="Material Name (RO)" aria-label="Material Name (RO)" aria-describedby="ro-mat-name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">HS Code:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="hs-code"><i className="bi bi-chat-dots-fill"></i></span>
                      <input type="text" className="form-control" name='hs_code' value={editProduct.hs_code ?? ''} onChange={e => setEditProduct({ ...editProduct, hs_code: e.target.value })} placeholder="HS Code" aria-label="HS Code" aria-describedby="hs-code" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Battery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" id="battery" name='battery' checked={editProduct.battery} onChange={e => setEditProduct({ ...editProduct, battery: e.target.checked })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Default Usage:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="usage"><i className="bi bi-chat-dots-fill"></i></span>
                      <input type="text" className="form-control" name='default_usage' value={editProduct.default_usage ?? ''} onChange={e => setEditProduct({ ...editProduct, default_usage: e.target.value })} placeholder="Default Usage" aria-label="Default Usage" aria-describedby="usage" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Estimated Production Time:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text" id="production-time"><i className="bi bi-coin"></i></span>
                      <input type="number" className="form-control" name='production_time' value={parseFloat(editProduct.production_time ?? '0')} onChange={e => setEditProduct({ ...editProduct, production_time: e.target.value })} placeholder="Production Time" aria-label="Production Time" aria-describedby="production-time" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Discontinued:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" id="discontinued" name='discontinued' checked={editProduct.discontinued} onChange={e => setEditProduct({ ...editProduct, discontinued: e.target.checked })} />
                    </div>
                  </div>
                </div>
              </form>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#createShipmentModal" onClick={() => setEditProduct(undefined)}><i className='bi bi-trash'></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleEditProduct}><i className='bi bi-save'></i>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}