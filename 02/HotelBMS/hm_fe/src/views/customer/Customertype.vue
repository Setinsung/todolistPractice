<template>
    <div>
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>客户类型</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- card卡片视图 -->
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" size="default" plain @click="addDialogVisible = true">添加类型</el-button>
          </el-col>
        </el-row>
        <el-table :data="customertypelist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="VIP类型" prop="vip"></el-table-column>
          <el-table-column label="折扣" sortable prop="discount" :formatter="discountFormate"></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" plain icon="el-icon-edit"
                @click="showEditDialog(scope.row.vid)"></el-button>
              <el-button type="danger" size="mini" plain icon="el-icon-delete"
                @click="removeCustomerById(scope.row.vid)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-card>

      <!-- dialog 添加 -->
      <el-dialog title="添加客户类型" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="VIP类型" prop="vip">
            <el-input v-model="addForm.vip"></el-input>
          </el-form-item>
          <el-form-item label="折扣" prop="discount">
            <el-input v-model="addForm.discount"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCustomertype">确 定</el-button>
        </span>
      </el-dialog>

      <!-- dialog 修改 -->
      <el-dialog title="修改客户类型" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="VIP类型" prop="vip">
            <el-input v-model="editForm.vip"></el-input>
          </el-form-item>
          <el-form-item label="折扣" prop="discount">
            <el-input v-model="editForm.discount"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCustomer">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>

<script>
export default {
  data () {
    const checkDiscount = (rule, value, cb) => {
      const regName = /^\+?[1-9]\d*$/
      if (regName.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的折扣额'))
    }
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 类型数据
      customertypelist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      delPopoverVisible: false,
      addForm: {
        vip: '',
        discount: null
      },
      // 查询到的客户类型信息数据
      editForm: {},
      // 添加客户类型的表单验证规则
      addFormRules: {
        vip: [
          { required: true, message: '请输入VIP类型名称', trigger: 'blur' },
          { min: 1, max: 10, message: 'VIP类型长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '请输入折扣(%)', trigger: 'blur' },
          { validator: checkDiscount, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCustomertypeList()
  },
  methods: {
    async getCustomertypeList () {
      const { data: res } = await this.$http.get('/v1/customertypes', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取客户类型列表失败！')
      this.customertypelist = res.data
      this.total = res.total
    },
    // 格式化折扣
    discountFormate (row, index) {
      if (row.discount === '100') { return '无' }
      return row.discount + '%'
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getCustomertypeList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCustomertypeList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$nextTick(() => {
        this.$refs.editFormRef.resetFields()
      })
    },
    addCustomertype () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.post('/v1/customertypes', this.addForm)
        if (res.status !== 0) return this.$message.error('添加客户类型失败！')
        this.$message.success('添加客户类型成功！')
        this.addDialogVisible = false
        this.getCustomertypeList()
      })
    },
    editCustomer () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.put('/v1/customertypes/' + this.editForm.vid, this.editForm)
        if (res.status !== 0) return this.$message.error('修改客户类型信息失败！')
        this.$message.success('修改客户类型信息成功！')
        this.editDialogVisible = false
        this.getCustomertypeList()
      })
    },
    async removeCustomerById (id) {
      const confirmRs = await this.$confirm('此操作将永久删除该客户类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/v1/customertypes/' + id)
      if (res.status !== 0) return this.$message.error('删除客户类型失败！')
      this.$message.success('删除客户类型成功！')
      this.getCustomertypeList()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/v1/customertypes/' + id)
      if (res.status !== 0) return this.$message.error('获取客户类型信息失败！')
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.editForm = res.data
      })
    }
  }
}
</script>

  <style lang="less" scoped>

  </style>
