import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { Content } from '../../../_metronic/layout/components/content'
import { ChartComponent } from './components/ChartComponent'
import { getDashboardInfo, getChartInfo } from './components/_request'

// const currentDate = new Date();

// const options: Intl.DateTimeFormatOptions = {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric'
// };

// const formattedDate = currentDate.toLocaleDateString('en-GB', options);

// console.log(formattedDate);

// const fakeStatistic = {
//   "Sales": [
//     {
//       "label": "Organic",
//       "value": "16056.22"
//     },{
//       "label": "Sponsored Products",
//       "value": "146.85"
//     }
//   ],
// }

// const fakeTrends = [
//   {
//     "product_id": ""
//   }
// ]

interface DashboardInfo {
  title: string;
  date_range: string;
  total_units: string;
  total_sales: string;
  total_refund: string;
  total_ads: string;
  total_payout: string;
  total_gross_profit: string;
  total_net_profit: string;
  total_orders: string;
}

interface Order {
  vendor_name: string;
  type: number;
  parent_id: number;
  date: string;
  payment_mode: string;
  detailed_payment_method: string;
  delivery_mode: string;
  observation: string;
  status: number;
  payment_status: number;
  customer_id: number;
  product: {
    product_id?: number;
    stock: string;
    part_number_key: string;
    sale_price: number;
    description: string;
    url: string;
  };
  shipping_tax: number;
  shipping_tax_voucher_split: string;
  vouchers: string;
  proforms: string;
  attachments: string;
  cashed_co: number;
  cashed_cod: number;
  cancellation_request: string;
  has_editable_products: boolean;
  refunded_amount: string;
  is_complete: boolean;
  reason_cancellation: string;
  refund_status: string;
  maximum_date_for_shipment: string;
  late_shipment: number;
  flags: string;
  emag_club: boolean;
  finalization_date: string;
  details: string;
  weekend_delivery: boolean;
  payment_mode_id: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const TileComponent: FC<{
  dashboardinfo: DashboardInfo
}> = props => (
  <div className="card card-custom card-stretch shadow mb-5 cursor-pointer">
    <div className="card-header pt-4 pb-3">
      <div className='row'>
        <h3 className="text-gray-800 card-title">{props.dashboardinfo.title}</h3><br />
        <span className='text-gray-800 text text-light-gray-800'>{props.dashboardinfo.date_range}</span>
      </div>
    </div>
    <div className="card-body p-6">
      <div className='row mb-2'>
        <span className='text-gray-700'>Sales</span><br />
        <h2 className='text-gray-900 text-hover-primary'>
          {
            formatCurrency(parseFloat(props.dashboardinfo.total_sales))
          }
        </h2>
      </div>
      <div className='row mb-2'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Orders / Units</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {`${props.dashboardinfo.total_orders} / ${props.dashboardinfo.total_units}`}
          </h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Refunds</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              props.dashboardinfo.total_refund
            }
          </h4>
        </div>
      </div>
      <div className="separator my-4"></div>
      <div className='row mb-2'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Adv. cost</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(parseFloat(props.dashboardinfo.total_ads ?? 0))
            }
          </h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Est. payout</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(parseFloat(props.dashboardinfo.total_payout))
            }
          </h4>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Gross profit</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(parseFloat(props.dashboardinfo.total_gross_profit))
            }
          </h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Net profit</span><br />
          <h4 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(parseFloat(props.dashboardinfo.total_net_profit))
            }
          </h4>
        </div>
      </div>
    </div>
    {/* <div className="card-footer p-2 text-center">
      More
    </div> */}
  </div>
)

const TableProductsOrders: FC<{ orders: Order[] }> = props => (
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
        props.orders.map((order, index) =>
          <tr key={index}>
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
                  <img className='rounded-2' src={order.product.url} alt="" />
                </div>
                <div className="d-flex flex-column ms-2">
                  <div className="d-flex align-items-center">
                    <span className='d-flex'><a href={`https://amazon.com/dp/${order.product.part_number_key}`} target='_blank'>{order.product.part_number_key}</a></span>
                    <span className='ms-1 d-flex' style={{ width: '2px', height: '2px', backgroundColor: '#0000008c', borderRadius: '100%' }}></span>
                    <span className='ms-1 d-flex'>SKU {order.product.stock}</span>
                  </div>
                  <div className="d-flex">Jewelry Packaging Gift Box 2.5*2.5*3cm</div>
                  <div className="d-flex">{formatCurrency(order.product.sale_price)}</div>
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
                      <img className='rounded-2' src={order.product.url} alt="" />
                    </div>
                    <div className="d-flex flex-column ms-2 text-nowrap">
                      <div className="d-flex align-items-center">
                        <span className='d-flex'><a href={`https://amazon.com/dp/${order.product.part_number_key}`} target='_blank'>{order.product.part_number_key}</a></span>
                        <span className='ms-1 d-flex' style={{ width: '2px', height: '2px', backgroundColor: '#0000008c', borderRadius: '100%' }}></span>
                        <span className='ms-1 d-flex'>SKU {order.product.stock}</span>
                      </div>
                      <div className="d-flex">Jewelry Packaging Gift Box 2.5*2.5*3cm</div>
                      <div className="d-flex">{formatCurrency(order.product.sale_price)}</div>
                    </div>
                  </div>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div className="d-flex">
                        <div className="d-flex"><strong>Sales</strong></div>
                        <div className="d-flex ms-auto mr-auto"><strong>{formatCurrency(order.product.sale_price)}</strong></div>
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



const DashboardPage: FC = () => {
  const [dashboardinfos, setDashboardInfos] = useState<DashboardInfo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [series, setSeries] = useState<string>('[]');
  const [categories, setCategories] = useState<string>('[]');

  type Series = {
    name: string;
    type: string;
    data: number[];
  };

  useEffect(() => {
    getDashboardInfo()
      .then(res => {
        if (res.status === 200) {
          const dashboardData = [];
          for (const datum in res.data) {
            dashboardData.push(res.data[datum]);
          }
          setDashboardInfos(dashboardData);
          // setOrders(dashboardData[0].orders);
          setOrders([{
            vendor_name: '',
            type: 0,
            parent_id: 0,
            date: '04/07/2024 17:00',
            payment_mode: '',
            detailed_payment_method: '',
            delivery_mode: '',
            observation: '',
            status: 0,
            payment_status: 0,
            customer_id: 0,
            shipping_tax: 0,
            shipping_tax_voucher_split: '',
            vouchers: '',
            proforms: '',
            attachments: '',
            cashed_co: 0,
            cashed_cod: 0,
            cancellation_request: '',
            has_editable_products: false,
            refunded_amount: '0',
            is_complete: false,
            reason_cancellation: '',
            refund_status: '',
            maximum_date_for_shipment: '',
            late_shipment: 0,
            flags: '',
            emag_club: false,
            finalization_date: '',
            details: '',
            weekend_delivery: false,
            payment_mode_id: 0,
            product: {
              stock: '2',
              part_number_key: 'B0XLFX8JXK',
              sale_price: 9.99,
              description: 'Jewelry Packaging Gift Box 2.5*2.5*3cm',
              url: 'https://app.sellerboard.com/images/Demo_pictures/19_SS40_.jpg'
            }
          }]);
        }
      })
    getChartInfo(1, '1,2')
      .then(res => {
        if (res.status === 200) {
          const data = res.data.chart_data;
          const categories = [];
          const series: Series[] = [
            {
              name: 'Units sold',
              type: 'line',
              data: [],
            },
            {
              name: 'Advertising cost',
              type: 'bar',
              data: [],
            },
            {
              name: 'Refunds',
              type: 'line',
              data: [],
            },
            {
              name: 'Net Profit',
              type: 'bar',
              data: [],
            },
          ];
          for (const datum of data) {
            categories.push(datum.date_string);
            series[0].data.push(datum.total_units);
            series[1].data.push(0);
            series[2].data.push(datum.total_refund);
            series[3].data.push(datum.total_net_profit);
          }
          setSeries(JSON.stringify(series));
          setCategories(JSON.stringify(categories));
        }
      });
  }, [])

  return (
    <>
      <Content>
        <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-bs-toggle="tab"
              href="#dashboard-tiles"
            >
              <i className="bi bi-grid-fill"></i>
              &nbsp;Tiles
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="tab"
              href="#dashboard-chart"
            >
              <i className="bi bi-bar-chart-fill"></i>
              &nbsp;Chart
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="tab"
              href="#dashboard-pl"
            >
              <i className="bi bi-stack"></i>
              &nbsp;P&L
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="tab"
              href="#dashboard-trends"
            >
              <i className="bi bi-rocket-takeoff-fill"></i>
              &nbsp;Trends
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="dashboard-tiles"
            role="tabpanel"
          >
            <div className='row d-flex'>
              {
                dashboardinfos.map((dashboardinfo, index) =>
                  <div className='custom-col-5' key={index}>
                    <TileComponent dashboardinfo={dashboardinfo} />
                  </div>
                )
              }
            </div>
            <div className='row'>
              <TableProductsOrders orders={orders} />
            </div>
          </div>
          <div className="tab-pane fade" id="dashboard-chart" role="tabpanel">
            <div className='row'>
              <div className='col-xl-9'>
                <div className="row">
                  <div className="col-md-6">
                    <div className="dropdown">
                      <div className="input-group" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        <span className="input-group-text" id="products"><i className="bi bi-search"></i></span>
                        <input type="text" className="form-control" name='products' placeholder="Search products by name, tag, SKU, ASIN" />
                      </div>
                      <form className="dropdown-menu p-4">
                        Product list
                      </form>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select form-select-lg mb-3">
                      <option value="1" selected>Last 12 months, by month</option>
                      <option value="2">Last 3 months, by week</option>
                      <option value="3">Last 30 days, by day</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type='button' className='btn btn-primary'>
                      <i className="bi bi-funnel"></i>
                      Filter
                    </button>
                  </div>
                </div>
                <ChartComponent className='card-xl-stretch mb-5 mb-xl-8' series={series} categories={categories} />
              </div>
              <div className='col-xl-3'>

              </div>
            </div>
            <div className='row'>
              <TableProductsOrders orders={orders} />
            </div>
          </div>
          <div className="tab-pane fade" id="dashboard-pl" role="tabpanel">
            PL
          </div>
          <div className="tab-pane fade" id="dashboard-trends" role="tabpanel">
            Trends
          </div>
        </div>
      </Content>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
