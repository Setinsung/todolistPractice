<template>
  <el-container class="home-container">
    <el-header>
      <div class="logobox">
        <div class="logo">
          <img src="../assets/img/logo.png" alt="" />
        </div>
        <span>酒店后台管理系统</span>
      </div>
      <div class="userbox">
        <el-tag v-if="(this.userinfo.admin === 0)" type="info" class="usertag">员工:&nbsp;{{userinfo.name}}</el-tag>
        <el-tag v-if="(this.userinfo.admin === 1)" type="warning" class="usertag">管理员:&nbsp;{{userinfo.name}}</el-tag>
        <el-dropdown @command="userCommand">
          <i class="el-icon-setting"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-postcard" command="1">账户</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" command="2">退出</el-dropdown-item>
            <el-dropdown-item>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse"><i
            :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i></div>
        <el-menu background-color="#003588" text-color="#fff" active-text-color="#66ccff" unique-opened
          :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" :disabled="verifyAdmin(item)">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" :disabled="verifyAdmin(subitem)"
              @click="saveNavState('/' + subitem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      menulist: [],
      userinfo: {},
      iconsObj: {
      },
      isCollapse: false,
      activePath: '',
      icons: {
        200: 'el-icon-s-custom',
        300: 'el-icon-s-help',
        400: 'el-icon-s-home',
        500: 'el-icon-s-order',
        600: 'el-icon-s-operation',
        700: 'el-icon-s-check'
      }
    }
  },
  created () {
    this.getMenuList()
    this.getUserinfo()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  computed: {
    verifyAdmin () {
      return function (item) {
        return !!(item.pid === 1 && this.userinfo.admin !== 1)
      }
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('/v1/menus')
      if (res.status !== 0) return this.$message.error('获取菜单数据失败！')
      this.menulist = res.data
    },
    // 获取用户信息
    async getUserinfo () {
      const { data: res } = await this.$http.get('api/user')
      if (res.status !== 0) return this.$message.error('获取用户信息失败！')
      this.userinfo = res.data
    },
    // 点击按钮，切换侧边菜单的缩进展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    // 用户下拉菜单指令
    userCommand (command) {
      if (command === '1') {
        window.sessionStorage.removeItem('activePath')
        this.activePath = ''
        this.$router.push('/user')
      } else if (command === '2') {
        this.logout()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding-left: 0;
  background-color: #fff;

  .logobox {
    display: flex;
    align-items: center;

    .logo {
      display: inline-block;
      height: 53px;
      width: 220px;
    }

    span {
      margin-left: 30px;
      line-height: 60px;
      font-size: 20px;
      font-weight: 700;
    }
  }

  .userbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .usertag {
      position: relative;
      border-radius: 15px;
    }

    .el-dropdown {
      margin-left: 10px;
      height: 40px;
      width: 40px;

      i {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        font-size: 20px;
      }
    }
  }
}

.el-aside {
  background-color: #003588;
  transition: all .5s;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.toggle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px 0;
  font-size: 20px;
  background-color: #0060fa;
  color: #fff;
  cursor: pointer;
}
</style>
