import { useEffect, useState } from 'react';
import Select from 'react-select';

import { Content } from '../../../../_metronic/layout/components/content';
import { Return } from '../../models/returns';
import { getAllReturns } from './_request';
import { Product } from '../../models/product';
import { getAllProducts } from '../../inventory_management/components/_request';

const StatusBadge: React.FC<{ status: number }> = props => {
  switch (props.status) {
    default: return <div></div>
    case 1:
      return (
        <div>
          <span className="badge badge-warning fw-bold fs-7 p-2">
            <i className='bi bi-hourglass-split fw-bold text-white'></i>&nbsp;
            Incomplete
          </span>
        </div>
      )
    case 2:
      return (
        <div>
          <span className="badge badge-primary fw-bold fs-7 p-2">
            <i className='bi bi-plus-circle fw-bold text-white'></i>&nbsp;
            New
          </span>
        </div>
      )
    case 3:
      return (
        <div>
          <span className="badge badge-light-success fw-bold fs-7 p-2">
            <i className='bi bi-check-circle text-success'></i>&nbsp;
            Approved
          </span>
        </div>
      )
    case 4:
      return (
        <div>
          <span className="badge badge-danger fw-bold fs-7 p-2">
            <i className='bi bi-x-circle fw-bold text-white'></i>&nbsp;
            Refused
          </span>
        </div>
      )
    case 5:
      return (
        <div>
          <span className="badge badge-light-secondary fw-bold fs-7 p-2">
            <i className='bi bi-slash-circle fw-bold'></i>&nbsp;
            Canceled
          </span>
        </div>
      )
    case 6:
      return (
        <div>
          <span className="badge badge-light-warning fw-bold fs-7 p-2">
            <i className='bi bi-inbox fw-bold text-warning'></i>&nbsp;
            Received
          </span>
        </div>
      )
    case 7:
      return (
        <div>
          <span className="badge badge-success fw-bold fs-7 p-2">
            <i className='bi bi-check2-all text-white'></i>&nbsp;
            Finalized
          </span>
        </div>
      )
  }
}

export const Returns = () => {
  const [returns, setReturns] = useState<Return[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRequestStatus, setSelectedReqeustStatus] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const requestStatusOptions = [
    { value: 1, label: 'Incomplete' },
    { value: 2, label: 'New' },
    { value: 3, label: 'Approved' },
    { value: 4, label: 'Refused' },
    { value: 5, label: 'Canceled' },
    { value: 6, label: 'Received' },
    { value: 7, label: 'Finalized' },
  ];
  const returnTypes = [
    '',
    'Replacement with same product',
    'Replacement with a different product',
    'Refund',
    'Cancel payment contract for this product',
    'Voucher'
  ];

  useEffect(() => {
    getAllReturns()
      .then(res => setReturns(res.data))
      .catch(e => console.error(e));
    getAllProducts()
      .then(res => setProducts(res.data))
      .catch(e => console.error(e));
  }, []);

  return (
    <Content>
      <div className="row mb-3">
        <div className="col-md-3 fw-bold text-end align-content-center">Request Status: </div>
        <div className="col-md-9">
          <Select
            className='react-select-styled react-select-solid react-select-sm flex-grow-1'
            options={requestStatusOptions}
            placeholder='Select status at least one'
            defaultValue={[...requestStatusOptions]}
            onChange={values => setSelectedReqeustStatus(values.map(value => value.value))}
            isClearable={false}
            isMulti={true}
            isSearchable={false}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 table-responsive">
          <table className="table table-rounded table-bordered border gy-7 gs-7 cursor-pointer table-hover text-center">
            <thead className='fw-bold'>
              <tr>
                <th>eMAG ID</th>
                <th>Order ID</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Pickup Address</th>
                <th>Return Reason</th>
                <th>Return Type</th>
                <th>Request Status</th>
                <th>Date</th>
                <th>Return Marketplace</th>
                <th>Replacement Product ID in eMAG</th>
                <th>Replacement Product ID</th>
                <th>Replacement Product Name</th>
                <th>Replacement Product Quantity</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((_return, index) => {
                if (selectedRequestStatus.findIndex(status => status === _return.request_status) >= 0) {
                  return (
                    <tr key={`return${index}`}>
                      <td className='align-content-center'>{_return.emag_id}</td>
                      <td className='align-content-center'>{_return.order_id}</td>
                      <td className='align-content-center'>{_return.type === 2 ? 'Fulfilled by eMAG' : 'Fulfilled by seller'}</td>
                      <td className='align-content-center'>
                        <b>{_return.customer_name}</b><br />
                        {_return.customer_company ? <>{` (${_return.customer_company})`}<br /></> : ''}
                        {_return.customer_phone?.startsWith('+') ? _return.customer_phone : `+${_return.customer_phone}`}
                      </td>
                      <td className='align-content-center'>
                        {(() => (
                          _return.products.map((id, i) => {
                            const product = products.find(pro => pro.id === id);
                            return (
                              <div key={`returnProduct(${index})(${i})`} className='d-flex'>
                                <img className='d-flex' src={product?.image_link} alt={product?.model_name} title={product?.product_name} width={50} />
                                <span className="d-flex text-nowrap align-items-center ms-2"> X {_return.quantity[i]}</span>
                              </div>
                            )
                          })
                        ))()}
                      </td>
                      <td className='align-content-center'>{_return.pickup_address}</td>
                      <td className='align-content-center'>{_return.return_reason}</td>
                      <td className='align-content-center'>{returnTypes[_return.return_type]}</td>
                      <td className='align-content-center'><StatusBadge status={_return.request_status} /></td>
                      <td className='text-nowrap align-content-center'>{_return.date?.split('T')[0]}</td>
                      <td className='align-content-center'>{_return.return_market_place}</td>
                      <td className='align-content-center'>{_return.replacement_product_id}</td>
                      <td className='align-content-center'>{_return.replacement_product_id}</td>
                      <td className='align-content-center'>{_return.replacement_product_name}</td>
                      <td className='align-content-center'>{_return.replacement_product_quantity}</td>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Content>
  )
}
