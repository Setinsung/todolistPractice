<template>
  <div>
    <!-- card卡片视图 -->
    <el-card class="box-card">
      <el-descriptions class="margin-top" title="用户信息" :column="2" size="big" border>
        <template slot="extra">
          <el-button type="primary" size="small" @click="showEditDialog">修改</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{userinfo.name}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-warning-outline"></i>
            权限类型
          </template>
          {{userinfo.admin ? '管理员': '用户'}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-notebook-1"></i>
            账号
          </template>
          {{userinfo.account}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-lock"></i>
            密码
          </template>
          {{userinfo.pwd}}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="editForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="editForm.pwd"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editDialogVisible: false,
      userinfo: {},
      resetFlag: true,
      editForm: {
        account: '',
        pwd: ''
      },
      editFormRules: {
        account: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserinfo()
  },
  methods: {
    // 获取用户信息
    async getUserinfo () {
      const { data: res } = await this.$http.get('api/user')
      if (res.status !== 0) return this.$message.error('获取用户信息失败！')
      this.userinfo = res.data
      this.editForm.account = this.userinfo.account
      this.editForm.pwd = this.userinfo.pwd
    },
    async showEditDialog () {
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.editForm.account = this.userinfo.account
        this.editForm.pwd = this.userinfo.pwd
      })
    },
    editDialogClosed () {
      this.$nextTick(() => {
        this.editForm = {
          account: '',
          pwd: ''
        }
      })
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.put('/api/user', this.editForm)
        if (res.status !== 0) return this.$message.error('修改员工信息失败！')
        this.$message.success('修改员工信息成功！')
        this.editDialogVisible = false
        window.sessionStorage.setItem('token', res.token)
        this.getUserinfo()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
