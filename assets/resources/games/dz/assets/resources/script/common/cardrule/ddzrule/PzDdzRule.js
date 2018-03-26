'use strict' ;
var DdzUtil = ('undefined' == typeof(cc)) ? require('./DdzUtil') : require('DdzUtil') ;
var DdzConst = ('undefined' == typeof(cc)) ? require('./DdzConst') : require('DdzConst') ;
var DdzRule = ('undefined' == typeof(cc)) ? require('./DdzRule') : require('DdzRule') ;
var LzDdzRule = ('undefined' == typeof(cc)) ? require('./LzDdzRule') : require('LzDdzRule') ;

/**
 * getHandCard() return type
 *
 * des: 类型的中文描述
 * handType: 类型的英文描述
 * points: [Array] 点数数组
 * mainPoints: [Array] 主数点数数组 (可选)
 * beltPoints: [Array] 携带点数数组 (可选)
 * mainValue:  [int] 主数值
 * keepCount:  [int] 像 顺子 连队 飞机 连续的个数
 * {des: '王炸', handType: 'Single', points: [3], mainPoints:[], beltPoints:[], mainValue: 3, keepCount
 *
 * 	癞子添加
 *  癞子数组		 癞子变牌数组(服务器不需要，客户端可能需要)
 * 	laiziPoints:[], laiziChangePoints:[]
 *
 * }
 * points: 正常手牌点数数组
 * laiziPoints: 癞子手牌点数数组
 * getHandCard:(points, laziPoints)
 */
// 手牌类型
var HandCardList = {
	Single: LzDdzRule.HandCardList.Single,

	Double: LzDdzRule.HandCardList.Double,

	Straight: LzDdzRule.HandCardList.Straight,

	DoubleStraight: LzDdzRule.HandCardList.DoubleStraight,

	Triplets: LzDdzRule.HandCardList.Triplets,

	TripletsBeltSingle: LzDdzRule.HandCardList.TripletsBeltSingle,

	TripletsBeltDouble: LzDdzRule.HandCardList.TripletsBeltDouble,

	Airplane: LzDdzRule.HandCardList.Airplane,

	AirplaneBeltSingle: LzDdzRule.HandCardList.AirplaneBeltSingle,
	AirplaneOneSingle: LzDdzRule.HandCardList.AirplaneOneSingle,
	AirplaneTowDouble: LzDdzRule.HandCardList.AirplaneTowDouble,

	AirplaneBeltDouble: LzDdzRule.HandCardList.AirplaneBeltDouble,

	FourCardsBeltTwo: LzDdzRule.HandCardList.FourCardsBeltTwo,
	FourCardsBeltTwoWithSingle: LzDdzRule.HandCardList.FourCardsBeltTwoWithSingle,
	FourCardsBeltTwoWithDouble: LzDdzRule.HandCardList.FourCardsBeltTwoWithDouble,
	FourCardsBeltTwoDouble: LzDdzRule.HandCardList.FourCardsBeltTwoDouble,

	// 皮子没有软炸
	// SoftBomb: LzDdzRule.HandCardList.SoftBomb,

	Bomb: {
		des: '炸弹', // 3333 or 4444
		handType: DdzConst.HandType.Bomb.value, // 手牌类型值
		level: DdzConst.HandType.Bomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			var length = points.length + laiziPoints.length ;
			if(length == 4){
				// 判断points 值是否一致
				let valueSame = points.every((p)=> p == points[0]) ;

				// points 里 值相同
				if(valueSame){
					var retPoints = [] ;
					var retLaiziChangePoints = [] ;

					for(let i = 0 ; i < length ; i++){
						retPoints.push(points[0]) ;
					}

					for(let i = 0 ; i < laiziPoints.length ; i++){
						retLaiziChangePoints.push(points[0]) ;
					}

					return DdzUtil.creatHandCard(this,
										{points: retPoints, mainValue: retPoints[0], mainPoints: retPoints,
										laiziPoints: laiziPoints, bombCount: length,
										laiziChangePoints: retLaiziChangePoints}) ;
				}
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points, laiziPoints){
			var length = points.length + laiziPoints.length ;
			var mainValue = (this.level == handCards.level) ? handCards.mainValue : 0 ;
			var retArr = [] ;
			// 从A - 3 判断 是否可以组成三顺
			for(let i = 15 ; i > mainValue ; i--){
				let keepArr = DdzUtil.getKeepData(points, i, i, 4) ;

				// 癞子可以补充完整
				if(keepArr.loseArr.length <= laiziPoints.length){
					// 不能全是癞子
					let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length) ;
					if(keepArr.existArr.length >= 1){
						let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr ;
						retArr.push(DdzUtil.creatHandCard(this,
										{points: pts, mainValue: pts[0],
										laiziPoints: useLaiziPoints,
										laiziChangePoints: keepArr.loseArr})) ;
					}
				}
			}

			// 升序排序
			if(retArr.length > 0){
				retArr.sort((a, b) => a.mainValue - b.mainValue) ;
			}

			return retArr ;
		}
	},

	KingBomb: {
		des: '王炸', // 3333 or 4444
		handType: DdzConst.HandType.KingBomb.value, // 手牌类型值
		level: DdzConst.HandType.KingBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			let length = points.length + laiziPoints.length ;
			if(2 == length){
				if(0 == laiziPoints.length){
					return DdzRule.HandCardList.KingBomb.getHandCard(points) ;
				}
				else
				{
					// 如果不包含大小王
					let p = points[0] ;
					if(55 !== p && 50 !== p){
						return false ;
					}
					let laiziChange = 0 ;
					if(55 == points[0]){
						laiziChange = 50 ;
					}
					else if(50 == points[0]){
						laiziChange = 55 ;
					}

					return DdzUtil.creatHandCard(this,
										{points: [55, 50], mainValue: 55,
										mainPoints: [55, 50],
										laiziPoints: laiziPoints, laiziChangePoints: [laiziChange]}) ;
				}
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points, laiziPoints){
			let findX = (-1 == points.indexOf(50)) ? false : true ;
			let findY = (-1 == points.indexOf(55)) ? false : true ;
			let retArr = [] ;
			// 大小王 都在
			if(findX && findY){
				retArr.push(DdzUtil.creatHandCard(this,
									{points: [55, 50], mainValue: 55,
									mainPoints: [55, 50]})) ;
			}

			// 小王和癞子存在
			if(findX && 1 == laiziPoints.length){
				retArr.push(DdzUtil.creatHandCard(this,
									{points: [55, 50], mainValue: 55,
									mainPoints: [55, 50], laiziPoints: laiziPoints,
									laiziChangePoints: [55]})) ;
			}

			// 大王和癞子存在
			if(findY && 1 == laiziPoints.length){
				retArr.push(DdzUtil.creatHandCard(this,
									{points: [55, 50], mainValue: 55,
									mainPoints: [55, 50], laiziPoints:laiziPoints,
									laiziChangePoints: [50]})) ;
			}

			return retArr ;
		}
	},

	// 王炸（皮子匹配不算）
	KingBombWithNoPZ: {
		des: '王炸不带皮子',
		handType: DdzConst.HandType.KingBombWithNoPZ.value, // 手牌类型值
		level: DdzConst.HandType.KingBombWithNoPZ.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			let length = points.length + laiziPoints.length ;
			if(2 == length){
				if(0 == laiziPoints.length){
					let hand = DdzRule.HandCardList.KingBomb.getHandCard(points) ;
					if(hand){
						hand.handType = this.handType ;
						hand.level = this.level ;
						hand.des = this.des ;
					}
					return hand ;
				}
			}
			return false ;
		},

		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points){
			return DdzRule.HandCardList.KingBomb.getAllCombo(handCards, points) ;
		}
	},

	ZhongBomb:{
		des: '重炸', // 3333 or 4444
		handType: DdzConst.HandType.ZhongBomb.value, // 手牌类型值
		level: DdzConst.HandType.ZhongBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			let length = points.length + laiziPoints.length ;

			// 4张的重炸
			if(5 == length){
				if(1 == laiziPoints.length){
					let theSame = points.every((p)=> p == points[0]) ;
					if(theSame){
						return DdzUtil.creatHandCard(this,
											{points: points.concat(laiziPoints), mainValue: points[0],
											mainPoints: points.concat(laiziPoints),
											laiziPoints: laiziPoints, laiziChangePoints: laiziPoints}) ;
					}
				}
			}
			// 王重炸
			else if(3 == length){
				let findX = points.indexOf(50) ;
				let findY = points.indexOf(55) ;
				let findP = laiziPoints.indexOf(0) ;
				if(1 == laiziPoints.length && -1 != findX && -1 != findY){
					return DdzUtil.creatHandCard(this,
										{points: points.concat(laiziPoints), mainValue: points[0],
										mainPoints: points.concat(laiziPoints),
										laiziPoints: laiziPoints, laiziChangePoints: laiziPoints}) ;
				}
				// 特殊情况 在上家手牌中出现了 癞子和正常牌值在一起的情况
				else if(-1 != findX && -1 != findY && -1 != findP){
					return DdzUtil.creatHandCard(this,
										{points: points, mainValue: points[0],
										mainPoints: points,
										laiziPoints: laiziPoints, laiziChangePoints: laiziPoints}) ;
				}
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points, laiziPoints){
			let retArr = [] ;
			if(1 == laiziPoints.length){
				let arr = DdzUtil.getSpecialSortArr(points) ;
				let fourArr = arr.fourArr ;
				let uniqueArr = [] ;

				fourArr.forEach((v)=> {
					if(-1 === uniqueArr.indexOf(v)){
						uniqueArr.push(v) ;
					}
				}) ;

				// 普通炸的重炸
				uniqueArr.forEach((v) =>{
					retArr.push(DdzUtil.creatHandCard(this,
										{points: [v, v, v, v, laiziPoints[0]], mainValue: v,
										mainPoints: [v, v, v, v],
										laiziPoints: laiziPoints, laiziChangePoints: laiziPoints})) ;
				}) ;

				// 双王重炸
				if(-1 != points.indexOf(55) &&
					-1 != points.indexOf(50)){
					retArr.push(DdzUtil.creatHandCard(this,
										{points: [55, 50, laiziPoints[0]], mainValue: 55,
										mainPoints: [55, 50, laiziPoints[0]],
										laiziPoints: laiziPoints, laiziChangePoints: laiziPoints})) ;
				}
			}

			return retArr ;
		}
	},

	ZhongBombNoPzKing:{
		des: '重炸不带王', // 3333 or 4444
		handType: DdzConst.HandType.ZhongBombNoPzKing.value, // 手牌类型值
		level: DdzConst.HandType.ZhongBombNoPzKing.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			let length = points.length + laiziPoints.length ;

			// 4张的重炸
			if(5 == length){
				if(1 == laiziPoints.length){
					let theSame = points.every((p)=> p == points[0]) ;
					if(theSame){
						return DdzUtil.creatHandCard(this,
											{points: points.concat(laiziPoints), mainValue: points[0],
											mainPoints: points.concat(laiziPoints),
											laiziPoints: laiziPoints, laiziChangePoints: laiziPoints}) ;
					}
				}
			}
			return false ;
		},

		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points, laiziPoints){
			let retArr = [] ;
			if(1 == laiziPoints.length){
				let arr = DdzUtil.getSpecialSortArr(points) ;
				let fourArr = arr.fourArr ;
				let uniqueArr = [] ;

				fourArr.forEach((v)=> {
					if(-1 === uniqueArr.indexOf(v)){
						uniqueArr.push(v) ;
					}
				}) ;

				// 普通炸的重炸
				uniqueArr.forEach((v) =>{
					retArr.push(DdzUtil.creatHandCard(this,
										{points: [v, v, v, v, laiziPoints[0]], mainValue: v,
										mainPoints: [v, v, v, v],
										laiziPoints: laiziPoints, laiziChangePoints: laiziPoints})) ;
				}) ;
			}

			return retArr ;
		}
	},

	LianBomb:{
		des: '连炸', // 3333 or 4444
		handType: DdzConst.HandType.LianBomb.value, // 手牌类型值
		level: DdzConst.HandType.LianBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			let length = points.length + laiziPoints.length ;
			if(8 == length && -1 == points.indexOf(15)){
				var leftFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 4, 2, true) ;
				if(leftFillArr && leftFillArr.keepCount == 2){
					return DdzUtil.creatHandCard(this,
									{points: leftFillArr.points, mainValue: leftFillArr.points[0],
									mainPoints: leftFillArr.points, keepCount: leftFillArr.keepCount,
									laiziPoints: leftFillArr.laiziPoints,
									laiziChangePoints: leftFillArr.laiziChangePoints}) ;
				}
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points, laiziPoints){
			var length = points.length + laiziPoints.length ;
			var mainValue = (this.level == handCards.level) ? handCards.mainValue : 0 ;
			var retArr = [] ;
			// 从A - 3 判断 是否可以组成三顺
			for(let i = 14 ; i > mainValue ; i--){
				let keepArr = DdzUtil.getKeepData(points, i - 1, i, 4) ;

				// 癞子可以补充完整
				if(keepArr.loseArr.length <= laiziPoints.length){
					// 不能全是癞子
					let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length) ;
					if(keepArr.existArr.length >= 1){
						let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr ;
						retArr.push(DdzUtil.creatHandCard(this,
										{points: pts, mainValue: pts[0],
										laiziPoints: useLaiziPoints,
										laiziChangePoints: keepArr.loseArr})) ;
					}
				}
			}

			// 升序排序
			if(retArr.length > 0){
				retArr.sort((a, b) => a.mainValue - b.mainValue) ;
			}
			return retArr;
		}
	},
} ;

var ddz = {

	//	获取手牌类型
	getHandCards: function(_cards, _laiziCards){
		let tmpHandCardList = LzDdzRule.getHandCardList() ;
		LzDdzRule.setHandCardList(HandCardList) ;
		let ret = LzDdzRule.ddz.getHandCards(_cards, _laiziCards) ;
		LzDdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	getAllCombo: function(handType, upCards, upLaiziCards, selfCards, laiziCards){
		let tmpHandCardList = LzDdzRule.getHandCardList() ;
		LzDdzRule.setHandCardList(HandCardList) ;
		let ret = LzDdzRule.ddz.getAllCombo(handType, upCards, upLaiziCards, selfCards, laiziCards) ;
		LzDdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	}
} ;

var rule = {

	/**
	 * 检查出牌是否正确
	 * @param cards 包含癞子牌
	 * @param laiziCards 同种类癞子牌 只包含一张
	 * @returns {boolean}
	 */
	isCardsValid: function(cards, laiziCards) {
		let tmpHandCardList = LzDdzRule.getHandCardList() ;
		LzDdzRule.setHandCardList(HandCardList) ;
		let ret = LzDdzRule.rule.isCardsValid(cards, laiziCards) ;
		LzDdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 对比牌型是否大小
	 * @param playerCards Array 自己手牌
	 * @param targetCards  Array 比较牌型
	 * @param {handType} string 手牌类型(可选)
	 * @returns {boolean}
	 */
	isCardsGreater: function(playerCards, laiziCards, targetCards, targetLaiziCards, handType){
		let tmpHandCardList = LzDdzRule.getHandCardList() ;
		LzDdzRule.setHandCardList(HandCardList) ;
		let ret = LzDdzRule.rule.isCardsGreater(playerCards, laiziCards, targetCards, targetLaiziCards, handType) ;
		LzDdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 获取可能存在的手牌类型
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} laiziCards 癞子牌
	 * @return {Array}             手牌组合数组
	 */
	getHandTypes: function(playerCards, laiziCards, targetCards, targetLaiziCards,handType){
		let tmpHandCardList = LzDdzRule.getHandCardList() ;
		LzDdzRule.setHandCardList(HandCardList) ;
		let ret = LzDdzRule.rule.getHandTypes(playerCards, laiziCards, targetCards, targetLaiziCards, handType) ;
		LzDdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 获取大过目标牌型的所有手牌组合
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} targetCards 目标手牌
	 * @param  {string} handType   （可选）
	 * @return {Array}             手牌组合数组
	 */
	getTargetCards: function(playerCards, laiziCards, targetCards, targetLaiziCards, handType) {
		let tmpHandCardList = LzDdzRule.getHandCardList() ;
		LzDdzRule.setHandCardList(HandCardList) ;
		let ret = LzDdzRule.rule.getTargetCards(playerCards, laiziCards, targetCards, targetLaiziCards, handType) ;
		LzDdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 获取手牌中的顺子
	 * @param  {Array} playerCards 玩家手牌
	 * @return {Array}             顺子手牌 或者 原样不变返回
	 */
	getStraightHards: function(playerCards){
		let tmpHandCardList = LzDdzRule.getHandCardList() ;
		LzDdzRule.setHandCardList(HandCardList) ;
		let ret = LzDdzRule.rule.getStraightHards(playerCards) ;
		LzDdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},
} ;

var e = {
	ddz: ddz,
	rule: rule,
	HandCardList: HandCardList,
	getHandCardList: function(){return HandCardList ;},
	setHandCardList: function(handCardList){
		this.HandCardList = handCardList ;
		HandCardList = handCardList ;
	}
}
module.exports = e ;