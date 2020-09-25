import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { listen, startSocket, send, setCookie } from '@/services/common';
import defaultSettings from '../../config/defaultSettings'
var moment = require('moment');

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    username: '',
  },
  effects: {
    *watch({ action }, { call, put }) {
      yield call(startSocket, defaultSettings.socketUrl, action);
    },

    *doLogin({ payload },{ call }) {
      const params = {
        msgid: 10,
        dt: moment(new Date()).format('YYYYMMDDhhmmss'),
        uname: payload.username,
        psw: payload.password,
        cuid: 'a18e2f78156d69a2bbb68ae907b498a6',
      };

      //state.username = params.uname;
      yield call(send, params, defaultSettings.socketUrl);
    },

    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      setCookie('state-grid-authority', '', -1);

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },

    subscript(state, action) {
      const data = action.payload;

      if (data.msgid == "10") {
        data.avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
        setAuthority(data);

        if (data.error.toLowerCase() === 'ok') {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
  
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
  
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
  
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }
  
          history.replace(redirect || '/');

          return state;
        }
        else {
          return { ...state, status: 'error', type: 'account' };
        }
      }
    },
  },
};
export default Model;
