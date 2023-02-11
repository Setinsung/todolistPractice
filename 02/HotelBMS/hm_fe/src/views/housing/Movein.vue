<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>住房管理</el-breadcrumb-item>
      <el-breadcrumb-item>入住列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入入住名称查询" clearable @clear="getMoveinList" @keyup.enter.native="getMoveinList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getMoveinList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
        <el-button type="primary" size="default" plain @click="toggleHistory">{{queryInfo.history?'查看当前':'查看全部'}}</el-button>
        </el-col>
      </el-row>
      <el-table :data="moveinlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="name" sortable></el-table-column>
        <el-table-column label="房间号" prop="rnumber"></el-table-column>
        <el-table-column label="入住时间" prop="moveintime" :formatter="dateinFormate"></el-table-column>
        <el-table-column label="预计退房" prop="moveouttime" :formatter="dateoutFormate"></el-table-column>
        <el-table-column label="是否当前" prop="ishistory">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ishistory" :active-value="0" :inactive-value="1" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
          <el-button type="danger" size="small" icon="el-icon-circle-close" plain @click="moveinToMoveout(scope.row.id)" :disabled="!!scope.row.ishistory">退房</el-button>
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
      moveinlist: [],
      total: 0,
      moveintypelist: []
    }
  },
  created () {
    this.getMoveinList()
  },
  methods: {
    async getMoveinList () {
      const { data: res } = await this.$http.get('/v1/moveins', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取入住列表失败！')
      this.moveinlist = res.data
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
      this.getMoveinList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getMoveinList()
    },
    toggleHistory () {
      this.queryInfo.history = 1 - this.queryInfo.history
      this.getMoveinList()
    },
    async moveinToMoveout (id) {
      const confirmRs = await this.$confirm('此操作将进行不可撤销的退房操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') return this.$message.info('已取消操作')
      const { data: res } = await this.$http.put('/v1/moveins', { id: id })
      if (res.status !== 0) return this.$message.error('退房操作失败！')
      this.$message.success('退房操作成功！')
      this.getMoveinList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
