const info = [

	{
		key: 'control_reasons',
		value: '管控原因',
		type: 'textarea'
	},
	//结果
	{
		key: 'state',
		value: '结果',
		type: 'input'
	},
	// 
	{
		key: 'census_Address',
		value: '检测机构',
		type: 'input'
	},
	// 第健康的查看	
	// 姓名
	{
		key: 'name',
		value: '姓名',
		type: 'input'
	},
	// 身份证号码
	{
		key: 'idInfo',
		value: '身份证号',
		type: 'input'
	},
	{
		key: 'patient_name',
		value: '姓名',
		type: 'input'
	},
	// 手机号码
	{
		key: 'num',
		value: '手机号码',
		type: 'input'
	},
	// 身份证号码
	{
		key: 'certificate_num',
		value: '身份证号',
		type: 'input'
	},
	// 手机号码
	{
		key: 'mobile',
		value: '手机号码',
		type: 'input'
	},
	// 健康码状态
	{
		key: 'healthStatusCode',
		value: '健康码状态',
		type: 'input',

	},
	// 管控方式
	{
		key: 'control_mode',
		value: '管控方式',
		type: 'input',

	},
	// 转派方式
	{
		key: 'dispatch_status',
		value: '派发状态',
		type: 'input',

	},
	// 派发状态 未转
	{
		key: 'transfer_status',
		value: '转派状态',
		type: 'input',

	},
	// 管控方式
	{
		key: 'control_mode',
		value: '管控方式',
		type: 'input',

	},
	// 赋码原因
	{
		key: 'give_code_reason',
		value: '赋码原因',
		type: 'textarea'
	},
	// 赋码时间
	{
		key: 'give_code_time',
		value: '赋码时间',
		type: 'input',

	},
	// 派发时间
	{
		key: 'dispatch_time',
		value: '派发时间',
		type: 'input',
		// map: {
		// 	0: "-"
		// }

	},
	// 备注
	{
		key: 'transfer_reason',
		value: '拒绝原因',
		type: 'input',

	},
	{
		key: 'remake',
		value: '备注',
		type: 'input',

	},
	// 第二页
	// 场所码编号
	{
		key: 'scene_code',
		value: '场所码编号',
		type: 'input',

	},
	// 场所码名称
	{
		key: 'scene_name',
		value: '单位名称',
		type: 'input',

	},
	// 联系人姓名
	{
		key: 'site_manager',
		value: '联系人',
		type: 'input',

	},
	// 联系人手机号码
	{
		key: 'manager_phone',
		value: '联系人号码',
		type: 'input',

	},
	//场所状态
	{
		key: 'enabling_status',
		value: '场所状态',
		type: 'input',

	},
	// 场所类型
	{
		key: 'scene_type',
		value: '场所类型',
		type: 'input',

	},
	{
		key: 'nucleic_acid_count',
		value: '核酸次数',
		type: 'input',
	
	},
	// 


	// 第三页





	// 第四页
	// {
	//    key: 'sceneName',
	//    value: '所属重点场所',
	//    type: 'input',   
	// },
	{
		key: 'nucleics',
		value: '是否达标',
		type: 'input',
	},


	// 第五页
	{
		key: 'scene_id',
		value: '场所代码',
		type: 'input',
	},
	{
		key: 'dept_name',
		value: '行政区划',
		type: 'input'
	},
	{
		key: 'site_manager',
		value: '联系人',
		type: 'input',
	},
	{
		key: 'manager_phone',
		value: '联系人号码',
		type: 'input',
	},
	{
		key: 'enabling_status',
		value: '场所状态',
		type: 'input'
	},
	{
		key: 'scene_type',
		value: '场所类型',
		type: 'input'
	},
	{
		key: 'dispatchStatus',
		value: '派发状态',
		type: 'input'
	},
	// create_time
	{
		key: 'create_time',
		value: '创建时间',
		type: 'input'
	},



	// 第六页

	{
		key: 'origin_place',
		value: '出发地',
		type: 'input'

	},
	{
		key: 'code_color',
		value: '码色',
		type: 'input'

	},
	{
		key: 'destination_place',
		value: '目的地',
		type: 'input'

	},
	{
		key: 'departure_time',
		value: '返乡时间',
		type: 'input'

	},

	// 第七页 入豫人员管理
	// 姓名---
	// 身份证
	{
		key: 'id_card_num',
		value: '身份证号码',
		type: 'input',

	},
	// 手机号码---
	// 派发状态--
	// 返乡时间
	{
		key: 'record_time',
		value: '返乡时间',
		type: 'input',

	},
	// 返回方式
	{
		key: 'travel_type',
		value: '返回方式',
		type: 'input',
		map: {
			"其他": "其他",
			1: "驾车",
			2: "火车",
			3: "飞机",
			4: "其他"
		}

	},
	// 出发地
	{
		key: 'depart_detail_address',
		value: '出发地',
		type: 'input',

	},
	// 目的地

	{
		key: 'dest_detail_address',
		value: '目的地',
		type: 'input',

	},


	// 第八页
	// 身份证号
	{
		key: 'id_card',
		value: '身份证号',
		type: 'input',

	},
	// 出发地
	{
		key: 'origin_place',
		value: '出发地',
		type: 'input',

	},
	// 目的地 destination_place
	{
		key: 'destination_place',
		value: '目的地',
		type: 'input',

	},
	// 中高风险
	{
		key: 'is_risk_area',
		value: '中高风险',
		type: 'input',
		map: {
			1: "是",
			2: "否",

		}

	},
	// 是否核酸 is_nucleic_acid
	{
		key: 'is_nucleic_acid',
		value: '是否核酸',
		type: 'input',
		map: {
			"-": "否",
			1: "是",
			2: "否",

		}

	},
	// 码色
	{
		key: 'code_color',
		value: '码色',
		type: 'input',

	},

	// 返乡人
	// is_back_personnel
	{
		key: 'is_back_personnel',
		value: '返乡人员',
		type: 'input',
		map: {
			0: "否",
			1: "是",
			2: "否"
		}

	},
	// 派发至
	{
		key: 'address',
		value: '行政区划',
		type: 'input',
	},
	// 是否转派
	{
		key: 'transfer_status',
		value: '是否转派',
		type: 'input',
	},
	// 转派时间
	{
		key: 'transfer_time',
		value: '转派时间',
		type: 'input',

	},

	// 第九页







]

export default info;
