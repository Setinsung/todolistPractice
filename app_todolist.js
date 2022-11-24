// 1. 使用Express开发一个HTTP服务器，实现5个API：获取todo列表、获取单个todo详情、新增单个todo、删除单个todo、更新单个todo
const express = require('express')
const fs = require('fs')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '654321',
  database: 'tododb'
})

connection.connect(err => {
  if (err) {
    console.error('failed to connect to database, error: ', err)
    process.exit(1)
  }
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('./pages'))

// 获取todo列表
app.get('/todos', function (req, res) {
  const { page = 0, size = 999 } = req.query
  const sql = `select * from tb_todo limit ${page}, ${size}`
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err })
    }
    res.json(result)
  })
})

// 获取单个todo详情
app.get('/todos/:id', function (req, res) {
  const { id } = req.params
  if(!id){
    return res.status(500).json({msg: 'invalid params'})
  }
  const sql = `select * from tb_todo where id = ?`
  connection.query(sql,id,(err,result) => {
    if (err) {
      return res.status(500).json({ msg: err })
    }
    if (result.length <= 0) {
      return res.status(500).end('获取失败！')
    } else {
      res.json(result)
    }
  })
})

// 新增单个todo
app.post('/todos', function (req, res) {
  if(Object.values(req.body).filter(item => item!=='').length!==2){
    return res.status(500).json({ msg: "invalid parameters" })
  }
  const sql = `insert into tb_todo set ?`
  connection.query(sql, req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err })
    }
    res.status(200).json({ id: result.insertId })
  })
})

// 更新单个todo
app.put( '/todos/:id', function (req, res) {
  req.body = {...req.params, ...req.body}
  if(Object.values(req.body).filter(item => item!=='').length === 1){
    return res.status(500).json({ msg: "invalid parameters" })
  }
  let sql = `update tb_todo set ? where id=?`
  connection.query(sql, [req.body,req.body.id], (err, result) => {
    if (err) {
      return res.status(500).json({msg: err})
    }

    if (result.affectedRows === 0) {
      return res.status(500).end('更新失败！')
    }

    res.status(200).end('更新成功！')
  })
})

// 删除单个todo
app.delete('/todos/:id', function (req, res) {
  const { id } = req.params
  if(!id){
    return res.status(500).json({msg: 'invalid params'})
  }
  const sql = `delete from tb_todo where id = ?`
  connection.query(sql, id, (err,result) => {
    if (err) {
      res.status(500).send({msg: err})
    } else {
      res.status(200).end('删除成功！')
    }
  })
})

const server = app.listen(80, 'localhost', function () {
  const host = server.address().address
  const port = server.address().port
  console.log("Running server at http://%s:%s", host, port)
})
