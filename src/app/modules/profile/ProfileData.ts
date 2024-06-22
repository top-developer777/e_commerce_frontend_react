import {PageLink} from '../../../_metronic/layout/core'

export const profileSubmenu: Array<PageLink> = [
  {
    title: 'Overview',
    path: '/account-manage/account/settings',
    isActive: true,
  },
  {
    title: 'Separator',
    path: '/account-manage/account/settings',
    isActive: true,
    isSeparator: true,
  },
  {
    title: 'Account',
    path: '/crafted/pages/profile/account',
    isActive: false,
  },
  {
    title: 'Account',
    path: '/crafted/pages/profile/account',
    isActive: false,
    isSeparator: true,
  },
  {
    title: 'Settings',
    path: '/crafted/pages/profile/settings',
    isActive: false,
  },
  {
    title: 'Settings',
    path: '/crafted/pages/profile/settings',
    isActive: false,
    isSeparator: true,
  },
]
