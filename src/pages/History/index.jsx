import React from 'react';
import { Card, Table, Input, Button, Checkbox, Select } from 'antd';
import { connect } from 'dva';
import {formatTableColumns, formatTableValue, getTableColumnsCheckbox, getHistoryChartModel} from '@/services/common';
import styles from './style.less';
import { Line } from '@ant-design/charts';
const { Option } = Select;

@connect(({ history, loading }) => ({ 
  history,
  loading: loading.models.history,
}))

class HistoryApp extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'history/watch',
      action: function()  {
        //设备列表
        dispatch({
          type: 'history/getList',
        });

        dispatch({
          type: 'history/getHistoryCurve',
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.history == this.props.history) {
      return;
    }

    const { history: { list } } = nextProps;
    const { history: { titles } } = nextProps;
    const { history: { historyCurve } } = nextProps;

    const columns = formatTableColumns(titles);
    const datadSource = formatTableValue(list, columns);
    const checkboxs = getTableColumnsCheckbox(columns);

    const defaultChecked = ["1", "2", "3", "4", "5", "6", "7"];
    let showColoums = [];
    columns.filter(x => {
      if (defaultChecked.indexOf(x.dataIndex) != -1)
      showColoums.push(x);
    });

    const chartData = getHistoryChartModel(historyCurve, datadSource);

    this.setState({ list: [...list], titles: [...titles], columns: [...columns], datadSource: [...datadSource], 
      checkboxs: checkboxs, showColoums: showColoums, defaultChecked: defaultChecked, 
      chartData: chartData, shownChart: chartData[0]});
  }

  componentDidUpdate () {
    const drawColorTags = document.getElementsByClassName("drawColor");
    if (drawColorTags.length > 0) {
      for(var i=0; i < drawColorTags.length; i++)
      {
        const color = drawColorTags[i].textContent.split("|");
        if (color.length > 1) {
          drawColorTags[i].parentNode.style.background = color[1];
          drawColorTags[i].textContent = color[0];
        }
      }
    }
  }

  constructor() {
    super();

    this.state = {
      startSN: "",
      endSN: "",
      showColoums: [],
      list: [],
      titles: [],
      columns: [],
      datadSource: [],
      checkboxs: [],
      defaultChecked: [],
      historyCurve: [],
      chartData: [],
      shownChart: {},
    }
  }

  onStartSNChange = event => {
    this.setState({ startSN: event.target.value });
  };

  onEndSNChange = event => {
    this.setState({ endSN: event.target.value });
  };

  search = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'history/getList',
      payload: {
        startSN: this.state.startSN,
        endSN: this.state.endSN,
      }
    });
  }

  onChange = (checkedValues) => {
    let showColoums = [];

    if (checkedValues.some(x => x == "-1")) {
      showColoums = this.state.columns;
    }
    else {
      this.state.columns.filter(x => {
        if (checkedValues.indexOf(x.dataIndex) != -1)
        showColoums.push(x);
      });
    }

    this.setState({ showColoums: showColoums });
  }
  
  onChartChange = (value) => {

    let chartData = this.state.chartData.find(x => x.title == value);
    if (chartData)
      this.setState({ shownChart: chartData });
  }

  render() {
    const { history: { equipmentInfo } } = this.props;
    const defaultChecked = ["1", "2", "3", "4", "5", "6", "7"];

    const selectItems = this.state.chartData
      .map((x, i) => <Option value={x.title} key={i}>{x.title}</Option>);

    const config = {
      title: {
        visible: true,
        text: (this.state.shownChart || {}).title,
      },
      padding: 'auto',
      forceFit: true,
      xField: 'date',
      yField: 'value',
      yAxis: { label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) } },
      legend: { position: 'right-top' },
      seriesField: 'type',
      color: (d) => {
        return d === '预警次数' || d === '倾斜角度'  || d === '离线次数'  ? '#93D072' : '#2D71E7';
      },
      responsive: true,
    };

    return (

      <div>
        <Card title={React.createElement('div',  {className: styles.title}, "设备状况")}
                bordered={false} size='small'>
          <div className={styles.info}>
            <span>
              所有设备总数&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#AC1600'}}>
                  {equipmentInfo.all}
              </Button>
            </span>
            <span>
              报警设备总数&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#FF322B'}}>
                  {equipmentInfo.warning}
              </Button>
            </span>     
            <span>
              预警设备总数&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#FF8A04'}}>
                  {equipmentInfo.earlyWarning}
              </Button>
            </span>               
          </div>
        </Card>

        <div className={styles.chartHeader}>                
          <div>
            <div>
              历史曲线

              <div className={styles.search}>
                <span>
                  选择曲线图: &nbsp;&nbsp;
                  <Select defaultValue='报警统计'
                    style={{ width: 200 }} onChange={this.onChartChange}>
                    {selectItems}
                 </Select>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.chart}>
          <Line {...config} data= {(this.state.shownChart || {}).data}/>
        </div>

        <div className={styles.listHeader}>                
          <div>
            <div>
              历史数据

              <div className={styles.search}>
                <img src={require('../../assets/search.png')} height="30" style={{cursor: "pointer"}} onClick={this.search} />
                <span>
                  设备序列号：
                  <Input placeholder="所有" style={{width: 200}} value={this.state.startSN} onChange={this.onStartSNChange}/>
                </span>
                -
                <span>
                  设备序列号：
                  <Input placeholder="所有" style={{width: 200}} value={this.state.endSN} onChange={this.onEndSNChange}/>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.checkboxGroup}>
          <Checkbox.Group
            options={this.state.checkboxs}
            defaultValue={defaultChecked}
            onChange={this.onChange}
          />
        </div>

        <div style={{ overflow: 'auto' }}>
          <Table
            bordered
            pagination={false}
            dataSource={this.state.datadSource}
            columns={this.state.showColoums}
            size="small" />
        </div>
      </div>);
  }
}

export default HistoryApp;