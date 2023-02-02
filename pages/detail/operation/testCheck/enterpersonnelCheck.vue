<template>
	<!-- 入豫人员管理 -->
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
					id_card_num: 132257200010105824,
					// 手机号
					num: 13233805955,
					// 派发状态
					dispatch_status: '',
					// 返乡时间
					record_time: "",
					// 返回方式
					travel_type: "",
					// 出发地
					depart_detail_address: '',
					// 目的地
					dest_detail_address: '',
					//行政区划
					address: '',
					// 派发时间
					dispatch_time: '',


					// 转派状态
					transfer_status: "",

					// 转派时间
					transfer_time: "",
					//数据创建时间
					create_time: "",
					// 拒绝原因
					transfer_reason: ""

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
			// 名字
			this.infomation.name = Result.name;
			// 身份证号
			this.infomation.id_card_num = Result.id_card_num;
			// 手机号
			this.infomation.num = Result.phone;
			// 派发状态
			this.infomation.dispatch_status = Result.dispatch_status;
			// 出发地
			this.infomation.depart_detail_address = Result.depart_detail_address
			// 目的地
			this.infomation.dest_detail_address = Result.dest_detail_address
			// 返乡方式
			this.infomation.travel_type = Result.travel_type
			// 返乡时间
			this.infomation.record_time = Result.record_time
			//address
			this.infomation.address = Result.address
			// 派发至
			this.infomation.address = Result.address
			// dispatch_time
			this.infomation.dispatch_time = Result.dispatch_time ? parseTime(Result.dispatch_time) : "-";
			// 是否转派
			this.infomation.transfer_status = Result.transfer_status
			// 转派时间
			this.infomation.transfer_time = Result.transfer_time ? parseTime(Result.transfer_time) : "-";
			// create_time
			this.infomation.create_time = Result.create_time
			// 
			this.infomation.transfer_reason = Result.transfer_reason

		},
		methods: {
			parseTime,
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
