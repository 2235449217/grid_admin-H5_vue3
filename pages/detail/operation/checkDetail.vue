<template>



</template>

<script>
	import info from './js/info'
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
					// 地址
					address: "",
					// 健康码状态
					healthStatus: 0,
					// 派发状态
					distributionStatus: 0,
					// 派发至
					destination: "新乡市",
					// 管控方式
					Control: 0,
					// 赋码原因
					content: "原因",
					// 创建时间
					createTime: 1655342752719,
					//日期范围
					daterange: "",
					// 备注
					remark: "备注",
					// 修改人
					revise: "张小凡",

					// 更新时间
					// update: 1655311152719
					updateTime: 1655342752719,
					// -----
					// 场所代码
					placeCode: 45664666,
					// 单位名称
					companyName: "草帽海贼团",
					// 联系人
					linkman: "黑胡子",
					// 场所类型
					placeTypes: 0,
					// 出发地
					placeDeparture: "木叶村",
					// 目的地
					bourn: "和之国",
					// 返乡时间
					hometownTime: 1655342752719,
					// 编码
					coding: 12138,
					// 场所
					site: "包子山",
					// 核酸信息
					acidMessage: "不醉不归",
					// 返回方式
					returnWay: 0,

				},

				pageValue: "",
			}
		},
		onLoad(option) {
			// console.log(option)
		},
		computed: {
			status: function() {
				return this.healthStatus.find((item) => {
					return item.value == this.info.healthStatus
				}).text
			},
		},
		onLoad(option) {
			// console.log("111", option)
			this.pageValue = option.value

		},
		mounted() {
			// console.log(this.pageValue);
			// 健康码管理
			if (this.pageValue == 1) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/healthCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
				// 场所码管理
			} else if (this.pageValue == 2) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/placeCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
				// 核酸信息管理
			} else if (this.pageValue == 3) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/nucleinCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
				// 重点人员管理
			} else if (this.pageValue == 4) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/keypersonnelCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
			}
			// 重点场所
			else if (this.pageValue == 5) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/keyplaceCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
			}
			// 风险人员
			else if (this.pageValue == 6) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/riskpersonnelCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
			}
			// 入豫人员
			else if (this.pageValue == 7) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/enterpersonnelCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
			}

			// 区域协查
			else if (this.pageValue == 9) {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/areacheckCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
			}
			// 风险预警
			else {
				const carlist = JSON.stringify(this.listItem);
				uni.navigateTo({
					url: "/pages/detail/operation/testCheck/riskwarnCheck" +
						"?value=" +
						this.pageValue +
						"&item=" +
						carlist,
				});
			}
		},
		// onLoad(options) {
		//   const Result = JSON.parse(options.item);
		//   console.log('外部查看的消息',JSON.parse(options.item));
		//   if(options.value == 4){
		//     this.infomation.name = Result.name;
		//     this.infomation.idInfo = Result.id_card;
		//     this.infomation.num = Result.phone;
		//     this.infomation.companyName =Result.scene_name;
		//     this.infomation.acidMessage = Result.is_nucleic_acid;
		//   }
		// },
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
			},


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
