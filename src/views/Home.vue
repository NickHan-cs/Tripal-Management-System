<template>
  <div class="main">
    <div class="title">游迹</div>
    <div class="btns">
      <a-button class="btn" type="primary" @click="toLogin">登录</a-button>
    <a-button class="btn" type="default" @click="toRegister">注册</a-button>
    </div>
    
  </div>
</template>

<script>
  export default {
    data(){
      return{
        isLogin:false,
      }
    },
    methods:{
      toLogin(){
        this.$router.push({
          name:"login"
        });
      },toRegister(){
        this.$router.push({
          name:"register"
        });
      },

    },

  }
</script>
<style scoped>
.title{
  padding-top: 150px;
  margin:auto;
  width:500px;
  height:250px;
  font-size:30px;
  /* border: solid red 1px; */
}
.main{
  
  width:100%;
  height:700px;
  background-color: antiquewhite;
}
.btn{
  font-size:18px;
  height:50px;
  width:100px;
  margin:50px 30px;
}
.btns{
  margin:auto;
  width:500px;
  height:100px;
  /* border: solid red 1px; */
}
</style>