
import { useEffect, FC, useState } from 'react'
import { getOrdersInfo } from '../../dashboard/components/_request';
import { Product } from '../../models/product';

type Props = {
  className: string,
  product: Product,
}
type Order = {
  order_id: number,
  order_date: string,
  customer_name: string,
  quantity_orders: string,
  order_status: string,
}

const OrdersInformation: FC<Props> = ({ className, product }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrdersInfo(product.id ?? 0)
      .then(res => {
        setOrders(res.data);
      })
      .catch(e => console.error(e));
  }, [product.id])

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
                <span className='me-3'><b>SKU</b></span>
                <span>{product.sku}</span>
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
                  <th>Customer Name</th>
                  <th>Quantity Ordered</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  return (
                    <tr key={`order${index}`}>
                      <td>{order.order_id}</td>
                      <td>{order.order_date}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.quantity_orders}</td>
                      <td>{order.order_status}</td>
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
