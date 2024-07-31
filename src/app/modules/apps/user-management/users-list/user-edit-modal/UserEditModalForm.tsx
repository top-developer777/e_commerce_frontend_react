import { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { initialUser, User } from '../core/_models'
import clsx from 'clsx'
import { useListView } from '../core/ListViewProvider'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createUser, updateUser } from '../core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
})

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [userForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    name: user.name || initialUser.name,
    email: user.email || initialUser.email,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  // const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  // const userAvatarImg = toAbsoluteUrl(`media/${userForEdit.avatar}`)

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(user)
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' method='post' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          <div className='fv-row'>
            {/* <label className='d-block fw-bold fs-6 mb-5'>Avatar</label> */}

            {/* <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{ backgroundImage: `url('${blankImg}')` }}
            >
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{ backgroundImage: `url('${userAvatarImg}')` }}
              ></div>
              <label
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='change'
                data-bs-toggle='tooltip'
                title='Change avatar'
              >
                <i className='bi bi-pencil-fill fs-7'></i>

                <input type='file' name='avatar' accept='.png, .jpg, .jpeg' />
                <input type='hidden' name='avatar_remove' />
              </label>
              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='cancel'
                data-bs-toggle='tooltip'
                title='Cancel avatar'
              >
                <i className='bi bi-x fs-2'></i>
              </span>
              <span
                className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                data-kt-image-input-action='remove'
                data-bs-toggle='tooltip'
                title='Remove avatar'
              >
                <i className='bi bi-x fs-2'></i>
              </span>
            </div>

            <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Full Name</label>
            <input
              placeholder='Full name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.name && formik.errors.name },
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>
          <div className='mb-7'>
            <label className='required fw-bold fs-6 mb-5'>Role</label>
            <div className='d-flex fv-row'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='Administrator'
                  id='kt_modal_update_role_option_0'
                  checked={formik.values.role === 'Administrator'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                  <div className='fw-bolder text-gray-800'>Administrator</div>
                  <div className='text-gray-600'>
                    Full access to all features and functionalities
                  </div>
                </label>
              </div>
            </div>
            <div className='separator separator-dashed my-5'></div>
            <div className='d-flex fv-row'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='Customer Support'
                  id='kt_modal_update_role_option_1'
                  checked={formik.values.role === 'Customer Support'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                  <div className='fw-bolder text-gray-800'>Customer Support</div>
                  <div className='text-gray-600'>
                    Customer Support
                  </div>
                </label>
              </div>
            </div>
            <div className='separator separator-dashed my-5'></div>
            <div className='d-flex fv-row'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='Order Agent'
                  id='kt_modal_update_role_option_2'
                  checked={formik.values.role === 'Order Agent'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_2'>
                  <div className='fw-bolder text-gray-800'>Order Agent</div>
                  <div className='text-gray-600'>
                    Order Agent
                  </div>
                </label>
              </div>
            </div>
            <div className='separator separator-dashed my-5'></div>
            <div className='d-flex fv-row'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='Product Manager'
                  id='kt_modal_update_role_option_3'
                  checked={formik.values.role === 'Product Manager'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_3'>
                  <div className='fw-bolder text-gray-800'>Product Manager</div>
                  <div className='text-gray-600'>
                    Product Manager
                  </div>
                </label>
              </div>
            </div>
            <div className='separator separator-dashed my-5'></div>
            <div className='d-flex fv-row'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  id='kt_modal_update_role_option_4'
                  value='Warehouse Staff'
                  checked={formik.values.role === 'Warehouse Staff'}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_4'>
                  <div className='fw-bolder text-gray-800'>Warehouse Staff</div>
                  <div className='text-gray-600'>
                    Warehouse Staff
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { UserEditModalForm }
