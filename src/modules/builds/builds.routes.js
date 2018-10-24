import RootPage from './build.page.vue'
import NewBuildPage from './new-build.page.vue'
import BuildDetailPage from './build-details.page.vue'
import DesktopBuildDetailPage from './desktop-build-details.page.vue'

let buildsRoutes = [
  {
    path: 'builds',
    name: 'builds',
    component: RootPage
  },
  {
    path: 'new-build',
    name: 'new-build',
    component: NewBuildPage
  },
  {
    path: 'build-details-mobile-:buildId',
    name: 'build-details-mobile',
    component: BuildDetailPage
  },
  {
    path: 'build-details-desktop-:buildId',
    name: 'build-details-desktop',
    component: DesktopBuildDetailPage
  },
]

export default buildsRoutes
