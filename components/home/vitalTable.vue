<template>
	<view class="vital_table">
		<view class="content" >
			<view class="contain">
				<view class="item" v-for="(item, index) in vitalData" :key="index">
					<view class="name">{{item.name}}</view>
					<view class="nums" :style="{color:item.nums=='-'?'':item.color}">{{item.nums}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['vitalData'],
		data() {
			return {
				vitalData: this.vitalData
			}
		},
		created() {
			// 动态填充标题背景颜色(使用es6语法中的fill方法)
			var origin = this.vitalData.length
			var length = this.vitalData.length  - this.vitalData.length%5 + (this.vitalData.length%5==0?0:5)
			this.vitalData.length = length
			this.vitalData.fill({},origin,length);
		}
	}
</script>

<style lang="scss" scoped>
	.vital_table {
		.content {
			position: relative;
			// border: 2rpx solid #ececec;
			.contain {
				position: relative;
				top: 0rpx;
				left: 0rpx;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				border-radius: 8rpx;
				overflow: hidden;
				.item {
					width: 20%;
					height: 120rpx;
					font-size: 28rpx;
					text-align: center;
					line-height: 63rpx;
					.name {
						height: 60rpx;  
						// background-color: #e2f0ff;
						background-color: #DAE8FF;
						color: #8F97A4;
						font-size: 24rpx;
					}
					.nums {
						height: 60rpx;
						background-color: #fff;
						font-size: 28rpx;
					}
				}
			}
			
		}
	}
</style>
