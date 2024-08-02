import { useEffect, useState } from 'react'
import Select from 'react-select';
import { toast } from 'react-toastify';

import { Content } from '../../../../_metronic/layout/components/content'
// import { useAuth } from '../../../modules/auth';
import { createAWB, getAllOrders, getCustomer, getOrderAmout } from './_request'
import { Order } from '../../models/order';
import { getAllProducts } from '../../inventory_management/components/_request';
import { Product } from '../../models/product';
import { getWarehouses } from '../../dashboard/components/_request';
import { WarehouseType } from '../../models/warehouse';
import { AWBInterface } from '../../models/awb';
import { CustomerInterface } from '../../models/customer';
// import Select from 'react-select'
// import { getProductImageByID } from '../../inventory_management/components/_request'

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

export const StatusBadge: React.FC<{ status: number }> = props => {
  switch (props.status) {
    default: return <div></div>
    case 0:
      return (
        <div>
          <span className="badge badge-secondary fw-bold fs-7 p-2">
            <i className='bi bi-slash-circle fw-bold'></i>&nbsp;
            Canceled
          </span>
        </div>
      )
    case 1:
      return (
        <div>
          <span className="badge badge-light-info fw-bold fs-7 p-2">
            <i className='bi bi-file-earmark-plus text-info fw-bold'></i>&nbsp;
            New
          </span>
        </div>
      )
    case 2:
      return (
        <div>
          <span className="badge badge-light-primary fw-bold fs-7 p-2">
            <i className='bi bi-hourglass text-primary fw-bold'></i>&nbsp;
            In progress
          </span>
        </div>
      )
    case 3:
      return (
        <div>
          <span className="badge badge-light-success fw-bold fs-7 p-2">
            <i className='bi bi-check2-circle text-success fw-bold'></i>&nbsp;
            Prepared
          </span>
        </div>
      )
    case 4:
      return (
        <div>
          <span className="badge badge-light-warning fw-bold fs-7 p-2">
            <i className='bi bi-stack text-warning fw-bold'></i>&nbsp;
            Finalized
          </span>
        </div>
      )
    case 5:
      return (
        <div>
          <span className="badge badge-light-danger fw-bold fs-7 p-2">
            <i className='bi bi-repeat text-danger fw-bold'></i>&nbsp;
            Returned
          </span>
        </div>
      )
  }
}

const OrderTable: React.FC<{
  orders: Order[],
  currentPage: number,
  totalPages: number,
  totalOrders: number,
  sort: boolean,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setSort: React.Dispatch<React.SetStateAction<boolean>>,
  setEditID?: React.Dispatch<React.SetStateAction<number>>,
}> = props => {
  const { currentPage, setCurrentPage } = props;
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, selectOrder] = useState<Order>();
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [senders, setSenders] = useState<{ value: string, label: string }[]>([]);
  const [customer, setCustomer] = useState<CustomerInterface>();

  useEffect(() => {
    getAllProducts()
      .then(res => setProducts(res.data))
      .catch(e => console.error(e))
    getWarehouses()
      .then(res => res.data)
      .then(res => {
        setWarehouses(res.sort((x: WarehouseType, y: WarehouseType) => {
          if (x.id && y.id) return x.id - y.id;
        }));
        const warehouse = res.map((data: WarehouseType) => {
          return { value: data.id, label: `${data.sender_name} (${data.phone1})` };
        });
        setSenders(warehouse);
      })
      .catch(e => console.error(e));
  }, []);
  useEffect(() => {
    if (!selectedOrder) {
      setCustomer(undefined);
      return;
    }
    getCustomer(selectedOrder?.id ?? 0)
      .then(res => res.data)
      .then(res => {
        if (res === null) {
          toast.warning('Can\'t load receiver\'s information.');
          setCustomer(undefined);
          return;
        }
        setCustomer(res);
      })
      .catch(e => {
        toast.error('Can\'t load receiver\'s information');
        setCustomer(undefined);
        console.error(e);
      })
  }, [selectedOrder]);

  // const { currentUser } = useAuth();
  // const handleEdit = (id: number) => {
  //   if (props.setEditID) {
  //     props.setEditID(id);
  //   }
  // }
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(props.totalPages - 1, currentPage + 2);
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
    if (endPage < props.totalPages - 1) {
      pageNumbers.push(<span key='end-elipsis'>...</span>);
    }
    if (props.totalPages > 1) {
      pageNumbers.push(
        <button key={`page${props.totalPages}`} type='button' className={`btn ${currentPage === props.totalPages ? 'btn-primary' : 'btn-light'} p-2 px-3 mx-1 fs-7`} onClick={() => setCurrentPage(props.totalPages)}>{props.totalPages}</button>
      );
    }
    return pageNumbers;
  };
  const isValidPhone = (phoneStr: string) => {
    let phone = phoneStr;
    if (phone.indexOf('+') === 0) phone = phone.slice(1);
    const phoneNum = parseFloat(phone);
    if (!phoneNum) return false;
    if (phoneNum % 1 > 0) return false;
    const len = Math.floor(Math.log10(phoneNum)) + 1;
    if (len > 7 && len < 12) return true;
    return false;
  }
  const handleCreateAWB = () => {
    if (!selectedOrder) return;
    const form = document.querySelector('#createAWBModal form');
    const closeBtn = document.querySelector('#createAWBModal .btn-close') as HTMLButtonElement;
    const data: AWBInterface = {
      cod: '0',
      envelope_number: 1,
      is_oversize: 0,
      order_id: 0,
      parcel_number: 0,
      locker_id: '',
      insured_value: '0',
      observation: '',
      courier_account_id: 0,
      pickup_and_return: 0,
      saturday_delivery: 0,
      sameday_delivery: 0,
      dropoff_locker: 0,
      receiver_contact: '',
      receiver_legal_entity: 0,
      receiver_locality_id: 0,
      receiver_name: '',
      receiver_phone1: '',
      receiver_phone2: '',
      receiver_street: '',
      receiver_zipcode: '',
      sender_locality_id: 0,
      sender_name: '',
      sender_phone1: '',
      sender_phone2: '',
      sender_street: '',
      sender_zipcode: '',
      weight: '0',
    };
    data.cod = (form?.querySelector('[name="cod"]') as HTMLInputElement).value;
    data.envelope_number = parseFloat((form?.querySelector('[name="envelope_number"]') as HTMLInputElement).value);
    data.is_oversize = (form?.querySelector('[name="is_oversize"]') as HTMLInputElement).checked ? 1 : 0;
    data.order_id = parseInt((form?.querySelector('[name="order_id"]') as HTMLInputElement).value);
    data.locker_id = (form?.querySelector('[name="locker_id"]') as HTMLInputElement).value;
    data.insured_value = (form?.querySelector('[name="insured_value"]') as HTMLInputElement).value;
    data.courier_account_id = parseInt((form?.querySelector('[name="courier_account_id"]') as HTMLInputElement).value);
    data.parcel_number = parseInt((form?.querySelector('[name="parcel_number"]') as HTMLInputElement).value);
    data.observation = (form?.querySelector('[name="observation"]') as HTMLInputElement).value;
    data.pickup_and_return = (form?.querySelector('[name="pickup_and_return"]') as HTMLInputElement).checked ? 1 : 0;
    data.saturday_delivery = (form?.querySelector('[name="saturday_delivery"]') as HTMLInputElement).checked ? 1 : 0;
    data.sameday_delivery = (form?.querySelector('[name="sameday_delivery"]') as HTMLInputElement).checked ? 1 : 0;
    data.dropoff_locker = (form?.querySelector('[name="dropoff_locker"]') as HTMLInputElement).checked ? 1 : 0;
    data.receiver_locality_id = parseInt((form?.querySelector('[name="receiver.locality_id"]') as HTMLInputElement).value);
    data.receiver_name = (form?.querySelector('[name="receiver.name"]') as HTMLInputElement).value;
    data.receiver_phone1 = (form?.querySelector('[name="receiver.phone1"]') as HTMLInputElement).value;
    data.receiver_phone2 = (form?.querySelector('[name="receiver.phone2"]') as HTMLInputElement).value;
    data.receiver_street = (form?.querySelector('[name="receiver.street"]') as HTMLInputElement).value;
    data.receiver_contact = (form?.querySelector('[name="receiver.contact"]') as HTMLInputElement).value;
    data.receiver_legal_entity = (form?.querySelector('[name="receiver.legal_entity"]') as HTMLInputElement).checked ? 1 : 0;
    data.receiver_zipcode = (form?.querySelector('[name="receiver.zipcode"]') as HTMLInputElement).value;
    if (!isValidPhone(data.receiver_phone1) || (data.receiver_phone2 && !isValidPhone(data.receiver_phone2 ?? ''))) {
      toast.error('Receiver\'s phone must be valid phone number.');
      return;
    }
    const senderId = parseInt((form?.querySelector('[name="sender"]') as HTMLInputElement).value);
    if (!data.cod || !data.order_id) {
      toast.error('Please fill all necessary values.');
      return;
    }
    if (!senderId) {
      toast.error('Please select a sender.');
      return;
    }
    const sender = warehouses.find(house => house.id === senderId);
    data.sender_locality_id = parseInt(sender?.locality_id ?? '0');
    data.sender_name = sender?.sender_name ?? '';
    data.sender_phone1 = sender?.phone1 ?? '';
    data.sender_phone2 = sender?.phone2 ?? '';
    data.sender_street = sender?.street ?? '';
    data.sender_zipcode = sender?.zipcode ?? '';
    createAWB(data, selectedOrder.order_market_place)
      .then(res => {
        const data = res.data;
        if (data.isError) {
          toast.error(data.messages[0]);
          return;
        } else {
          toast.success(
            <table>
            <tr><td className='text-nowrap fw-bold'>AWB Barcode: </td><td>{data.results.awb[0].awb_barcode}</td></tr>
            <tr><td className='text-nowrap fw-bold'>AWB Number: </td><td>{data.results.awb[0].awb_number}</td></tr>
            <tr><td className='text-nowrap fw-bold'>Courier ID: </td><td>{data.results.courier_id}</td></tr>
            <tr><td className='text-nowrap fw-bold'>Courier Name: </td><td>{data.results.courier_name}</td></tr>
            </table>, {
              autoClose: false,
            });
          closeBtn.click();
        }
      })
      .catch(e => console.error(e));
  }

  return (
    <>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div className='d-flex flex-row '>
          <button type='button' key={-1} className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="bi bi-chevron-double-left"></i>
          </button>
          {renderPageNumbers()}
          <button type='button' key="+1" className='btn btn-light p-2 px-3 mx-1 fs-7' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === props.totalPages}>
            <i className="bi bi-chevron-double-right"></i>
          </button>
          <div className='align-content-center mx-10'>
            Total: {props.totalOrders}
          </div>
        </div>
        {/* <div>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-cart-plus"></i>
            Add Order
          </button>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-repeat"></i>
            Add to process group
          </button>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-tags"></i>
            Tags
          </button>
          <button type='button' className='btn btn-light btn-light-primary p-2 px-3 mx-1 fs-7'>
            <i className="bi bi-activity"></i>
            Actions
          </button>
        </div> */}
      </div>
      <div>
        <table className="table table-rounded table-row-bordered border gy-7 gs-7">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              {/* <th className='align-content-center'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              </th> */}
              <th className='col-md-1 align-content-center text-center cursor-pointer' onClick={() => props.setSort(!props.sort)} title='Assending/Decending'>
                <div className="d-flex">
                  <div className='d-flex align-items-center'>Order Date</div>
                  <div className='d-flex align-items-center'>{props.sort ? <i className='bi bi-caret-down-fill'></i> : <i className='bi bi-caret-up-fill'></i>}</div>
                </div>
              </th>
              <th className='col-md-1 align-content-center text-center'>Order ID</th>
              <th className='col-md-1 align-content-center text-center'>Products</th>
              <th className='col-md-1 align-content-center text-center'>Vendor Name</th>
              <th className='col-md-1 align-content-center text-center'>Marketplace</th>
              {/* <th className='col-md-2 align-content-center text-center px-1'>Invoice</th> */}
              <th className='col-md-2 align-content-center text-center px-1'>AWB</th>
              <th className='col-md-1 align-content-center text-center'>Status</th>
              <th className='col-md-1 align-content-center text-center py-0'>Payment Method</th>
              <th className='col-md-1 align-content-center text-center py-0'>Shipping Tax</th>
              {/* {currentUser && parseInt(currentUser.role ?? '') > 2 && (
                <th className='col-md-1 align-content-center text-center'>Actions</th>
              )} */}
            </tr>
          </thead>
          <tbody>
            {
              props.orders.map((order: Order, index: number) =>
                <tr key={`order${index}`}>
                  {/* <td className='align-content-center'>
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                  </td> */}
                  <td className='align-content-center text-center '>{(new Date(order.date)).toLocaleString()}</td>
                  <td className='align-content-center text-center'>{order.id}</td>
                  <td className='align-content-center text-center'>
                    {order.product_id.map(id => {
                      const product = products.find(product => product.id === id);
                      return <div key={`product${order.id}:${id}`}><a href='#'><img width={40} src={product?.image_link} alt={product?.model_name} title={product?.product_name} /></a></div>
                    })}
                  </td>
                  <td className='align-content-center text-center '>{order.vendor_name}</td>
                  <td className='align-content-center text-center'>
                    {order.order_market_place}
                  </td>
                  {/* <td className='align-content-center text-center'>
                    <button type='button' className='btn btn-primary p-1 px-3'>
                      <i className="bi bi-file-earmark-plus"></i>
                      Create
                    </button>
                  </td> */}
                  <td className='align-content-center text-center'>
                    {order.status === 0 && <>None</>}
                    {([1, 2, 3].findIndex(item => item === order.status) >= 0 && order.payment_mode_id !== 2) && <button type='button' className='btn btn-primary p-1 px-3' onClick={() => selectOrder(order)} data-bs-toggle="modal" data-bs-target="#createAWBModal">
                      <i className="bi bi-file-earmark-plus"></i>
                      Create
                    </button>}
                    {[4, 5].findIndex(item => item === order.status) >= 0 && <>{order.awb ?? 'None'}</>}
                  </td>
                  <td className='align-content-center text-center'>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className='align-content-center text-center'>
                    {order.payment_mode}
                  </td>
                  <td className='align-content-center text-center'>
                    {order.shipping_tax}
                  </td>
                  {/* {currentUser && [3, 4].includes(parseInt(currentUser.role ?? '')) && (
                    <td className='align-content-center text-center'>
                      {(currentUser.role == '3' && [2, 3].includes(order.status)) ? '' : (
                        <a className='btn btn-white btn-sm p-0' onClick={() => handleEdit(index)}>
                          <i className="bi bi-pencil-square fs-3 p-1"></i>
                        </a>
                      )}
                    </td>
                  )} */}
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className="modal fade" id='createAWBModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Create AWB</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="" method='post' id='createAWBForm'>
                <input type="number" name='order_id' defaultValue={selectedOrder?.id} disabled style={{ display: 'none' }} />
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Warehouse:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='sender'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={senders}
                      placeholder='Select a warehouse'
                      isSearchable={false}
                      noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                      defaultValue={senders[0]}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Envelope Number:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='envelope_number' placeholder="Envelope Number" defaultValue={0} min={0} max={9999} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Parcel Number:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='parcel_number' placeholder="Parcel Number" min={0} max={999} defaultValue={1} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Locker ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="string" className="form-control" name='locker_id' placeholder="Locker ID" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">COD:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='cod' placeholder="COD" defaultValue={selectedOrder?.cashed_cod} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Contain Oversize Product:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='is_oversize' defaultChecked={false} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Insured Value:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='insured_value' placeholder="Insured Value" defaultValue={0} min={0} max={9999} required />
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
                  <div className="d-flex fw-bold w-25">Courier Account ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='courier_account_id' placeholder="Courier Account ID" min={0} max={9999} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Pickup and Return:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='pickup_and_return' defaultChecked={true} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Saturday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='saturday_delivery' defaultChecked={true} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Sameday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='sameday_delivery' defaultChecked={true} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Dropoff Locker:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='dropoff_locker' defaultChecked={false} />
                    </div>
                  </div>
                </div>
                <hr />
                <h2>Receiver</h2>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.name' value={customer?.name} onChange={e => {if (customer) setCustomer({ ...customer, name: e.target.value })}} placeholder="Name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Contact:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.contact' value={customer?.shipping_contact} onChange={e => {if (customer) setCustomer({ ...customer, shipping_contact: e.target.value })}} placeholder="Contact" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Phone Number 1:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.phone1' value={customer?.phone_1} onChange={e => {if (customer) setCustomer({ ...customer, phone_1: e.target.value })}} placeholder="+11234567890" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Phone Number 2 (Optional):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.phone2' placeholder="+11234567890" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Legal Entity:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='receiver.legal_entity' checked={customer?.legal_entity === 1} onChange={e => {if (customer) setCustomer({ ...customer, legal_entity: e.target.checked ? 1 : 0 })}} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Locality ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='receiver.locality_id' value={customer?.shipping_locality_id} onChange={e => {if (customer) setCustomer({ ...customer, shipping_locality_id: e.target.value })}} min={1} max={4294967295} placeholder="Locality ID" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Street:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.street' value={customer?.shipping_street} onChange={e => {if (customer) setCustomer({ ...customer, shipping_street: e.target.value })}} placeholder="Street" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Zipcode:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.zipcode' placeholder="Zipcode" required />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => selectOrder(undefined)} data-bs-dismiss="modal"><i className='bi bi-trash'></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleCreateAWB}><i className='bi bi-save'></i>Create AWB</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const SearchBar: React.FC<{
  selectedStatus: number,
  searchText: string,
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
  setSelectedStatus: React.Dispatch<React.SetStateAction<number>>,
}> = props => {
  const handleChangeStatus = (status: number) => {
    if (status === props.selectedStatus) {
      props.setSelectedStatus(-1);
    } else {
      props.setSelectedStatus(status);
    }
  }
  return (
    <div>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div>
          <button type='button' className={`btn btn-secondary fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 0 ? ' active' : ''}`} onClick={() => handleChangeStatus(0)}>
            <i className="bi bi-slash-circle"></i>
            Canceled
          </button>
          <button type='button' className={`btn btn-light-info fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 1 ? ' active' : ''}`} onClick={() => handleChangeStatus(1)}>
            <i className="bi bi-file-earmark-plus"></i>
            New
          </button>
          <button type='button' className={`btn btn-light-primary fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 2 ? ' active' : ''}`} onClick={() => handleChangeStatus(2)}>
            <i className="bi bi-hourglass"></i>
            In progress
          </button>
          <button type='button' className={`btn btn-light-success fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 3 ? ' active' : ''}`} onClick={() => handleChangeStatus(3)}>
            <i className="bi bi-check2-circle"></i>
            Prepared
          </button>
          <button type='button' className={`btn btn-light-warning fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 4 ? ' active' : ''}`} onClick={() => handleChangeStatus(4)}>
            <i className="bi bi-stack"></i>
            Finalized
          </button>
          <button type='button' className={`btn btn-light-danger fw-bold p-1 px-3 mx-1 fs-7 fs-7${props.selectedStatus === 5 ? ' active' : ''}`} onClick={() => handleChangeStatus(5)}>
            <i className="bi bi-repeat"></i>
            Returned
          </button>
        </div>
        {/* <button type='button' className='btn btn-light btn-light-primary p-1 px-3 mx-1'>
          <i className="bi bi-search"></i>
          Advanced Search
        </button> */}
      </div>
      <div className='mb-4'>
        <input
          type="text"
          className="form-control form-control-solid py-1"
          placeholder="Search..."
          value={props.searchText}
          onChange={e => props.setSearchText(e.target.value)}
        />
      </div>
    </div>
  )
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState<number>(50);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [currentState, setCurrentState] = useState<[number, string]>([-1, '']);
  const [sort, setSort] = useState<boolean>(true);

  useEffect(() => {
    if (currentState[0] !== selectedStatus || currentState[1] !== searchText) {
      setCurrentState([selectedStatus, searchText]);
      setCurrentPage(1);
    }
    getOrderAmout(selectedStatus, searchText)
      .then(res => {
        setTotalOrders(res.data);
        setTotalPages(res.data > 0 ? Math.ceil((res.data + 1) / limit) : 1);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, searchText, selectedStatus]);
  useEffect(() => {
    if (currentState[0] !== selectedStatus || currentState[1] !== searchText) {
      setCurrentState([selectedStatus, searchText]);
      setCurrentPage(1);
    }
    getAllOrders(currentPage, limit, selectedStatus, searchText, sort)
      .then(async res => {
        setOrders(res.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, selectedStatus, searchText, sort]);

  return (
    <Content>
      <SearchBar searchText={searchText} setSearchText={setSearchText} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
      <OrderTable orders={orders} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} totalOrders={totalOrders} sort={sort} setSort={setSort} />
    </Content>
  )
}
