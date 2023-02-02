<template>
	<!-- 核酸信息管理 -->
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
						<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomation[key]">
						</uni-easyinput>
					</uni-section>
				</template>
				<!-- 地区选择 -->
				<template v-if="findValue(key).type == 'picker'">
					<uni-section title="本地数据" type="line" padding>
						<uni-data-picker v-model="infomation[key]" disabled class="infoValue" placeholder="请选择所在县"
							popup-title="请选择所在地区">
						</uni-data-picker>
					</uni-section>
				</template>
				<!-- 时间选择器 -->
				<template v-if="findValue(key).type == 'time'">
					<uni-section title="本地数据" type="line" padding>
						<view class="example-body">
							<uni-datetime-picker disabled class="infoValue" type="datetime" v-model="infomation[key]"
								@change="changeLog" />
						</view>
					</uni-section>
				</template>
				<!-- 日期范围 -->
				<template v-if="findValue(key).type == 'daterange'">
					<uni-section title="本地数据" type="line" padding>
						<view class="example-body">
							<view class="example-body">
								<uni-datetime-picker start="2020-20-10" end="2022-10-10" class="infoValue"
									v-model="daterange" disabled type="daterange" @maskClick="maskClick" />
							</view>
						</view>
					</uni-section>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import info from '../js/info.js'
	export default {
		data() {
			return {
				datalist: info,

				infomation: {

					// 姓名
					patient_name: "",
					// 身份证号
					certificate_num: '',
					// 手机号
					mobile: '',
					// num: 13233805955,
					// // 健康码状态
					// healthStatusCode: "11",
					// // 转派状态					
					// dispatch_status: '',
					// // 派发状态
					// transfer_status: '',
					// // 管控发送
					// control_mode: "",
					// 检测机构
					census_Address:"",
					//结果
					 state:"",
					// // 赋码原因
					// give_code_reason: "备注",
					// // 赋码时间
					// give_code_time: '',
					

				},


			}
		},
		computed: {
			status: function() {
				return this.healthStatus.find((item) => {
					return item.value == this.info.healthStatus
				}).text
			},
		},
		// 接受传来的数据
		onLoad(options) {
			const Result = JSON.parse(options.item);
			this.infomation.patient_name = Result.patient_name;
			// 身份证号
			this.infomation.certificate_num = Result.certificate_num;
			// 手机号
			this.infomation.mobile = Result.mobile;
			// // 健康码状态
			// this.infomation.healthStatusCode = Result.code_color;
			// // 转派状态
			// this.infomation.dispatch_status = Result.dispatch_status;
			// // 派发状态
			// this.infomation.transfer_status = Result.transfer_status;
			// // 管控方式	
			// this.infomation.control_mode = Result.control_mode;
			// 检测机构
			this.infomation.census_Address = Result.census_Address;
			// 结果
			this.infomation.state = Result.state;
			// // 赋码原因
			// this.infomation.give_code_reason = Result.give_code_reason;
			// // 赋码时间
			// this.infomation.give_code_time = Result.give_code_time;


		},
		methods: {
			findValue(key) {
				// console.log(key)
				return this.datalist.find((item) => {
					return item.key == key
				})
			},
			findMap(key, value) {
				// console.log(key)
				const mapList = this.datalist.find((item) => {
					return item.key == key
				}).map
				return mapList[value]
			}
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
