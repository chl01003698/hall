'use strict' ;
// 三张过滤映射表
let TripletsFilterTable = {
	'1': 'TripletsBeltSingle',
	'2': 'TripletsBeltDouble'
};

// 飞机映射过滤表
let AirplaneFilterTable = {
	'1': 'AirplaneOneSingle',
	'2': 'AirplaneTowDouble'
};

// 四张映射过滤表
let FourCardFilterTable = {
	'1': 'FourCardsBeltTwoWithSingle',
	'2': 'FourCardsBeltTwoWithDouble'
} ;

// 皮子映射过滤表
let PzFilterTable = {
	'1': 'ZhongBomb',
	'2': 'KingBomb',
	no: {
		'1': 'ZhongBombNoPzKing',
		'2': 'KingBombWithNoPZ',
	}
} ;
	// 王炸
let KingBomb= {
		value: 'KingBomb',
		level: 5
};
let pick = function(obj, propArr) {
	let ret = obj ;
	propArr.forEach((v) => ret = ret[v]) ;
	return ret ;
} ;

let valueProcess = function(arr, include, succFunc, errFunc){
	let ret = (-1 == arr.indexOf(include)) ? errFunc() : succFunc() ;
};

/**
 * 返回过滤列表
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function getFilterTable(config){

	// 三张配置
	let retArr = [] ;
	let three = pick(config, ['article3']) ;
	valueProcess(three, 1, () => retArr.push(TripletsFilterTable['1']), ()=> 1) ;
	valueProcess(three, 2, () => retArr.push(TripletsFilterTable['2']), ()=> 1) ;


	// 飞机配置
	let air = pick(config, ['plane']) ;
	valueProcess(air, 1, () => retArr.push(AirplaneFilterTable['1']), ()=> 1) ;  //飞机  1不可带一对  
	valueProcess(air, 2, () => retArr.push(AirplaneFilterTable['2']), ()=> 1) ; //飞机 2不可带2对

	// 四张配置
	let four = pick(config, ['four']) ;
	valueProcess(four, 1, () => retArr.push(FourCardFilterTable['1']), ()=> 1) ;
	valueProcess(four, 2, () => retArr.push(FourCardFilterTable['2']), ()=> 1) ;

	// 默认过滤掉四带二
	if(!(-1 !== four.indexOf(1) && -1 !== four.indexOf(2))){
		retArr.push('FourCardsBeltTwo') ;
	}

	// 皮子配置
	let pz = pick(config, ['pzPw']) ;
	if(pz){
		valueProcess(pz, 1, () => retArr.push(PzFilterTable['1']),
								() => retArr.push(PzFilterTable.no['1'])) ;
		valueProcess(pz, 2, () => retArr.push(PzFilterTable['2']),
								() => retArr.push(PzFilterTable.no['2'])) ;
	}
	return retArr ;
}

/**
 * 过滤最后不能出
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function getEndHandFilter(config){

	// 三张配置
	let retArr = [] ;
	let three = pick(config, ['article3']) ;
	valueProcess(three, 3, () => retArr.push('Triplets'), ()=> 1) ;

	// 飞机配置
	let air = pick(config, ['plane']) ;
	valueProcess(air, 3, () => retArr.push('Airplane'), ()=> 1) ;
	return retArr ;
}

module.exports.getFilterTable = getFilterTable ;
module.exports.getEndHandFilter = getEndHandFilter ;