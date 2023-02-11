const db = require('@/db/index')


exports.getTypes = async (req, res) => {
    let result = {}
    let pagenum = parseInt(req.query.pagenum) || 1
    let pagesize = parseInt(req.query.pagesize) || 99
    let query = req.query.query
    if(!query) query = ''
    let sql_toshow = ''
    let sql_count = ''
    let total = 0
    let data = {}
    sql_toshow = `call sel_q1_v_page('room_type', 'rtype', ?, 1, 0, ?, ?)` 
    sql_count = `select count(*) as count from room_type`
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
        msg: '查询房间类型数据成功！',
        total,
        data: data[0]
    }
    res.send(result)
}

exports.addTypes = async (req, res) => {
    let result = {}
    let sql = ``
    let data = {}
    let roomtypeobj = req.body
    sql = `insert into room_type set ?`
    try {
        let [rows] = await db.query(sql, [roomtypeobj])
        data = rows
    } catch (err) {
        if (err) res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('新增房间类型失败！')
    result = {
        status: 0,
        msg: '新增房间类型成功！',
        insertId: data.insertId,
        data: roomtypeobj
    }
    res.send(result)
}

exports.getTypesById = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let id = req.params.id
    sql = `select * from room_type where rid=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if(data[0] == null) return res.sd('查询房间类型失败！')
    result = {
        status: 0,
        msg: '查询房间类型信息成功！',
        data: data[0]
    }
    res.send(result)
}

exports.editTypeById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let roomtypeobj = req.body
    let data = {}
    sql = `update room_type set ? where rid=?`
    try {
        const [rows] = await db.query(sql, [roomtypeobj, id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('修改房间类型信息失败！')
    result = {
        status: 0,
        msg: '修改房间类型信息成功！',
        data: roomtypeobj
    }
    res.send(result)
}

exports.deleteTypeById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let data = {}
    sql = `delete from room_type where rid=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('删除房间类型失败！')
    result = {
        status: 0,
        msg: '删除房间类型成功！',
        data: null
    }
    res.send(result)
}