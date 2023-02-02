<template>
	<view class="contain">
		<cu-custom class="top-bar" isBack="true">
			<block #content>查看详情</block>
		</cu-custom>
		<h3>待核查人员来源信息</h3>
		<!-- v-for循环信息 -->
		<view>
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
		<h3>核查信息</h3>
		<view>
			<view class="info" v-for="(value,key,index) in infomations">
				<text class="infoKey">{{findValue(key).value}}</text>
				<!-- input -->
				<template v-if="findValue(key).type == 'input'">
					<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
						<uni-easyinput class="infoValue" disabled
							:value="findValue(key).map?findValue(key).map[infomations[key]]:infomations[key]">
						</uni-easyinput>
					</uni-section>
				</template>

				<!-- 多文本 -->
				<template v-if="findValue(key).type == 'textarea'">
					<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
						<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomations[key]">
						</uni-easyinput>
					</uni-section>
				</template>
				<!-- 地区选择 -->
				<template v-if="findValue(key).type == 'picker'">
					<uni-section title="本地数据" type="line" padding>
						<uni-data-picker v-model="infomations[key]" disabled class="infoValue" placeholder="请选择所在县"
							popup-title="请选择所在地区">
						</uni-data-picker>
					</uni-section>
				</template>
				<!-- 数据选择 -->
				<template v-if="findValue(key).type == 'checkBox'">
					<uni-section title="单选" type="line">
						<view class="uni-px-5 uni-pb-5">
							<!-- <view class="text">单选选中：{{JSON.stringify(radio1)}}</view> -->
							<uni-data-checkbox v-model="infomations[key]" :localdata="sex"></uni-data-checkbox>
						</view>
					</uni-section>
				</template>

				<!-- 时间选择器 -->
				<template v-if="findValue(key).type == 'time'">
					<uni-section title="本地数据" type="line" padding>
						<view class="example-body">
							<uni-datetime-picker disabled class="infoValue" type="datetime" v-model="infomations[key]"
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
		<!-- 是属实本地 -->
		<view v-show=!isShow>
			<!-- 是否属实本地 -->
			<uni-section title="单选" type="line">
				<view class="aaa uni-px-5 uni-pb-5">
					<!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
					<view class="text">是否属实本地</view>
					<uni-data-checkbox calss="bbb" v-model="infomationsOne.radio1" :localdata="infomationsOne.locality">
					</uni-data-checkbox>
				</view>
			</uni-section>
			<!-- 是否属实本地 -->
			<uni-section title="单选" type="line">
				<view class="aaa uni-px-5 uni-pb-5">
					<!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
					<view class="text">是否当地核酸检测</view>
					<uni-data-checkbox calss="bbb" v-model="infomationsOne.radio2" :localdata="infomationsOne.acid">
					</uni-data-checkbox>
				</view>
			</uni-section>
			<!-- 是否纳入本地管控 -->
			<uni-section title="单选" type="line">
				<view class="aaa uni-px-5 uni-pb-5">
					<!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
					<view class="text">是否纳入本地管控</view>
					<uni-data-checkbox calss="bbb" v-model="infomationsOne.radio3" :localdata="infomationsOne.control">
					</uni-data-checkbox>
				</view>
			</uni-section>
			<!-- 本地管控方式 -->
			<uni-section title="单选" type="line">
				<view class="aaa uni-px-5 uni-pb-5">
					<!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
					<view class="text">本地管控方式</view>
					<uni-data-checkbox calss="bbb" v-model="infomationsOne.radio4"
						:localdata="infomationsOne.controlWay">
					</uni-data-checkbox>
				</view>
			</uni-section>
			<view class="characters">其他核查过程信息</view>
			<view class="characters">(乘坐交通工具情况？是否做过核酸？核酸检测时间结果?)</view>
			<view class="characters">(当前的采取管控措施？是否当地报备？先住址在那里?)</view>
			<view class="textarea">
				<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
					<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomationsOne.textarea ">
					</uni-easyinput>
				</uni-section>
			</view>
		</view>
		<!-- 不属实本地 -->
		<view v-show=isShow>
			<!-- 是否属实本地 -->
			<uni-section title="单选" type="line">
				<view class="aaa uni-px-5 uni-pb-5">
					<!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
					<view class="text">是否属实本地</view>
					<uni-data-checkbox calss="bbb" v-model="infomationsTwo.radio1" :localdata="infomationsTwo.locality">
					</uni-data-checkbox>
				</view>
			</uni-section>
			<!-- 转派区划 -->
			<uni-section title="单选" type="line">
				<view class="aaa uni-px-5 uni-pb-5">
					<!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
					<view class="text textheight">转派区划</view>
					<uni-section title="禁用" subTitle="使用 disabled 属性禁用输入框" type="line" padding>
						<uni-easyinput class="infoValue inputBox" disabled v-model="infomationsTwo.area">
						</uni-easyinput>
					</uni-section>
				</view>
			</uni-section>
			<!-- 输入转派原因 -->
			<view class="characters">输入转派原因</view>
			<view class="textarea">
				<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
					<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomationsTwo.reason ">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 选择退回原因 -->
			<view class="characters">选择退回原因</view>
			<view class="textarea">
				<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
					<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomationsTwo.reason ">
					</uni-easyinput>
				</uni-section>
			</view>

			<!-- 选择转出外省区划 -->
			<view class="characters">选择转出外省区划</view>
			<view class="textarea">
				<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
					<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomationsTwo.reason ">
					</uni-easyinput>
				</uni-section>
			</view>
			<!-- 退回过程其他信息 -->
			<view class="characters">退回过程其他信息</view>
			<view class="textarea">
				<uni-section title="多行文本" subTitle="指定属性 type=textarea 使用多行文本框" type="line" padding>
					<uni-easyinput class="infoValue" disabled type="textarea" v-model="infomationsOne.textarea ">
					</uni-easyinput>
				</uni-section>
			</view>
		</view>
	</view>
</template>

<script>
	import info from './js/data.js'
	export default {
		data() {
			return {
				// 是否属实本地
				isShow: true,
				infomationsOne: {
					radio1: 0,
					locality: [{
						text: '是',
						value: 0
					}, {
						text: '否',
						value: 1
					}],
					radio2: 0,
					acid: [{
							text: '是(阴性)',
							value: 0
						}, {
							text: '是(确诊)',
							value: 1
						},
						{
							text: '是(无症状感染)',
							value: 2
						},
						{
							text: '否',
							value: 3
						}
					],
					radio3: 0,
					control: [{
						text: '是',
						value: 0
					}, {
						text: '否',
						value: 1
					}],
					radio4: 0,
					controlWay: [{
						text: '居家隔离',
						value: 0
					}, {
						text: '医学管理(集中隔离)',
						value: 1
					}, {
						text: '健康申报',
						value: 2
					}, ],
					textarea: "sdfsfgdg"

				},
				infomationsTwo: {
					radio1: 0,
					locality: [{
						text: '是',
						value: 0
					}, {
						text: '否',
						value: 1
					}],
					area: '新乡市',
					reason: '史蒂夫懂法守法',
				},
				datalist: info,

				infomation: {
					// 姓名
					name: "王路飞",
					// 身份证号
					idInfo: 132257200010105824,
					// 手机号
					num: 13233805955,
					// 地址
					address: "很难受",
					// 来源日期
					createTime: 1655342752719,
					// 来源类型
					sourceType: "重点区域",
					// 事件名称
					eventName: "动态疫情",
					// 批次号
					batchNum: 6165165161,
					// 健康码
					healthStatus: 0,
					// 地址
					site: "",
					// 备注
					remark: "364565456",
					// names: "四皇巴基",

				},
				// 核查信息中的内容
				infomations: {
					// 姓名
					names: "四皇巴基",
					// 身份证号
					idInfo: 132257200010105824,
					// 手机号
					num: 13233805955,
					// 是否属实本地
					// locality: 0
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

	.textheight {
		margin: 0 20rpx;
	}

	.reason {
		width: 660rpx;
		margin: 20rpx;

	}




	.aaa {
		display: flex;
		justify-content: space-between;
		margin: 10rpx 20rpx;


		.text {
			margin: 3rpx 35rpx 0rpx 0;
		}

	}

	.inputBox {
		width: 550rpx;
	}

	h3 {
		margin: 10px
	}

	.characters {
		margin: 10px
	}

	.textheight {
		height: 40px;
		line-height: 30px;
	}

	.textarea {
		margin: 10px
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
