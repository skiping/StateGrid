import { listen, startSocket, send } from '@/services/common';
import defaultSettings from '../../config/defaultSettings'
var moment = require('moment');

export default {
  namespace: 'equipmentList',

  state: {
    equipmentInfo: {
      all: 0,
      offline: 0,
      warning: 0,
      earlyWarning: 0,
    },
    titles: [],
    list: [],
  },

  effects: {
    *watch({ action }, { call }) {
        yield call(startSocket, defaultSettings.socketUrl, action);
    },

    *getEquipmentInfo({ payload },{ call }) {
        const params = {
          msgid: 20,
          dt: moment(new Date()).format('YYYYMMDDhhmmss'),
          ui_id: 'widget_10',
          page: 'list',
        };
        yield call(send, params, defaultSettings.socketUrl);
    },

    *getList({ payload },{ call }) {
      const params = {
        msgid: 30,
        dt: moment(new Date()).format('YYYYMMDDhhmmss'),
        ui_id: 'widget_20',
        page: 'list',
      };
      yield call(send, params, defaultSettings.socketUrl);
    },
  },

  reducers: {
    subscript(state, action) {
      const data = action.payload;

      if (data.msgid == "20") {

        const list = (data.widget || {}).list || [];
        if (list.length > 0) {
          const info = {
            all: list[0].val,
            offline: list[1].val,
            warning: list[2].val,
            earlyWarning: list[3].val,
          }

          return {
            ...state,
            equipmentInfo: info
          }
        }

        return state;
      }
      else if (data.msgid == "30") {
        if (data.widget) {
          return {
            ...state,
            titles: data.widget.list_title,
            list: data.widget.list_value,
          }
        }
      }

      return {
        ...state,
        data: action.payload
      }
    }
  }
};