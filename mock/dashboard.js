const getWarns = (req, res) => {
    res.json([
      {
        key: 1,
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '你收到了 14 份新周报',
        datetime: '2017-08-09',
        type: 'notification',
        region: '北京',
        tiltangle:'-10.01°左 0.01前',
        distance: '-2cm左 2cm下'
      },
      {
        key: 2,
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '你收到了 14 份新周报',
        datetime: '2017-08-09',
        type: 'notification',
        region: '北京',
        tiltangle:'-10.01°左 0.01前',
        distance: '-2cm左 2cm下'
      },
      {
        key: 3,
        id: '000000003',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '你收到了 14 份新周报',
        datetime: '2017-08-09',
        type: 'notification',
        region: '北京',
        tiltangle:'-10.01°左 0.01前',
        distance: '-2cm左 2cm下'
      },
      {
        key: 4,
        id: '1000000004',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '你收到了 14 份新周报',
        datetime: '2017-08-09',
        type: 'notification',
        region: '北京',
        tiltangle:'-10.01°左 0.01前',
        distance: '-2cm左 2cm下'
      }
    ]);
  };
  
  export default {
    'GET /api/warn': getWarns,
  };
  