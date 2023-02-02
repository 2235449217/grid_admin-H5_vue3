import Config from '@/setting.js'
const TokenKey = Config.TokenKey

export function getToken() {
	return uni.getStorageSync(TokenKey);
}

export function isRemeberMe() {
	return uni.getStorageSync('rememberMe');
}

export function getInfo() {
	const getUserName = uni.getStorageSync('userName');
	const getPwd = uni.getStorageSync('Pwd');
	return Promise.all([setUserName, setPwd, getUserName, getPwd]);
}

export function reSetToken(token) {
	return uni.setStorageSync(TokenKey, token);
}

export function setToken(token, rememberMe,id ,userName, Pwd) {
	if (rememberMe) {
		const setToken = uni.setStorageSync(TokenKey, token);
		const setRememberMe = uni.setStorageSync('rememberMe', true);
		const setUserName = uni.setStorageSync('userName', userName);
		const setPwd = uni.setStorageSync('Pwd', Pwd);
		const setId = uni.setStorageSync('user_id', id);
		return Promise.all([setToken, setRememberMe, setUserName, setPwd,setId])
	} else {
		const removeToken = uni.clearStorageSync();
		const setToken = uni.setStorageSync(TokenKey, token);
		const setRememberMe = uni.setStorageSync('rememberMe', false);
		const setId = uni.setStorageSync('user_id', id); 
		return Promise.all([removeToken, setToken, setRememberMe,setId])
	}
}

export function removeToken() {
	return uni.clearStorageSync();
}
// 只移除token代表你没有登录
export function removeUserToken() {
	return uni.removeStorageSync(TokenKey)
}
