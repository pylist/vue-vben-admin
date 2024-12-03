import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('super-admin.title'),
    },
    name: 'SuperAdmin',
    path: '/super-admin',
    children: [
      {
        meta: {
          title: $t('super-admin.users.title'),
        },
        name: 'UserAdmin',
        path: '/super-admin/users',
        component: () => import('#/views/super-admin/users/index.vue'),
      },
      {
        meta: {
          title: $t('super-admin.settings.title'),
        },
        name: 'Settings',
        path: '/super-admin/settings',
        component: () => import('#/views/super-admin/settings/index.vue'),
      },
    ],
  },
];

export default routes;
