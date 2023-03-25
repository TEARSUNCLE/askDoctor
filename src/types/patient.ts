/** 问诊记录-订单列表-请求参数 */
export interface requestOrderListType {
	current?: number
	pageSize?: number
	type?: number
}

/** 问诊记录-订单列表 */
export interface consultOrderListType {
	id: string;
	orderNo: string;
	type: string;
	typeValue: string;
	createTime: string;
	patientInfo: PatientInfo;
	illnessDesc: string;
	docInfo: DocInfo;
	status: number;
	// 处方id信息
	prescriptionId?: string,
	statusValue: string;
	cancelReason: string;
	cancelReasonValue: string;
	cancelProcess: string;
	payment: number;
	evaluateId?: number | string;
	illnessTime: number;
	// 评论id
	consultFlag: number;
}
export interface PatientInfo {
	name: string;
	idCard: string;
	gender: number;
	genderValue: string;
	age: number;
	id: string;
}
export interface DocInfo {
	name: string;
}

/** 问诊-订单详情 */
export interface orderDetailType {
	id: string;
	orderNo: string;
	type: string;
	createTime: string;
	patientInfo: PatientInfo;
	illnessDesc: string;
	prescriptionId: string;
	recordId: string;
	status: number;
	statusValue: string;
	docInfo: DocInfo;
	cancelProcess?: any;
	countdown: number;
	payment: number;
	pointDeduction: number;
	couponDeduction: number;
	actualPayment: number;
	creator: string;
	evaluateFlag: number;
	pictures: any[];
	illnessTime: number;
	consultFlag: number;
}
export interface PatientInfo {
	name: string;
	idCard: string;
	gender: number;
	genderValue: string;
	age: number;
	id: string;
}
export interface DocInfo {
	id: string;
	name: string;
	avatar: string;
	depName: string;
	positionalTitles: string;
	hospitalName: string;
	gradeName: string;
}

/** 问诊-新增患者请求参数 */
export interface createPatientType {
	name: string;
	idCard: string;
	defaultFlag: number;
	gender?: number;
	id?: string;
	genderValue?: string;
	age?: number
}

/** 问诊-患者信息档案 */
export interface patientInfoType {
	name: string;
	idCard: string;
	defaultFlag: number;
	gender: number;
	genderValue: string;
	age: number;
	id: string;
}

/** 找医生-科室 */
export interface depType {
	id: string;
	name: string;
	child: Child[];
}
export interface Child {
	id: string;
	name: string;
	avatar: string;
}

/** 问诊-支付请求参数 */
export interface requestOrderPreType {
	type?: number;
	illnessType?: number;
	useCoupon?: string;
	couponId?: string;
	docId?: string;
	patientId?: string;
	depId?: string;
}

/** 优惠券 */
export interface couponInfoType {
	payment: number;
	couponDeduction: number;
	couponId?: any;
	pointDeduction: number;
	actualPayment: number;
}

/** 图文问诊-疾病信息 */
export interface setIllnessType {
	illnessDesc: string;
	illnessTime: number | undefined;
	consultFlag: number | undefined;
	pictures: any[];
}

/** 问诊-构建订单参数 */
export interface buildOrderData {
	illnessDesc: string;
	illnessTime: number | undefined;
	consultFlag: number | undefined;
	pictures: any[];
	patientId: string | undefined;
	type: number;
	illnessType: number;
	depId: string;
	couponId: string | null;
}