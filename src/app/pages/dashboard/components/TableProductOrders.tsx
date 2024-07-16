import { FC } from "react";
import { Order } from "../../models/order";
import { formatCurrency } from "./_function";

export const TableProductsOrders: FC<{ orders: Order[] }> = props => (
  <table className="table table-rounded table-row-bordered table-hover border gy-7 gs-7">
    <thead>
      <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
        <th className='text-left'>Order number</th>
        <th className='text-left'>Product</th>
        <th className='text-left'>Units sold</th>
        <th className='text-left'>Refunds</th>
        <th className='text-left'>Sales</th>
        <th className='text-left'>Sellable Returns</th>
        <th className='text-left'>Amazon fees</th>
        <th className='text-left'>Gross profit</th>
        <th className='text-left'>Coupon</th>
        <th className='text-left'>Info</th>
      </tr>
    </thead>
    <tbody>
      {
        !!props.orders && props.orders.map((order, index) =>
          <tr key={`tr${index}`}>
            <td className='p-2'>
              <div className='row'>
                <div className="col-md-12">
                  <a href='https://sellercentral.amazon.com/orders-v3/order/304-4566381-6611111'>304-4566381-6611111</a>
                  <span className='ms-1 text-warning' data-bs-toggle="tooltip" data-bs-placement="left" title="This order involves deferred payment, which means an arrangement allowing the debtor to pay the invoice at a later date. Please note that there's up to 30 days delay in updating deferred payments. The final values will be displayed upon payment processing.">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle thinIcon attention-icon low-priority">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 d-flex align-items-center">
                  <img className='d-flex' src="https://app.sellerboard.com/images/marketplaces/amazon.com.svg" alt="Amazon" style={{ width: '26px' }} />
                  <span className='ms-1 d-flex'>{order.date}</span>
                  <span className='ms-1 d-flex' style={{ width: '2px', height: '2px', backgroundColor: '#0000008c', borderRadius: '100%' }}></span>
                  <span className='ms-1 d-flex'>Shipped</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">COG: {formatCurrency(parseFloat('6.00'))}</div>
              </div>
            </td>
            <td className='align-content-center p-2'>
              <div className="d-flex">
                <div className="d-flex align-items-center">
                  <img className='rounded-2' src={order.product.image_link} alt="" />
                </div>
                <div className="d-flex flex-column ms-2">
                  <div className="d-flex align-items-center">
                    <span className='d-flex'><a href={`https://amazon.com/dp/${order.product.model_name}`} target='_blank'>{order.product.model_name}</a></span>
                    <span className='ms-1 d-flex' style={{ width: '2px', height: '2px', backgroundColor: '#0000008c', borderRadius: '100%' }}></span>
                    <span className='ms-1 d-flex'>SKU {order.product.stock}</span>
                  </div>
                  <div className="d-flex">{order.product.product_name}</div>
                  <div className="d-flex">{formatCurrency(parseFloat(order.product.price))}</div>
                </div>
              </div>
            </td>
            <td className='text-end align-content-center'>2</td>
            <td className='text-end align-content-center'>{order.refunded_amount}</td>
            <td className='text-end align-content-center'>{formatCurrency(parseFloat('9.99'))}</td>
            <td className='text-end align-content-center'>0%</td>
            <td className='text-end align-content-center'>{formatCurrency(parseFloat('0'))}</td>
            <td className='text-end align-content-center'>{formatCurrency(parseFloat('3.99'))}</td>
            <td className='text-end align-content-center'></td>
            <td className='text-end align-content-center'>
              <div className="btn-group dropstart">
                <a href='#' data-bs-toggle="dropdown" aria-expanded="false">More</a>
                <ul className="dropdown-menu p-0">
                  <div className="d-flex p-6">
                    <div className="d-flex align-items-center">
                      <img className='rounded-2' src={order.product.image_link} alt="" />
                    </div>
                    <div className="d-flex flex-column ms-2 text-nowrap">
                      <div className="d-flex align-items-center">
                        <span className='d-flex'><a href={`https://amazon.com/dp/${order.product.model_name}`} target='_blank'>{order.product.model_name}</a></span>
                        <span className='ms-1 d-flex' style={{ width: '2px', height: '2px', backgroundColor: '#0000008c', borderRadius: '100%' }}></span>
                        <span className='ms-1 d-flex'>SKU {order.product.stock}</span>
                      </div>
                      <div className="d-flex">{order.product.product_name}</div>
                      <div className="d-flex">{formatCurrency(parseFloat(order.product.price))}</div>
                    </div>
                  </div>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex"><strong>Sales</strong></div>
                        <div className="d-flex ms-auto mr-auto"><strong>{formatCurrency(parseFloat(order.product.price))}</strong></div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Units</div>
                        <div className="d-flex ms-auto mr-auto">{1}</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Promo</div>
                        <div className="d-flex ms-auto mr-auto">{formatCurrency(0)}</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Refund cost</div>
                        <div className="d-flex ms-auto mr-auto">{formatCurrency(0)}</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Amazon fees</div>
                        <div className="d-flex ms-auto mr-auto">{formatCurrency(0)}</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">+Cost of goods</div>
                        <div className="d-flex ms-auto mr-auto">{formatCurrency(-6)}</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Gross profit</div>
                        <div className="d-flex ms-auto mr-auto">{formatCurrency(3.99)}</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Estimated payout</div>
                        <div className="d-flex ms-auto mr-auto">{formatCurrency(0)}</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">% Refunds</div>
                        <div className="d-flex ms-auto mr-auto">0.00%</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Sellable returns</div>
                        <div className="d-flex ms-auto mr-auto">0.00%</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">Margin</div>
                        <div className="d-flex ms-auto mr-auto">39.94%</div>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex">ROI</div>
                        <div className="d-flex ms-auto mr-auto">66.50%</div>
                      </div>
                    </li>
                  </ul>
                </ul>
              </div>
            </td>
          </tr>
        )
      }
    </tbody>
  </table>
)