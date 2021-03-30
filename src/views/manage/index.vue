<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <div class="avatar" >
        <a-avatar icon="user">
        </a-avatar>
        
      </div>
      <div class="info">
        <p style="color:white;">用户名：{{username}}</p >
        <p style="color:white;margin-top:-55px">管理员编号：{{userid}}</p>
        </div>
      <div class="logo">游迹后台管理系统</div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :default-selected-keys="['1']"
          :default-open-keys="['sub2']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="1">
              首页
            </a-menu-item>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="laptop" />游记审核</span>
            <a-menu-item key="5">
              待审核
            </a-menu-item>
            <a-menu-item key="6">
              审核通过
            </a-menu-item>
            <a-menu-item key="7">
              审核不通过
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="notification" />信息推送</span>
            <a-menu-item key="9">
              option9
            </a-menu-item>
            <a-menu-item key="10">
              option10
            </a-menu-item>
            <a-menu-item key="11">
              option11
            </a-menu-item>
            <a-menu-item key="12">
              option12
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px;min-height:600px">
        <router-view style="min-height:600px"></router-view>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      username:"Mary",
      userid:100,
      collapsed: false,
    };
  },
};
</script>

<style>
.logo {
  font-size:20px;
  color:white;
  width: 320px;
  line-height: 30px;
  height: 31px;
  margin: 16px 28px 16px 0;
  float: right;
  display:inline-block;
  /* border: white solid 1px; */
}
.avatar{
  float: left;
 display:inline-block;
  /* border: red solid 1px; */
  width:50px
}
.info{
  font-size:12px;
  width:300px;
  height:60px;
  float: left;
  text-align:left;
  margin-top:-10px;
  margin: left 20px;
}
</style>
