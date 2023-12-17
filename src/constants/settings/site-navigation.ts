import { HomeIcon, CoursesIcon, UserIcon2 } from '@/src/constants/icons';
import { CalendarIcon2 } from '../icons/CalendarIcon2';


export const mobileNavigation = [
  {
    id: 1,
    label: 'home-with-icon',
    url: '/',
    icon: HomeIcon,
  },
  {
    id: 2,
    label:'mycourses-with-icon',
    url: '/user/my-courses',
    icon: CoursesIcon,
  },
  {
    id: 3,
    label: 'classes-with-icon',
    url: '/user/classes',
    icon: CalendarIcon2,
  },
  {
    id: 2,
    label: 'profile-with-icon',
    url: '/user/settings',
    icon: UserIcon2,
  },
];
