const db = require('@/db/index')

exports.getMoveins = async (req, res) => {
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
    sql_toshow = `call sel_q1_v_page_housing('movein_info_v', 'name', ?, 1, 1, ?, ?, ?)` 
    if(history === 1)
        sql_count = `select count(*) as count from movein_info_v`
    else
        sql_count = `select count(*) as count from movein_info_v where ishistory = 0`

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
        msg: '查询入住记录数据成功！',
        total,
        data: data[0]
    }
    res.send(result)
}

exports.moveinsToHistory = async (req, res) => {
    let id = req.body.id
    let s_id = req.user.id
    let sql = `update movein set ishistory = 1, s_id = ? where in_no = ?`
    try {
        const [rows] = await db.execute(sql, [s_id, id])
        if (rows.affectedRows !== 1) return res.sd('退房操作失败！')
        res.send({
            status: 0,
            msg: '退房操作成功！',
            id 
        })
    } catch (err) {
        res.sd(err)
    }
}