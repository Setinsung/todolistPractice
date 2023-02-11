<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>住房管理</el-breadcrumb-item>
      <el-breadcrumb-item>预定列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入预定名称查询" clearable @clear="getReserveList" @keyup.enter.native="getReserveList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getReserveList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" plain
            @click="toggleHistory">{{ queryInfo.history ? '查看当前' : '查看全部' }}</el-button>
        </el-col>
      </el-row>
      <el-table :data="reservelist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="name" sortable></el-table-column>
        <el-table-column label="房间号" prop="rnumber"></el-table-column>
        <el-table-column label="预定时间" prop="moveintime" :formatter="dateinFormate"></el-table-column>
        <el-table-column label="预计退房" prop="moveouttime" :formatter="dateoutFormate"></el-table-column>
        <el-table-column label="是否当前" prop="ishistory">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ishistory" :active-value="0" :inactive-value="1" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column class="operation" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" plain @click="intoMovein(scope.row.id)"
              :disabled="!!scope.row.ishistory">转为入住</el-button>
              <el-button size="mini" type="danger" plain @click="dropReserve(scope.row.id)" :disabled="!!scope.row.ishistory">取消预定</el-button>
            </el-button-group>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        history: 0
      },
      reservelist: [],
      total: 0,
      reservetypelist: []
    }
  },
  created () {
    this.getReserveList()
  },
  methods: {
    async getReserveList () {
      const { data: res } = await this.$http.get('/v1/reserves', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取预定列表失败！')
      this.reservelist = res.data
      this.total = res.total
    },
    dateinFormate (row, index) {
      const zoneDate = new Date(row.moveintime).toJSON()
      const date = new Date(+new Date(zoneDate) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      return date
    },
    dateoutFormate (row, index) {
      const zoneDate = new Date(row.moveouttime).toJSON()
      const date = new Date(+new Date(zoneDate) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      return date
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getReserveList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getReserveList()
    },
    toggleHistory () {
      this.queryInfo.history = 1 - this.queryInfo.history
      this.getReserveList()
    },
    async intoMovein (id) {
      const { data: res } = await this.$http.put('/v1/reserves', { id: id })
      if (res.status !== 0) return this.$message.error('转为入住操作失败！')
      this.$message.success('转为入住操作成功！')
      this.getReserveList()
    },
    async dropReserve (id) {
      const confirmRs = await this.$confirm('此操作将永久删除该预定记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') return this.$message.info('已取消操作')
      const { data: res } = await this.$http.delete('/v1/reserves/' + id)
      if (res.status !== 0) return this.$message.error('删除预定记录失败！')
      this.$message.success('删除预定记录成功！')
      this.getReserveList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
