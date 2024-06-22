import {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../_metronic/layout/core'

const CustomerActionPage: FC = () => (
  <>
    Customers And Actions
  </>
)

const CustomerActionWrapper: FC = () => {
    const intl = useIntl()
    return (
      <>
        <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'Customers & Actions'})}</PageTitle>
        <CustomerActionPage />
      </>
    )
}

export {CustomerActionWrapper}