// 这里面所有的数据和方法都是有关用户的。我们定义好整个所有的然后放在仓库里通过名字引入
export default{
  //一整个都出去
  // 给当前模块开启命名空间
  namespace:true,
  state:()=>({
    // 存用户需要的
    token:'',
    username:'',
    password:''
  }),
  mutations:{
    // 定义一个保存数据的三个方法
    // 保存用户名
    saveUserName(state,username){
      state.username = username
    },
    // 保存密码
    savePassWord(state,password){
      state.password = password
    },
    // 保存token
    saveToken(state,token){
      state.token = token
    }
    // 永久化存储信息
    
  }
  
  
}