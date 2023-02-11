<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>住房管理</el-breadcrumb-item>
      <el-breadcrumb-item>退房列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入退房名称查询" clearable @clear="getMoveoutList" @keyup.enter.native="getMoveoutList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getMoveoutList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" plain
            @click="toggleHistory">{{ queryInfo.history ? '查看当前' : '查看全部' }}</el-button>
        </el-col>
      </el-row>
      <el-table :data="moveoutlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="name" sortable></el-table-column>
        <el-table-column label="房间号" prop="rnumber"></el-table-column>
        <el-table-column label="入住时间" prop="moveintime" :formatter="dateinFormate"></el-table-column>
        <el-table-column label="退房时间" prop="moveouttime" :formatter="dateoutFormate"></el-table-column>
        <el-table-column label="罚款比率" prop="fine" :formatter="fineFormate"></el-table-column>
        <el-table-column label="是否当前" prop="ishistory">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ishistory" :active-value="0" :inactive-value="1" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
              <el-button type="success" size="small" plain icon="el-icon-circle-check"
                @click="goToBill(scope.row.id)" :disabled="!!scope.row.ishistory">生成账单</el-button>
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
      moveoutlist: [],
      total: 0,
      moveouttypelist: []
    }
  },
  created () {
    this.getMoveoutList()
  },
  methods: {
    async getMoveoutList () {
      const { data: res } = await this.$http.get('/v1/moveouts', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取退房列表失败！')
      this.moveoutlist = res.data
      this.total = res.total
    },
    fineFormate (row, index) {
      return row.fine + '%'
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
      this.getMoveoutList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getMoveoutList()
    },
    toggleHistory () {
      this.queryInfo.history = 1 - this.queryInfo.history
      this.getMoveoutList()
    },
    async goToBill (id) {
      // console.log(id)
      const { data: res } = await this.$http.put('/v1/moveouts', { id: id })
      if (res.status !== 0) return this.$message.error('退房操作失败！')
      this.$message.success('退房操作成功！')
      this.getMoveoutList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
