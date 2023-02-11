require('module-alias/register')
const express = require('express')
const cors = require('cors');
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// 响应
app.use((req, res, next) => {
    res.sd = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})


// 解析 Token
const expressJWT = require('express-jwt')
const jwtConfig = require('./config/jwt_config')

app.use(expressJWT({ secret: jwtConfig.jwtSecretKey }).unless({ path: [/^\/api\/login/] }))


app.get('/api/', (req, res) => {
    res.send('index')
})
// 用户
const userRouter = require('./router/user/user')
app.use('/api', userRouter)

// 菜单
const menuRouter = require('./router/menu/menu')
app.use('/v1', menuRouter)
// 员工
const staffRouter = require('./router/staff/staff')
app.use('/v1', staffRouter)
// 员工类型
const stafftypeRouter = require('./router/staff/stafftype')
app.use('/v1', stafftypeRouter)

// 房间
const roomRouter = require('./router/room/room')
app.use('/v1', roomRouter)
// 房间类型
const roomtypeRouter = require('./router/room/roomtype')
app.use('/v1', roomtypeRouter)

// 客户
const customerRouter = require('./router/customer/customer')
app.use('/v1', customerRouter)
// 客户类型
const customertypeRouter = require('./router/customer/customertype')
app.use('/v1', customertypeRouter)

//入住管理
const moveinRouter = require('./router/housing/movein')
app.use('/v1', moveinRouter)
//预定管理
const reserveRouter = require('./router/housing/reserve')
app.use('/v1', reserveRouter)
//退房管理
const moveoutRouter = require('./router/housing/moveout')
app.use('/v1', moveoutRouter)
//住房管理
const housingRouter = require('./router/housing/housing')
app.use('/v1', housingRouter)

//操作管理
const handlingRouter = require('./router/handling/handling')
app.use('/v1', handlingRouter)

//账单管理
const billRouter = require('./router/bill/bill')
app.use('/v1', billRouter)


// 错误
app.use((err, req, res, next) => {
    // 身份认证失败
    if (err.name === 'UnauthorizedError') return res.sd('身份认证失败！')
    res.sd(err)
})


app.listen(80, () => {
    console.log('api server running at http://127.0.0.1')
})
