import React from 'react';
import { Card, Button } from 'antd';
import { connect } from 'umi';
import styles from './style.less';

@connect(({ user, loading }) => ({ 
    user,
    loading: loading.models.user,
  }))

  
class UserInfo extends React.Component {
    componentDidMount() {
        this.setState({
          isReady: true,
        });
        const { dispatch } = this.props;
    
        if (dispatch) {
          dispatch({
            type: 'user/watch',
            action: function()  {
              //设备详情
              dispatch({
                type: 'user/getUserInfo',
                payload: {
                  id: '',
                }
              });
            }
          });
        }     
    }
    
    
    logout = () => {    
        const { dispatch } = this.props;
        if (dispatch) {
            dispatch({
                type: 'login/logout',
            });
        }

        return;
    };

    render() {
        const { user: { userInfo} } = this.props;
        const baseSensorItems = userInfo.map((x, i) => <div className={styles.infoItem} key={i}><span>{x.title}</span>{x.value}</div>);
        return (
            <Card title="用户信息"
                bordered={false} style={{ height: 400}} size='small'>
                {baseSensorItems}

                <div style={{marginTop: 50}}>
                    <Button type="primary" danger shape="round" size="large" onClick={this.logout}>
                        退出
                    </Button>
                </div>
            </Card>
        );
    }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(UserInfo);
