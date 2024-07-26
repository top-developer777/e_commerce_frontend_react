import { useEffect, useState } from 'react'
import Select from 'react-select';

import { Content } from '../../../../_metronic/layout/components/content'
// import { useAuth } from '../../../modules/auth';
import { createAWB, getAllOrders, getOrderAmout } from './_request'
import { Order } from '../../models/order';
import { getAllProducts } from '../../inventory_management/components/_request';
import { Product } from '../../models/product';
import { toast } from 'react-toastify';
import { getWarehouses } from '../../dashboard/components/_request';
import { WarehouseType } from '../../models/warehouse';
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

export const StatusBadge: React.FC<{ status: number }> = props => (
  <>
    {props.status === 0
      ? <div>
        <span className="badge badge-secondary fw-bold fs-7 p-2">
          <i className='bi bi-slash-circle fw-bold'></i>&nbsp;
          Canceled
        </span>
      </div>
      : props.status === 1
        ? <div>
          <span className="badge badge-light-info fw-bold fs-7 p-2">
            <i className='bi bi-file-earmark-plus text-info fw-bold'></i>&nbsp;
            New
          </span>
        </div>
        : props.status == 2
          ? <div>
            <span className="badge badge-light-primary fw-bold fs-7 p-2">
              <i className='bi bi-hourglass text-primary fw-bold'></i>&nbsp;
              In progress
            </span>
          </div>
          : props.status == 3
            ? <div>
              <span className="badge badge-light-success fw-bold fs-7 p-2">
                <i className='bi bi-check2-circle text-success fw-bold'></i>&nbsp;
                Prepared
              </span>
            </div>
            : props.status === 4
              ? <div>
                <span className="badge badge-light-warning fw-bold fs-7 p-2">
                  <i className='bi bi-stack text-warning fw-bold'></i>&nbsp;
                  Finalized
                </span>
              </div>
              : props.status == 5
                ? <div>
                  <span className="badge badge-light-danger fw-bold fs-7 p-2">
                    <i className='bi bi-repeat text-danger fw-bold'></i>&nbsp;
                    Returned
                  </span>
                </div>
                : <div>

                </div>
    }
  </>
)

const OrderTable: React.FC<{
  orders: Order[],
  currentPage: number,
  totalPages: number,
  totalOrders: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setEditID?: React.Dispatch<React.SetStateAction<number>>,
}> = props => {
  const { currentPage, setCurrentPage } = props;
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOrder, selectOrder] = useState<Order>();
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [senders, setSenders] = useState<{ value: string, label: string }[]>([]);

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
    const data: {
      cod: number,
      envelope_number: number,
      is_oversize: boolean,
      order_id: number,
      parcel_number: number,
      locker_id: string,
      rma_id: number,
      insured_value: number,
      observation: string,
      courier_account_id: number,
      pickup_and_return: boolean,
      saturday_delivery: boolean,
      sameday_delivery: boolean,
      dropoff_locker: boolean,
      receiver_contact: string,
      receiver_legal_entity: boolean,
      receiver_locality_id: number,
      receiver_name: string,
      receiver_phone1: string,
      receiver_phone2?: string,
      receiver_street: string,
      receiver_zipcode: string,
      sender_locality_id: number,
      sender_name: string,
      sender_phone1: string,
      sender_phone2?: string,
      sender_street: string,
      sender_zipcode: string,
    } = {
      cod: 0,
      envelope_number: 0,
      is_oversize: false,
      order_id: 0,
      parcel_number: 0,
      locker_id: '',
      rma_id: 0,
      insured_value: 0,
      observation: '',
      courier_account_id: 0,
      pickup_and_return: false,
      saturday_delivery: false,
      sameday_delivery: false,
      dropoff_locker: false,
      receiver_contact: '',
      receiver_legal_entity: false,
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
      sender_zipcode: ''
    };
    data.cod = parseFloat((form?.querySelector('[name="cod"]') as HTMLInputElement).value);
    data.envelope_number = parseFloat((form?.querySelector('[name="envelope_number"]') as HTMLInputElement).value);
    data.is_oversize = (form?.querySelector('[name="is_oversize"]') as HTMLInputElement).checked;
    data.order_id = parseInt((form?.querySelector('[name="order_id"]') as HTMLInputElement).value);
    data.locker_id = (form?.querySelector('[name="locker_id"]') as HTMLInputElement).value;
    data.rma_id = parseInt((form?.querySelector('[name="rma_id"]') as HTMLInputElement).value);
    data.insured_value = parseFloat((form?.querySelector('[name="insured_value"]') as HTMLInputElement).value);
    data.courier_account_id = parseInt((form?.querySelector('[name="courier_account_id"]') as HTMLInputElement).value);
    data.parcel_number = parseInt((form?.querySelector('[name="parcel_number"]') as HTMLInputElement).value);
    data.observation = (form?.querySelector('[name="observation"]') as HTMLInputElement).value;
    data.pickup_and_return = (form?.querySelector('[name="pickup_and_return"]') as HTMLInputElement).checked;
    data.saturday_delivery = (form?.querySelector('[name="saturday_delivery"]') as HTMLInputElement).checked;
    data.sameday_delivery = (form?.querySelector('[name="sameday_delivery"]') as HTMLInputElement).checked;
    data.dropoff_locker = (form?.querySelector('[name="dropoff_locker"]') as HTMLInputElement).checked;
    data.receiver_locality_id = parseInt((form?.querySelector('[name="receiver.locality_id"]') as HTMLInputElement).value);
    data.receiver_name = (form?.querySelector('[name="receiver.name"]') as HTMLInputElement).value;
    data.receiver_phone1 = (form?.querySelector('[name="receiver.phone"]') as HTMLInputElement).value;
    data.receiver_street = (form?.querySelector('[name="receiver.street"]') as HTMLInputElement).value;
    data.receiver_contact = (form?.querySelector('[name="receiver.contact"]') as HTMLInputElement).value;
    data.receiver_legal_entity = (form?.querySelector('[name="receiver.legal_entity"]') as HTMLInputElement).checked;
    data.receiver_zipcode = (form?.querySelector('[name="receiver.zipcode"]') as HTMLInputElement).value;
    if (!isValidPhone(data.receiver_phone1) || (data.receiver_phone2 && !isValidPhone(data.receiver_phone2 ?? ''))) {
      toast.error('Receiver\'s phone must be valid phone number.');
      return;
    }
    const senderId = parseInt((form?.querySelector('[name="sender"]') as HTMLInputElement).value);
    if (!data.cod || !data.envelope_number || !data.order_id || !data.locker_id || !data.insured_value || !data.parcel_number) {
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
      .then(() => {})
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
              <th className='col-md-1 align-content-center text-center'>Order Date</th>
              <th className='col-md-1 align-content-center text-center'>Products</th>
              <th className='col-md-1 align-content-center text-center'>Vendor Name</th>
              <th className='col-md-1 align-content-center text-center'>Marketplace</th>
              {/* <th className='col-md-2 align-content-center text-center px-1'>Invoice</th> */}
              <th className='col-md-2 align-content-center text-center px-1'>AWB</th>
              <th className='col-md-1 align-content-center text-center'>Status</th>
              <th className='col-md-1 align-content-center text-center py-0'>Payment Method</th>
              <th className='col-md-1 align-content-center text-center py-0'>Shipping Tax</th>
              <th className='col-md-1 align-content-center text-center'>Customer</th>
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
                  <td className='align-content-center text-center'>
                    {order.product_id.map(id => {
                      const product = products.find(product => product.id === id);
                      return <div key={`product${order.id}:${id}`}><a href='#'><img width={40} src={product?.image_link} alt={product?.model_name} /></a></div>
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
                    {[1, 2, 3].findIndex(item => item === order.status) >= 0 && <button type='button' className='btn btn-primary p-1 px-3' onClick={() => selectOrder(order)} data-bs-toggle="modal" data-bs-target="#createAWBModal">
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
                  <td className='align-content-center text-center'>
                    {order.customer_id}
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
                  <div className="d-flex fw-bold w-25">RMA ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='rma_id' placeholder="RMA ID" min={0} max={999} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Envelope Number:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='envelope_number' placeholder="Envelope Number" min={0} max={9999} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Parcel Number:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='parcel_number' placeholder="Parcel Number" min={0} max={999} required />
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
                <div className="align-items-center py-1" style={{ display: 'none' }}>
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
                      <input type="number" className="form-control" name='insured_value' placeholder="Insured Value" min={0} max={9999} required />
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
                      <input className="form-check-input" type="checkbox" name='pickup_and_return' defaultChecked={false} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Saturday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='saturday_delivery' defaultChecked={false} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Sameday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='sameday_delivery' defaultChecked={false} />
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
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Sender:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='sender'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      options={senders}
                      placeholder='Select a sender'
                      isSearchable={false}
                      noOptionsMessage={e => `No more senders including "${e.inputValue}"`}
                      defaultValue={senders[0]}
                    />
                  </div>
                </div>
                <hr />
                <h2>Receiver</h2>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Name:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.name' placeholder="Name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Contact:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.contact' placeholder="Contact" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Phone Number:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.phone' placeholder="+11234567890" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Legal Entity:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" name='receiver.legal_entity' defaultChecked={false} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Locality ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" name='receiver.locality_id' min={1} max={4294967295} placeholder="Locality ID" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Street:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" name='receiver.street' placeholder="Street" required />
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
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className='bi bi-trash'></i>Close</button>
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
  const [currentState, setCurrentState] = useState<[number, string]>([-1, ''])

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
    getAllOrders(currentPage, limit, selectedStatus, searchText)
      .then(async res => {
        setOrders(res.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, selectedStatus, searchText]);

  return (
    <Content>
      <SearchBar searchText={searchText} setSearchText={setSearchText} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
      <OrderTable orders={orders} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} totalOrders={totalOrders} />
    </Content>
  )
}
