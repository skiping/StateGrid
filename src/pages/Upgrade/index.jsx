import React from 'react';
import { Card, message, Table, Input, Button } from 'antd';
import { connect } from 'dva';
import {formatTableColumns, formatTableValue} from '@/services/common';
import styles from './style.less';

@connect(({ upgrade, loading }) => ({ 
  upgrade,
  loading: loading.models.upgrade,
}))

class UpgradeApp extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'upgrade/watch',
      action: function()  {
        //设备列表
        dispatch({
          type: 'upgrade/getList',
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.upgrade == this.props.upgrade) {
      return;
    }

    const { upgrade: { list } } = nextProps;
    const { upgrade: { titles } } = nextProps;
    const { upgrade: { info } } = nextProps;

    const columns = formatTableColumns(titles);
    const datadSource = formatTableValue(list, columns);

    const primaryColumn = columns.find(x => x.title == '产品型号序列号');
    datadSource.filter(x => {
      x.key = x[primaryColumn.key];
    });

    this.setState({ list: [...list], titles: [...titles], columns: [...columns], datadSource: [...datadSource], info: info});
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
      info: {},
      list: [],
      titles: [],
      columns: [],
      datadSource: [],
      selectedRowKeys: [],
    }
  }

  onStartSNChange = event => {
    debugger;
    this.setState({ startSN: event.target.value });
  };

  onEndSNChange = event => {
    this.setState({ endSN: event.target.value });
  };

  search = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'upgrade/getList',
      payload: {
        startSN: this.state.startSN,
        endSN: this.state.endSN,
      }
    });
  }

  doUpgrade = () => {
    if (this.state.selectedRowKeys.length == 0) {
      message.error('请勾选需要升级的设备！');
      return;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'upgrade/doUpgrade',
      payload: {
        list: this.state.selectedRowKeys,
      }
    });
  }

  onChange = (checkedValues) => {
    debugger;
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

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    
    return (
      <div>    
        <Card title={React.createElement('div',  {className: styles.title}, "设备状况")}
                bordered={false} size='small'>
          <div className={styles.info}>
            <span>
              升级总数&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#016EFF'}}>
                  {this.state.info.total}
              </Button>
            </span>
            <span>
              升级成功&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#4ad662'}}>
                {this.state.info.success}
              </Button>
            </span>     
            <span>
              升级中&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#FF8A04'}}>
                {this.state.info.inprogress}
              </Button>
            </span>
            <span>
              升级失败&nbsp;
              <Button type="primary" shape="round" style={{width: 100, background: '#FF322B'}}>
                {this.state.info.fail}
              </Button>
            </span>                  
          </div>
        </Card>

        <div className={styles.listHeader}>                
          <div>
            <div>
              设备升级

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

        <div className={styles.upgrade}>
          <div className={styles.infoItem}>
            <span>升级文件</span>http://wdelivery.windsbrige.cn/w9087/10.10.30.wupg

            <Button type="primary" shape="round" onClick={this.doUpgrade}
              style={{width: 100, background: '#016EFF', marginLeft: 100}}>
              升级
            </Button>
          </div>
        </div>

        <div className={styles.tableTitle}>
          升级列表
        </div>
        <div className={styles.table}>
          <Table
            bordered
            rowSelection={rowSelection}
            pagination={false}
            dataSource={this.state.datadSource}
            columns={this.state.columns}
            size="small" />
        </div>
      </div>);
  }
}

export default UpgradeApp;