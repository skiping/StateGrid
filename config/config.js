// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: '登录',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/dashboard',
              authority: ['admin', 'user'],
            },
            {
              name: '设备详情',
              path: '/equipmentinfo',
              component: './EquipmentInfo',
              hideInMenu: true,
              authority: ['admin', 'user'],
            },
            {
              path: '/dashboard',
              name: '设备地图',
              icon: 'icon-deploymentunit',
              component: './Dashboard',
              authority: ['admin', 'user'],
            },
            {
              path: '/equipmentlist',
              name: '设备列表',
              icon: 'icon-unorderedlist',
              component: './EquipmentList',
              authority: ['admin', 'user'],
            },
            {
              path: '/history',
              name: '历史数据',
              icon: 'icon-time-circle-copy',
              component: './History',
              authority: ['admin', 'user'],
            },
            {
              path: '/upgrade',
              name: '升级管理',
              icon: 'icon-sync',
              component: './Upgrade',
              authority: ['admin']
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'icon-deploymentunit',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: '用户信息',
              path: '/userinfo',
              component: './UserInfo',
              hideInMenu: true,
              authority: ['admin', 'user'],      
            },            
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    //'primary-color': defaultSettings.primaryColor,
    'primary-color': '#005a5f',
    'menu-dark-bg': '#005a5f',
    'layout-sider-background': '#005a5f'
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
