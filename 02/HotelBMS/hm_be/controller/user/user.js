const db = require('@/db/index')
const jwt = require('jsonwebtoken')
const jwtConfig = require('@/config/jwt_config')

exports.login = async (req, res) => {
    let result = {}
    const userinfo = req.body
    let admin = userinfo.admin
    let sql = ''
    let rspwd = ''
    let data = {}
    if (admin == 1)
        sql = `select * from manager where maccount=?`
    else if (admin == 0)
        sql = `select * from staff where saccount=?`
    try {
        [rows] = await db.execute(sql, [userinfo.username])
        data = rows
    } catch (err) {
        if (err) return res.sd(err)
    }
    if (data.length !== 1) return res.sd('登录失败！')
    rspwd = data[0]['spwd'] || data[0]['mpwd']
    if (userinfo.password !== rspwd) return res.sd('密码错误！')

    // 生成token
    let id = data[0]['sno'] || data[0]['mno']
    const user = {
        id,
        username: userinfo.username,
        admin
    }
    const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey, { expiresIn: jwtConfig.expiresIn })
    data[0].admin = admin
    result = {
        message: '登录成功！',
        status: 0,
        token: 'Bearer ' + tokenStr,
        data: {id,admin}
    }
    res.send(result)

}

exports.getUser = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let admin = req.user.admin;
    let id = req.user.id;
    sql = `call get_userinfo_p(?,?)`
    try {
        const [rows] = await db.execute(sql,[id,admin])
        data = rows
        data[0][0].admin = admin;
        result = {
            message: '获取用户信息成功！',
            status: 0,
            data: data[0][0]
        }
        res.send(result)
    } catch (err) {
        res.sd(err)
    }
}

exports.updateUser = async (req, res) => {
    let result = {}
    let sql = ''
    let data = {}
    let admin = req.user.admin;
    let id = req.user.id;
    let username = req.user.username;
    let account = req.body.account;
    let pwd = req.body.pwd;
    if(!account && !pwd) return res.sd('账号和密码不可都为空！')
    if(!account) account = ''
    if(!pwd) pwd = ''
    sql = `call updata_userinfo_p(?,?,?,?)`
    try {
        const [rows] = await db.execute(sql,[id,admin,account,pwd])
        data = rows
        if (data.affectedRows !== 1) return res.sd('修改用户信息失败！')
        
        //生成新token
        const user = {
            id,
            username,
            admin
        }
        const tokenStr = jwt.sign(user, jwtConfig.jwtSecretKey, { expiresIn: jwtConfig.expiresIn })
        result = {
            message: '修改用户信息成功！',
            status: 0,
            token: 'Bearer ' + tokenStr,
            data: null
        }
        res.send(result)
    } catch (err) {
        res.sd(err)
    }
}