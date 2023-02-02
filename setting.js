const config = {
	/**
	 * @description 标题
	 */
	title: '',
	/**
	 * @description token key
	 */
	TokenKey: 'userToken',
	/**
	 * @description 请求超时时间，毫秒（默认2分钟）
	 */
	timeout: 1200000,
	/**
	 * @description 开发环境请求地址
	 *
	 */
	// 开发环境
	// developUrl: 'https://grid.cppwnn.top/api',
	developUrl: 'http://221.176.150.183:8081/api',
	/**
	 * @description 生产环境请求地址http://221.176.150.183:8082/
	 // */
	productionUrl: 'http://221.176.150.183:8081/api',
	/**
	 * @description 测试环境请求地址 
	 */
	testUrl: ''

}

export default config;
