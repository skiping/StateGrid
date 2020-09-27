import { listen, startSocket, send } from '@/services/common';
import defaultSettings from '../../config/defaultSettings'
var moment = require('moment');


const pageIds = {
  login: [10],
  dashboard: [20, 21, 22],
  equipmentList: [20, 30],
  equipmentInfo: [60, 50],
  history: [70, 71],
  upgrade: [40, 41],
  userInfo: [80],
}

export default {
  namespace: 'dashboard',

  state: {
    data: moment(new Date()).format("YYYY-MM-DD"),

    equipmentInfo: {
      all: {},
      online: {},
      offline: {},
      warning: {},
      earlyWarning: {},
    },
    listTitles: [],
    warnList: [],
    equipmentPositions: [],

  },

  effects: {
    *watch({ action }, { call, put }) {
        yield call(startSocket, defaultSettings.socketUrl, action);
    },

    *getEquipmentInfo({ payload },{ call }) {
        const params = {
          msgid: 20,
          dt: moment(new Date()).format('YYYYMMDDhhmmss'),
          ui_id: 'widget_10'
        };
        yield call(send, params, defaultSettings.socketUrl);
    },

    *getWarnList({ payload },{ call }) {
      const params = {
        msgid: 21,
        dt: moment(new Date()).format('YYYYMMDDhhmmss'),
        ui_id: 'widget_11'
      };
      yield call(send, params, defaultSettings.socketUrl);
  },

    *getEquipmentPosition({ payload }, { call }) {
      let snList = [];
      if (payload && payload.startSN) snList.push(payload.startSN);
      if (payload && payload.endSN) snList.push(payload.endSN);
  
      let params = {
        msgid: 22,
        dt: moment(new Date()).format('YYYYMMDDhhmmss'),
        ui_id: 'widget_12'
      };
      if (snList.length > 0) params.sn = snList;
      yield call(send, params, defaultSettings.socketUrl);
    }
  },

  reducers: {
    subscript(state, action) {
      const data = action.payload;

      if (data.msgid == "20") {

        const list = (data.widget || {}).list || [];
        if (list.length > 0) {
          const info = {
            all: (list.find(x => x.title == "所有设备总数") || {}),
            online: (list.find(x => x.title == "在线设备总数") || {}),
            offline: (list.find(x => x.title == "离线设备总数") || {}),
            warning: (list.find(x => x.title == "报警设备总数") || {}),
            earlyWarning: (list.find(x => x.title == "预警设备总数") || {}),
          }

          return {
            ...state,
            equipmentInfo: info
          }
        }

        return state;
      }
      else if (data.msgid == "21") {
        return {
          ...state,
          listTitles: data.widget.list_title,
          warnList: data.widget.list_value,
        }
      }
      else if (data.msgid == "22") {
        let positions = [];
        data.widget.list.filter(x => {
          x.longitude = x.lat;
          x.latitude = x.lng;
          positions.push({position: x});
        });

        return {
          ...state,
          equipmentPositions: positions,
        }
      }

      return state;
    }
  },

  subscriptions: {

    //订阅scoket数据，并分发到相应页面
    socketMessage({dispatch, history}) {
      return listen(defaultSettings.socketUrl, (data) => {
        if (data.indexOf("客户端") != -1 && data.indexOf("{") == -1) {
          return "";
        }

        const json = JSON.parse(data);
        const msgId = (json || {}).msgid || 0;
        if (pageIds.dashboard.indexOf(msgId) != -1) {
          dispatch({
            type: "subscript",
            payload: json,
          });
        }

        if (pageIds.equipmentList.indexOf(msgId) != -1) {
          dispatch({
            type: "equipmentList/subscript",
            payload: json,
          });
        }

        if (pageIds.equipmentInfo.indexOf(msgId) != -1) {
          dispatch({
            type: "info/subscript",
            payload: json,
          });
        }

        if (pageIds.history.indexOf(msgId) != -1) {
          dispatch({
            type: "history/subscript",
            payload: json,
          });
        }

        if (pageIds.upgrade.indexOf(msgId) != -1) {
          dispatch({
            type: "upgrade/subscript",
            payload: json,
          });
        }

        if (pageIds.login.indexOf(msgId) != -1) {
          dispatch({
            type: "login/subscript",
            payload: json,
          });
        }

        if (pageIds.userInfo.indexOf(msgId) != -1) {
          dispatch({
            type: "user/subscript",
            payload: json,
          });
        }   
      })
    }
  }
};