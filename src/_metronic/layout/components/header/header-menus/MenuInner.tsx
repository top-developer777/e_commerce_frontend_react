import {useIntl} from 'react-intl'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'

export function MenuInner() {
  const intl = useIntl()
  return (
    <>
      <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuInnerWithSub title='Configuration' to='/config' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/config/account' title='Account' hasBullet={true} />
        <MenuItem to='/config/my-teams' title='My Teams' hasBullet={true} />
        <MenuItem to='/config/integrations' title='Integrations' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub title='Orders & Clients' to='/orders' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/orders/orders' title='Orders' hasBullet={true} />
        <MenuItem to='/orders/returns' title='Returns' hasBullet={true} />
        <MenuItem to='/orders/order-processing' title='Order Processing' hasBullet={true} />
        <MenuItem to='/orders/product-reviews' title='Product Reviews' hasBullet={true} />
        <MenuItem to='/orders/customers_actions' title='Customers & Actions' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub title='Inventory management' to='/inventory-management' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/inventory-management/products' title='Products' hasBullet={true} />
        <MenuItem to='/inventory-management/planner' title='Planner' hasBullet={true} />
        <MenuItem to='/inventory-management/shipping-management' title='Shipping Management' hasBullet={true} />
        <MenuItem to='/inventory-management/warehouse' title='Warehouse Management' hasBullet={true} />
        <MenuItem to='/inventory-management/suppliers' title='Suppliers' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub title='Alerts' to='/alerts' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/alerts/dashboard' title='Dashboard' hasBullet={true} />
        <MenuItem to='/alerts/settings' title='Settings' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub title='Money Back' to='/pay-back' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/pay-back/lost-damaged' title='Lost & Damaged' hasBullet={true} />
        <MenuItem to='/pay-back/returns' title='Returns' hasBullet={true} />
      </MenuInnerWithSub>
      <MenuInnerWithSub title='Auto respender' to='/auto-respender' menuPlacement='bottom-start' menuTrigger='click'>
        <MenuItem to='/auto-respender/campaigns' title='Campaigns' hasBullet={true} />
        <MenuItem to='/auto-respender/products' title='Products' hasBullet={true} />
        <MenuItem to='/auto-respender/orders' title='Orders' hasBullet={true} />
      </MenuInnerWithSub>
    </>
  )
}
