import { useEffect, useState } from 'react'
import Select from 'react-select';
import { toast } from 'react-toastify';

import { Content } from '../../../../_metronic/layout/components/content'
import { createAWB, getAllOrders, getAWBByOrderID, getCouriers, getCustomer, getNewOrders, getOrder, getOrderAmout } from './_request'
import { Order } from '../../models/order';
import { getAllProducts } from '../../inventory_management/components/_request';
import { Product } from '../../models/product';
import { getWarehouses } from '../../dashboard/components/_request';
import { WarehouseType } from '../../models/warehouse';
import { AWBInterface } from '../../models/awb';
import { CourierType } from '../../models/courier';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerInterface } from '../../models/customer';
import { formatCurrency } from '../../dashboard/components/_function';
import { darkModeStyles } from '../../../../_metronic/partials';

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

interface AllAWBInterface {
  senderID: number;
  courier_account_id: number | null;
  pickup_and_return: number;
  saturday_delivery: number;
  sameday_delivery: number;
  dropoff_locker: number;
}

const OrderTable: React.FC<{
  orders: Order[];
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  sort: boolean;
  totals: number[];
  awbs: { orderID: number, data: any }[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setSort: React.Dispatch<React.SetStateAction<boolean>>;
  setEditID?: React.Dispatch<React.SetStateAction<number>>;
}> = props => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { currentPage, setCurrentPage, products, totals } = props;
  const [selectedOrder, selectOrder] = useState<Order>();
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [senders, setSenders] = useState<{ value: number, label: string }[]>([]);
  const [couriers, setCouriers] = useState<{ value: number, label: string }[]>([]);
  const [awbForm, setAwbForm] = useState<AWBInterface>();
  const [awbsForm, setAwbsForm] = useState<AllAWBInterface>();
  const [senderId, setSenderId] = useState<number>(0);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<{ id: number, data: CustomerInterface }[]>([]);
  const navigate = useNavigate();

  setInterval(() => {
    if (localStorage.getItem('kt_theme_mode_value') === 'dark') setIsDarkMode(true);
    else setIsDarkMode(false);
  }, 100);
  useEffect(() => {
    getWarehouses()
      .then(res => res.data)
      .then(res => {
        setWarehouses(res.sort((x: WarehouseType, y: WarehouseType) => {
          if (x.id && y.id) return x.id - y.id;
        }));
        const warehouse = res.map((data: WarehouseType) => {
          return { value: data.id, label: `${data.sender_name} (${data.phone1})` };
        });
        setAwbsForm({
          senderID: warehouse[0]?.value ?? 0,
          courier_account_id: null,
          pickup_and_return: 0,
          sameday_delivery: 0,
          saturday_delivery: 0,
          dropoff_locker: 0,
        });
        setSenders(warehouse);
      })
      .catch(e => console.error(e));
    getCouriers()
      .then(res => res.data)
      .then((res: CourierType[]) => {
        setCouriers(res.map(data => {
          return { value: data.account_id, label: data.account_display_name }
        }));
      })
      .catch(e => console.error(e));
    getNewOrders()
      .then(res => res.data)
      .then(res => {
        setNewOrders(res);
      })
      .catch(e => console.error(e));
    props.orders.forEach(order => {
      getCustomer(order.id ?? 0)
        .then(res => {
          setCustomers([...customers, { id: order.id ?? 0, data: res.data }]);
        })
        .catch(e => console.error(e));
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.orders]);
  useEffect(() => {
    if (!selectedOrder) {
      setAwbForm(undefined);
      return;
    }
    const sender = warehouses.find(house => house.id === senderId);
    const products = props.products.filter(product => selectedOrder.product_id.findIndex(id => id === product.id) >= 0);
    const observation = products.map((product, index) => {
      const quantity = selectedOrder.quantity[index] ?? 1;
      return `${product.observation ?? '(No observation)'} X${quantity}${quantity > 1 ? ' ' + Array(quantity).fill('●').join('') : ''}`;
    }).join(' ➕ ');
    getCustomer(selectedOrder.id ?? 0)
      .then(res => res.data)
      .then(res => {
        if (res === null) {
          toast.warning('Can\'t load receiver\'s information.');
          setAwbForm({
            cod: selectedOrder.cashed_cod.toString(),
            envelope_number: 1,
            is_oversize: 0,
            order_id: selectedOrder?.id ?? 0,
            parcel_number: 0,
            locker_id: JSON.parse(selectedOrder?.details ?? '{}').locker_id ?? '',
            insured_value: '0',
            observation: observation,
            courier_account_id: null,
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
            sender_locality_id: sender?.locality_id ?? 0,
            sender_name: sender?.sender_name ?? '',
            sender_phone1: sender?.phone1 ?? '',
            sender_phone2: sender?.phone2 ?? '',
            sender_street: sender?.street ?? '',
            sender_zipcode: sender?.zipcode ?? '',
            weight: '0',
          });
          return;
        }
        setAwbForm({
          cod: selectedOrder.cashed_cod.toString(),
          envelope_number: 1,
          is_oversize: 0,
          order_id: selectedOrder?.id ?? 0,
          parcel_number: 0,
          locker_id: JSON.parse(selectedOrder?.details ?? '{}').locker_id ?? '',
          insured_value: '0',
          observation: observation,
          courier_account_id: null,
          pickup_and_return: 0,
          saturday_delivery: 0,
          sameday_delivery: 0,
          dropoff_locker: 0,
          receiver_contact: res.shipping_contact,
          receiver_legal_entity: res.legal_entity,
          receiver_locality_id: parseInt(res.shipping_locality_id),
          receiver_name: res.name,
          receiver_phone1: res.phone_1,
          receiver_phone2: '',
          receiver_street: res.shipping_street,
          receiver_zipcode: '',
          sender_locality_id: sender?.locality_id ?? 0,
          sender_name: sender?.sender_name ?? '',
          sender_phone1: sender?.phone1 ?? '',
          sender_phone2: sender?.phone2 ?? '',
          sender_street: sender?.street ?? '',
          sender_zipcode: sender?.zipcode ?? '',
          weight: '0',
        });
      })
      .catch(e => {
        toast.error('Can\'t load receiver\'s information');
        setAwbForm({
          cod: selectedOrder.cashed_cod.toString(),
          envelope_number: 1,
          is_oversize: 0,
          order_id: selectedOrder?.id ?? 0,
          parcel_number: 0,
          locker_id: JSON.parse(selectedOrder?.details ?? '{}').locker_id ?? '',
          insured_value: '0',
          observation: observation,
          courier_account_id: null,
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
          sender_locality_id: sender?.locality_id ?? 0,
          sender_name: sender?.sender_name ?? '',
          sender_phone1: sender?.phone1 ?? '',
          sender_phone2: sender?.phone2 ?? '',
          sender_street: sender?.street ?? '',
          sender_zipcode: sender?.zipcode ?? '',
          weight: '0',
        });
        console.error(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, warehouses, selectedOrder]);

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
    if (!selectedOrder || !awbForm) return;

    const closeBtn = document.querySelector('#createAWBModal .btn-close') as HTMLButtonElement;
    const senderId = parseInt((document.querySelector('#createAWBModal form [name="sender"]') as HTMLInputElement).value);
    if (!awbForm?.cod || !awbForm?.order_id) {
      toast.error('Please fill all necessary values.');
      return;
    }
    if (!senderId) {
      toast.error('Please select a sender.');
      return;
    }
    if (!isValidPhone(awbForm.receiver_phone1) || (awbForm.receiver_phone2 && !isValidPhone(awbForm.receiver_phone2))) {
      toast.error('Receiver\'s phones must be valid phone numbers.');
      return;
    }
    createAWB(awbForm, selectedOrder.order_market_place)
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
  const handleCreateAWBs = () => {
    if (!awbsForm) return;
    const sender = warehouses.find(warehouse => warehouse.id === awbsForm.senderID);
    if (!sender) {
      toast.error('Can\'t find warehouse.');
      return;
    }
    const len = newOrders.length;
    newOrders.forEach((order, index) => {
      if (order.payment_mode_id === 2) return;
      getCustomer(order.id ?? 0)
        .then(res => res.data as CustomerInterface)
        .then(res => {
          const products = props.products.filter(product => order.product_id.findIndex(id => id === product.id) >= 0);
          const observation = products.map((product, index) => {
            const quantity = order.quantity[index] ?? 1;
            return `${product.observation ?? '(No observation)'} X${quantity}${quantity > 1 ? ' ' + Array(quantity).fill('●').join('') : ''}`;
          }).join(' ➕ ');
          const data: AWBInterface = {
            order_id: order.id ?? 0,
            sender_name: sender.sender_name,
            sender_phone1: sender.phone1,
            sender_phone2: sender.phone2 ?? '',
            sender_locality_id: sender.locality_id,
            sender_street: sender.street,
            sender_zipcode: sender.zipcode,
            receiver_contact: res.shipping_contact,
            receiver_legal_entity: res.legal_entity,
            receiver_locality_id: parseInt(res.shipping_locality_id),
            receiver_name: res.name,
            receiver_phone1: res.phone_1,
            receiver_phone2: '',
            receiver_street: res.shipping_street,
            receiver_zipcode: '',
            cod: order.cashed_cod.toString(),
            envelope_number: 0,
            is_oversize: 0,
            parcel_number: 1,
            locker_id: JSON.parse(order?.details ?? '{}').locker_id ?? '',
            insured_value: '0',
            observation: observation,
            courier_account_id: awbsForm.courier_account_id,
            pickup_and_return: awbsForm.pickup_and_return,
            saturday_delivery: awbsForm.saturday_delivery,
            sameday_delivery: awbsForm.sameday_delivery,
            dropoff_locker: awbsForm.dropoff_locker,
            weight: '0',
          }
          createAWB(data, order.order_market_place)
            .then(res => {
              const data = res.data;
              if (data.isError) {
                toast.error(<>
                  Failed to create AWB for order {order.id}<br />
                  {data.messages[0]}
                </>);
                return;
              }
              if (len === index + 1) toast.success('Completed!');
            })
            .catch(e => console.error(e));
        })
        .catch(e => {
          toast.error(`Can't create awb for order ${order.id}`);
          console.error(e);
        });
    });
  }

  return (
    <>
      <div className='d-flex flex-row justify-content-between mb-4'>
        <div className='d-flex flex-row'>
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
        <div className='d-flex ms-auto me-0'>
          <button type='button' className='btn btn-primary p-2 px-3 mx-1 fs-7' data-bs-toggle="modal" data-bs-target="#createAllAWBModal">
            <i className="bi bi-cart-plus"></i>
            Create AWBs for new Orders
          </button>
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
              <th className='align-content-center text-center cursor-pointer' onClick={() => props.setSort(!props.sort)} title='Assending/Decending'>
                <div className="d-flex">
                  <div className='d-flex align-items-center'>Order Date</div>
                  <div className='d-flex align-items-center'>{props.sort ? <i className='bi bi-caret-down-fill'></i> : <i className='bi bi-caret-up-fill'></i>}</div>
                </div>
              </th>
              <th className='align-content-center text-center'>Order ID</th>
              <th className='align-content-center text-center'>Products</th>
              <th className='align-content-center text-center'>Marketplace/Warehouse</th>
              <th className='align-content-center text-center px-1'>AWB</th>
              <th className='align-content-center text-center px-1'>Invoice</th>
              <th className='align-content-center text-center'>Status</th>
              <th className='align-content-center text-center'>Shipping Address</th>
              <th className='align-content-center text-center'>Payment Method</th>
              <th className='align-content-center text-center'>Total</th>
              <th className='align-content-center text-center'>Stock</th>
              {/* {currentUser && parseInt(currentUser.role ?? '') > 2 && (
                <th className='align-content-center text-center'>Actions</th>
              )} */}
            </tr>
          </thead>
          <tbody>
            {
              props.orders.map((order: Order, index: number) => {
                const selectedProducts = products.filter(product => order.product_id.findIndex(id => product.id === id) >= 0);

                return <tr key={`order${index}`}>
                  {/* <td className='align-content-center'>
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                  </td> */}
                  <td className='align-content-center text-center '>{(new Date(order.date)).toLocaleString()}</td>
                  <td className='align-content-center text-center text-primary cursor-pointer text-nowrap'>
                    <a href='#' onClick={() => navigate(`./${order.id}`)}>{order.id}</a>
                    {order.order_market_place.startsWith('eMAG.') && <a href={`https://marketplace.${order.order_market_place.toLowerCase()}/order/list-xb?mktId=${order.id ?? 0}`} className="ms-2" target='_blank'>
                      <svg fill="none" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <filter id="a" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="22" width="24" x=".5" y="1.5">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                          <feOffset />
                          <feGaussianBlur stdDeviation=".25" />
                          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
                          <feBlend in2="shape" mode="normal" result="effect1_innerShadow_19_598" />
                          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                          <feOffset dx="-1" dy="1" /><feGaussianBlur stdDeviation="1" />
                          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                          <feBlend in2="effect1_innerShadow_19_598" mode="normal" result="effect2_innerShadow_19_598" />
                          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                          <feOffset dx="2" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 0 0.220833 0 0 0 0.28 0" />
                          <feBlend in2="effect2_innerShadow_19_598" mode="normal" result="effect3_innerShadow_19_598" />
                          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                          <feOffset dx="1" dy="1" /><feGaussianBlur stdDeviation="1.5" />
                          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.199167 0 0 0 0 0.199217 0 0 0 0.1 0" />
                          <feBlend in2="effect3_innerShadow_19_598" mode="normal" result="effect4_innerShadow_19_598" />
                        </filter>
                        <pattern id="b" height=".791667" patternContentUnits="objectBoundingBox" width="1.05556" />
                        <g filter="url(#a)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                          <path d="m18 13v6c0 .5304-.2107 1.0391-.5858 1.4142s-.8838.5858-1.4142.5858h-11c-.53043 0-1.03914-.2107-1.41421-.5858-.37508-.3751-.58579-.8838-.58579-1.4142v-11c0-.53043.21071-1.03914.58579-1.41421.37507-.37508.88378-.58579 1.41421-.58579h6m4-3h6m0 0v6m0-6-11 11" stroke="#00f" />
                          <path d="m18 13v6c0 .5304-.2107 1.0391-.5858 1.4142s-.8838.5858-1.4142.5858h-11c-.53043 0-1.03914-.2107-1.41421-.5858-.37508-.3751-.58579-.8838-.58579-1.4142v-11c0-.53043.21071-1.03914.58579-1.41421.37507-.37508.88378-.58579 1.41421-.58579h6m4-3h6m0 0v6m0-6-11 11" stroke="url(#b)" strokeOpacity=".05" />
                        </g>
                      </svg>
                    </a>}
                  </td>
                  <td className='align-content-center text-center cursor-pointer'>
                    {selectedProducts.map((product, index) => {
                      return <div key={`product${order.id}:${product.id}:${index}`} onClick={() => navigate(`/dashboard/products/${product.id}`)}><img width={40} src={product?.image_link ?? '/media/products/0.png'} alt={product?.model_name ?? 'Image Coming Soon'} title={product?.product_name} /></div>
                    })}
                  </td>
                  <td className='align-content-center text-center'>
                    {order.order_market_place}<br />
                    {selectedProducts.map(product => {
                      return warehouses.find(warehouse => warehouse.id === product?.warehouse_id)?.name ?? '(Not selected warehouse)'
                    }).join(' + ')}
                  </td>
                  <td className='align-content-center text-center'>
                    {order.status === 0 && <>None</>}
                    {(() => {
                      if ([1, 2, 3].findIndex(item => item === order.status) >= 0 && order.payment_mode_id !== 2) {
                        const awb = props.awbs.find(awb => awb.orderID === order.id);
                        if (awb && awb.data) return <>{awb.data}</>
                        else {
                          return (
                            <button type='button' className='btn btn-primary p-1 px-3' onClick={() => selectOrder(order)} data-bs-toggle="modal" data-bs-target="#createAWBModal">
                              <i className="bi bi-file-earmark-plus"></i>
                              Create
                            </button>
                          );
                        }
                      } else if ([4, 5].findIndex(item => item === order.status) >= 0) {
                        return <>{order.awb ?? 'None'}</>
                      } else {
                        return <></>
                      }
                    })()}
                  </td>
                  <td className='align-content-center text-center'>
                    <button type='button' className='btn btn-primary p-1 px-3'>
                      <i className="bi bi-file-earmark-plus"></i>
                      Create
                    </button>
                  </td>
                  <td className='align-content-center text-center'>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className='align-content-center text-center'>
                    {customers.find(customer => customer.id === order.id)?.data.shipping_street ?? '(Not found)'}
                  </td>
                  <td className='align-content-center text-center'>
                    {order.payment_mode}
                  </td>
                  <td className='align-content-center text-center text-nowrap'>
                    {(() => {
                      let sign = '';
                      const marketplace = order.order_market_place;
                      if (marketplace.endsWith('.ro')) {
                        sign = 'RON';
                      }
                      if (marketplace.endsWith('.bg')) {
                        sign = 'BGN';
                      }
                      if (marketplace.endsWith('.hu')) {
                        sign = 'HUF';
                      }
                      return <>{totals[index].toFixed(2)} {sign}</>
                    })()}<br />
                    CO: {order.cashed_co}<br />
                    COD: {order.cashed_cod}
                  </td>
                  <td className='align-content-center text-center'>
                    {selectedProducts.map(product => product.stock ?? 0).join(', ')}
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
              })
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
              {!!awbForm && <form action="" method='post' id='createAWBForm'>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Warehouse:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='sender'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      theme={isDarkMode ? darkModeStyles : undefined}
                      options={senders}
                      placeholder='Select a warehouse'
                      isSearchable={false}
                      noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                      value={senders.find(sender => sender.value === senderId)}
                      onChange={e => setSenderId(e?.value ?? 0)}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Envelope Number:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" placeholder="Envelope Number" value={awbForm.envelope_number} onChange={e => setAwbForm({ ...awbForm, envelope_number: parseInt(e.target.value) })} min={0} max={9999} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Parcel Number:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" placeholder="Parcel Number" min={0} max={999} value={awbForm.parcel_number} onChange={e => setAwbForm({ ...awbForm, parcel_number: parseInt(e.target.value) })} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Locker ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="string" className="form-control" value={awbForm.locker_id} onChange={e => setAwbForm({ ...awbForm, locker_id: e.target.value })} placeholder="Locker ID" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">COD:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" placeholder="COD" value={awbForm.cod} onChange={e => setAwbForm({ ...awbForm, cod: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Contain Oversize Product:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbForm.is_oversize === 1} onChange={e => setAwbForm({ ...awbForm, is_oversize: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Insured Value:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" placeholder="Insured Value" value={awbForm.insured_value} onChange={e => setAwbForm({ ...awbForm, insured_value: e.target.value })} min={0} max={9999} required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Observation:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" value={awbForm.observation} onChange={e => setAwbForm({ ...awbForm, observation: e.target.value })} placeholder="Observation" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Courier Account (Optional):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      theme={isDarkMode ? darkModeStyles : undefined}
                      options={couriers}
                      placeholder='Select a courier'
                      isSearchable={false}
                      noOptionsMessage={e => `No more courier including "${e.inputValue}"`}
                      isClearable={true}
                      value={couriers.find(courier => courier.value === awbForm.courier_account_id)}
                      onChange={e => setAwbForm({ ...awbForm, courier_account_id: e?.value ?? null })}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Pickup and Return:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbForm.pickup_and_return === 1} onChange={e => setAwbForm({ ...awbForm, pickup_and_return: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Saturday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbForm.saturday_delivery === 1} onChange={e => setAwbForm({ ...awbForm, saturday_delivery: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Sameday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbForm.sameday_delivery === 1} onChange={e => setAwbForm({ ...awbForm, sameday_delivery: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Dropoff Locker:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbForm.dropoff_locker === 1} onChange={e => setAwbForm({ ...awbForm, dropoff_locker: e.target.checked ? 1 : 0 })} />
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
                      <input type="text" className="form-control" value={awbForm.receiver_name} onChange={e => setAwbForm({ ...awbForm, receiver_name: e.target.value })} placeholder="Name" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Contact:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" value={awbForm.receiver_contact} onChange={e => setAwbForm({ ...awbForm, receiver_contact: e.target.value })} placeholder="Contact" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Phone Number 1:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" value={awbForm.receiver_phone1} onChange={e => setAwbForm({ ...awbForm, receiver_phone1: e.target.value })} placeholder="+11234567890" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Phone Number 2 (Optional):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" placeholder="+11234567890" value={awbForm.receiver_phone2} onChange={e => setAwbForm({ ...awbForm, receiver_phone2: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Legal Entity:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbForm.receiver_legal_entity === 1} onChange={e => setAwbForm({ ...awbForm, receiver_legal_entity: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Locality ID:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="number" className="form-control" value={awbForm.receiver_locality_id} onChange={e => setAwbForm({ ...awbForm, receiver_locality_id: parseInt(e.target.value) })} min={1} max={4294967295} placeholder="Locality ID" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Street:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" value={awbForm.receiver_street} onChange={e => setAwbForm({ ...awbForm, receiver_street: e.target.value })} placeholder="Street" required />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Zipcode:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-link-45deg"></i></span>
                      <input type="text" className="form-control" placeholder="Zipcode" value={awbForm.receiver_zipcode} onChange={e => setAwbForm({ ...awbForm, receiver_zipcode: e.target.value })} required />
                    </div>
                  </div>
                </div>
              </form>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => selectOrder(undefined)} data-bs-dismiss="modal"><i className='bi bi-trash'></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleCreateAWB}><i className='bi bi-save'></i>Create AWB</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id='createAllAWBModal' tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Create AWBs</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {!!awbsForm && <form action="" method='post'>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Warehouse:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      name='sender'
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      theme={isDarkMode ? darkModeStyles : undefined}
                      options={senders}
                      placeholder='Select a warehouse'
                      isSearchable={false}
                      noOptionsMessage={e => `No more warehouses including "${e.inputValue}"`}
                      value={senders.find(sender => sender.value === awbsForm.senderID)}
                      onChange={e => setAwbsForm({ ...awbsForm, senderID: e?.value ?? senders[0].value })}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-1">
                  <div className="d-flex fw-bold w-25">Courier Account (Optional):</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <Select
                      className='react-select-styled react-select-solid react-select-sm w-100'
                      theme={isDarkMode ? darkModeStyles : undefined}
                      options={couriers}
                      placeholder='Select a courier'
                      isSearchable={false}
                      noOptionsMessage={e => `No more courier including "${e.inputValue}"`}
                      isClearable={true}
                      value={couriers.find(courier => courier.value === awbsForm.courier_account_id)}
                      onChange={e => setAwbsForm({ ...awbsForm, courier_account_id: e?.value ?? null })}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Pickup and Return:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbsForm.pickup_and_return === 1} onChange={e => setAwbsForm({ ...awbsForm, pickup_and_return: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Saturday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbsForm.saturday_delivery === 1} onChange={e => setAwbsForm({ ...awbsForm, saturday_delivery: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Sameday Delivery:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbsForm.sameday_delivery === 1} onChange={e => setAwbsForm({ ...awbsForm, sameday_delivery: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center py-3">
                  <div className="d-flex fw-bold w-25">Dropoff Locker:</div>
                  <div className="d-flex ms-auto mr-0 w-75">
                    <div className="form-check form-switch form-check-custom form-check-solid">
                      <input className="form-check-input" type="checkbox" checked={awbsForm.dropoff_locker === 1} onChange={e => setAwbsForm({ ...awbsForm, dropoff_locker: e.target.checked ? 1 : 0 })} />
                    </div>
                  </div>
                </div>
              </form>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className='bi bi-trash'></i>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleCreateAWBs}><i className='bi bi-save'></i>Create AWBs</button>
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

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totals, setTotals] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [limit, setLimit] = useState<number>(50);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [currentState, setCurrentState] = useState<[number, string]>([-1, '']);
  const [sort, setSort] = useState<boolean>(true);
  const [awbs, setAWBs] = useState<{ orderID: number, data: any }[]>([]);

  useEffect(() => {
    getAllProducts()
      .then(res => setProducts(res.data))
      .catch(e => console.error(e))
  }, []);
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
        setOrders(res.data.map((data: { order: Order, total: number }) => data.order));
        setTotals(res.data.map((data: { order: Order, total: number }) => data.total));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, selectedStatus, searchText, sort]);
  useEffect(() => {
    const result: { orderID: number, data: any }[] = [];
    const len = orders.length;
    orders.forEach((order, index) => {
      getAWBByOrderID(order.id ?? 0)
        .then(res => {
          result.push({ orderID: order.id ?? 0, data: res.data });
          if (index === len - 1) setAWBs(result);
        })
        .catch(e => console.error(e));
    })
  }, [orders]);
  useEffect(() => {
    console.log(awbs);
  }, [awbs]);

  const params = useParams();

  if (params.id && !isNaN(parseInt(params.id))) return <OrderDetails orderID={parseInt(params.id)} products={products} awbs={awbs} />
  else return (
    <Content>
      <SearchBar searchText={searchText} setSearchText={setSearchText} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
      <OrderTable orders={orders} products={products} currentPage={currentPage} setCurrentPage={setCurrentPage} totals={totals} totalPages={totalPages} totalOrders={totalOrders} sort={sort} setSort={setSort} awbs={awbs} />
    </Content>
  )
}

export const OrderDetails: React.FC<{ orderID: number, products: Product[], awbs: { orderID: number, data: any }[] }> = ({ orderID, products, awbs }) => {
  const [customer, setCustomer] = useState<CustomerInterface>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    getOrder(orderID)
      .then(res => {
        if (res.data) setOrder(res.data);
        else toast.error('This order doesn\'t exist.');
      })
      .catch(e => {
        toast.error('Failed to load order.');
        console.error(e);
      });
    getCustomer(orderID)
      .then(res => res.data)
      .then(res => setCustomer(res))
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Content>
    <div className="row">
      <div className="col-md-12 text-end">
        <button className="btn btn-light-primary btn-sm" onClick={() => navigate('./../')}>
          <i className="bi bi-backspace-fill"></i> Back to Order List
        </button>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <div className="card card-custom card-stretch shadow cursor-pointer mb-4">
          <div className="card-header pt-6 w-full">
            <div>
              <h3 className="text-gray-800 card-title align-content-center">Order {orderID}</h3>
            </div>
          </div>
          <div className="card-body p-6">
            <div className="row mb-3">
              <div className="align-content-center col-md-2 fw-bold">Vendor Name</div>
              <div className="align-content-center col-md-2">{order?.vendor_name}</div>
              <div className="align-content-center col-md-2 fw-bold">Order Type</div>
              <div className="align-content-center col-md-2">{order?.type}</div>
              <div className="align-content-center col-md-2 fw-bold">Date</div>
              <div className="align-content-center col-md-2">{new Date(order?.date ?? '').toLocaleDateString()}</div>
            </div>
            <div className="row mb-3">
              <div className="align-content-center col-md-2 fw-bold">Payment Mode</div>
              <div className="align-content-center col-md-2">{order?.payment_mode}</div>
              <div className="align-content-center col-md-2 fw-bold">Detailed Payment Method</div>
              <div className="align-content-center col-md-2">{order?.detailed_payment_method}</div>
              <div className="align-content-center col-md-2 fw-bold">Delivery Mode</div>
              <div className="align-content-center col-md-2">{order?.delivery_mode}</div>
            </div>
            <div className="row mb-3">
              <div className="align-content-center col-md-2 fw-bold">Status</div>
              <div className="align-content-center col-md-2">{order?.status}</div>
              <div className="align-content-center col-md-2 fw-bold">Payment Status</div>
              <div className="align-content-center col-md-2">{order?.payment_status}</div>
              <div className="align-content-center col-md-2 fw-bold">Customer</div>
              <div className="align-content-center col-md-2">{customer?.name}</div>
            </div>
            <div className="row mb-3">
              <div className="align-content-center col-md-2 fw-bold">Shipping Tax</div>
              <div className="align-content-center col-md-2">${(order?.shipping_tax ?? 0).toFixed(2)}</div>
              <div className="align-content-center col-md-2 fw-bold">Cashed COD</div>
              <div className="align-content-center col-md-2">{order?.cashed_cod}</div>
              <div className="align-content-center col-md-2 fw-bold">Refunded Amount</div>
              <div className="align-content-center col-md-2">{order?.refunded_amount}</div>
            </div>
            <div className="row mb-3">
              <div className="align-content-center col-md-2 fw-bold">Completed</div>
              <div className="align-content-center col-md-2">{order?.is_complete ? 'Completed' : 'In progress'}</div>
              <div className="align-content-center col-md-2 fw-bold">Maximum date for shipment</div>
              <div className="align-content-center col-md-2">{new Date(order?.maximum_date_for_shipment ?? '').toLocaleDateString()}</div>
              <div className="align-content-center col-md-2 fw-bold">Late Shipment</div>
              <div className="align-content-center col-md-2">{order?.late_shipment}</div>
            </div>
            <div className="row mb-3">
              <div className="align-content-center col-md-2 fw-bold">eMAG Club</div>
              <div className="align-content-center col-md-2">{order?.emag_club}</div>
              <div className="align-content-center col-md-2 fw-bold">AWB</div>
              <div className="align-content-center col-md-2">{awbs.find(awb => awb.orderID === order?.id)?.data ?? 'None'}</div>
              <div className="align-content-center col-md-2 fw-bold">Marketplace</div>
              <div className="align-content-center col-md-2">{order?.order_market_place}</div>
            </div>
            <div className="row mb-10">
              <div className="align-content-center col-md-2 fw-bold">Cancelled Reason</div>
              <div className="align-content-center col-md-2">{order?.cancellation_reason ?? 'None'}</div>
              <div className="align-content-center col-md-2 fw-bold">Refunded Status</div>
              <div className="align-content-center col-md-2">{order?.refund_status ?? 'None'}</div>
              <div className="align-content-center col-md-2 fw-bold">Cashed CO</div>
              <div className="align-content-center col-md-2">{order?.cashed_co}</div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <h3>Flags</h3>
                {JSON.parse(order?.flags ?? '[]').map((flag: { flag: string, value: string }, index: number) => (
                  <div key={`flag${index}`}>
                    <span className='fw-bold text-capitalize'>{flag.flag.replace('_', ' ').replace('_', ' ')}: </span>
                    <span>{flag.value}</span>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <h3>Details</h3>
                {(() => {
                  const dict = JSON.parse(order?.details ?? '{}');
                  let res = <></>;
                  for (const key in dict) {
                    res = <>{res}<div><span className='fw-bold text-capitalize'>{key.replace('_', ' ').replace('_', ' ')}: </span><span>{dict[key]}</span></div></>
                  }
                  return res;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {!!order?.product_id.length && (
      <div className="row">
        <div className="col-md-12 table-responsive">
          <table className="table table-rounded table-hover table-striped table-bordered border text-center">
            <thead>
              <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200 bg-gray-300 text-nowrap">
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {order.product_id.map((id, index) => {
                const product = products.find(product => product.id === id);
                return (
                  <tr key={`product${index}`}>
                    <td className='align-content-center'><img src={product?.image_link ?? '/media/products/0.png'} alt={product?.model_name} width={60} height={60} /></td>
                    <td className='align-content-center text-start cursor-pointer text-primary' onClick={() => navigate(`/dashboard/products/${id}`)}>
                      {product?.product_name}
                    </td>
                    <td className='align-content-center'>{formatCurrency(parseFloat(product?.price ?? '0'))}</td>
                    <td className='align-content-center'>{order.quantity[index]}</td>
                    <td className='align-content-center'>{product?.stock ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </Content>
}
