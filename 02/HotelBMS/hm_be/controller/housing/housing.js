const db = require('@/db/index')
const dayjs = require('dayjs')

exports.doHousing = async (req, res) => {
    let sql = ``
    let housingobj = req.body
    let s_id = req.user.id;
    if(housingobj.moveintime !== '') 
        housingobj.moveintime = dayjs(housingobj.moveintime).format('YYYY-MM-DD')+ ' 8:00:00'
    housingobj.moveouttime = dayjs(housingobj.moveouttime).format('YYYY-MM-DD')+ ' 12:00:00'
    sql = `call housing_p(${housingobj.cid},${housingobj.housingtype},${housingobj.rtypeid},'${housingobj.moveintime}','${housingobj.moveouttime}',${s_id})`
    try {
        let [rows] = await db.query(sql)
        res.send({
            status: 0,
            msg: housingobj.housingtype == '0'? '入住房间成功！':'预定房间成功！',
            data: rows[0][0]
        })
    } catch (err) {
        res.sd(err)
    }
}