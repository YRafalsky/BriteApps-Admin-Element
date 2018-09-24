import Vue from 'vue'
import Router from 'vue-router'
import Interceptor from '@/router/router.interceptor'

import LoginRoutes from '@/modules/login/login.routes'
import DashboardRoutes from '@/modules/dashboard/dashboard.routes'
import BuildRoutes from '@/modules/builds/builds.routes'
import SettingsRoutes from '@/modules/settings/settings.routes'
import ContentRoutes from '@/modules/content/content.routes'
import AppearanceRoutes from '@/modules/appearance/appearance.routes'
import TemplatesRoutes from '@/modules/templates/templates.routes'
import EDeliveryRoutes from '@/modules/edelivery/edelivery.routes'
import EmailsRoutes from '@/modules/emails/emails.routes'
import UsersRoutes from '@/modules/user/users.routes'

import CompanySelectPage from '@/modules/dashboard/company-select.page'
import CompanyRootPage from '@/modules/dashboard/company-root.page'

Vue.use(Router)

let router = new Router({
  routes: [
    ...LoginRoutes,
    {
      path: '/company-select',
      name: 'company-select',
      component: CompanySelectPage
    },
    {
      path: '/company/:companyId',
      component: CompanyRootPage,
      children: [
        ...DashboardRoutes,
        ...BuildRoutes,
        ...SettingsRoutes,
        ...ContentRoutes,
        ...AppearanceRoutes,
        ...TemplatesRoutes,
        ...EDeliveryRoutes,
        ...EmailsRoutes,
        ...UsersRoutes,
      ]
    },
  
  
  ],
  mode: 'history',
})

Interceptor.attach(router)

export default router
