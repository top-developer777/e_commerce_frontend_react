import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import {
  // defaultLogs,
  KTIcon,
  toAbsoluteUrl,
  // useIllustrationsPath,
} from '../../../helpers'
import { getNotifications, updateNotifications } from './_request';
import { useAuth } from '../../../../app/modules/auth';

export interface AlertModel {
  id: number
  title: string
  description: string
  time: string
  icon: string
  state: 'success' | 'info' | 'warning' | 'error',
  read: boolean
  user_id: number
}

const HeaderNotificationsMenu: FC = () => {
  const [alerts, setAlerts] = useState<AlertModel[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    getNotifications()
      .then(res => {
        const data = res.data.reverse().filter((dat: AlertModel) => dat.user_id === currentUser?.id);
        const alerts = data.map((dat: { [key: string]: string | number | boolean }) => {
          const alert = { ...dat };
          if (dat.state === 'warning') alert['icon'] = 'notification-on';
          if (dat.state === 'info') alert['icon'] = 'information-5';
          if (dat.state === 'success') alert['icon'] = 'rocket';
          if (dat.state === 'error') alert['icon'] = 'cross-circle';
          return alert;
        });
        setAlerts(alerts);
        setTimeout(() => {
          for (const alert of alerts) {
            if (!alert.read) {
              toast(<div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{alert.title}</div>
                <div className='overflow-hidden text-nowrap' style={{ textOverflow: 'ellipsis', width: 'calc(var(--toastify-toast-width) - 66px)' }}>{alert.description}</div>
              </div>, {
                autoClose: 5000000,
                closeOnClick: true,
                closeButton: false,
                draggable: true,
                hideProgressBar: false,
                onClick: () => {
                  const newAlerts = [...alerts];
                  const index = newAlerts.findIndex(al => al.id === alert.id);
                  if (index >= 0) {
                    newAlerts[index].read = true;
                    setAlerts(newAlerts);
                    updateNotifications(alert.id, newAlerts[index]);
                  }
                },
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                position: 'top-right',
                progress: undefined,
                type: alert.state as ('success' | 'info' | 'warning' | 'error')
              });
            }
          }
        }, 5000);
      })
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
      data-kt-menu='true'
    >
      <div
        className='d-flex flex-column bgi-no-repeat rounded-top'
        style={{ backgroundImage: `url('${toAbsoluteUrl('media/misc/menu-header-bg.jpg')}')` }}
      >
        <h3 className='text-white fw-bold px-9 mt-10 mb-6'>
          Notifications <span className='fs-8 opacity-75 ps-3'>{alerts.length} {alerts.length === 1 ? 'report' : 'reports'}</span>
        </h3>

        {/* <ul className='nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-bold px-9 active'>
        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#kt_topbar_notifications_1'
          >
            Alerts
          </a>
        </li>

        {/* <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#kt_topbar_notifications_2'
          >
            Updates
          </a>
        </li>

        <li className='nav-item'>
          <a
            className='nav-link text-white opacity-75 opacity-state-100 pb-4'
            data-bs-toggle='tab'
            href='#kt_topbar_notifications_3'
          >
            Logs
          </a>
        </li>
      </ul> */}
      </div>

      <div className='tab-content'>
        <div className='tab-pane fade show active' id='kt_topbar_notifications_1' role='tabpanel'>
          <div className='scroll-y mh-325px my-5 px-2'>
            {!!alerts.length && alerts.map((alert, index) => {
              const state = alert.state === 'error' ? 'danger' : alert.state;
              return (
                <div key={`alert${index}`} className='d-flex flex-stack py-4'>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-35px me-4'>
                      <span className={clsx('symbol-label', `bg-light-${state}`)}>
                        {' '}
                        <KTIcon iconName={alert.icon} className={`fs-2 text-${state}`} />
                      </span>
                    </div>
                    <div
                      className='mb-0 me-2'
                      onClick={() => {
                        if (alert.read) return;
                        const newAlerts = [...alerts];
                        const index = newAlerts.findIndex(al => al.id === alert.id);
                        if (index >= 0) {
                          newAlerts[index].read = true;
                          setAlerts(newAlerts);
                          updateNotifications(alert.id, newAlerts[index]);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                        {alert.title}
                      </a>
                      <div className={`fs-7 ${alert.read ? 'text-gray-500' : 'text-danger fw-bold'}`} >
                        {(() => {
                          let text = alert.description;
                          let clipped = false;
                          if (text.length > 45) clipped = true;
                          text = text.slice(0, 45);
                          if (clipped) text = `${text} ...`;
                          return text;
                        })()}
                      </div>
                    </div>
                  </div>
                  <span className='badge badge-light fs-8'>{(new Date(alert.time).toDateString())}</span>
                </div>
              )
            })}
          </div>

          {/* <div className='py-3 text-center border-top'>
          <Link
            to='/crafted/pages/profile'
            className='btn btn-color-gray-600 btn-active-color-primary'
          >
            View All <KTIcon iconName='arrow-right' className='fs-5' />
          </Link>
        </div> */}
        </div>

        {/* <div className='tab-pane fade show active' id='kt_topbar_notifications_2' role='tabpanel'>
        <div className='d-flex flex-column px-9'>
          <div className='pt-10 pb-0'>
            <h3 className='text-gray-900 text-center fw-bolder'>Get Pro Access</h3>

            <div className='text-center text-gray-600 fw-bold pt-1'>
              Outlines keep you honest. They stoping you from amazing poorly about drive
            </div>

            <div className='text-center mt-5 mb-9'>
              <a
                href='#'
                className='btn btn-sm btn-primary px-6'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_upgrade_plan'
              >
                Upgrade
              </a>
            </div>
          </div>

          <div className='text-center px-4'>
            <img className='mw-100 mh-200px' alt='metronic' src={useIllustrationsPath('1.png')} />
          </div>
        </div>
      </div>

      <div className='tab-pane fade' id='kt_topbar_notifications_3' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {defaultLogs.map((log, index) => (
            <div key={`log${index}`} className='d-flex flex-stack py-4'>
              <div className='d-flex align-items-center me-2'>
                <span className={clsx('w-70px badge', `badge-light-${log.state}`, 'me-4')}>
                  {log.code}
                </span>

                <a href='#' className='text-gray-800 text-hover-primary fw-bold'>
                  {log.message}
                </a>

                <span className='badge badge-light fs-8'>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className='py-3 text-center border-top'>
          <Link
            to='/crafted/pages/profile'
            className='btn btn-color-gray-600 btn-active-color-primary'
          >
            View All <KTIcon iconName='arrow-right' className='fs-5' />
          </Link>
        </div>
      </div> */}
      </div>
    </div>
  )
}

export { HeaderNotificationsMenu }
