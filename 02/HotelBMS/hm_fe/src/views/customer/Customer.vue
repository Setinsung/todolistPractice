<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入客户名称查询" clearable @clear="getCustomerList" @keyup.enter.native="getCustomerList"
            v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getCustomerList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" plain @click="addDialogVisible = true">客户录入</el-button>
        </el-col>
      </el-row>
      <el-table :data="customerlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="cname" sortable></el-table-column>
        <el-table-column label="身份证号" prop="identity"></el-table-column>
        <el-table-column label="性别" prop="csex" :formatter="sexFormate" sortable></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="会员类型" prop="vip"></el-table-column>
        <el-table-column label="折扣" prop="discount" sortable :formatter="discountFormate"></el-table-column>
        <el-table-column label="住房状态" sortable prop="checkin">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.checkin" :active-value="1" :inactive-value="0" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" plain icon="el-icon-edit"
              @click="showEditDialog(scope.row.cid)"></el-button>
            <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="removeCustomerById(scope.row.cid)"
              :disabled="!!scope.row.checkin"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="住房" width="170px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="small" type="primary" plain round icon="el-icon-s-home" :disabled="!!scope.row.checkin"
                @click="housing(scope.row, 0)">入住</el-button>
              <el-button size="small" type="primary" plain round :disabled="!!scope.row.checkin"
                @click="housing(scope.row, 1)">预定<i class="el-icon-house el-icon--right"></i></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- dialog 添加 -->
    <el-dialog title="添加客户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="姓名" prop="cname">
          <el-input v-model="addForm.cname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="csex">
          <el-radio-group v-model="addForm.csex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="identity">
          <el-input v-model="addForm.identity"></el-input>
        </el-form-item>
        <el-form-item label="会员类型" prop="vid">
          <el-select v-model="addForm.vid" placeholder="请选择客户会员类型">
            <el-option v-for="item in customertypelist" :key="item.vid" :label="item.vip" :value="item.vid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- dialog 修改 -->
    <el-dialog title="修改客户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="姓名" prop="cname">
          <el-input v-model="editForm.cname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="csex">
          <el-radio-group v-model="editForm.csex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="identity">
          <el-input v-model="editForm.identity"></el-input>
        </el-form-item>
        <el-form-item label="会员类型" prop="vid">
          <el-select v-model="editForm.vid" placeholder="请选择客户会员类型">
            <el-option v-for="item in customertypelist" :key="item.vid" :label="item.vip" :value="item.vid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- dialog 入住和预定 -->
    <el-dialog title="客户住房" :visible.sync="housingDialogVisible" width="40%" @close="housingDialogClosed">
      <el-form :model="housingForm" :rules="housingFormRules" ref="housingFormRef" label-width="100px">
        <el-form-item label="住房类型" prop="housingtype">
          <el-radio-group v-model="housingForm.housingtype">
            <el-radio :label="0">入住</el-radio>
            <el-radio :label="1">预定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房间类型" prop="rtypeid">
          <el-select v-model="housingForm.rtypeid" placeholder="请选择房间类型">
            <el-option v-for="item in roomtypelist" :key="item.rid" :label="item.rtype" :value="item.rid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="housingForm.housingtype === 1" label="入住时间" prop="moveintime">
          <el-date-picker type="date" placeholder="选择日期" v-model="housingForm.moveintime" style="max-width: 70%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="退房时间" prop="moveouttime">
          <el-date-picker type="date" placeholder="选择日期" v-model="housingForm.moveouttime" style="max-width: 70%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="housingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="housingCustomer">完 成</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    // const checkMobile = (rule, value, cb) => {
    //   const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
    //   if (regMobile.test(value)) {
    //     return cb()
    //   }
    //   cb(new Error('请输入合法的手机号'))
    // }
    // const checkName = (rule, value, cb) => {
    //   const regName = /^(?:[\u4e00-\u9fa5·]{2,16})$/
    //   if (regName.test(value)) {
    //     return cb()
    //   }
    //   cb(new Error('请输入合法的姓名'))
    // }
    // const checkIdentity = (rule, value, cb) => {
    //   const regIdentity = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    //   if (regIdentity.test(value)) {
    //     return cb()
    //   }
    //   cb(new Error('请输入合法的身份证号'))
    // }
    // const checkEmail = (rule, value, cb) => {
    //   const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //   if (regEmail.test(value)) {
    //     return cb()
    //   }
    //   cb(new Error('请输入合法的邮箱'))
    // }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      customerlist: [],
      roomtypelist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      delPopoverVisible: false,
      housingDialogVisible: false,
      customertypelist: [],
      addForm: {
        cname: '',
        identity: '',
        csex: 0,
        vid: null,
        phone: '',
        email: ''
      },
      housingForm: {
        cid: null,
        housingtype: 0,
        rtypeid: null,
        moveintime: '',
        moveouttime: ''
      },
      editForm: {},
      addFormRules: {
        cname: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
          // { validator: checkName, trigger: 'blur' }
        ],
        identity: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
          // { validator: checkIdentity, trigger: 'blur' }
        ],
        csex: [
          { required: true, message: '请选择客户性别', trigger: 'blur' }
        ],
        vid: [
          { required: true, message: '请选择客户会员类型', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入客户电话', trigger: 'blur' }
          // { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入客户邮箱', trigger: 'blur' }
          // { validator: checkEmail, trigger: 'blur' }
        ]
      },
      housingFormRules: {
        housingtype: [
          { required: true, message: '请选择住房类型', trigger: 'blur' }
        ],
        rtypeid: [
          { required: true, message: '请选择房间类型', trigger: 'blur' }
        ],
        moveintime: [
          { required: true, message: '请选择入住时间', trigger: 'blur' }
        ],
        moveouttime: [
          { required: true, message: '请选择退房时间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCustomerList()
    this.getCustomertypeList()
    this.getRoomtypeList()
  },
  watch: {
    'housingForm.housingtype' (newVal, oldVal) {
      if (newVal === 0) {
        this.housingForm.moveintime = ''
      }
    }

  },
  methods: {
    async getCustomerList () {
      const { data: res } = await this.$http.get('/v1/customers', { params: this.queryInfo })
      if (res.status !== 0) return this.$message.error('获取客户列表失败！')
      this.customerlist = res.data
      this.total = res.total
    },
    async getCustomertypeList () {
      const { data: res } = await this.$http.get('/v1/customertypes')
      if (res.status !== 0) return this.$message.error('获取客户类型列表失败！')
      this.customertypelist = res.data
    },
    async getRoomtypeList () {
      const { data: res } = await this.$http.get('/v1/roomtypes')
      if (res.status !== 0) return this.$message.error('获取房间类型列表失败！')
      this.roomtypelist = res.data
    },
    // 根据0和1显示格式化为男女
    sexFormate (row, index) {
      if (row.csex === 0) {
        return '男'
      } else if (row.csex === 1) {
        return '女'
      }
    },
    // 格式化折扣
    discountFormate (row, index) {
      if (row.discount === '100') { return '无' }
      return row.discount + '%'
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getCustomerList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCustomerList()
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$nextTick(() => {
        this.$refs.editFormRef.resetFields()
      })
    },
    housingDialogClosed () {
      this.$nextTick(() => {
        this.$refs.housingFormRef.resetFields()
      })
    },
    addCustomer () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.post('/v1/customers', this.addForm)
        if (res.status !== 0) return this.$message.error('添加客户失败！')
        this.$message.success('添加客户成功！')
        this.addDialogVisible = false
        this.getCustomerList()
      })
    },
    editCustomer () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.put('/v1/customers/' + this.editForm.cid, this.editForm)
        if (res.status !== 0) return this.$message.error('修改客户信息失败！')
        this.$message.success('修改客户信息成功！')
        this.editDialogVisible = false
        this.getCustomerList()
      })
    },
    // 入住和预定-确定
    housingCustomer () {
      this.$refs.housingFormRef.validate(async valid => {
        if (!valid) return ''
        // console.log(this.housingForm)
        const { data: res } = await this.$http.post('/v1/housing', this.housingForm)
        // if (res.status !== 0) return this.$message.error('添加客户失败！')
        if (res.status !== 0) return this.$message.error('此类型房间无空房或不存在！')
        this.$message.success(res.msg + '房间号是' + res.data.rnumber + '!')
        this.housingDialogVisible = false
        this.getCustomerList()
      })
    },
    // 入住和预定
    housing (customerobj, cmd) {
      if (cmd === 1) {
        this.housingForm.housingtype = 1
      } else if (cmd === 0) {
        this.housingForm.housingtype = 0
      }
      this.housingForm.cid = customerobj.cid
      this.housingDialogVisible = true
    },

    async removeCustomerById (id) {
      const confirmRs = await this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRs !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/v1/customers/' + id)
      if (res.status !== 0) return this.$message.error('删除客户失败！')
      this.$message.success('删除客户成功！')
      this.getCustomerList()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/v1/customers/' + id)
      if (res.status !== 0) return this.$message.error('获取客户信息失败！')

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
