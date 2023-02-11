<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>操作管理</el-breadcrumb-item>
      <el-breadcrumb-item>操作列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入操作名称查询" clearable @clear="getHandlingList" @keyup.enter.native="getHandlingList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getHandlingList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="handlinglist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="操作类型" prop="handlingtype" sortable></el-table-column>
        <el-table-column label="客户名" prop="cname" sortable></el-table-column>
        <el-table-column label="房间号" prop="rnumber" sortable></el-table-column>
        <el-table-column label="处理人" prop="sname" sortable></el-table-column>
        <el-table-column label="操作时间" prop="handlingtime" :formatter="dateFormate" sortable></el-table-column>
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
        pagesize: 5
      },
      handlinglist: [],
      total: 0,
      handlingtypelist: []
    }
  },
  created () {
    this.getHandlingList()
  },
  methods: {
    async getHandlingList () {
      const { data: res } = await this.$http.get('/v1/handlings', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取操作列表失败！')
      this.handlinglist = res.data
      this.total = res.total
    },
    dateFormate (row, index) {
      const zoneDate = new Date(row.handlingtime).toJSON()
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
      this.getHandlingList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getHandlingList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
