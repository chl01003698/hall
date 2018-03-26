'use strict' ;

/**
 * 所有斗地的主常量定义
 */
var c = {
	// 牌点数
	CardPoints: [3, 4, 5, 6, 7, 8 , 9, 10, 11, 12, 13, 14, 15, 50, 55], // 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A, 2

	// 牌类型 片 花 红 黑 王
	CardType: [1, 2, 3, 4, 5],

	// 牌值
	// 百位代表牌类型 十位和 个位代表牌点数 千位 代表癞子
	CardValue: [
		103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, // 3, 4, 5 .... J, Q, K, A, 2
		203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215,
		303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315,
		403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415,
		550, 555 // 大王，小王 癞子是正常值 + 1000
	],

	// 牌点数
	CardPoint: [
		3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, // 3, 4, 5 .... J, Q, K, A, 2
		50, 55, // 大王，小王, 癞子点数
	],


	// var card = {
	//     suit : {spade : 0, heart : 1, club : 2, diamond : 3, joker : 4},
	//     pack : [],
	//     points : ['3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A', '2'],
	//     joker: 'X',
	//     jokerRed: 'Y',
	//     handTypes: {
	//         ROCKET: 0,  //火箭
	//         BOMB: 1,    //炸弹
	//         SOLO: 2,    //单张
	//         PAIR: 3,    //对
	//         STRAIGHT: 4, //顺子
	//         CONSECUTIVE_PAIRS: 5,  //连对
	//         TRIO: 6,   //三张
	//         TRIO_SOLO: 7, //三带一
	//         TRIO_PAIR: 8,  //三带对
	//         AIRPLANE: 9,  // 飞机
	//         AIRPLANE_SOLO: 10, //飞机带2单
	//         AIRPLANE_PAIR: 11, //飞机带2对
	//         SPACE_SHUTTLE_SOLO: 12,  //四带2单
	//         SPACE_SHUTTLE_PAIR:13,   //四带2对
	//     }
	// };

	// 自身牌值
	CardSelf: {

	    '03': 103, '04': 104, '05': 105, '06': 106, '07': 107, '08': 108, '09': 109,
	    '00': 110, '0J': 111, '0Q': 112, '0K': 113, '0A': 114, '02': 115,

	    '13': 203, '14': 204, '15': 205, '16': 206, '17': 207, '18': 208, '19': 209,
	    '10': 210, '1J': 211, '1Q': 212, '1K': 213, '1A': 214, '12': 215,

	    '23': 303, '24': 304, '25': 305, '26': 306, '27': 307, '28': 308, '29': 309,
	    '20': 310, '2J': 311, '2Q': 312, '2K': 313, '2A': 314, '22': 315,

	    '33': 403, '34': 404, '35': 405, '36': 406, '37': 407, '38': 408, '39': 409,
	    '30': 410, '3J': 411, '3Q': 412, '3K': 413, '3A': 414, '32': 415,

	    '4X': 550, '4Y': 555
	},

	// 外部牌值
	CardExtern:{
	    [103]: '03', [104]: '04', [105]: '05', [106]: '06', [107]: '07', [108]: '08', [109]: '09',
	    [110]: '00', [111]: '0J', [112]: '0Q', [113]: '0K', [114]: '0A', [115]: '02',

	    [203]: '13', [204]: '14', [205]: '15', [206]: '16', [207]: '17', [208]: '18', [209]: '19',
	    [210]: '10', [211]: '1J', [212]: '1Q', [213]: '1K', [214]: '1A', [215]: '12',

	    [303]: '23', [304]: '24', [305]: '25', [306]: '26', [307]: '27', [308]: '28', [309]: '29',
	    [310]: '20', [311]: '2J', [312]: '2Q', [313]: '2K', [314]: '2A', [315]: '22',

	    [403]: '33', [404]: '34', [405]: '35', [406]: '36', [407]: '37', [408]: '38', [409]: '39',
	    [410]: '30', [411]: '3J', [412]: '3Q', [413]: '3K', [414]: '3A', [415]: '32',
	    [550]: '4X', [555]: '4Y'
	},

	// 主值转换
	MainValueExtern:{
		[0]: 'P', // 皮子
		[3]: '3',
		[4]: '4',
		[5]: '5',
		[6]: '6',
		[7]: '7',
		[8]: '8',
		[9]: '9',
		[10]: '0',
		[11]: 'J',
		[12]: 'Q',
		[13]: 'K',
		[14]: 'A',
		[15]: '2',
		[50]: 'X',
		[55]: 'Y',
	},

	// 玩法类型
	PlayType:{
		ddz3: 'ddz3', // 经典斗地主
		ddz2: 'ddz2', // 二人斗地主
		sdddz: 'sd3', // 闪电斗地主
		lzddz: 'lz3', // 癞子斗地主
		ddz4: 'ddz4', // 四人斗地主
		tdddz: 'tdlz3', //天地癞子
		pzddz: 'pz3', //皮子玩法
	},

	// 斗地主 手牌类型
	HandType:{
		// 单牌
		Single: {
			value: 'Single',
			level: 1
		},

		// 对牌
		Double: {
			value: 'Double',
			level: 1
		},

		// 顺子
		Straight: {
			value: 'Straight',
			level: 1
		},

		// 连对
		DoubleStraight: {
			value: 'DoubleStraight',
			level: 1
		},

		// 三张一样的
		Triplets: {
			value: 'Triplets',
			level: 1
		},

		// 三带一
		TripletsBeltSingle: {
			value: 'TripletsBeltSingle',
			level: 1
		},

		// 三带对
		TripletsBeltDouble: {
			value: 'TripletsBeltDouble',
			level: 1
		},

		// 飞机
		Airplane: {
			value: 'Airplane',
			level: 1
		},

		// 飞机带单
		AirplaneBeltSingle: {
			value: 'AirplaneBeltSingle',
			level: 1
		},
		//飞机带一对
		AirplaneOneSingle:{
			value: 'AirplaneOneSingle',
			level: 1
		},
		//飞机带两队
		AirplaneTowDouble:{
			value:'AirplaneTowDouble',
			level: 1
		},
		// 飞机带对
		AirplaneBeltDouble: {
			value: 'AirplaneBeltDouble',
			level: 1
		},

		// 四带二
		FourCardsBeltTwo: {
			value: 'FourCardsBeltTwo',
			level: 1
		},

		// 四带二(只能带单)
		FourCardsBeltTwoWithSingle: {
			value: 'FourCardsBeltTwoWithSingle',
			level: 1
		},

		// 四带二(只能带对)
		FourCardsBeltTwoWithDouble: {
			value: 'FourCardsBeltTwoWithDouble',
			level: 1
		},


		// 四带一
		FourCardsBeltSingle: {
			value: 'FourCardsBeltSingle',
			level: 1
		},

		// 四带两对
		FourCardsBeltTwoDouble: {
			value: 'FourCardsBeltTwoDouble',
			level: 1
		},

		// 炸弹
		Bomb: {
			value: 'Bomb',
			level: 3
		},

		// 王炸
		KingBomb: {
			value: 'KingBomb',
			level: 5
		},

		// 四人玩法添加
		// 天王炸
		TopKingBomb: {
			value: 'TopKingBomb',
			level: 10
		},

		// 癞子玩法 添加
		// 软炸
		SoftBomb: {
			value: 'SoftBomb',
			level: 2
		},

		// 癞炸
		LaiBomb: {
			value: 'LaiBomb',
			level: 4
		},

		// 皮子玩法添加
		// 重炸
		ZhongBomb:{
			value: 'ZhongBomb',
			level: 6
		},
		// 重炸里皮子不能和王匹配
		ZhongBombNoPzKing:{
			value: 'ZhongBomb',
			level: 6
		},
		// 连炸
		LianBomb:{
			value: 'LianBomb',
			level: 7
		},

		// 王炸（皮子匹配不算）
		KingBombWithNoPZ: {
			value: 'KingBombWithNoPZ',
			level: 5
		},
	},
} ;

module.exports = c ;



