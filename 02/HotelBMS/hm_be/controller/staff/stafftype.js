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
    sql_toshow = `call sel_q1_v_page('staff_type', 'typename', ?, 1, 0, ?, ?)` 
    sql_count = `select count(*) as count from staff_type`
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
        msg: '查询员工级别数据成功！',
        total,
        data: data[0]
    }
    res.send(result)
}

exports.addTypes = async (req, res) => {
    let result = {}
    let sql = ``
    let data = {}
    let stafftypeobj = req.body
    sql = `insert into staff_type set ?`
    try {
        let [rows] = await db.query(sql, [stafftypeobj])
        data = rows
    } catch (err) {
        if (err) res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('新增员工级别失败！')
    result = {
        status: 0,
        msg: '新增员工级别成功！',
        insertId: data.insertId,
        data: stafftypeobj
    }
    res.send(result)
}

exports.getTypesById = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let id = req.params.id
    sql = `select * from staff_type where stno=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if(data[0] == null) return res.sd('查询员工级别失败！')
    result = {
        status: 0,
        msg: '查询员工级别信息成功！',
        data: data[0]
    }
    res.send(result)
}

exports.editTypeById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let stafftypeobj = req.body
    let data = {}
    sql = `update staff_type set ? where stno=?`
    try {
        const [rows] = await db.query(sql, [stafftypeobj, id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('修改员工级别信息失败！')
    result = {
        status: 0,
        msg: '修改员工级别信息成功！',
        data: stafftypeobj
    }
    res.send(result)
}

exports.deleteTypeById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let data = {}
    sql = `delete from staff_type where stno=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('删除员工级别失败！')
    result = {
        status: 0,
        msg: '删除员工级别成功！',
        data: null
    }
    res.send(result)
}