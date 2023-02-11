const db = require('@/db/index')
const sr = require('simple-random')




// 获取员工列表
exports.getStaffs = async (req, res) => {
    let result = {}
    let pagenum = parseInt(req.query.pagenum) || 1
    let pagesize = parseInt(req.query.pagesize) || 2
    let query = req.query.query
    if(!query) query = ''
    let sql_toshow = ''
    let sql_count = ''
    let total = 0
    let data = {}
    sql_toshow = `call sel_q1_v_page('staff_toshow', 'sname', ?, 1, 0, ?, ?)` 
    sql_count = `select count(*) as count from staff_toshow`
    try {
        // nt execute需要参数必须为字符串，坑爹bug
        let [rows] = await db.execute(sql_toshow, [query,pagenum,pagesize])
        let [totalpage] = await db.execute(sql_count)
        data = rows
        total = totalpage[0].count
    } catch (err) {
        res.sd(err)
    }
    result = {
        status: 0,
        msg: '查询员工数据成功！',
        total,
        data: data[0]
    }
    res.send(result)
}

// 根据id获取单个员工信息
exports.getStaffById = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let id = req.params.id
    sql = `select * from staff where sno=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if(data[0] == null) return res.sd('查询员工信息失败！')
    result = {
        status: 0,
        msg: '查询员工信息成功！',
        data: data[0]
    }
    res.send(result)
}


//新增员工信息
exports.addStaffs = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let staffobj = req.body
    staffobj.saccount = sr({ length: 5, security: true })
    staffobj.spwd = sr({ length: 5, security: true })
    sql = `insert into staff set ?`
    try {
        let [rows] = await db.query(sql, [staffobj])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('新增员工信息失败！')
    result = {
        status: 0,
        msg: '新增员工信息成功！',
        insertId: data.insertId,
        data: staffobj
    }
    res.send(result)
}



// 修改员工信息
exports.editStaffById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let staffobj = req.body
    let data = {}
    sql = `update staff set ? where sno=?`
    try {
        const [rows] = await db.query(sql, [staffobj, id])
        data = rows
        console.log(rows);
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('修改员工信息失败！')
    result = {
        status: 0,
        msg: '修改员工信息成功！',
        data: staffobj
    }
    res.send(result)
}

//根据id删除员工信息
exports.deleteStaffById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let data = {}
    sql = `delete from staff where sno=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('删除员工信息失败！')
    result = {
        status: 0,
        msg: '删除员工信息成功！',
        data: null
    }
    res.send(result)
}