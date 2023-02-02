<template>
	<view>
		<view class="cu-custom" v-if="!dingding" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<view class="right">
					<slot name="right"></slot>
				</view>
			</view>
		</view>
	</view>
	<view class="risk-notice" v-if="page<=noticeCount+1">
		<uni-notice-bar show-icon show-close single backgroundColor="#fde2e2" @click="goRisk" color="#f56c6c"
			:text="noticeBack" @close='getNotice' />
	</view>
</template>

<script setup>
	import * as dd from 'dingtalk-jsapi';
	import {
		computed,
		getCurrentInstance,
		ref,
		useSlots
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		getRiskNotice,
		confirmMessage
	} from '@/api/message.js'
	import {
		getToken
	} from "@/utils/auth.js";
	const emit = defineEmits(['search'])
	const {
		appContext
	} = getCurrentInstance()
	const slots = useSlots()
	const CustomBar = appContext.config.globalProperties.CustomBar
	const StatusBar = appContext.config.globalProperties.StatusBar
	const props = defineProps({
		bgColor: {
			type: String,
			default: 'bg-weixin'
		},
		isBack: {
			type: [Boolean, String],
			default: false
		},
		bgImage: {
			type: String,
			default: ''
		},
	})
	let page = ref(1);
	let noticeCount = ref(-1);
	let noticeBack = ref('');
	let item = ref({});
	onShow(() => {
		const title = slots.content()[0].children
		const right = slots.right?.()
		if (dd.env.platform !== "notInDingTalk") {
			dd.ready(function() {
				// dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
				dd.biz.navigation.setTitle({
					title: title
				});
				if(right) {
					dd.biz.navigation.setMenu({
						backgroundColor: "#666666",
						textColor: "#666666",
						items: [{
							"id": "1", //字符串
					
							"iconId": "search", //字符串，图标命名
					
							"text": "搜索",
							
							"iconColor": "#666666"
						}],
						onSuccess: function(res) {
							emit('search')
						},
						onFail: function(err) {
						}
					});
				}
			});
		}
		if (getToken()) {
			getNotice();
		}
	});

	function getNotice() {
		const data = {
			page: page.value,
			pageSize: 0
		}
		getRiskNotice(data).then((res) => {
			item.value = res.data.Notice[0]
			noticeBack.value = res.data.Notice[0]?.notice_back || 0;
			noticeCount.value = res.data.notice_count;
			page.value++
		}).catch()
	}

	function goRisk() {
		const NoticeObj = {
			id: item.value.id
		}
		confirmMessage(NoticeObj).then((res) => {
			uni.hideLoading()
			// 跳转对应的某一条的路径
			if (item.value.section_type == 1) {
				uni.navigateTo({
					url: "/pages/detail/healthDetail"
				})
			} else if (item.section_type == 2) {
				uni.navigateTo({
					url: "/pages/detail/placeDetail"
				})
			} else if (item.section_type == 3) {
				uni.navigateTo({
					url: "/pages/detail/enterpersonnelDetail"
				})
			} else if (item.section_type == 4) {
				uni.navigateTo({
					url: "/pages/detail/keyplaceDetail"
				})
			} else if (item.section_type == 5) {
				uni.navigateTo({
					url: "/pages/detail/riskpersonnelDetail"
				})
			} else if (item.section_type == 6) {
				uni.navigateTo({
					url: "/pages/detail/riskwarnDetail"
				})
			} else if (item.section_type == 7) {
				uni.navigateTo({
					url: "/pages/detail/areacheckDetail"
				})
			}
		});
	}
	const style = computed(() => {
		var bgImage = props.bgImage;
		var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
		if (props.bgImage) {
			style = `${style}background-image:url(${props.bgImage});`;
		}
		return style
	})
</script>
<script>
	export default {
		name: 'cu-custom',
		methods: {
			BackPage() {
				if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
					let url = '/' + __wxConfig.pages[0]
					uni.hideLoading()
					return uni.redirectTo({
						url
					})
				}
				uni.hideLoading()
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
	.cu-bar {
		background-color: #fff;
	}

	.right {
		position: absolute;
		right: 40rpx;
	}

	.uni-noticebar {
		margin-bottom: 0px;
	}

	.content {
		font-weight: bold;
	}
</style>
