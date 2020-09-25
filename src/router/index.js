import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/lang/i18n.js'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: i18n.t('menu.dashboard'),
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/article',
    name: 'Article',
    component: Layout,
    redirect: '/article/article-list',
    // redirect: 'noRedirect',
    alwaysShow: true,
    hidden: false,
    meta: {
      title: i18n.t('menu.article'),
      icon: 'table'
    },
    children: [
      {
        path: 'article-list',
        name: 'ArticleList',
        component: () => import('@/views/article/article-list'),
        alwaysShow: false,
        hidden: false,
        meta: {
          title: i18n.t('menu.article_list'),
          icon: 'table'
        }
      },
      {
        path: 'article-add',
        name: 'ArticleAdd',
        alwaysShow: false,
        hidden: true,
        component: () => import('@/views/article/article-add'),
        meta: {
          title: i18n.t('menu.article_add')
        }
      },
      {
        path: 'article-edit',
        name: 'ArticleEdit',
        alwaysShow: false,
        hidden: true,
        component: () => import('@/views/article/article-edit'),
        meta: {
          title: i18n.t('menu.article_edit')
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = []

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
