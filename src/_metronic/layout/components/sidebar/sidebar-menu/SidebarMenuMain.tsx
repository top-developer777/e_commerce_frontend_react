import {useIntl} from 'react-intl'
// import {KTIcon} from '../../../../helpers'
import {SidebarMenuItem} from './SidebarMenuItem'
// import { FALSE } from 'sass'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Dashboard</span>
        </div>
      </div>
      <SidebarMenuItem to='/dashboard' icon='element-11' title={intl.formatMessage({id: 'MENU.DASHBOARD'})} fontIcon='bi-app-indicator' />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Configuration</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-person-fill' to='/config/account' title='Account' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-people-fill' to='/config/my-teams' title='My Teams' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-link-45deg' to='/config/integrations' title='Integrations' hasBullet={false} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Orders & Clients</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-cart-dash-fill' to='/orders/orders' title='Orders' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-reply-fill' to='/orders/returns' title='Returns' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-repeat' to='/orders/order-processing' title='Order Processing' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-hand-thumbs-up-fill' to='/orders/product-reviews' title='Product Reviews' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-activity' to='/orders/customers_actions' title='Customers & Actions' hasBullet={false} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Inventory management</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-cart-plus-fill' to='/inventory-management/products' title='Products' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-list-check' to='/inventory-management/planner' title='Planner' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-command' to='/inventory-management/shipping-management' title='Shipping Management' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-database-fill' to='/inventory-management/warehouse' title='Warehouse Management' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-lightning-fill' to='/inventory-management/suppliers' title='Suppliers' hasBullet={false} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Alerts</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-ui-checks' to='/alerts/dashboard' title='Dashboard' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-gear-fill' to='/alerts/settings' title='Settings' hasBullet={false} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Money Back</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-heartbreak-fill' to='/pay-back/lost-damaged' title='Lost & Damaged' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-reply-fill' to='/pay-back/returns' title='Returns' hasBullet={false} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Auto respender</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-graph-up' to='/auto-respender/campaigns' title='Campaigns' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-cart-plus-fill' to='/auto-respender/products' title='Products' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-cart-dash-fill' to='/auto-respender/orders' title='Orders' hasBullet={false} />
      {/* <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}

export {SidebarMenuMain}
