const db = require('@/db/index')

exports.getRooms = async (req, res) => {
    let result = {}
    let pagenum = parseInt(req.query.pagenum) || 1
    let pagesize = parseInt(req.query.pagesize) || 2
    let query = req.query.query
    if(!query) query = ''
    let sql_toshow = ''
    let sql_count = ''
    let total = 0
    let data = {}
    sql_toshow = `call sel_q1_v_page('room_type_v', 'rtype', ?, 1, 0, ?, ?)` 
    sql_count = `select count(*) as count from room_type_v`
    try {
        let [rows] = await db.execute(sql_toshow, [query,pagenum,pagesize])
        let [totalpage] = await db.execute(sql_count)
        data = rows
        total = totalpage[0].count
    } catch (err) {
        res.sd(err)
    }
    result = {
        status: 0,
        msg: '查询房间数据成功！',
        total,
        data: data[0]
    }
    res.send(result)
}

exports.getRoomById = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let id = req.params.id
    sql = `select * from room where rno=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if(data[0] == null) return res.sd('查询房间信息失败！')
    result = {
        status: 0,
        msg: '查询房间信息成功！',
        data: data[0]
    }
    res.send(result)
}

exports.addRooms = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let roomobj = req.body
    sql = `insert into room set ?`
    try {
        let [rows] = await db.query(sql, [roomobj])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('新增房间信息失败！')
    result = {
        status: 0,
        msg: '新增房间信息成功！',
        insertId: data.insertId,
        data: roomobj
    }
    res.send(result)
}

exports.editRoomById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let roomobj = req.body
    let data = {}
    sql = `update room set ? where rno=?`
    try {
        const [rows] = await db.query(sql, [roomobj, id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('修改房间信息失败！')
    result = {
        status: 0,
        msg: '修改房间信息成功！',
        data: roomobj
    }
    res.send(result)
}

exports.deleteRoomById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let data = {}
    sql = `delete from room where rno=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('删除房间信息失败！')
    result = {
        status: 0,
        msg: '删除房间信息成功！',
        data: null
    }
    res.send(result)
}