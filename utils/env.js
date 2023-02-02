import Config from "@/setting.js"
export default (function() {
    if (process.env.NODE_ENV === 'development') {
        console.log('开发环境');
        return Config.developUrl;
    } else if (process.env.NODE_ENV === 'production') {
        console.log('生产环境');
        return Config.productionUrl;
    } else if (process.env.NODE_ENV === 'test') {
        console.log('测试环境');
        return Config.testUrl;
    }
})() 