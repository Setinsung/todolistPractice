<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账单管理</el-breadcrumb-item>
      <el-breadcrumb-item>账单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入账单名称查询" clearable @clear="getBillList" @keyup.enter.native="getBillList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getBillList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="billlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="客户名" prop="name" sortable></el-table-column>
        <el-table-column label="房间号" prop="rnumber" sortable></el-table-column>
        <el-table-column label="总金额" prop="sum" sortable></el-table-column>
        <el-table-column label="处理时间" prop="handlingtime" :formatter="dateFormate" sortable></el-table-column>
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
      billlist: [],
      total: 0,
      billtypelist: []
    }
  },
  created () {
    this.getBillList()
  },
  methods: {
    async getBillList () {
      const { data: res } = await this.$http.get('/v1/bills', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取账单列表失败！')
      this.billlist = res.data
      this.total = res.total
    },
    dateFormate (row, index) {
      const zoneDate = new Date(row.handlingtime).toJSON()
      const date = new Date(+new Date(zoneDate) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      return date
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getBillList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getBillList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
