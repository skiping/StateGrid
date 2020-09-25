import { listen, startSocket, send } from '@/services/common';
import defaultSettings from '../../config/defaultSettings'
var moment = require('moment');

export default {
  namespace: 'info',

  state: {
    baseInfo: {
        time: '',
        list: [{title: '设备序列号', value: 'SG-0000-1004'}]
    },
    baseSensor: [],
    extendSensor: [],
    installInfo: [],
    management: [],
  },

  effects: {
    *watch({ action }, { call }) {
        yield call(startSocket, defaultSettings.socketUrl, action);
    },

    *getEquipmentInfo({ payload },{ call }) {
        const params = {
          msgid: 50,
          dt: moment(new Date()).format('YYYYMMDDhhmmss'),
          ui_id: 'widget_50',
          did: payload.sn
        };
        yield call(send, params, defaultSettings.socketUrl);
    },

    *getList({ payload },{ call }) {
      const params = {
        msgid: 30,
        dt: moment(new Date()).format('YYYYMMDDhhmmss'),
        ui_id: 'widget_20',
        did: payload.sn
      };
      yield call(send, params, defaultSettings.socketUrl);
    },
  },

  reducers: {
    subscript(state, action) {
      const data = action.payload;

      if (data.msgid == "50") {
        if (data.widget.length > 0) {
          let info = {};
          let baseSensors = [];
          let extendSensors = [];
          let installInfos = [];

          data.widget.filter(x => {
            if (x.widget_id == "widget_50") {//基本信息
                info.time = moment(x.title.title_udt).format('YYYY-MM-DD hh:mm:ss');
                info.list = x.list;
            }
            else if (x.widget_id == "widget_41") { //基本传感器
              baseSensors = x.list;
            }
            else if (x.widget_id == "widget_42") { //扩展传感器
              extendSensors = x.list;
            }
            else if (x.widget_id == "widget_43") { //安装信息
              installInfos = x.list;
            }
          });

          return {
            ...state,
            baseInfo: info,
            baseSensor: baseSensors,
            extendSensor: extendSensors,
            installInfo: installInfos,
          }       
        }
        return state;
      }
      else if (data.msgid == "41") {
        if (data.widget) {
          return {
            ...state,
            titles: data.widget.list_title,
            list: data.widget.list_value,
          }
        }


        return {
          ...state,
          titles: [{1: "设备序列号"}, {2: "产品型号"},{3: "地区"},{4: "工作状态"},{5: "赶塔线路"}],
          list: []
        }
      }

      return {
        ...state,
        data: action.payload
      }
    }
  }
}