import {ID, Response} from '../../../../../../_metronic/helpers'
export type User = {
  id?: ID
  user_id?: number
  full_name?: string
  avatar?: string
  email?: string
  position?: string
  role?: string | number
  username?: string
  last_login?: string
  two_steps?: boolean
  joined_day?: string
  online?: boolean
  initials?: {
    label: string
    state: string
  }
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  role: 'Administrator',
  full_name: '',
  email: '',
}
