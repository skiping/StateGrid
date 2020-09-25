import { listen, startSocket, send } from '@/services/common';
import defaultSettings from '../../config/defaultSettings'
var moment = require('moment');

export default {
  namespace: 'history',

  state: {
    equipmentInfo: {
      all: 0,
      warning: 0,
      earlyWarning: 0,
    },
    titles: [],
    list: [],
    historyCurve: [],
  },

  effects: {
    *watch({ action }, { call }) {
        yield call(startSocket, defaultSettings.socketUrl, action);
    },

    *getHistoryCurve({ payload },{ call }) {
        const params = {
          msgid: 71,
          dt: moment(new Date()).format('YYYYMMDDhhmmss'),
          ui_id: 'widget_71'
        };
        yield call(send, params, defaultSettings.socketUrl);
    },

    *getList({ payload },{ call }) {
        let snList = [];
        if (payload && payload.startSN) snList.push(payload.startSN);
        if (payload && payload.endSN) snList.push(payload.endSN);

        const params = {
            msgid: 70,
            dt: moment(new Date()).format('YYYYMMDDhhmmss'),
            ui_id: 'wi dget_70'
        };
        if (snList.length > 0) params.did = snList;
        yield call(send, params, defaultSettings.socketUrl);
    },
  },

  reducers: {
    subscript(state, action) {
      const data = action.payload;
      if (data.msgid == "71") {

        const list = data.historical_curve || [];
        if (list.length > 0) {
          return {
            ...state,
            historyCurve : list
          }
        }
      }
      else if (data.msgid == "70") {
        let info = {
            all: 0,
            warning: 0,
            earlyWarning: 0,
        }
        if (data.stat) {
            data.stat.list_title.filter(x => {
                if (x.title == "设备总数") {
                    info.all = x.value;
                }
                else if (x.title == "报警次数") {
                    info.warning = x.value;
                }
                else if (x.title == "预警次数") {
                    info.earlyWarning = x.value;
                }
            });
        }

        let titles = [];
        let values = [];
        if (data.history) {
            titles = data.history.list_title;
            values = data.history.list_value;
        }

        return {
            ...state,
            equipmentInfo: info,
            titles: titles,
            list: values,
          }
      }

      return state;
    }
  }
};