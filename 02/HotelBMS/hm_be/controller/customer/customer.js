const db = require('@/db/index')
const sr = require('simple-random')


exports.getCustomers = async (req, res) => {
    let result = {}
    let pagenum = parseInt(req.query.pagenum) || 1
    let pagesize = parseInt(req.query.pagesize) || 2
    let query = req.query.query
    if(!query) query = ''
    let sql_toshow = ''
    let sql_count = ''
    let total = 0
    let data = {}
    sql_toshow = `call sel_q1_v_page('customer_vip_v', 'cname', ?, 1, 0, ?, ?)` 
    sql_count = `select count(*) as count from customer_vip_v`
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
        msg: '查询客户数据成功！',
        total,
        data: data[0]
    }
    res.send(result)
}

exports.getCustomerById = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let id = req.params.id
    sql = `select * from customer where cid=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if(data[0] == null) return res.sd('查询客户信息失败！')
    result = {
        status: 0,
        msg: '查询客户信息成功！',
        data: data[0]
    }
    res.send(result)
}


exports.addCustomers = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let customerobj = req.body
    sql = `insert into customer set ?`
    try {
        let [rows] = await db.query(sql, [customerobj])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('新增客户信息失败！')
    result = {
        status: 0,
        msg: '新增客户信息成功！',
        insertId: data.insertId,
        data: customerobj
    }
    res.send(result)
}


exports.editCustomerById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let customerobj = req.body
    let data = {}
    sql = `update customer set ? where cid=?`
    try {
        const [rows] = await db.query(sql, [customerobj, id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('修改客户信息失败！')
    result = {
        status: 0,
        msg: '修改客户信息成功！',
        data: customerobj
    }
    res.send(result)
}

exports.deleteCustomerById = async (req, res) => {
    let result = {}
    let sql = ''
    let id = req.params.id
    let data = {}
    sql = `delete from customer where cid=?`
    try {
        const [rows] = await db.execute(sql,[id])
        data = rows
    } catch (err) {
        res.sd(err)
    }
    if (data.affectedRows !== 1) return res.sd('删除客户信息失败！')
    result = {
        status: 0,
        msg: '删除客户信息成功！',
        data: null
    }
    res.send(result)
}