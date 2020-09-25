import { queryCurrent, query as queryUsers } from '@/services/user';
import { listen, startSocket, send, getCookie } from '@/services/common';
import defaultSettings from '../../config/defaultSettings';

var moment = require('moment');

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userInfo: [],
  },
  effects: {
    *watch({ action }, { call, put }) {
      yield call(startSocket, defaultSettings.socketUrl, action);
    },

    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      let authorityString = getCookie('state-grid-authority') || "";
      let user = {};
      if (authorityString) {
        user = JSON.parse(authorityString);
      }
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
    },

    *getUserInfo({ payload },{ call }) {
      const params = {
        msgid: 80,
        dt: moment(new Date()).format('YYYYMMDDhhmmss'),
        ui_id: 'widget_80'
      };
      yield call(send, params, defaultSettings.socketUrl);
  },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    subscript(state, action) {
      const data = action.payload;

      if (data.msgid == "80") {
        if (data.widget) {
          return {
            ...state,
            userInfo: data.widget.list,
          }
        }
      }

      return state;
    }
  },
};
export default UserModel;
