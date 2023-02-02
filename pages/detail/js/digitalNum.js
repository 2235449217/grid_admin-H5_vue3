//处理后端传过来数字代表的含义
export function digitalNum(data) {
	for (let item of data) {
		//判断健康码
		switch (item['code_color']) {
			case 1:
				item['code_color'] = '绿码';
				break;
			case 2:
				item['code_color'] = '黄码';
				break;
			case 3:
				item['code_color'] = '红码';
				break;
			case 4:
				item['code_color'] = '灰码';
				break;
		}
		//判断管控方式
		// switch (item['control_mode']) {
		// 	case 1:
		// 		item['control_mode'] = '集中隔离';
		// 		break;
		// 	case 2:
		// 		item['control_mode'] = '居家隔离';
		// 		break;
		// 	case 3:
		// 		item['control_mode'] = '居家健康检测';
		// 		break;
		// 	case 4:
		// 		item['control_mode'] = '失控状态';
		// 		break;
		// 	case 5:
		// 		item['control_mode'] = '解除管控';
		// 		break;
		// }
		//判断派发状态
		switch (item['dispatch_status']) {
			case 1:
				item['dispatch_status'] = '未派发';
				break;
			case 2:
				item['dispatch_status'] = '已派发';
				break;
		}
		//判断转派状态
		switch (item['transfer_status']) {
			case 1:
				item['transfer_status'] = '未转派';
				break;
			case 2:
				item['transfer_status'] = '转派中';
				break;
			case 3:
				item['transfer_status'] = '转派接受';
				break;
			case 4:
				item['transfer_status'] = '转派拒绝';
				break;
		}
		//判断返程交通方式
		switch (item['travel_type']) {
			case 1:
				item['travel_type'] = '驾车';
				break;
			case 2:
				item['travel_type'] = '火车';
				break;
			case 3:
				item['travel_type'] = '飞机';
				break;
			case 4:
				item['travel_type'] = '其他';
				break;
		}
		//判断是否去过高风险区域或接触高风险人员
		switch (item['is_risk_area']) {
			case 1:
				item['is_risk_area'] = '是';
				break;
			case 2:
				item['is_risk_area'] = '否';
				break;
		}
		//判断是否启用状态（是否有效）
		switch (item['enabling_status']) {
			case 1:
				item['enabling_status'] = '启用';
				break;
			case 2:  
				item['enabling_status'] = '停用';
				break;
		}
		// 是否核酸
		switch (item['is_nucleic_acid']) {
			case '1':
				item['is_nucleic_acid'] = '已达标';
				break;
			case '2':
				item['is_nucleic_acid'] = '未达标';
				break;
		}
		// 是否为返现人员
		switch (item['is_back_personnel']) {
			case 1:
				item['is_back_personnel'] = '是';
				break;
			case 2:
				item['is_back_personnel'] = '否';
				break;
		}
		// 中高风险
		switch (item['is_risk_area']) {
			case 1:
				item['is_risk_area'] = '是';
				break;
			case 2:
				item['is_risk_area'] = '否';
				break;
		}
		// 核查状态
		switch (item['is_verification']) {
			case 1:
				item['is_verification'] = '已核查';
				break;
			case 2:
				item['is_verification'] = '未核查';
				break;
		}
		//判断管控方式（区域协查）
		switch (item['is_control']) {
			case 1:
				item['is_control'] = '集中隔离';
				break;
			case 2:
				item['is_control'] = '居家隔离';
				break;
			case 3:
				item['is_control'] = '居家健康检测';
				break;
			case 4:
				item['is_control'] = '过期人员无需监控';
				break;
			case 5:
				item['is_control'] = '低风险地区无需管控';
				break;
		}
		//管控方式（区域协查）
		switch (item['control_mode']) {
			case 1:
				item['control_mode'] = '集中隔离';
				break;
			case 2:
				item['control_mode'] = '居家隔离';
				break;
			case 3:
				item['control_mode'] = '居家健康监测';
				break;
			case 4:
				item['control_mode'] = '低风险区管控';
				break;
			case 5:
				item['control_mode'] = '常态化管控';
				break;
			case 6:
				item['control_mode'] = '无需管控';
				break;
			case 7:
				item['control_mode'] = '失控状态';
				break;
			case 8:
				item['control_mode'] = '无法管控';
		}
		
	}
}
