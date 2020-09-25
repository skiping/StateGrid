import React from 'react';
import styles from '../style.less';


// tslint:disable-next-line:max-classes-per-file
class MapComponent extends React.Component {

    componentDidMount() {
        window.onLoad = function () {
            var map = new AMap.Map('map');
        }
        var url = 'https://webapi.amap.com/maps?v=1.4.15&key=d15953afa5bab6ff4f79ff57c1c4d483&callback=onLoad';
        var jsapi = document.createElement('script');
        jsapi.charset = 'utf-8';
        jsapi.src = url;
        document.head.appendChild(jsapi);
    }
    render() {
        return (
            <div>
            <Row gutter={16}>
                <Col span={8}>
                  <Card title={React.createElement('div',  {className: styles.title}, "设备状况")}
                         bordered={false} style={{ height: 300}}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                  </Card>
                </Col>
                <Col span={16}>
                  <Card title={React.createElement('div',  {className: styles.warnTitle}, "报警列表")}
                        bordered={false} style={{ height: 300, overflow: 'auto' }}>
                    <Table
                      bordered
                      pagination={false}
                      dataSource={dataSource}
                      columns={columns}
                      size="small" />
                  </Card>
                </Col>
            </Row>       
            <Card title='er343434'
              bordered={false} style={{ width: 500, height: 500 }}>
               erer
            </Card>
    
    
            <div className={styles.map}>
                  <Map amapkey={'d15953afa5bab6ff4f79ff57c1c4d483'} />
                </div>
          </div>
        )
    }
}

export default MapComponent;




