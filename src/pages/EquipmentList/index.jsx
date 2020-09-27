import React from 'react';
import { Card, Col, Row, Table, Input, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import {formatTableColumns, formatTableValue, getTableColumnsCheckbox} from '@/services/common';
import styles from './style.less';

@connect(({ equipmentList, loading }) => ({ 
  equipmentList,
  loading: loading.models.equipmentList,
}))

class App2 extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'equipmentList/watch',
      action: function()  {
        //设备信息
        dispatch({
          type: 'equipmentList/getEquipmentInfo',
        });

        //设备列表
        dispatch({
          type: 'equipmentList/getList',
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.equipmentList == this.props.equipmentList) {
      return;
    }
    
    const { equipmentList: { list } } = nextProps;
    const { equipmentList: { titles } } = nextProps;

    const columns = formatTableColumns(titles);
    const datadSource = formatTableValue(list, columns);
    const checkboxs = getTableColumnsCheckbox(columns);

    const defaultChecked = ["1", "2", "3", "4", "5", "6", "7"];
    let showColoums = [];
    columns.filter(x => {
      if (defaultChecked.indexOf(x.dataIndex) != -1)
      showColoums.push(x);
    });

    this.setState({ list: list, titles: titles, columns: columns, datadSource: datadSource, 
      checkboxs: checkboxs, showColoums: showColoums, defaultChecked: defaultChecked});
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
      type: 'equipmentList/getList',
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

  render() {
    const { equipmentList: { equipmentInfo } } = this.props;
    const defaultChecked = ["1", "2", "3", "4", "5", "6", "7"];

    return (
      <div>
        <Card title={React.createElement('div',  {className: styles.title}, "设备状况")}
                bordered={false} size='small'>
          <div className={styles.info}>
            <span>
              所有设备总数&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#016EFF', border: 'none'}}>
                  {equipmentInfo.all}
              </Button>
            </span>
            <span>
              报警设备总数&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#FF322B', border: 'none'}}>
                  {equipmentInfo.warning}
              </Button>
            </span>     
            <span>
              预警设备总数&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#FF8A04', border: 'none'}}>
                  {equipmentInfo.earlyWarning}
              </Button>
            </span>               
          </div>
        </Card>

        <div className={styles.listHeader}>                
          <div>
            <div>
              设备列表信息

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

export default App2;