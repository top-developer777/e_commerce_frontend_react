import { FC } from "react"
import { formatCurrency } from "./_function"
import { DashboardInfo } from "./_model"
import { Order } from "../../models/order"

export const TileComponent: FC<{
  dashboardinfo: DashboardInfo,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
}> = props => (
  <div className="card card-custom card-stretch shadow mb-5 cursor-pointer" onClick={() => props.setOrders(props.dashboardinfo.orders ?? [])}>
    <div className="card-header pt-4 pb-3">
      <div className='row'>
        <h3 className="text-gray-800 card-title">{props.dashboardinfo.title}</h3><br />
        <span className='text-gray-800 text text-light-gray-800'>{props.dashboardinfo.date_range}</span>
      </div>
    </div>
    <div className="card-body p-6">
      <div className='row mb-2'>
        <span className='text-gray-700'>Sales</span><br />
        <h2 className='text-gray-900 text-hover-primary'>{ formatCurrency(parseFloat(props.dashboardinfo.total_sales)) }</h2>
      </div>
      <div className='row mb-2'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Orders / Units</span><br />
          <h4 className='text-gray-900 text-hover-primary'>{`${props.dashboardinfo.total_orders} / ${props.dashboardinfo.total_units}`}</h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Refunds</span><br />
          <h4 className='text-gray-900 text-hover-primary'>{ props.dashboardinfo.total_refund }</h4>
        </div>
      </div>
      <div className="separator my-4"></div>
      <div className='row mb-2'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Adv. cost</span><br />
          <h4 className='text-gray-900 text-hover-primary'>{ formatCurrency(parseFloat(props.dashboardinfo.total_ads ?? 0)) }</h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Est. payout</span><br />
          <h4 className='text-gray-900 text-hover-primary'>{ formatCurrency(parseFloat(props.dashboardinfo.total_payout)) }</h4>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <span className='text-gray-700'>Gross profit</span><br />
          <h4 className='text-gray-900 text-hover-primary'>{ formatCurrency(parseFloat(props.dashboardinfo.total_gross_profit)) }</h4>
        </div>
        <div className='col-md-6'>
          <span className='text-gray-700'>Net profit</span><br />
          <h4 className='text-gray-900 text-hover-primary'>{ formatCurrency(parseFloat(props.dashboardinfo.total_net_profit)) }</h4>
        </div>
      </div>
    </div>
    {/* <div className="card-footer p-2 text-center">
      More
    </div> */}
  </div>
)
