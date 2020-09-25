function getWebsocket(url) {
    if (!window.websocket) {
        const socket = new WebSocket(url);
        window.websocket = socket;
    }
    return window.websocket;
}

export async function startSocket(url, action) {
  const websocket = getWebsocket(url);

  if (websocket.readyState != 1) {
    websocket.onopen = () => {
      action();
    }
  }
  else {
    action();
  }
}

export async function closeSocket() {
  if (window.websocket) {
    window.websocket.close();
  }
}

export async function listen(url, action) {
  const websocket = getWebsocket(url);
  websocket.onmessage = (data) => {
    //if (data.data.error == "OK")

    action(data.data);
  };
}

export async function send(payload, url) {
    const websocket = getWebsocket(url);
    if (websocket.readyState != 1) {
      const socket = new WebSocket(url);
      window.websocket = socket;
      window.websocket.onopen = () => {
        window.websocket.send(JSON.stringify(payload));
      }
    }
    else {
      websocket.send(JSON.stringify(payload));
    }
}

export async function logout(config, code, reason) {
    const websocket = getWebsocket(config.url);
    websocket.close(code, reason);
}

export function formatTableColumns(titles) {
  let columns = [];
  let timeColumns = ['上报日期', '上线时间', '重启时间', '升级开始时间', '升级结束时间'];
  let numberColumns = ['升级后版本', '充电次数', '通信次数', '预警次数', '报警次数', '离线次数', '每天离线次数', '重启次数'];
  let moment = require('moment');

  (titles || {}).filter(x => {
    for (const title in x) {
      columns.push({
        title: x[title],
        dataIndex: title,
        key: title,
        sorter: (a, b) => {
          if (timeColumns.some(y => y == x[title])) {
            let valuea = a[title];
            if (!valuea || valuea == "-") {
              valuea = '1990-01-01 00:00:00'
            }
            let valueb = b[title];
            if (!valueb || valueb == "-") {
              valueb = '1990-01-01 00:00:00'
            }

            return moment(valuea).isSameOrAfter(moment(valueb));
          }
          else if (numberColumns.some(y => y == x[title])) {
              const valuea = Number.parseInt(a[title].replace(/,/g, ''));
              const valueb = Number.parseInt(b[title].replace(/,/g, ''));

              return valuea - valueb;
          }
          
          return (a[title] || '').localeCompare(b[title] || '');
        },
        sortDirections: ['descend', 'ascend'],
      });
    }
  });

  return columns;
}



export function getTableColumnsCheckbox(columns) {
  const checkboxs = [];

  if (columns && columns.length > 0)
    checkboxs.push({label: '所有', value: -1});

  (columns || []).filter(x => {
    checkboxs.push({label: x.title, value: x.dataIndex});
  })

  return checkboxs;
}

export function formatTableValue(listValue, columns) {

  let dataSource = [];
  let key = 1;
  (listValue || []).filter(x => {
    let item = {};

    (x || []).filter(y => {
      let fileds = [];
      for(const field in y) {
        fileds.push(field);
      }

      if (fileds.length == 1) {
        item[fileds[0]] = y[fileds[0]];
      }
      else if (fileds[1] == "bcolor") {
        item[fileds[0]] = y[fileds[0]] + "|" + y[fileds[1]];
       
        columns.filter(z => {
          if (z.dataIndex == fileds[0]) {
            z.render = (text) => <span className='drawColor'>{text}</span>; 
          }
        });
      }
    });

    item.key = 'key' + key;
    key ++;
    dataSource.push(item);
  });

  return dataSource;
}

export function setCookie(name, value, exHours, forCurrentPage) {
  forCurrentPage = forCurrentPage || false;
  var d = new Date();
  d.setTime(d.getTime() + (exHours * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires}${forCurrentPage ? "" : ";path=/"}`;
}

export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

  if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
  }
  else {
      return null;
  }
}

export function getHistoryChartModel(history, dataSource) {
  let data = [];

  (history || []).filter(x => {
    let chartModel = {};
    chartModel.title = x.title;
    chartModel.data = [];

    //X轴 轴名和列key数据
    let xObj = x.list_xy[0];
    let xKey = 0;
    let xTitle = '';
    for(const field in xObj) {
      xKey = xKey;
      xTitle = xObj[field];
    }

    //Y轴 轴名和列key数据
    let yLabels = [];
    x.list_xy.forEach(function(val, index){
      if (index != 0) {
        for(const field in val) {
          yLabels.push({key: field, value: val[field]});
        }
      }
    });

    //从主表格中获取图标数据
    dataSource.map(val => {
      yLabels.filter(label => {
        let yData = {};
        yData.type = label.value;
        yData.date = val[xKey];

        const value = val[label.key];
        const values = value.split("|");
        yData.value = values[0];

        chartModel.data.push(yData);
      })
    });

    data.push(chartModel);
  });

  return data;
}
