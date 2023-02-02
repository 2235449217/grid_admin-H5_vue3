<template>
  <view>
    <cu-custom class="top-bar" isBack = "true">
    	<block #content>修改密码</block>
    </cu-custom>
    <!-- 修改密码的区域 -->
    <view class="password-box">
      <view class="password-container">
        <view class="list-wrapper">
          <!-- 第一行 -->
          <view class="list-item">
            <view class="item-title">
              原密码:
            </view>
            <view class="item-input">
              <input v-model="prePassWord" placeholder="请输入原密码" type="password">
            </view>
          </view>
        <!-- 第二行 -->
       <view class="list-item">
          <view class="item-title">
            新密码:
          </view>
          <view class="item-input">
            <input v-model="newPassWord"  placeholder="请输入新密码" type="password">
          </view>
        </view>
        <!-- 第三行 -->
       <view class="list-item">
          <view class="item-title">
            确认新密码:
          </view>
          <view class="item-input">
            <input v-model="surePassWord"  placeholder="请重新输入新密码" type="password">
          </view>
        </view>
        </view>
       <view class="change-pwd-btn">
          <button type="primary" class="btn"  @click="handleSubmit" >确认修改</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {getToken,removeUserToken,removeToken} from '../../utils/auth.js'
  import {changePassWord} from '@/api/auth.js'
  import {getUserInfo} from "@/api/auth.js"
  export default {
    data() {
      return {
        prePassWord:'',
        newPassWord:'',
        surePassWord:'',
        userName:''
      };
    },
    methods:{
      handleSubmit(){
        // 点击的时候第一步先验证
        if(  this.newPassWord!=='' 
        && this.prePassWord!==''
        &&this.surePassWord!==''
        &&this.newPassWord===this.surePassWord
        ){
          const userObj = {
            newPassword:this.newPassWord,
            password:this.prePassWord,
            username:this.userName
          };
          // 输出打印一下
          // console.log('修改数据的对象',userObj);
          // 调用接口传递
          changePassWord(userObj).then((res)=>{
            // console.log('修改密码的返回值',res);
            if(res.msg==='修改成功'){
              uni.showToast({
                title:"修改成功"
              });
              // 重新开始
              removeToken();
              // 跳转登录页面
              uni.navigateTo({
                url:"/pages/login/login"
              })
            }else if(res.msg==='修改失败， 原密码与当前账户不符'){
              uni.showToast({
                title:"修改失败， 原密码与当前账户不符"
              })
            }
          }).catch((error)=>{
            // console.log('请求失败',error);
          })
          
        }else{
          uni.showToast({
            title:"两次输入密码不正确"
          })
        }
      },
      // 上一步
      handlePre(){
        uni.navigateBack({
          delta:1
        })
      }
    },
    onLoad(options) {
      this.userName = options.userName;
      uni.$on('userPassword',(data)=>{
        this.prePassWord = data
      })
    },
    onUnload() {
      //移除
      uni.$off('userPassword');
    },
    created() {
      // console.log('111',getUserInfo());
	  // getUserInfo()
      // if(uni.getStorageSync('Pwd')){
      //   this.prePassWord = uni.getStorageSync('Pwd');
      // }else{
      //   this.prePassWord = ""
      // }
    }
  
  }
</script>

<style lang="scss">
// 修改密码的区域
.password-box{
  width: 100%;
  background:rgba(249,249,249,0.5);
  .password-container{
    width: 91%;
    margin: 0 auto;
    // border: 1px solid red;
    .list-wrapper{
      width: 100%;
      margin-top: 8rpx;
      // border: 1px solid blue;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .list-item{
        // border: 1px solid red;
        // margin-bottom: 20rpx;
        // margin-top: 5rpx;
        width: 100%;
        height: 80rpx;
        // border: 1px solid yellow;
        display: flex;
        border-bottom: 2rpx solid rgba(214, 214, 214, 0.5);
        // justify-content: ;
        .item-title{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 28rpx;
          width: 28%;
        }
        .item-input{
          // margin-left: 5rpx;
          width: 65%;
          padding-left: 15rpx;
          // font-size: rpx;
          display: flex;
          align-items: center;
          input{
            font-size: 28rpx;
          }
        }
      }
      
    }
  }
}
.change-pwd-btn{
        width: 100%;
        height: 80rpx;
   .btn{
     font-size: 28rpx;
     background: rgba(89, 126, 247, 1);
     // background-color: #8d97a5;
     background-blend-mode: normal;
     border-radius: 4rpx;
     mix-blend-mode: normal;
     margin-top: 120rpx;
     width: 500rpx;
     height: 70rpx;
   }
      }
</style>
