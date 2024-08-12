import {useEffect} from 'react'
import {useLocation} from 'react-router'
import clsx from 'clsx'
import {useLayout} from '../../core'
import {DrawerComponent} from '../../../assets/ts/components'
import {WithChildren} from '../../../helpers'

const Content = ({children}: WithChildren) => {
  const {config, classes} = useLayout()
  const location = useLocation()
  useEffect(() => {
    DrawerComponent.hideAll()
  }, [location])

  const appContentContainer = config.app?.content?.container
  return (
    <div
      id='kt_app_content'
      className={clsx(
        'd-flex app-content mb-0 mt-auto',
        classes.content.join(' '),
        config?.app?.content?.class
      )}
      style={{ height: 'calc(100% - var(--bs-app-toolbar-height))' }}
    >
      {appContentContainer ? (
        <div
          id='kt_app_content_container'
          className={clsx('d-flex app-container d-flex h-100 w-100 flex-column overflow-auto', classes.contentContainer.join(' '), {
            'flex-column-xxl': appContentContainer === 'fixed',
            'flex-column-fluid': appContentContainer === 'fluid',
          })}
          style={{ flex: '1' }}
        >
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export {Content}
