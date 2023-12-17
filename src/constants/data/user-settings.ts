import { Wallet } from '../icons';
import MoneyChange from '../icons/money-change';
import {
  ProfileIcon,
  BookingListIcon,
  Bookmark,
  Aboutus,
  ShieldIcon,
  CustomerService,
} from '../icons/settings';

export const userSettings1 = [
  {
    id: 'profile-info',
    url: '/user/profile',
    icon: ProfileIcon,
  },
  {
    id: 'booking-list',
    url: '/user/all-bookings',
    icon: BookingListIcon,
  },
  {
    id: 'saved',
    url: '/user/saved-courses',
    icon: Bookmark,
  },
  {
    id: 'payment-history',
    url: '/user/invoices',
    icon: MoneyChange,
  },
];

export const userSettings2 = [
  {
    id: 'about-us',
    url: '/aboutus',
    icon: Aboutus,
  },
  {
    id: 'terms_and_conditions',
    url: '/terms-and-conditions',
    icon: ShieldIcon,
  },
  {
    id: 'customer-service',
    url: '/customer-service',
    icon: CustomerService,
  },
  // {
  //   id: 'user-settings-4',
  //   title: 'Share App',
  //   url: '#',
  //   icon: Share,
  // },
];
