<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房间管理</el-breadcrumb-item>
      <el-breadcrumb-item>房间列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入房间类型查询" clearable @clear="getRoomList" @keyup.enter.native="getRoomList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getRoomList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" plain @click="addDialogVisible = true">添加房间</el-button>
        </el-col>
      </el-row>
      <el-table :data="roomlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="房间号" prop="rnumber" sortable></el-table-column>
        <el-table-column label="房间电话" prop="rphone"></el-table-column>
        <el-table-column label="类型" prop="rtype"></el-table-column>
        <el-table-column label="价格" prop="rprice" sortable></el-table-column>
        <el-table-column label="使用状态" prop="used" sortable>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.used" :active-value="1" :inactive-value="0" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" plain icon="el-icon-edit"
              @click="showEditDialog(scope.row.rno)"></el-button>
            <el-button type="danger" size="mini" plain icon="el-icon-delete"
              @click="removeRoomById(scope.row.rno)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- dialog 添加 -->
    <el-dialog title="添加房间" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="房间号" prop="rnumber">
          <el-input v-model="addForm.rnumber"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="rphone">
          <el-input v-model="addForm.rphone"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="rtypeid">
          <el-select v-model="addForm.rtypeid" placeholder="请选择房间类型">
            <el-option v-for="item in roomtypelist" :key="item.rid" :label="item.rtype" :value="item.rid"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoom">确 定</el-button>
      </span>
    </el-dialog>

    <!-- dialog 修改 -->
    <el-dialog title="修改房间" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="房间号" prop="rnumber">
          <el-input v-model="editForm.rnumber"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="rphone">
          <el-input v-model="editForm.rphone"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="rtypeid">
          <el-select v-model="editForm.rtypeid" placeholder="请选择房间类型">
            <el-option v-for="item in roomtypelist" :key="item.rid" :label="item.rtype" :value="item.rid"></el-option>
          </el-select>
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
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      roomlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      delPopoverVisible: false,
      roomtypelist: [],
      addForm: {
        rnumber: null,
        rphone: null,
        rtypeid: null
      },
      editForm: {},
      addFormRules: {
        rnumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' },
          { min: 2, max: 5, message: '房间号长度在 2 到 5 个', trigger: 'blur' }
        ],
        rphone: [
          { required: true, message: '请输入房间电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        rtypeid: [
          { required: true, message: '请选择房间类型', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoomList()
    this.getRoomtypeList()
  },
  methods: {
    async getRoomList () {
      const { data: res } = await this.$http.get('/v1/rooms', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取房间列表失败！')
      this.roomlist = res.data
      this.total = res.total
    },
    async getRoomtypeList () {
      const { data: res } = await this.$http.get('/v1/roomtypes')
      if (res.status !== 0) return this.$message.error('获取房间类型列表失败！')
      this.roomtypelist = res.data
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getRoomList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getRoomList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$nextTick(() => {
        this.$refs.editFormRef.resetFields()
      })
    },
    addRoom () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.post('/v1/rooms', this.addForm)
        if (res.status !== 0) return this.$message.error('添加房间失败！')
        this.$message.success('添加房间成功！')
        this.addDialogVisible = false
        this.getRoomList()
      })
    },
    editRoom () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.put('/v1/rooms/' + this.editForm.rno, this.editForm)
        if (res.status !== 0) return this.$message.error('修改房间信息失败！')
        this.$message.success('修改房间信息成功！')
        this.editDialogVisible = false
        this.getRoomList()
      })
    },
    async removeRoomById (id) {
      const confirmRs = await this.$confirm('此操作将永久删除该房间, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/v1/rooms/' + id)
      if (res.status !== 0) return this.$message.error('删除房间失败！')
      this.$message.success('删除房间成功！')
      this.getRoomList()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/v1/rooms/' + id)
      if (res.status !== 0) return this.$message.error('获取房间信息失败！')

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
