const db = require('@/db/index')

exports.getReserves = async (req, res) => {
    let result = {}
    let pagenum = parseInt(req.query.pagenum) || 1
    let pagesize = parseInt(req.query.pagesize) || 2
    let history = parseInt(req.query.history)
    if(isNaN(history))
    history = 0
    let query = req.query.query
    if(!query) query = ''
    let sql_toshow = ''
    let sql_count = ''
    let total = 0
    let data = {}
    sql_toshow = `call sel_q1_v_page_housing('reserve_info_v', 'name', ?, 1, 1, ?, ?, ?)` 
    if(history === 1)
        sql_count = `select count(*) as count from reserve_info_v`
    else
        sql_count = `select count(*) as count from reserve_info_v where ishistory = 0`

    try {
        let [rows] = await db.execute(sql_toshow, [query,history,pagenum,pagesize])
        let [totalpage] = await db.execute(sql_count)
        data = rows
        total = totalpage[0].count
    } catch (err) {
        res.sd(err)
    }
    result = {
        status: 0,
        msg: '查询预定记录数据成功！',
        total,
        data: data[0]
    }
    res.send(result)
}


exports.reservesToHistory = async (req, res) => {
    let id = req.body.id
    let s_id = req.user.id
    let sql = `update reserve set ishistory = 1, s_id = ? where r_no = ?`
    try {
        const [rows] = await db.execute(sql, [s_id, id])
        if (rows.affectedRows !== 1) return res.sd('转为入住操作失败！')
        res.send({
            status: 0,
            msg: '转为入住操作成功！',
            id 
        })
    } catch (err) {
        res.sd(err)
    }
}

exports.deleteReserveById = async (req, res) => {
    let id = req.params.id
    let sql = `delete from reserve where r_no=?`
    try {
        const [rows] = await db.execute(sql,[id])
        if (rows.affectedRows !== 1) return res.sd('删除预定记录失败！')
        res.send({
            status: 0,
            msg: '删除预定记录成功！',
            data: null
        })
    } catch (err) {
        res.sd(err)
    }
}