<template>
	<view class="uni-data-tree">
		<view class="uni-data-tree-input" @click="handleInput">
			<slot :options="options" :data="gridValue" :error="errorMessage">
				<view class="input-value" :class="{'input-value-border': border}">
					<text v-if="errorMessage" class="selected-area error-text">{{errorMessage}}</text>
					<view v-else-if="loading && !isOpened" class="selected-area">
						<uni-load-more class="load-more" :contentText="loadMore" status="loading"></uni-load-more>
					</view>
					<scroll-view v-else-if="gridValue" class="selected-area" scroll-x="true">
						<view class="selected-list">
							<view class="selected-item" >
								<text>{{gridText}}</text>
							</view>
						</view>
					</scroll-view>
					<text v-else class="selected-area placeholder">{{placeholder}}</text>
					<view v-if="clearIcon && !readonly && gridValue" class="icon-clear" @click.stop="clear">
						<uni-icons type="clear" color="#e1e1e1" size="14"></uni-icons>
					</view>
					<view class="arrow-area" v-if="(!clearIcon || !gridValue) && !readonly ">
						<view class="input-arrow"></view>
					</view>
				</view>
			</slot>
		</view>
		<view class="uni-data-tree-cover" v-if="isOpened" @click="handleClose"></view>
		<view class="uni-data-tree-dialog" v-show="isOpened">
			<view class="uni-popper__arrow"></view>
			<view class="dialog-caption">
				<view class="title-area">
					<text class="dialog-title">{{popupTitle}}</text>
				</view>
				<view class="dialog-close" @click="handleClose">
					<view class="dialog-close-plus" data-id="close"></view>
					<view class="dialog-close-plus dialog-close-rotate" data-id="close"></view>
				</view>
			</view>
			<tui-cascade-selection
				ref="gridSelet"
				height="280px"
				:activeColor="color"
				:lineColor="color"
				:checkMarkColor="color"
				:itemList="parentDept"
				request
				:receiveData="receiveData"
				@complete="complete"
				@change="change"
				@update="update"
			></tui-cascade-selection>
		</view>
	</view>
</template>

<script>
	import tuiCascadeSelection from "@/components/thorui/tui-cascade-selection/tui-cascade-selection"
	import {departMent} from "@/api/deptList.js"
	export default {
		name: "grid-cascade-selection",
		data() {
			return {
				parentDept: [],
				receiveData: [],
				isOpened: false,
				gridValue: null,
				gridText: ''
			};
		},
		components: {
			tuiCascadeSelection
		},
		emits: ['popupopened', 'popupclosed', 'input', 'change', 'update:modelValue'],
		created() {
			this.getDeptList(1).then((res)=>{
				this.parentDept = res
			}).catch((err)=>{
				
			})
		},
		props: {
			color: {
				type: String,
				default: '#007aff'
			},
			options: {
				type: [Object, Array],
				default () {
					return {}
				}
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			popupTitle: {
				type: String,
				default: '请选择'
			},
			heightMobile: {
				type: String,
				default: ''
			},
			readonly: {
				type: Boolean,
				default: false
			},
			clearIcon: {
				type: Boolean,
				default: true
			},
			border: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			clear() {
				this.gridText = ''
				this.gridValue = null
				this.$emit('input', this.gridValue)
				this.$emit('update:modelValue', this.gridValue)
				this.$refs.gridSelet.clear()
			},
			getDeptList(id) {
				return departMent({id:id}).then((res)=>{
					return res.data.list.map((item)=>{
						return {
							text: item.deptName,
							value: item.ID
						}
					})
				}).catch((err)=>{
				})
			},
			change(e) {
				/**
				 *   layer: 0  第几级 index
					 src: '/static/images/basic/color.png'
					 subIndex: 2   //当前层级下选中项index
					 subText: '30人'  //选中项数据
					 text: '高一(3)班'
					 value: 103 //选中项value数据
				 * */
			
				// 模拟请求
				let value = e.value;
				let layer = e.layer;
				if (layer === 3) {
					//实际中以请求数据为准，无下级数据则传空数组
					this.receiveData = [];
				} else {
					uni.showLoading({
						title: '请稍候...'
					});
					this.getDeptList(value).then((res)=>{
						this.receiveData =res.length?res:[]
						uni.hideLoading();
					}).catch((err)=>{
						
					})
				}
			},
			complete(e) {
				this.gridText = e.text
				this.gridValue = e.value
				this.$emit('input', this.gridValue)
				this.$emit('update:modelValue', this.gridValue)
				this.$emit('popupopened')
			},
			update(value) {
				this.gridText = value.text
				this.gridValue = value.value
				this.$emit('input', this.gridValue)
				this.$emit('update:modelValue', this.gridValue)
			},
			show() {
				this.isOpened = true
				this.$emit('popupopened')
			},
			hide() {
				this.isOpened = false
				this.$emit('popupclosed')
			},
			handleInput() {
				if (this.readonly) {
					return
				}
				this.show()
			},
			handleClose(e) {
				this.hide()
			}
		}
	}
</script>

<style>
.uni-data-tree {
		position: relative;
		font-size: 14px;
	}

	.error-text {
		color: #DD524D;
	}

	.input-value {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		flex-wrap: nowrap;
		font-size: 14px;
		line-height: 38px;
		padding: 0 5px;
		overflow: hidden;
		/* #ifdef APP-NVUE */
		height: 40px;
		/* #endif */
	}

	.input-value-border {
		border: 1px solid #e5e5e5;
		border-radius: 5px;
	}

	.selected-area {
		flex: 1;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.load-more {
		/* #ifndef APP-NVUE */
		margin-right: auto;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 40px;
		/* #endif */
	}

	.selected-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 0 5px;
	}

	.selected-item {
		flex-direction: row;
		padding: 0 1px;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
	}

	.placeholder {
		font-size: 24rpx;
		color: #bbbbbb;
	}

	.input-split-line {
		opacity: .5;
	}

	.arrow-area {
		position: relative;
		width: 20px;
		/* #ifndef APP-NVUE */
		margin-bottom: 5px;
		margin-left: auto;
		display: flex;
		/* #endif */
		justify-content: center;
		transform: rotate(-45deg);
		transform-origin: center;
	}

	.input-arrow {
		width: 7px;
		height: 7px;
		border-left: 1px solid #999;
		border-bottom: 1px solid #999;
	}

	.uni-data-tree-cover {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .4);
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		z-index: 100;
	}

	.uni-data-tree-dialog {
		position: fixed;
		left: 0;
		top: 20%;
		right: 0;
		bottom: 0;
		background-color: #FFFFFF;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		z-index: 102;
		overflow: hidden;
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
	}

	.dialog-caption {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		/* border-bottom: 1px solid #f0f0f0; */
	}

	.title-area {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		/* #ifndef APP-NVUE */
		margin: auto;
		/* #endif */
		padding: 0 10px;
	}

	.dialog-title {
		/* font-weight: bold; */
		line-height: 44px;
	}

	.dialog-close {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding: 0 15px;
	}

	.dialog-close-plus {
		width: 16px;
		height: 2px;
		background-color: #666;
		border-radius: 2px;
		transform: rotate(45deg);
	}

	.dialog-close-rotate {
		position: absolute;
		transform: rotate(-45deg);
	}

	.picker-view {
		flex: 1;
		overflow: hidden;
	}

	/* #ifdef H5 */
	@media all and (min-width: 768px) {
		.uni-data-tree-cover {
			background-color: transparent;
		}

		.uni-data-tree-dialog {
			position: absolute;
			top: 55px;
			height: auto;
			min-height: 400px;
			max-height: 50vh;
			background-color: #fff;
			border: 1px solid #EBEEF5;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			border-radius: 4px;
			overflow: unset;
		}

		.dialog-caption {
			display: none;
		}

		.icon-clear {
			margin-right: 5px;
		}
	}

	/* #endif */

	/* picker 弹出层通用的指示小三角, todo：扩展至上下左右方向定位 */
	/* #ifndef APP-NVUE */
	.uni-popper__arrow,
	.uni-popper__arrow::after {
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 6px;
	}

	.uni-popper__arrow {
		filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
		top: -6px;
		left: 10%;
		margin-right: 3px;
		border-top-width: 0;
		border-bottom-color: #EBEEF5;
	}

	.uni-popper__arrow::after {
		content: " ";
		top: 1px;
		margin-left: -6px;
		border-top-width: 0;
		border-bottom-color: #fff;
	}

	/* #endif */
</style>
