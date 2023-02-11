

exports.getMenus = async (req, res) => {
  let admin = parseInt(req.user.admin)
  let data = []
  data = [
    {
      id: 200,
      authName: '客户管理',
      path: null,
      pid: 0,
      children: [
        {
          id: 201,
          authName: '客户列表',
          path: 'customer',
          pid: 0,
          children: []
        },
        {
          id: 202,
          authName: '客户类型',
          path: 'customertype',
          pid: 0,
          children: []
        }
      ]
    },
    {
      id: 300,
      authName: '住房管理',
      path: null,
      pid: 0,
      children: [
        {
          id: 301,
          authName: '入住列表',
          path: 'movein',
          pid: 0,
          children: []
        },
        {
          id: 302,
          authName: '预定列表',
          path: 'reserve',
          pid: 0,
          children: []
        },
        {
          id: 303,
          authName: '退房列表',
          path: 'moveout',
          pid: 0,
          children: []
        }
      ]
    },
    {
      id: 400,
      authName: '房间管理',
      path: null,
      pid: 0,
      children: [
        {
          id: 11,
          authName: '房间列表',
          path: 'room',
          pid: 0,
          children: []
        },
        {
          id: 12,
          authName: '房间类型',
          path: 'roomtype',
          pid: 0,
          children: []
        }
      ]
    },
    {
      id: 500,
      authName: '账单管理',
      path: null,
      pid: 0,
      children: [
        {
          id: 501,
          authName: '账单列表',
          path: 'bill',
          pid: 0,
          children: []
        }
      ]
    },
    {
      id: 600,
      authName: '操作管理',
      path: null,
      pid: 1,
      children: [
        {
          id: 601,
          authName: '操作列表',
          path: 'handling',
          pid: 1,
          children: []
        }
      ]
    },
    {
      id: 700,
      authName: '员工管理',
      path: null,
      pid: 1,
      children: [
        {
          id: 701,
          authName: '员工列表',
          path: 'staff',
          pid: 1,
          children: []
        },
        {
          id: 702,
          authName: '员工级别',
          path: 'stafftype',
          pid: 1,
          children: []
        }
      ]
    }
  ]
  res.send({
    data,
    msg: '获取权限列表成功',
    status: 0
  })
}