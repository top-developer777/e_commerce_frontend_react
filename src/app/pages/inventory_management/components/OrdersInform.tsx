
import { FC } from 'react'
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { StatusBadge } from '../../orders_clients/components/Orders';

type Props = {
  className: string,
  product: Product,
  orders: Order[],
}
const OrdersInformation: FC<Props> = ({ className, product, orders }) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Orders Information</span>
        </h3>
      </div>
      <div className='card-body'>
        <div className='row'>
          <h4>{product.product_name}</h4>
        </div>
        <div className='row align-content-center mt-5'>
          <div className='col-xl-2'>
            <a href={product.image_link}>
              {product.image_link ? <img src={product.image_link} alt={product.product_name} className='w-150px h-150px' /> : 'No Image'}
            </a>
          </div>
          <div className='col-xl-10'>
            <div className='row'>
              <div className='col-md-4'>
                <span className='me-3'><b>Model Name</b></span>
                <span>{product.model_name}</span>
              </div>
              <div className='col-md-4'>
                <span className='me-3'><b>EAN</b></span>
                <span>{product.ean}</span>
              </div>
            </div>
            <div className="separator my-10"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-rounded table-bordered border gy-7 gs-7 cursor-pointer table-hover text-center">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Delivery Mode</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  return (
                    <tr key={`order${index}`}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.delivery_mode}</td>
                      <td><StatusBadge status={order.status} /></td>
                    </tr>
                  )
                })}
                {orders.length === 0 && <tr><td colSpan={5}>No Orders for this product.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export { OrdersInformation }
