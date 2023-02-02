<template>
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
						<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomation[key]"
							:placeholder="info.remark">
						</uni-easyinput>
					</uni-section>
				</template>
				<!-- 地区选择 -->
				<template v-if="findValue(key).type == 'picker'">
					<uni-section title="本地数据" type="line" padding>
						<uni-data-picker v-model="info.address" class="infoValue" placeholder="请选择所在县"
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
			<!--姓名  -->
			<view class="info">
				<text class="infoKey">姓名</text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput class="infoValue" disabled v-model.value="info.name"></uni-easyinput>
				</uni-section>
			</view>
			<!-- 身份证号 -->
			<view class="info">
				<text class="infoKey">身份证号</text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput class="infoValue" disabled v-model.value="info.id" placeholder="请输入内容">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 手机号码 -->
			<view class="info">
				<text class="infoKey">手机号码</text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput class="infoValue" disabled v-model.value="info.num" placeholder="请输入内容">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 地址 级联选择器   -->
			<view class="info">
				<text class="infoKey">地址</text>
				<uni-section title="本地数据" type="line" padding>
					<uni-data-picker v-model="info.address" class="infoValue" placeholder="请选择所在县"
						popup-title="请选择所在地区">
					</uni-data-picker>
				</uni-section>
			</view>
			<!-- 健康码状态 -->
			<view class="info">
				<text class="infoKey">健康码状态</text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput class="infoValue" disabled v-model.value="status" placeholder="请输入内容">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 派发状态 -->
			<view class="info">
				<text class="infoKey">派发状态</text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput class="infoValue" disabled value="邢小橙" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
			</view>
			<!-- 派发至 -->
			<view class="info">
				<text class="infoKey">派发至</text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput class="infoValue" disabled value="邢小橙" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
			</view>
			<!-- 管控方式 -->
			<view class="info">
				<text class="infoKey">管控方式 </text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput class="infoValue" disabled value="邢小橙" placeholder="请输入内容"></uni-easyinput>
				</uni-section>
			</view>
			<!-- 解码原因 -->
			<view class="info">
				<text class="infoKey">赋码原因 </text>
				<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
					<uni-easyinput class="infoValue" disabled type="textarea" v-model="value"
						:placeholder="info.content">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 创建时间 -->
			<view class="info">
				<text class="infoKey">创建时间 </text>
				<view class="example-body">
					<uni-datetime-picker disabled class="infoValue" type="datetime" v-model="datetimesingle"
						@change="changeLog" />
				</view>
			</view>
			<!-- 日期范围 -->
			<view class="info">
				<text class="infoKey">日期范围 </text>
				<view class="example-body">
					<uni-datetime-picker start="2020-20-10" end="2022-10-10" class="infoValue" v-model="range" disabled
						type="daterange" @maskClick="maskClick" />
				</view>
			</view>
			<!-- 备注 -->
			<view class="info">
				<text class="infoKey">备注 </text>
				<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
					<uni-easyinput class="infoValue" disabled type="textarea" v-model="value"
						:placeholder="info.remark">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 修改人 -->
			<view class="info">
				<text class="infoKey">修改人 </text>
				<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
					<uni-easyinput v-model.value="info.revise" class="infoValue" disabled placeholder="请输入内容">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 更新时间 -->
			<view class="info">
				<text class="infoKey">更新时间 </text>
				<view class="example-body">
					<uni-datetime-picker class="infoValue" type="datetime" v-model="datetimesingle" disabled
						@change="changeLog" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import info from './js/info'
	export default {
		data() {
			return {
				datalist: info,
				info: {
					// 姓名
					name: "邢小橙",

					id: 5246534542564324,
					num: 312432534,
					revise: "张小帆",
					content: "懂法守法",
					remark: "和学生的过多多多多多多多多多多多或过多几扩付绿所多付或过过付说过军所付多过或绿军扩",
					healthStatus: '0',
					datetimesingle: "45635434536453d"

				},
				infomation: {
					// 姓名
					name: "邢小橙",
					// 身份证号
					idInfo: 132257200010105824,
					// 手机号
					num: 13233805955,
					// address:"",
					// 健康码状态
					healthStatus: 0,
					// 地址
					address: "",
					// 派发状态
					distributionStatus: 0,
					// 派发至
					destination: "新乡市",
					// 管控方式
					Control: 0,
					// 赋码原因
					content: "原因",
					// 备注
					remark: "备注",
					// 修改人
					revise: "张小凡",
					// 创建时间
					createTime: 1655342752719,
					//日期范围
					daterange: "",
					// 更新时间
					// update: 1655311152719
					updateTime: 1655342752719,
				},
				// 创建时间
				datetimesingle: 1655342752719,

				// 更新时间
				healthStatus: [{
						value: 0,
						text: "绿码"
					},
					{
						value: 1,
						text: "黄码"
					},
					{
						value: 2,
						text: "红码"
					},
				],

			}
		},
		computed: {
			status: function() {
				return this.healthStatus.find((item) => {
					return item.value == this.info.healthStatus
				}).text
			},
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
			// width: 750px;
			margin: 10rpx 0rpx;

			.infoKey {
				margin: 20rpx;
				// font-size: 10rpx
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
</style>
