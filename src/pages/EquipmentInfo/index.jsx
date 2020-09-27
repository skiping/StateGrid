import React from 'react';
import { Card, Col, Row, Button, Input, Form, Tooltip, Select } from 'antd';
const { Option } = Select;
import { connect } from 'dva';
import styles from './style.less';


class EInfo extends React.Component {
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

            //设备管理
            dispatch({
              type: 'info/getManagement',
              payload: {
                sn: query.SN,
              }
            });
          }
        });
      }
    }

    onFinish = (values) => {
      console.log('Success:', values);

      const { dispatch } = this.props;
      if (!dispatch) return;

      //设备管理
      dispatch({
        type: 'info/setManagement',
        payload: {
          list: values,
        }
      });

    }
  
    render() {
      const { info: { baseInfo } } = this.props;
      const { info: { baseSensor} } = this.props;
      const { info: { extendSensor} } = this.props;
      const { info: { installInfo} } = this.props;
      const { info: { management} } = this.props;
      const { info: { managementTitle} } = this.props;

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

      const managementItems = management.map((x, i) => {
          if (x.value_list.indexOf(x.value) == -1) {
            return  <Form.Item label={x.title}  labelAlign="left" key={i}>
                      <Form.Item
                        name={"input_" + i}
                        noStyle
                        initialValue = {x.value}
                        rules={[{ required: true, message: '请输入' + x.title }]}
                      >
                        <Input style={{ width: 120 }}  />
                      </Form.Item>
                      <Tooltip title="Useful information" >
                          <span style={{marginLeft: 20}}>{x.value_unit}</span>
                      </Tooltip>
                    </Form.Item>

          }
          else {
          const options = x.value_list.map((v, i) => <Option value={v} key={i}>{v}</Option>);
            return  <Form.Item label={x.title}  labelAlign="left" key={i}>
                      <Form.Item
                        name={"input_" + i}
                        noStyle
                        initialValue = {x.value}
                        rules={[{ required: true, message: '请选择' + x.title }]}
                      >
                        <Select style={{ width: 120 }}>
                        {options}</Select>
                      </Form.Item>
                      <Tooltip title="Useful information" >
                        <span style={{marginLeft: 20}}>{x.value_unit}</span>
                      </Tooltip>
                    </Form.Item>
          }
        }
      );

      const layout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 8,
        },
      };

      const tailLayout = {
        wrapperCol: {
          span: 24,
        },
      };

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

              <Card title={React.createElement('div',  {className: styles.baseSensorTiile}, "基本传感器信息")}
                    bordered={false} style={{ marginTop: 20 }} size='small'>
                {baseSensorItems}
              </Card>

              <Card title={React.createElement('div',  {className: styles.extendSensorTiile}, "扩展传感器信息")}
                    bordered={false} style={{ marginTop: 20 }} size='small'>
                {extendSensorItems}
              </Card>

              <Card title={React.createElement('div',  {className: styles.managementTiile}, "设备管理")}
                    bordered={false} style={{ marginTop: 20}} size='small'>


                <Form
                  {...layout}
                  name="management_box"
                  onFinish={this.onFinish}
                  //onFinishFailed={onFinishFailed}
                >
                  {managementItems}

                  <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" shape="round" style={{width: 100, background: '#016EFF'}}>
                      设置
                    </Button>

                    <label className={styles.setSuccess} style={{color: 'grey'}}>{managementTitle.title_udt} 设置成功</label>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
             
            </Col>
            <Col span={12}>
              
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
  }))(EInfo);
  
  