<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房间管理</el-breadcrumb-item>
      <el-breadcrumb-item>房间类型</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" size="default" plain @click="addDialogVisible = true">添加类型</el-button>
        </el-col>
      </el-row>
      <el-table :data="roomtypelist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="类型" prop="rtype"></el-table-column>
        <el-table-column label="价格" sortable prop="rprice"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" plain icon="el-icon-edit"
              @click="showEditDialog(scope.row.rid)"></el-button>
            <el-button type="danger" size="mini" plain icon="el-icon-delete"
              @click="removeRoomById(scope.row.rid)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- dialog 添加 -->
    <el-dialog title="添加房间类型" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="类型" prop="rtype">
          <el-input v-model="addForm.rtype"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="rprice">
          <el-input v-model="addForm.rprice"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoomtype">确 定</el-button>
      </span>
    </el-dialog>

    <!-- dialog 修改 -->
    <el-dialog title="修改房间类型" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="类型" prop="rtype">
          <el-input v-model="editForm.rtype"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="rprice">
          <el-input v-model="editForm.rprice"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoom">确 定</el-button>
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
      cb(new Error('请输入合法的类型名称'))
    }
    const checkSalary = (rule, value, cb) => {
      const regName = /^\+?[1-9]\d*$/
      if (regName.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的价格额'))
    }
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 类型数据
      roomtypelist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      delPopoverVisible: false,
      addForm: {
        rtype: '',
        rprice: null
      },
      // 查询到的房间类型信息数据
      editForm: {},
      // 添加房间类型的表单验证规则
      addFormRules: {
        rtype: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        rprice: [
          { required: true, message: '请输入类型价格', trigger: 'blur' },
          { validator: checkSalary, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoomtypeList()
  },
  methods: {
    async getRoomtypeList () {
      const { data: res } = await this.$http.get('/v1/roomtypes', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取房间类型列表失败！')
      this.roomtypelist = res.data
      this.total = res.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getRoomtypeList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getRoomtypeList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$nextTick(() => {
        this.$refs.editFormRef.resetFields()
      })
    },
    addRoomtype () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.post('/v1/roomtypes', this.addForm)
        if (res.status !== 0) return this.$message.error('添加房间类型失败！')
        this.$message.success('添加房间类型成功！')
        this.addDialogVisible = false
        this.getRoomtypeList()
      })
    },
    editRoom () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.put('/v1/roomtypes/' + this.editForm.rid, this.editForm)
        if (res.status !== 0) return this.$message.error('修改房间类型信息失败！')
        this.$message.success('修改房间类型信息成功！')
        this.editDialogVisible = false
        this.getRoomtypeList()
      })
    },
    async removeRoomById (id) {
      const confirmRs = await this.$confirm('此操作将永久删除该房间类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/v1/roomtypes/' + id)
      if (res.status !== 0) return this.$message.error('删除房间类型失败！')
      this.$message.success('删除房间类型成功！')
      this.getRoomtypeList()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/v1/roomtypes/' + id)
      if (res.status !== 0) return this.$message.error('获取房间类型信息失败！')
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
