'use strict' ;
var DdzUtil = ('undefined' == typeof(cc)) ? require('./DdzUtil') : require('DdzUtil') ;
var DdzConst = ('undefined' == typeof(cc)) ? require('./DdzConst') : require('DdzConst') ;
var DdzRule = ('undefined' == typeof(cc)) ? require('./DdzRule') : require('DdzRule') ;

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
	Single: DdzRule.HandCardList.Single,

	Double: DdzRule.HandCardList.Double,

	Straight: {
		des: '顺子',	// 5, 6, 7, 8 , 9
		handType: DdzConst.HandType.Straight.value, // 手牌类型值
		level: DdzConst.HandType.Straight.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points){
			// 连续数字个数大于3 并且 (2 不能在其中)
			var keepCount = DdzUtil.getKeepCount(points) ;
			if(3 <= keepCount  &&
				points.length == keepCount &&
				15 != points[0]){
				return {des: this.des, handType: this.handType, level: this.level,
						points: points, mainValue: points[0], keepCount: keepCount} ;
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points){
			var mainValue = handCard.mainValue ;
			var keepCount = handCard.keepCount ;
			var retArr = [] ;

			// 上家手牌 数量大于自己手牌数量
			if(handCard.points.length > points.length){
				return retArr ;
			}

			// A带头顺子，没必要继续
			if(14 == mainValue){
				return retArr ;
			}

			//	遍历可用数组
			for(let i = 14; i > mainValue ; i--){
				let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 1) ;
				if(keepArr.maxKeepCount == keepCount){
					retArr.push({des: this.des, handType: this.handType, level: this.level,
								points: keepArr.existArr, mainValue: i, keepCount: keepCount}) ;
				}
			}

			// 升序排序
			if(retArr.length > 0){
				retArr.sort((a, b) => a.mainValue - b.mainValue) ;
			}

			return retArr ;
		}
	},

	DoubleStraight: {
		des: '连对', // 33, 44, or 33, 44, 55
		handType: DdzConst.HandType.DoubleStraight.value, // 手牌类型值
		level: DdzConst.HandType.DoubleStraight.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points){
			// 长度大于 6 并且 长度可以 %2 == 0, 2不在其中
			if( 6 <= points.length &&
				0 == points.length % 2 &&
				15 != points[0]){
				var doubleMainValueArr = [] ;
				for(let i = 0 ; i < points.length ; i = i + 2){
					if(points[i] == points[i + 1]){
						doubleMainValueArr.push(points[i]) ;
					}
					else
					{
						return false ;
					}
				}

				// 连续3个以上的对
				var keepCount = DdzUtil.getKeepCount(doubleMainValueArr) ;
				if(2 <= keepCount && keepCount == doubleMainValueArr.length){
					return {des: this.des, handType: this.handType, level: this.level,
							points: points, mainValue: points[0], keepCount: keepCount} ;
				}
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points){
			var mainValue = handCard.mainValue ;
			var keepCount = handCard.keepCount ;
			var retArr = [] ;

			// 上家手牌 数量大于自己手牌数量
			if(handCard.points.length > points.length){
				return retArr ;
			}

			// A带头连对，没必要继续
			if(14 == mainValue){
				return retArr ;
			}

			//	遍历可用数组
			for(let i = 14; i > mainValue ; i--){
				let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 2) ;
				if(keepArr.maxKeepCount == keepCount){
					retArr.push({des: this.des, handType: this.handType, level: this.level,
								points: keepArr.existArr, mainValue: i, keepCount: keepCount}) ;
				}
			}

			// 升序排序
			if(retArr.length > 0){
				retArr.sort((a, b) => a.mainValue - b.mainValue) ;
			}

			return retArr ;
		}
	},

	Triplets: DdzRule.HandCardList.Triplets,

	TripletsBeltSingle: DdzRule.HandCardList.TripletsBeltSingle,

	TripletsBeltDouble: DdzRule.HandCardList.TripletsBeltDouble,

	Airplane: DdzRule.HandCardList.Airplane,

	AirplaneBeltSingle: DdzRule.HandCardList.AirplaneBeltSingle,

	AirplaneBeltDouble: DdzRule.HandCardList.AirplaneBeltDouble,

	AirplaneOneSingle:DdzRule.HandCardList.AirplaneOneSingle,
	AirplaneTowDouble:DdzRule.HandCardList.AirplaneTowDouble,

	// 四带二
	FourCardsBeltTwo: DdzRule.HandCardList.FourCardsBeltTwo,
	FourCardsBeltTwoWithSingle: DdzRule.HandCardList.FourCardsBeltTwoWithSingle,
	FourCardsBeltTwoWithDouble: DdzRule.HandCardList.FourCardsBeltTwoWithDouble,
	FourCardsBeltTwoDouble: DdzRule.HandCardList.FourCardsBeltTwoDouble,

	Bomb: DdzRule.HandCardList.Bomb,

	KingBomb: DdzRule.HandCardList.KingBomb,
} ;

var ddz = {

	//	获取手牌类型
	getHandCards: function(_cards, _laiziCards){
		let tmpHandCardList = DdzRule.getHandCardList() ;
		DdzRule.setHandCardList(HandCardList) ;
		let ret = DdzRule.ddz.getHandCards(_cards, _laiziCards) ;
		DdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	getAllCombo: function(handType, upCards, selfCards, laiziCards){
		let tmpHandCardList = DdzRule.getHandCardList() ;
		DdzRule.setHandCardList(HandCardList) ;
		let ret = DdzRule.ddz.getAllCombo(handType, upCards, selfCards, laiziCards) ;
		DdzRule.setHandCardList(tmpHandCardList) ;
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
	isCardsValid: function(cards) {
		let tmpHandCardList = DdzRule.getHandCardList() ;
		DdzRule.setHandCardList(HandCardList) ;
		let ret = DdzRule.rule.isCardsValid(cards) ;
		DdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 对比牌型是否大小
	 * @param playerCards Array 自己手牌
	 * @param targetCards  Array 比较牌型
	 * @param {handType} string 手牌类型(可选)
	 * @returns {boolean}
	 */
	isCardsGreater: function(playerCards, targetCards, handType){
		let tmpHandCardList = DdzRule.getHandCardList() ;
		DdzRule.setHandCardList(HandCardList) ;
		let ret = DdzRule.rule.isCardsGreater(playerCards, targetCards, handType) ;
		DdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 获取可能存在的手牌类型
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} laiziCards 癞子牌
	 * @return {Array}             手牌组合数组
	 */
	getHandTypes: function(playerCards, targetCards, handType){
		let tmpHandCardList = DdzRule.getHandCardList() ;
		DdzRule.setHandCardList(HandCardList) ;
		let ret = DdzRule.rule.getHandTypes(playerCards, targetCards, handType) ;
		DdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 获取大过目标牌型的所有手牌组合
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} targetCards 目标手牌
	 * @param  {string} handType   （可选）
	 * @return {Array}             手牌组合数组
	 */
	getTargetCards: function(playerCards, targetCards, handType) {
		let tmpHandCardList = DdzRule.getHandCardList() ;
		DdzRule.setHandCardList(HandCardList) ;
		let ret = DdzRule.rule.getTargetCards(playerCards, targetCards, handType) ;
		DdzRule.setHandCardList(tmpHandCardList) ;
		return ret ;
	},

	/**
	 * 获取手牌中的顺子
	 * @param  {Array} playerCards 玩家手牌
	 * @return {Array}             顺子手牌 或者 原样不变返回
	 */
	getStraightHards: function(playerCards){
		let tmpHandCardList = DdzRule.getHandCardList() ;
		DdzRule.setHandCardList(HandCardList) ;
		let ret = DdzRule.rule.getStraightHards(playerCards) ;
		DdzRule.setHandCardList(tmpHandCardList) ;
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