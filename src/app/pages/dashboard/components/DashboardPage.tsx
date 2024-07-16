import { FC, useEffect, useState } from 'react'
import { Content } from '../../../../_metronic/layout/components/content'
import { Order } from '../../models/order'
import { DashboardInfo } from './_model'
import { getDashboardInfo } from './_request'
import { ChartComponent } from './ChartComponent'
import { PLComponent } from './PLComponent'
import { TableProductsOrders } from './TableProductOrders'
import { TileComponent } from './TileComponent'
import { TrendComponent } from './TrendComponent'

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

const DashboardPage: FC = () => {
  const [dashboardinfos, setDashboardInfos] = useState<DashboardInfo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getDashboardInfo()
      .then(res => {
        if (res.status === 200) {
          const dashboardData = [];
          for (const datum in res.data) {
            dashboardData.push(res.data[datum]);
          }
          setDashboardInfos(dashboardData);
          setOrders(dashboardData[0].orders);
        } else {
          console.error(res);
        }
      })
  }, []);

  return (
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
          <div className='row'>
            {
              dashboardinfos.map((dashboardinfo, index) =>
                <div className='d-table-cell' style={{ flex: 1 }} key={`tile${index}`}>
                  <TileComponent dashboardinfo={dashboardinfo} setOrders={setOrders} />
                </div>
              )
            }
          </div>
          <div className='row'>
            <TableProductsOrders orders={orders} />
          </div>
        </div>
        <ChartComponent className='card-xl-stretch mb-5 mb-xl-8' />
        <PLComponent />
        <TrendComponent />
      </div>
    </Content>
  )
}

export { DashboardPage }
