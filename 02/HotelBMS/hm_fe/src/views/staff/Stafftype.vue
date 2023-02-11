<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工级别</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" size="default" plain @click="addDialogVisible = true">添加级别</el-button>
        </el-col>
      </el-row>
      <el-table :data="stafftypelist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="级别" prop="typename"></el-table-column>
        <el-table-column label="薪资" sortable prop="salary"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" plain icon="el-icon-edit"
              @click="showEditDialog(scope.row.stno)"></el-button>
            <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="removeStaffById(scope.row.stno)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- dialog 添加 -->
    <el-dialog title="添加员工级别" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="级别" prop="typename">
          <el-input v-model="addForm.typename"></el-input>
        </el-form-item>
        <el-form-item label="薪资" prop="salary">
          <el-input v-model="addForm.salary"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStafftype">确 定</el-button>
      </span>
    </el-dialog>

    <!-- dialog 修改 -->
    <el-dialog title="修改员工级别" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="级别" prop="typename">
          <el-input v-model="editForm.typename"></el-input>
        </el-form-item>
        <el-form-item label="薪资" prop="salary">
          <el-input v-model="editForm.salary"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStaff">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const checkName = (rule, value, cb) => {
      const regName = /^(?:[\u4e00-\u9fa5·]{2,16})$/
      if (regName.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的级别名称'))
    }
    const checkSalary = (rule, value, cb) => {
      const regName = /^\+?[1-9]\d*$/
      if (regName.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的薪资额'))
    }
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 级别数据
      stafftypelist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      delPopoverVisible: false,
      addForm: {
        typename: '',
        salary: null
      },
      // 查询到的员工级别信息数据
      editForm: {},
      // 添加员工级别的表单验证规则
      addFormRules: {
        typename: [
          { required: true, message: '请输入级别名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        salary: [
          { required: true, message: '请输入级别薪资', trigger: 'blur' },
          { validator: checkSalary, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getStafftypeList()
  },
  methods: {
    async getStafftypeList () {
      const { data: res } = await this.$http.get('/v1/stafftypes', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取员工级别列表失败！')
      this.stafftypelist = res.data
      this.total = res.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getStafftypeList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getStafftypeList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$nextTick(() => {
        this.$refs.editFormRef.resetFields()
      })
    },
    addStafftype () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.post('/v1/stafftypes', this.addForm)
        if (res.status !== 0) return this.$message.error('添加员工级别失败！')
        this.$message.success('添加员工级别成功！')
        console.log('yes')
        this.addDialogVisible = false
        this.getStafftypeList()
      })
    },
    editStaff () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.put('/v1/stafftypes/' + this.editForm.stno, this.editForm)
        if (res.status !== 0) return this.$message.error('修改员工级别信息失败！')
        this.$message.success('修改员工级别信息成功！')
        this.editDialogVisible = false
        this.getStafftypeList()
      })
    },
    async removeStaffById (id) {
      const confirmRs = await this.$confirm('此操作将永久删除该员工级别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/v1/stafftypes/' + id)
      if (res.status !== 0) return this.$message.error('删除员工级别失败！')
      this.$message.success('删除员工级别成功！')
      this.getStafftypeList()
    },
    async showEditDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get('/v1/stafftypes/' + id)
      if (res.status !== 0) return this.$message.error('获取员工级别信息失败！')
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
