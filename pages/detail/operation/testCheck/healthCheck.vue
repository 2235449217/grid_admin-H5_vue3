<template>
	<!-- 健康码管理 -->
	<view>
		<view class="contain">
			<cu-custom class="top-bar" isBack="true">
				<block #content>查看详情</block>
			</cu-custom>
			<!-- v-for循环信息 -->
			<view class="info" v-for="(value,key,index) in infomation">
				<text class="infoKey">{{findValue(key).value}}</text>
				<!-- input -->
				<template v-if="findValue(key).type == 'input'">
					<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
						<uni-easyinput class="infoValue" disabled
							:value="findValue(key).map?findValue(key).map[infomation[key]]:infomation[key]">
						</uni-easyinput>
					</uni-section>
				</template>

				<!-- 多文本 -->
				<template v-if="findValue(key).type == 'textarea'">
					<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
						<uni-easyinput autoHeight  class="infoValue" disabled type="textarea" v-model="infomation[key]">
						</uni-easyinput>
					</uni-section>
				</template>
			</view>
				
				
		</view>
	</view>
</template>

<script>
	import info from '../js/info.js'
	import {
		parseTime
	} from "@/utils/utils.js"

	export default {
		data() {
			return {
				datalist: info,

				infomation: {

					// 姓名
					name: "邢小橙",
					// 身份证号
					idInfo: 132257200010105824,
					// 手机号
					num: 13233805955,
					// 健康码状态
					healthStatusCode: "11",
					// 管控方式
					control_mode: "",
					// 管控原因
					control_reasons: "",
					// 转派状态					
					dispatch_status: '',
					// 派发状态
					transfer_status: '',
					// 行政区划
					dept_name: '',
					// 赋码原因
					give_code_reason: "备注",
					// 赋码时间
					give_code_time: '',
					// 派发时间
					dispatch_time: '',
					// 转派时间
					transfer_time: '',
					// 备注
					transfer_reason: '',
				},
				
			}
		},
		// 接受传来的数据
		onLoad(options) {
			const Result = JSON.parse(options.item);
			// console.log('option', Result)
			this.infomation.name = Result.name;
			// 身份证号
			this.infomation.idInfo = Result.certificate_num;
			// 手机号
			this.infomation.num = Result.phone;
			// 健康码状态
			this.infomation.healthStatusCode = Result.code_color;
			// 管控方式
			this.infomation.control_mode = Result.control_mode;
			// 管控原因
			if(Result.control_mode == "无法管控") {
				this.infomation.control_reasons = Result.control_reasons;
			} else {
				delete this.infomation.control_reasons;  //删除管控原因（删除对象中的一个属性）
			}
			// 转派状态
			this.infomation.dispatch_status = Result.dispatch_status;
			// 派发状态
			this.infomation.transfer_status = Result.transfer_status;
			//  行政区划dept_name
			this.infomation.dept_name = Result.dept_name;
			// 赋码原因
			this.infomation.give_code_reason = Result.give_code_reason;
			// 赋码时间
			this.infomation.give_code_time = Result.give_code_time;
			// 派发时间
			this.infomation.dispatch_time = Result.dispatch_time ? parseTime(Result.dispatch_time) : "-";
			// 转派时间
			this.infomation.transfer_time = Result.transfer_time ? parseTime(Result.transfer_time) : "-";
			// 备注
			this.infomation.transfer_reason = Result.transfer_reason;
		},

		methods: {
			parseTime,
			findValue(key) {
				// console.log(key)
				return this.datalist.find((item) => {
					return item.key == key
				})
			},
			
			// findMap(key, value) {
			// 	// console.log(key)
			// 	const mapList = this.datalist.find((item) => {
			// 		return item.key == key
			// 	}).map
			// 	return mapList[value]
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.contain {

		.info {
			display: flex;
			justify-content: space-between;
			text-align: center;
			margin: 10rpx 0rpx;

			.infoKey {
				margin: 20rpx;
				align-items: center;
				height: 40rpx;
				lline-height: 40rpx;
			}

			.infoValue {
				margin: 0 20rpx 0 0rpx;
				width: 550rpx;
			}
		}
	}



	// 更改一下输入框的文本颜色
	::v-deep .uni-easyinput__content.is-disabled {
		color: #000;
	}

	// 更改一下字体颜色
	::v-deep .uni-date-x {
		color: #000;
		// font-weight: bold;
	}

	// 更改一下整体的透明度一定要观察设置了变淡肯定有问题是不是继承了谁
	::v-deep .uni-date-editor--x__disabled {
		opacity: 1;
	}

	//更改了颜色配置
	::v-deep .uniui-calendar[data-v-a2e81f6e]:before {
		content: "\e6a0";
		color: #000;
	}
</style>
