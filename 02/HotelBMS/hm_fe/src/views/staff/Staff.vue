<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <!-- clearable设置可清空，@clear设置清空后再去请求一次查询全部的 -->
          <el-input placeholder="请输入姓名查询" clearable @clear="getStaffList" @keyup.enter.native="getStaffList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getStaffList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" plain @click="addDialogVisible = true">添加员工</el-button>
        </el-col>
      </el-row>
      <!-- 员工列表区域 -->
      <el-table :data="stafflist" border stripe>
        <!-- 添加一个索引列，只需要有一个type="index"即可 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="sname" sortable></el-table-column>
        <!-- :formatter根据0和1显示格式化为男女 -->
        <el-table-column label="性别" prop="ssex" :formatter="sexFormate" sortable></el-table-column>
        <el-table-column label="电话" prop="sphone"></el-table-column>
        <el-table-column label="类型" prop="typename"></el-table-column>
        <el-table-column label="薪资" prop="salary" sortable></el-table-column>
        <el-table-column label="账号" prop="saccount"></el-table-column>
        <el-table-column label="密码" prop="spwd"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="warning" size="mini" plain icon="el-icon-edit"
              @click="showEditDialog(scope.row.sno)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" size="mini" plain icon="el-icon-delete"
              @click="removeStaffById(scope.row.sno)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <!-- 其中的layout就是要展示的数据 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- dialog 添加 -->
    <el-dialog title="添加员工" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="姓名" prop="sname">
          <el-input v-model="addForm.sname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="ssex">
          <el-radio-group v-model="addForm.ssex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="sphone">
          <el-input v-model="addForm.sphone"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="stype">
          <el-select v-model="addForm.stype" placeholder="请选择员工类型">
            <el-option v-for="item in stafftypelist" :key="item.stno" :label="item.typename" :value="item.stno"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStaff">确 定</el-button>
      </span>
    </el-dialog>

    <!-- dialog 修改 -->
    <!-- 虽然修改后每次还是会发起请求重置，此处仍搞一个关闭后重置是为了重置表单验证的字样 -->
    <el-dialog title="修改员工" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="姓名" prop="sname">
          <el-input v-model="editForm.sname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="ssex">
          <el-radio-group v-model="editForm.ssex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="sphone">
          <el-input v-model="editForm.sphone"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="stype">
          <el-select v-model="editForm.stype" placeholder="请选择员工类型">
            <el-option v-for="item in stafftypelist" :key="item.stno" :label="item.typename" :value="item.stno"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="saccount">
          <el-input v-model="editForm.saccount"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="spwd">
          <el-input v-model="editForm.spwd"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
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
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    const checkName = (rule, value, cb) => {
      const regName = /^(?:[\u4e00-\u9fa5·]{2,16})$/
      if (regName.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的姓名'))
    }
    return {
      // 获取员工列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      // 员工数据
      stafflist: [],
      // 总数据
      total: 0,
      // 控制添加员工的dialog是否显示
      addDialogVisible: false,
      // 控制修改员工的dialog是否显示
      editDialogVisible: false,
      // 控制删除员工的小弹出框是否显示
      delPopoverVisible: false,
      // 员工类型数据
      stafftypelist: [],
      // 添加员工的表单数据
      addForm: {
        sname: '',
        ssex: 0,
        sphone: '',
        stype: null
      },
      // 查询到的员工信息数据
      editForm: {},
      // 添加员工的表单验证规则
      addFormRules: {
        sname: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        ssex: [
          { required: true, message: '请选择员工性别', trigger: 'blur' }
        ],
        sphone: [
          { required: true, message: '请输入员工电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        stype: [
          { required: true, message: '请选择员工类型', trigger: 'blur' }
        ]
      },
      // 修改员工的表单验证规则
      editFormRules: {
        sname: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        ssex: [
          { required: true, message: '请选择员工性别', trigger: 'blur' }
        ],
        sphone: [
          { required: true, message: '请输入员工电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        stype: [
          { required: true, message: '请选择员工类型', trigger: 'blur' }
        ],
        saccount: [
          { required: true, message: '请输入员工账号', trigger: 'blur' },
          { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }

        ],
        spwd: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getStaffList()
    this.getStafftypeList()
  },
  methods: {
    async getStaffList () {
      const { data: res } = await this.$http.get('/v1/staffs', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取员工列表失败！')
      this.stafflist = res.data
      this.total = res.total
    },
    // 获取员工类型列表
    async getStafftypeList () {
      const { data: res } = await this.$http.get('/v1/stafftypes')
      if (res.status !== 0) return this.$message.error('获取员工类型列表失败！')
      this.stafftypelist = res.data
    },
    // 根据0和1显示格式化为男女
    sexFormate (row, index) {
      if (row.ssex === 0) {
        return '男'
      } else if (row.ssex === 1) {
        return '女'
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      // 更新pagesize
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      // 重新渲染
      this.getStaffList()
    },
    // 监听当前页码值改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      // 更新每页显示数据条数
      this.queryInfo.pagenum = newPage
      // 重新渲染
      this.getStaffList()
    },
    // 监听添加员工对话框的关闭事件，保证每次打开都是新的表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改员工对话框的关闭事件，保证每次打开都是新的表单（取消检验报错的提示）
    editDialogClosed () {
      this.$nextTick(() => {
        this.$refs.editFormRef.resetFields()
      })
    },
    // 点击添加员工dialog中的确定按钮，添加员工
    addStaff () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return ''
        // 发起添加员工的请求
        const { data: res } = await this.$http.post('/v1/staffs', this.addForm)
        if (res.status !== 0) return this.$message.error('添加员工失败！')
        this.$message.success('添加员工成功！')
        // 隐藏添加员工的对话框
        this.addDialogVisible = false
        // 重新渲染
        this.getStaffList()
      })
    },
    // 点击修改员工dialog中的确定按钮，修改员工
    editStaff () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return ''
        // 发起修改员工的请求
        const { data: res } = await this.$http.put('/v1/staffs/' + this.editForm.sno, this.editForm)
        if (res.status !== 0) return this.$message.error('修改员工信息失败！')
        this.$message.success('修改员工信息成功！')
        this.editDialogVisible = false
        this.getStaffList()
      })
    },
    // 根据id删除员工的信息
    async removeStaffById (id) {
      // 弹框询问用户是否删除
      const confirmRs = await this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(res) confirm / cancel
      if (confirmRs !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/v1/staffs/' + id)
      if (res.status !== 0) return this.$message.error('删除员工失败！')
      this.$message.success('删除员工成功！')
      this.getStaffList()
    },
    // 更新员工数据dialog展示
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/v1/staffs/' + id)
      if (res.status !== 0) return this.$message.error('获取员工信息失败！')
      // 这里解决一个bug：使用resetFields重置，关闭表单会出现一闪而过上次赋的值
      // 原因是对当前表单引用使用resetFields重置时，内部会去dialog刚打开时获取editForm数据源的值来作为之后重置的值。而当每次打开Dialog，其中的内容都会重新渲染，因此Form每次都会重新赋值，关闭后，就会给Form回填赋值的初始值
      // 那么解决方法就是先显示dialog后，nextTick方法到下一次DOM更新dialog后在给绑定的对象赋值
      // 这时resetFields在最开始记录的就是空的editForm，就会在dialog关闭时使表单重置为空值
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
