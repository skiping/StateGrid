import { listen, startSocket, send } from '@/services/common';
import defaultSettings from '../../config/defaultSettings'
var moment = require('moment');

export default {
  namespace: 'upgrade',

  state: {
    info: {
      total: 0,
      success: 0,
      inprogress: 0,
      fail: 0,
    },
    titles: [],
    list: [],
  },

  effects: {
    *watch({ action }, { call }) {
        yield call(startSocket, defaultSettings.socketUrl, action);
    },

    *getList({ payload },{ call }) {
        const params = {
            msgid: 40,
            dt: moment(new Date()).format('YYYYMMDDhhmmss'),
            ui_id: 'widget_30'
        };
        yield call(send, params, defaultSettings.socketUrl);
    },

    *doUpgrade({ payload },{ call, put }) {
      const didList = payload.list.map(x => {
        return {did: x}
      });
      const params = {
          msgid: 41,
          dt: moment(new Date()).format('YYYYMMDDhhmmss'),
          upg_list: {
            total: didList.length,
            file: 'http://wdelivery.windsbrige.cn/w9087/10.10.30.wupg',
            list: didList,
          }
      };
      yield call(send, params, defaultSettings.socketUrl);
      yield put({
        type: 'reset',
      });
  },
  },

  reducers: {
    reset(state) {
      return {
        ...state,
        titles: [],
        list: [],
    }
    },

    subscript(state, action) {
        const data = action.payload;
        if (data.msgid == "40") {
            let info = {
                total: 0,
                success: 0,
                inprogress: 0,
                fail: 0,
            };

            let titles = [];
            let values = [];
            if (data.widget) {
                info.total= data.widget.total;
                info.success= data.widget.upg_success;
                info.inprogress= data.widget.upg_inprogress;
                info.fail= data.widget.upg_fail;

                titles = data.widget.list_title;
                values = data.widget.list_value;
            }

            return {
                ...state,
                info: info,
                titles: titles,
                list: values,
            }
        }

        return state;
    }
  }
};