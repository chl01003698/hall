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

	AirplaneBeltDouble: LzDdzRule.HandCardList.AirplaneBeltDouble,
	AirplaneTowDouble: LzDdzRule.HandCardList.AirplaneTowDouble,

	FourCardsBeltTwo: LzDdzRule.HandCardList.FourCardsBeltTwo,
	FourCardsBeltTwoWithSingle: LzDdzRule.HandCardList.FourCardsBeltTwoWithSingle,
	FourCardsBeltTwoWithDouble: LzDdzRule.HandCardList.FourCardsBeltTwoWithDouble,
	FourCardsBeltTwoDouble: LzDdzRule.HandCardList.FourCardsBeltTwoDouble,

	// 软炸
	SoftBomb: {
		des: '软炸', // 3333 or 4444
		handType: DdzConst.HandType.SoftBomb.value, // 手牌类型值
		level: DdzConst.HandType.LaiBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			var length = points.length + laiziPoints.length ;
			if(points.length > 0  && laiziPoints.length > 0 && length >= 4 &&
				-1 == points.indexOf(55) && -1 == points.indexOf(50)){
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
										laiziPoints: laiziPoints, bombCount: length, bombLevel: 1,
										laiziChangePoints: retLaiziChangePoints}) ;
				}
			}

		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points, laiziPoints){
			let length = points.length + laiziPoints.length ;
			let mainValue = (handCard.level == this.level) ? handCard.mainValue : 0 ;
			let bombCount = handCard.bombCount || 4 ;
			let retArr = [] ;
			if(0 == laiziPoints.length){
				return false ;
			}
			else{
				// 上家手牌数量
				if(length >= handCard.points.length){

					// 判断 4 到 12 炸弹个数
					for(let bCount = bombCount ; bCount < 13 ; bCount++){

						// 炸弹个数相同的情况下 如果是癞炸 或者 炸弹 不循环
						if(bCount == bombCount &&
							(handCard.handType === DdzConst.HandType.LaiBomb.value ||
								handCard.handType === DdzConst.HandType.Bomb.value)){
							continue ;
						}
						// 值 3 - 15
						for(let i = 3 ; i < 16 ; i++){

							// 同类型情况下 并且炸弹个数相同情况下 需要判断主值大小
							if(this.handType == handCard.handType && i <= mainValue && bCount == bombCount){
								continue;
							}

							let keepArr = DdzUtil.getKeepData(points, i, i, bCount) ;
							// 癞子可以补充完整 并且不能全是癞子
							if(keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1){
								let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length) ;

								let pts = keepArr.existArr.concat(keepArr.loseArr) ;
								retArr.push(DdzUtil.creatHandCard(this,
											{points: pts, mainValue: pts[0], mainPoints: pts, bombCount: bCount,
											bombLevel: 1,
											laiziPoints: useLaiziPoints, laiziChangePoints: keepArr.loseArr})) ;
							}
						}
					}

					// // 升序排序
					// if(retArr.length > 0){
					// 	retArr.sort((a, b) => a.mainValue - b.mainValue) ;
					// }
				}
			}
			return retArr ;
		}
	},

	// 炸弹
	Bomb: {
		des: '炸弹', // 3333 or 4444
		handType: DdzConst.HandType.Bomb.value, // 手牌类型值
		level: DdzConst.HandType.LaiBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			let length = points.length + laiziPoints.length ;
			if(4 == length){
				if(0 == laiziPoints.length){
					var handCard = DdzRule.HandCardList.Bomb.getHandCard(points) ;
					if(handCard){
						handCard.level = this.level ;
						handCard.bombCount = 4 ;
						handCard.bombLevel = 2 ;
					}
					return handCard ;
				}
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points, laiziPoints){
			let length = points.length + laiziPoints.length ;
			let mainValue = (handCard.level == this.level) ? handCard.mainValue : 0 ;
			let bombCount = handCard.bombCount || 4 ;
			let retArr = [] ;

			// 炸弹个数是4个 不是癞炸
			if(bombCount == 4 && handCard.handType !== DdzConst.HandType.LaiBomb.value){
				// 值 3 - 15
				for(let i = 3 ; i < 16 ; i++){

					// 同类型情况下 需要判断主值大小
					if(this.handType == handCard.handType && i <= mainValue){
						continue;
					}

					let keepArr = DdzUtil.getKeepData(points, i, i, 4) ;
					// 不需要癞子补充
					if(keepArr.loseArr.length == 0){
						let pts = keepArr.existArr;
						retArr.push(DdzUtil.creatHandCard(this,
									{points: pts, mainValue: pts[0], mainPoints: pts, bombCount: 4, bombLevel: 2})) ;
					}
				}
			}

			return retArr ;
		}
	},

	// 癞炸
	LaiBomb: {
		des: '癞子炸弹', // 3333 or 4444
		handType: DdzConst.HandType.LaiBomb.value,
		level: DdzConst.HandType.LaiBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points, laiziPoints){
			let length = points.length + laiziPoints.length ;
			if(0 == points.length && length >= 4){
				return DdzUtil.creatHandCard(this,
									{points: laiziPoints, mainValue: laiziPoints[0], mainPoints: laiziPoints,
									laiziPoints: laiziPoints, bombCount: length, bombLevel: 3,
									laiziChangePoints: laiziPoints}) ;
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points, laiziPoints){
			let length = laiziPoints.length ;
			let bombCount = handCard.bombCount || 4 ;

			// 如果上家手牌为癞炸
			if(handCard.handType == this.handType){
				return []
			}

			// 癞炸不足
			if(laiziPoints.length < 4){
				return [] ;
			}

			// 类型不同 或者
			// 类型相同的情况下炸弹个数多 或者
			// 都是炸弹判断个数
			if( this.level > handCard.level ||
				(this.handType === handCard.handType && length > bombCount) ||
					(this.level === handCard.level && length >= bombCount)){
				return DdzUtil.creatHandCard(this,
									{points: laiziPoints, mainValue: laiziPoints[0], mainPoints: laiziPoints,
									laiziPoints: laiziPoints, bombCount: length, bombLevel: 3,
									laiziChangePoints: laiziPoints}) ;
			}
			return [] ;
		}
	},

	// 王炸 最大
	KingBomb: LzDdzRule.HandCardList.KingBomb
} ;

var ddz = {

	//	获取手牌类型
	getHandCards: function(_cards, _laiziCards){
		var cards = _cards.slice() ;
		var laiziCards = _laiziCards.slice() ;
		var points = DdzUtil.cardsToPoints(cards) ;
		var laiziPoints = DdzUtil.cardsToPoints(_laiziCards || []) ;


		// 特殊形式排序
		// 先是四个一样的
		// 三个一样的
		// 对子
		// 单张
		points = DdzUtil.getSpecialSortArr(points).sortArr.slice() ;
		laiziPoints = DdzUtil.getSpecialSortArr(laiziPoints).sortArr.slice() ;

		// 癞子手牌 降序
		laiziPoints.sort((a, b)=> b - a) ;

		var handCardArr = [] ;
		var handPushFunc = (handCard)=> handCardArr.push(handCard) ;
		for(var key in HandCardList){
			var handCards = HandCardList[key].getHandCard(points, laiziPoints) ;

			if(handCards){
				if(!(handCards instanceof Array)){
					handCardArr.push(handCards) ;
				}
				else{
					handCards.forEach(handPushFunc) ;
				}
			}
		}
		return handCardArr ;
	},

	getAllCombo: function(handType, upCards, upLaiziCards, selfCards, laiziCards){
		var upHandCardArr = this.getHandCards(upCards, upLaiziCards) ;
		var selfPoints = DdzUtil.cardsToPoints(selfCards) ;
		var laiziPoints = DdzUtil.cardsToPoints(laiziCards) ;
		var upHandLevel = HandCardList[handType].level ;
		var upHandCard = null ;
		var handCardArr = [] ; // 正常牌型
		var bombHandCardArr = [] ; // 炸弹牌型
		var kingBombHandCardArr = [] ; // 王炸牌型

		// 特殊类型排序
		selfPoints = DdzUtil.getSpecialSortArr(selfPoints).sortArr.slice() ;
		laiziPoints = DdzUtil.getSpecialSortArr(laiziPoints).sortArr.slice() ;

		// 取出上家手牌中符合手牌类型的
		upHandCardArr.forEach(function(ele){
			if(ele.handType == handType){
				if(!upHandCard){
					upHandCard = ele ;
				}
			}
		}) ;

		let isBombType = function(hType){
			if(DdzConst.HandType.Bomb.value == hType ||
				DdzConst.HandType.SoftBomb.value == hType||
				 DdzConst.HandType.LaiBomb.value == hType){
				return true ;
			}
			return false ;
		} ;

		if(upHandCard){
			for(let key in HandCardList){
				var t = HandCardList[key] ;

				// 手牌等级大 或者
				// 等级相同 类型相同 或者
				// 都是炸弹
				if(t.level > upHandLevel ||
					(t.level == upHandLevel && handType == t.handType) ||
					(isBombType(handType) && isBombType(t.handType))){
					var comboArr = t.getAllCombo(upHandCard, selfPoints, laiziPoints) ;

					if(comboArr){
						if(isBombType(t.handType)){
							bombHandCardArr = bombHandCardArr.concat(comboArr) ;
						}
						else if(DdzConst.HandType.KingBomb.value === t.handType){
							kingBombHandCardArr = kingBombHandCardArr.concat(comboArr) ;
						}
						else{
							handCardArr = handCardArr.concat(comboArr) ;
						}

					}
				}
			}
		}

		// 排序
		bombHandCardArr.sort((a, b) => {
			let aLength = a.points.length ;
			let bLength = b.points.length ;

			// 炸弹个数相同
			if(aLength == bLength){
				// 类型相同 按照主数
				if(a.handType == b.handType){
					return a.mainValue - b.mainValue ;
				}
				else
				{
					return a.bombLevel - b.bombLevel ;
				}
			}
			else{
				return aLength - bLength ;
			}
		}) ;
		handCardArr = handCardArr.concat(bombHandCardArr, kingBombHandCardArr) ;

		return handCardArr ;
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
		var handCards = ddz.getHandCards(cards, laiziCards) ;
	    return handCards.length !== 0;
	},

	/**
	 * 对比牌型是否大小
	 * @param playerCards Array 自己手牌
	 * @param targetCards  Array 比较牌型
	 * @param {handType} string 手牌类型(可选)
	 * @returns {boolean}
	 */
	isCardsGreater: function(playerCards, laiziCards, targetCards, targetLaiziCards,handType){
		return this.getHandTypes(playerCards, laiziCards, targetCards, targetLaiziCards, handType).length !== 0 ;
	    // handType = handType || null ;
	    // var playerHandCards = ddz.getHandCards(playerCards, laiziCards) ;
	    // var targetHandCards = ddz.getHandCards(targetCards, targetLaiziCards) ;
	    // var playerHandCard = null ;
	    // var targetHandCard = null ;

	    // let isBombType = function(hType){
	    // 	if(DdzConst.HandType.Bomb.value == hType ||
	    // 		DdzConst.HandType.SoftBomb.value == hType||
	    // 		 DdzConst.HandType.LaiBomb.value == hType){
	    // 		return true ;
	    // 	}
	    // 	return false ;
	    // } ;

	    // if(0 == playerHandCards.length || 0 == targetHandCards.length){
	    //     return false ;
	    // }

	    // // 不存在手牌类型
	    // if(!handType){
	    //     targetHandCard = targetHandCards[0] ;
	    //     handType = targetHandCard.handType ;
	    // }
	    // else{
	    //     targetHandCards.forEach(function(c){
	    //         if(c.handType == handType){
	    //             if(!targetHandCard){
		// 				targetHandCard = c ;
		// 			}
	    //         }
	    //     }) ;
	    // }

	    // playerHandCards.forEach(function(c){
	    //     if(c.level >= targetHandCard.level){
		// 		if(!playerHandCard){
		// 			playerHandCard = c ;
		// 		}
	    //     }
	    // }) ;


	    // if(!playerHandCard || !targetHandCard){
	    //     return false ;
	    // }

	    // if(playerHandCard.level > targetHandCard.level){
	    //     return true ;
	    // }

	    // //  级别相等
	    // if(playerHandCard.level == targetHandCard.level){

	    // 	// 如果都是炸弹类型
	    // 	if(isBombType(playerHandCard.handType) &&
	    // 		isBombType(targetHandCard.handType)){
	    // 		// 炸弹个数多的
	    // 		if(playerHandCard.bombCount > targetHandCard.bombCount)
	    // 		{
	    // 			return true ;
	    // 		}
	    // 		// 炸弹个数相同
	    // 		else if(playerHandCard.bombCount == targetHandCard.bombCount){

	    // 			// 炸弹级别大
	    // 			if(playerHandCard.bombLevel > targetHandCard.bombLevel){
	    // 				return true ;
	    // 			}
	    // 			// 炸弹级别相等 说明类型相同
	    // 			else if(playerHandCard.bombLevel == targetHandCard.bombLevel){

	    // 				//	主数大
	    // 				if(playerHandCard.mainValue > targetHandCard.mainValue){
	    // 					return true ;
	    // 				}
	    // 				return false ;
	    // 			}
	    // 			else
	    // 			{
	    // 				return false ;
	    // 			}
	    // 		}
	    // 		// 炸弹个数少
	    // 		else
	    // 		{
	    // 			return false ;
	    // 		}
	    // 	}

		// 	// 如果类型不同
	    // 	if(playerHandCard.handType !== targetHandCard.handType){
	    // 		return false ;
		// 	}

	    // 	// 连续个数
	    // 	if(playerHandCard.keepCount && targetHandCard.keepCount &&
	    // 		targetHandCard.keepCount > playerHandCard.keepCount){
	    // 		return false ;
	    // 	}

		//     // 主数判断
	    //     if(playerHandCard.mainValue > targetHandCard.mainValue){
	    //         return true ;
	    //     }
	    // }

	    // return false ;
	},

	/**
	 * 获取可能存在的手牌类型
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} laiziCards 癞子牌
	 * @return {Array}             手牌组合数组
	 */
	getHandTypes: function(playerCards, laiziCards, targetCards, targetLaiziCards, handType){
		var hands = ddz.getHandCards(playerCards, laiziCards) ;
		var targetHand = null ;
		var retArr = [] ;

		let isBombType = function(hType){
			if(DdzConst.HandType.Bomb.value == hType ||
				DdzConst.HandType.SoftBomb.value == hType||
				 DdzConst.HandType.LaiBomb.value == hType){
				return true ;
			}
			return false ;
		} ;

		if(handType){
			let targetHands = ddz.getHandCards(targetCards, targetLaiziCards) ;
			if(targetHands){
				targetHands.forEach((hand) =>{
					if(hand.handType == handType){
						if(!targetHand){
							targetHand = hand ;
						}
					}
				}) ;
			}

			if(!targetHand){
				console.log("Error, getTargetCard HandType not found：", handType) ;
			}
		}
		else
		{
			targetHand = ddz.getHandCards(targetCards, targetLaiziCards)[0] ;
			console.log("Warning, getHandTypes no handType") ;
		}

		if(!targetHand){
			retArr = hands ;
		}
		else{
			for(let i = 0 ; i < hands.length ; i++){
				let selfHand = hands[i] ;
				let bAdd = false ;
				//等级大
				if(selfHand.level > targetHand.level){
					bAdd = true ;
				}
				// 都是炸弹
				else if(isBombType(selfHand.handType) && isBombType(targetHand.handType)){
					let selfType = selfHand.handType ;
					let targetType = targetHand.handType ;
					let selfCount = selfHand.bombCount ;
					let targetCount = targetHand.bombCount ;

					// 炸弹个数多
					if(selfCount > targetCount){
						bAdd = true ;
					}
					// 炸弹个数相同
					else if(selfCount == targetCount){

						// 炸弹级别大
						if(selfHand.bombLevel > targetHand.bombLevel){
							bAdd = true ;
						}
						// 炸弹级别相等 说明类型相同
						else if(selfHand.bombLevel == targetHand.bombLevel){

							// 如果都是癞炸 并且 都是4张 谁先出谁大
							if(selfType == targetType && DdzConst.HandType.LaiBomb.value == selfType && selfCount == 4){
								bAdd = false ;
								continue ;
							}
							// 主数大
							if(selfHand.mainValue > targetHand.mainValue){
								bAdd = true ;
							}
						}
					}
				}
				// 类型 相同 主数大
				else if(selfHand.handType === targetHand.handType && selfHand.mainValue > targetHand.mainValue){
					// 判断是否是顺子类型
					if(!targetHand.keepCount  ||
						(targetHand.keepCount && targetHand.keepCount == selfHand.keepCount)){
						bAdd = true ;
					}
				}

				if(bAdd){
					retArr.push(selfHand) ;
				}
			}
		}

		return retArr ;
	},

	/**
	 * 获取大过目标牌型的所有手牌组合
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} targetCards 目标手牌
	 * @param  {string} handType   （可选）
	 * @return {Array}             手牌组合数组
	 */
	getTargetCards: function(playerCards, laiziCards, targetCards, targetLaiziCards, handType) {
	    console.log('cardToSelf playerCards: ' + playerCards + 'lai: ' + laiziCards) ;
	    console.log('cardToSelf targetCards: ' + targetCards + 'lai: ' + targetLaiziCards) ;
	    var retArr = [] ;
	    if(!handType){
	        let targetHandCards = ddz.getHandCards(targetCards, targetLaiziCards) ;
	        if(0 == targetHandCards.length)
	        {
	            return retArr ;
	        }
	        handType = targetHandCards[0].handType ;
	    }

	    retArr = ddz.getAllCombo(handType, targetCards, targetLaiziCards, playerCards, laiziCards) ;
		// for(let v of retArr){
	    //     console.log('getTargetCards retArr: ' + v) ;
	    // }
	    return retArr ;
	},

	/**
	 * 获取手牌中的顺子
	 * @param  {Array} playerCards 玩家手牌
	 * @return {Array}             顺子手牌 或者 原样不变返回
	 */
	getStraightHards: function(playerCards, laiziCards){
	    var retArr = [] ;
	    var points = playerCards.map((value) => value % 100) ;
	    var laiziPoints = laiziCards.map((value) => value % 100) ;

	    var leftFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 1, 5, true) ;
	    if(leftFillArr && 0 == leftFillArr.unusedLaiziPoints.length &&
	    	leftFillArr.keepCount == points.length + laiziPoints.length){
	    	retArr.push(DdzUtil.creatHandCard(this,
	    					{points: leftFillArr.points, mainValue: leftFillArr.points[0],
	    					laiziPoints: leftFillArr.laiziPoints, keepCount: leftFillArr.keepCount,
	    					laiziChangePoints: leftFillArr.laiziChangePoints})) ;
	    }
	    return retArr ;
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