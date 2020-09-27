import React from 'react';
import { Card, Col, Row, Table, Input, Button } from 'antd';
import { Map, Markers } from 'react-amap';
import { connect } from 'dva';
import { history } from 'umi';
import {formatTableColumns, formatTableValue} from '@/services/common';
import styles from './style.less';
import { EnvironmentOutlined } from '@ant-design/icons';
 
@connect(({ dashboard, loading }) => ({ 
  dashboard,
  loading: loading.models.dashboard,
}))

class App1 extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;


    dispatch({
      type: 'dashboard/fetch',
    });

    dispatch({
      type: 'dashboard/watch',
      action: function()  {
        //设备状况
        dispatch({
          type: 'dashboard/getEquipmentInfo',
        });

        //报警列表
        dispatch({
          type: 'dashboard/getWarnList',
        });

        //设备地图
        dispatch({
          type: 'dashboard/getEquipmentPosition'
        });
      }
    });
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.dashboard == this.props.dashboard) {
      return;
    }

    const { dashboard: { equipmentPositions } } = nextProps;
    this.setState({ equipmentPositionsSrc: equipmentPositions, equipmentPositions: equipmentPositions});
  }

  constructor(){
    super();
    this.state = {
      startSN: "",
      endSN: "",
      equipmentPositionsSrc: [],
      equipmentPositions: []
    }
    this.mapCenter = {longitude: 115, latitude: 40};
    this.search = this.search.bind(this);
    this.showEarlyWarning = this.showEarlyWarning.bind(this);
    this.showWarning = this.showWarning.bind(this);

    this.markersEvents = {
      click: (MapsOption, marker) => {   
        const extData = marker.getExtData();
        history.push({
          pathname: '/equipmentinfo',   
          query: {
            SN: extData.position.sn,      
          },      
        });
      }
    }
  }

  search = () => {
    //设备地图
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/getEquipmentPosition',
      payload: {
        startSN: this.state.startSN,
        endSN: this.state.endSN,
      }
    });
  }

  renderMarkerLayout(extData){
    if (extData.position.status_icon == "02-dev-status-02.png") {
      return <div className={styles.status}><img src= {require('../../assets/02-dev-status-02.png')} width="30" /></div>
    }
    else if (extData.position.status_icon == "02-dev-status-03.png") {
      return <div className={styles.status}><img src= {require('../../assets/02-dev-status-03.png')} width="30" /></div>
    }
    else if (extData.position.status_icon == "02-dev-status-01.png") {
      return <div className={styles.status}><img src= {require('../../assets/02-dev-status-01.png')} width="30" /></div>
    }
    else if (extData.position.status_icon == "02-dev-status-04.png") {
      return <div className={styles.status}><img src= {require('../../assets/02-dev-status-04.png')} width="30" /></div>
    }
    else if (extData.position.status_icon == "02-dev-status-05.png") {
      return <div className={styles.status}><img src= {require('../../assets/02-dev-status-05.png')} width="30" /></div>
    }
  }

  onStartSNChange = event => {
    this.setState({ startSN: event.target.value });
  };

  onEndSNChange = event => {
    this.setState({ endSN: event.target.value });
  };

  showEarlyWarning = () => {
    const positions = this.state.equipmentPositionsSrc.filter(x => x.position.status_icon.indexOf("status-03") > -1)
    this.setState({equipmentPositions: positions});
  };

  showWarning = () => {
    const positions = this.state.equipmentPositionsSrc.filter(x => x.position.status_icon.indexOf("status-05") > -1)
    this.setState({equipmentPositions: positions});
  };

  render() {
    const { dashboard: { listTitles } } = this.props;
    const { dashboard: { warnList } } = this.props;
    const { dashboard: { equipmentInfo} } = this.props;

    const columns = formatTableColumns(listTitles);
    const datadSource = formatTableValue(warnList, columns);

    return (
      <div>
          <Row gutter={16}>
              <Col span={8}>
                <Card title={React.createElement('div',  {className: styles.title}, "设备状况")}
                        bordered={false} style={{ height: 280}} size='small'>
                  <p>
                    所有设备总数&nbsp; &nbsp;    
                    <Button type="primary" shape="round" 
                      style={{width: 100, background: equipmentInfo.all.val_bcolor, border: 'none'}}>
                        {equipmentInfo.all.val}
                    </Button>
                  </p>
                  <p>
                    在线设备总数&nbsp; &nbsp;    
                    <Button type="primary" shape="round" 
                      style={{width: 100, background: equipmentInfo.online.val_bcolor, border: 'none'}}>
                        {equipmentInfo.online.val}
                    </Button>
                  </p>
                  <p>
                    离线设备总数&nbsp; &nbsp;    
                    <Button type="primary" shape="round" 
                      style={{width: 100, background: equipmentInfo.offline.val_bcolor, border: 'none'}}>
                        {equipmentInfo.offline.val}
                    </Button>
                  </p>
                  <p>
                    报警设备总数&nbsp; &nbsp;    
                    <Button type="primary" shape="round" 
                      style={{width: 100, background: equipmentInfo.warning.val_bcolor, border: 'none'}}>
                        {equipmentInfo.warning.val}
                    </Button>
                    <span className={styles.addressIcon} style={{color: '#FF322B'}}>
                      <EnvironmentOutlined onClick={this.showWarning} />
                    </span>
                  </p>
                  <p>
                    预警设备总数&nbsp; &nbsp;   
                    <Button type="primary" shape="round" 
                      style={{width: 100, background: equipmentInfo.earlyWarning.val_bcolor, border: 'none'}}>
                        {equipmentInfo.earlyWarning.val}
                    </Button>
                    <span className={styles.addressIcon} style={{color: '#FF8A04'}}>
                        <EnvironmentOutlined onClick={this.showEarlyWarning} />
                    </span>
                  </p>
                </Card>
              </Col>
              <Col span={16}>
                <Card title={React.createElement('div',  {className: styles.warnTitle}, "报警列表")}
                      bordered={false} style={{ height: 280, overflow: 'auto' }} size='small'>
                  <Table
                    bordered
                    pagination={false}
                    dataSource={datadSource}
                    columns={columns}
                    size="small" />
                </Card>
              </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 30}}>
            <Col span={24}>
              <div className={styles.mapHeader}>                
                <div>
                  <div>
                    设备地图

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

              <div className={styles.map}>
                <Map plugins={['ToolBar']} center={this.mapCenter} zoom={4} amapkey={'d15953afa5bab6ff4f79ff57c1c4d483'}>
                  <Markers 
                    markers={this.state.equipmentPositions}
                    events={this.markersEvents}
                    useCluster
                    render={this.renderMarkerLayout}
                  />
                </Map>
              </div>
            </Col>  
          </Row>
        </div>
      )
  }
}

export default App1;

//export default function(props) {
 // return <App1 {...props} key='dashboard'/>
//}