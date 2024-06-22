import {FC} from 'react'
import {
  ListsWidget1,
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget5,
  ListsWidget6,
  ListsWidget7,
  ListsWidget8,
} from '../../../../_metronic/partials/widgets'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'

const Lists: FC = () => {
  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* begin::Row */}
        <div className='row g-5 g-xl-8'>
          <div className='col-xl-4'>
            <ListsWidget1 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-4'>
            <ListsWidget2 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-4'>
            <ListsWidget3 className='card-xl-stretch mb-5 mb-xl-8' />
          </div>
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className='row g-5 g-xl-8'>
          <div className='col-xl-4'>
            <ListsWidget4 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-4'>
            <ListsWidget5 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-4'>
            <ListsWidget6 className='card-xl-stretch mb-5 mb-xl-8' />
          </div>
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className='row g-5 g-xl-8'>
          <div className='col-xl-6'>
            <ListsWidget7 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-6'>
            <ListsWidget8 className='card-xl-stretch mb-5 mb-xl-8' />
          </div>
        </div>
        {/* end::Row */}
      </Content>
    </>
  )
}

export {Lists}
