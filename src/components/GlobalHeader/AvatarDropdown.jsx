import { Avatar, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import styles from './index.less';
var moment = require('moment');

class AvatarDropdown extends React.Component {
  constructor(){
    super();
    this.state = {
      date: moment(new Date()).format("YYYY年MM月DD日"),
      time: moment(new Date()).format("HH:mm:ss"),
    }

    setInterval(() => {
      this.setState({
        date: moment(new Date()).format("YYYY年MM月DD日"),
        time: moment(new Date()).format("HH:mm:ss"),
      });
    }, 1000)
  }

  onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  viewUser = () => {
    history.push(`/userinfo`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
    } = this.props;
    return currentUser && currentUser.uinfo ? (
        <span className={`${styles.action} ${styles.account}`} onClick={this.viewUser}>
          <span className={styles.loginModel}>{currentUser.login_mode}</span>
          <span className={styles.date}>{this.state.date}</span>
          <span className={styles.time}>{this.state.time}</span>
          <span className={`${styles.uinfo} anticon`}>{currentUser.uinfo}</span>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        </span>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
