import { useIntl } from 'react-intl'
// import {KTIcon} from '../../../../helpers'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useAuth } from '../../../../../app/modules/auth'
import { getAllMarketplaces } from '../../../../../app/pages/config/components/_request';
import { useEffect, useState } from 'react';
import { getNewOrderAmount } from '../../../../../app/pages/orders_clients/components/_request';
// import { FALSE } from 'sass'

const SidebarMenuMain = () => {
  const intl = useIntl();
  const [numMKP, setNumMKP] = useState<number>(0);
  const { currentUser } = useAuth();
  const [numOrder, setNumOrder] = useState(0);

  useEffect(() => {
    getNewOrderAmount()
      .then(res => {
        setNumOrder(res.data as number);
      })
      .catch(e => console.error(e));
    getAllMarketplaces()
      .then(res => res.data.length)
      .then(res => setNumMKP(res))
      .catch(e => console.error(e));
  }, []);

  setInterval(() => {
    getNewOrderAmount()
      .then(res => {
        setNumOrder(res.data as number);
      })
      .catch(e => console.error(e));
    getAllMarketplaces()
      .then(res => res.data.length)
      .then(res => setNumMKP(res))
      .catch(e => console.error(e));
  }, 900000)

  return (
    <>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Profit</span>
        </div>
      </div>
      <SidebarMenuItem icon='element-11' to='/dashboard/main' title={intl.formatMessage({ id: 'MENU.DASHBOARD' })} fontIcon='bi-app-indicator' />
      <SidebarMenuItem icon='bi bi-cart-plus-fill' to='/dashboard/products' title='Products' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-house-fill' to='/dashboard/warehouses' title='Warehouses' hasBullet={false} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Configuration</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-person-fill' to='/config/account' title='Account' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-people-fill' to='/config/my-teams' title='My Teams' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-link-45deg' to='/config/integrations' title='Integrations' hasBullet={false} badge={numMKP} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Orders & Clients</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-cart-dash-fill' to='/orders/orders' title='Orders' hasBullet={false} badge={numOrder} />
      <SidebarMenuItem icon='bi bi-reply-fill' to='/orders/returns' title='Returns' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-hourglass' to='/orders/order-processing' title='Order Processing' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-hand-thumbs-up-fill' to='/orders/product-reviews' title='Product Reviews' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-activity' to='/orders/customers_actions' title='Customers & Actions' hasBullet={false} />
      <SidebarMenuItem icon='bi bi-cart-check' to='/orders/neridicate' title='Neridicate' hasBullet={false} />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Inventory management</span>
        </div>
      </div>
      <SidebarMenuItem icon='bi bi-cart-plus-fill' to='/inventory-management/products' title='Inventory Calculator' hasBullet={false} />
      {currentUser && (parseInt(currentUser.role ?? '') > 1) && (
        <>
          {/* <SidebarMenuItem icon='bi bi-list-check' to='/inventory-management/planner' title='Planner' hasBullet={false} /> */}
        </>
      )}
      {currentUser && [1, 3, 4].includes(parseInt(currentUser.role ?? '')) && (
        <>
          <SidebarMenuItem icon='bi bi-command' to='/inventory-management/shipping-management' title='Shipping Management' hasBullet={false} />
        </>
      )}
      {currentUser && [0, 3, 4].includes(parseInt(currentUser.role ?? '')) && (
        <>
          {/* <SidebarMenuItem icon='bi bi-database-fill' to='/inventory-management/warehouse' title='Warehouse Management' hasBullet={false} /> */}
        </>
      )}
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
      {currentUser && parseInt(currentUser.role ?? '') > 2 && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Auto respender</span>
            </div>
          </div>
          <SidebarMenuItem icon='bi bi-graph-up' to='/auto-respender/campaigns' title='Campaigns' hasBullet={false} />
          <SidebarMenuItem icon='bi bi-cart-plus-fill' to='/auto-respender/products' title='Products' hasBullet={false} />
          <SidebarMenuItem icon='bi bi-cart-dash-fill' to='/auto-respender/orders' title='Orders' hasBullet={false} />
        </>
      )}
      {currentUser && parseInt(currentUser.role ?? '') === 4 && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Administrator</span>
            </div>
          </div>
          <SidebarMenuItem icon='bi bi-people-fill' to='/site-manager/manage-users' title='Users' hasBullet={false} />
          {/* <SidebarMenuItem icon='bi bi-gear-fill' to='/account-manage/account/settings' title='Settings' hasBullet={false} />
          <SidebarMenuItem icon='bi bi-pencil-square' to='/account-manage/account/edit' title='Edit' hasBullet={false} /> */}
        </>
      )}
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

export { SidebarMenuMain }
