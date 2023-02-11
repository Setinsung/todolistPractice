<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title">
        酒店管理系统
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="loginForm.admin">
            <el-radio :label="0">员工</el-radio>
            <el-radio :label="1">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'xiaowang',
        password: '1234',
        admin: 0
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return ''
        const { data: res } = await this.$http.post('api/login', this.loginForm)
        if (res.status !== 0) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        window.sessionStorage.setItem('token', res.token)
        this.$router.push({ path: '/home' })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #000;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 350px;
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .title {
    font-size: 30px;
    font-weight: 700;
    margin: 25px 0 15px 0;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
