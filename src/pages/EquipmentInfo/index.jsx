import React from 'react';
import { Card, Col, Row, } from 'antd';
import { connect } from 'dva';
import styles from './style.less';


class test extends React.Component {
    state = {
      isReady: false,
    };
  
    componentDidMount() {
      const { location: { query } } = this.props;
      this.setState({
        isReady: true,
      });
      const { dispatch } = this.props;
  
      if (dispatch) {
        dispatch({
          type: 'info/watch',
          action: function()  {
            //设备详情
            dispatch({
              type: 'info/getEquipmentInfo',
              payload: {
                sn: query.SN,
              }
            });
          }
        });
      }

      
    }
  
    render() {
      const { info: { baseInfo } } = this.props;
      const { info: { baseSensor} } = this.props;
      const { info: { extendSensor} } = this.props;
      const { info: { installInfo} } = this.props;

      const infoItems = baseInfo.list.map((x, i) => {
        if (x.value_bkcolor) {
          return <div className={styles.infoItem} key={i}>
                    <span>{x.title}</span> <label style={{color: x.value_bkcolor}}>{x.value}</label>
                  </div>
        }
        return <div className={styles.infoItem} key={i}><span>{x.title}</span>{x.value}</div>
      });
      const baseSensorItems = baseSensor.map((x, i) => <div className={styles.infoItem} key={i}><span>{x.title}</span>{x.value}</div>);
      const extendSensorItems = extendSensor.map((x, i) => <div className={styles.infoItem} key={i}><span>{x.title}</span>{x.value}</div>);
      const installInfoItems = installInfo.map((x, i) =>  {
        if (x.value_bkcolor) {
          return <div className={styles.infoItem} key={i}>
                    <span>{x.title}</span> <label style={{color: x.value_bkcolor}}>{x.value}</label>
                  </div>
        }
        return <div className={styles.infoItem} key={i}><span>{x.title}</span>{x.value}</div>
      });

      return (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card title={React.createElement('div',  {className: styles.infoTiile}, "基本信息")}
                    bordered={false}  size='small'>
                {infoItems}
              </Card>
            </Col>
            <Col span={12}>
              <Card title={React.createElement('div',  {className: styles.installTiile}, "安装信息")}
                    bordered={false} size='small'>
                {installInfoItems}
              </Card>

              <Card title={React.createElement('div',  {className: styles.installTiile}, "基本传感器信息")}
                    bordered={false} style={{ marginTop: 20 }} size='small'>
                {baseSensorItems}
              </Card>

              <Card title={React.createElement('div',  {className: styles.infoTiile}, "扩展传感器信息")}
                    bordered={false} style={{ marginTop: 20 }} size='small'>
                {extendSensorItems}
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
             
            </Col>
            <Col span={12}>
              <Card title={React.createElement('div',  {className: styles.installTiile}, "安装信息")}
                    bordered={false} style={{ height: 240}} size='small'>
                {baseSensorItems}
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
  }
  
  //export default test;

  export default connect(({ info, loading }) => ({ 
    info,
    loading: loading.models.info,
  }))(test);
  
  