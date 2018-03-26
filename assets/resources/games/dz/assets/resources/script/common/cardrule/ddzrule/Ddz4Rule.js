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
 * {des: '王炸', handType: 'Single', points: [3], mainPoints:[], beltPoints:[], mainValue: 3, }
 */
// 手牌类型
var HandCardList = {
	Single: DdzRule.HandCardList.Single,
	Double: DdzRule.HandCardList.Double,
	Straight: DdzRule.HandCardList.Straight,
	DoubleStraight: DdzRule.HandCardList.DoubleStraight,
	Triplets: {
		des: '三张一样的', // 333 or 444
		handType: DdzConst.HandType.Triplets.value, // 手牌类型值
		level: DdzConst.HandType.Triplets.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points){
			if(3 == points.length && points[0] == points[1] && points[0] == points[2]){
				return {des: this.des, handType: this.handType, level: this.level,
						points: points, mainValue: points[0]} ;
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points){
			var mainValue = handCard.mainValue ;
			var retArr = [] ;

			// 上家手牌 数量大于自己手牌数量
			if(handCard.points.length > points.length){
				return retArr ;
			}

			// 222 没有必要继续检测
			if(15 == mainValue){
				return retArr ;
			}

			var arr = DdzUtil.getSpecialSortArr(points) ;
			var arrs = [arr.threeArr, arr.fourArr, arr.fiveArr, arr.sixArr, arr.sevenArr, arr.eightArr]		

			// 三张一样的处理
			arrs.forEach((array, arrayi) =>{
				let retThreeArr = [] ;
				for(let i = 0 ; i < array.length; i = i + (3 + arrayi)){
					if(array[i] > mainValue){
						retThreeArr.push({des: this.des, handType: this.handType, level: this.level,
									points: [array[i], array[i + 1], array[i + 2]], mainPoints: [array[i], array[i + 1], array[i + 2]],
									mainValue: array[i]}) ;
					}
				}
				retThreeArr.reverse() ;
				retArr = retArr.concat(retThreeArr) ;
			});
			return retArr ;
		}
	},

	TripletsBeltSingle: {
		des: '三带一', // 333, 5 or 444, 6
		handType: DdzConst.HandType.TripletsBeltSingle.value, // 手牌类型值
		level: DdzConst.HandType.TripletsBeltSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points){

			// 如果是炸 直接返回
			if(4 == points.length && points[0] == points[1] && points[0] == points[2] && points[0] == points[3]){
				return false ;
			}

			if(4 == points.length && points[0] == points[1] && points[0] == points[2]){
				return {des: this.des, handType: this.handType, level: this.level,
						points: points, mainPoints:[points[0], points[1], points[2]],
						beltPoints:[points[3]],mainValue: points[0]} ;
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points){
			var mainValue = handCard.mainValue ;
			var retArr = [] ;

			// 上家手牌 数量大于自己手牌数量
			if(handCard.points.length > points.length){
				return retArr ;
			}

			// 222 无需比较了
			if(15 == mainValue){
				return retArr ;
			}

			var arr = DdzUtil.getSpecialSortArr(points) ;
			var arrs = [arr.threeArr, arr.fourArr, arr.fiveArr, arr.sixArr, arr.sevenArr, arr.eightArr]		

			// 三张一样的处理
			arrs.forEach((array, arrayi) =>{
				let retThreeArr = [] ;
				for(let i = 0 ; i < array.length; i = i + (3 + arrayi)){
					if(array[i] > mainValue){
						retThreeArr.push({des: this.des, handType: this.handType, level: this.level,
									points: [array[i], array[i + 1], array[i + 2]], mainPoints: [array[i], array[i + 1], array[i + 2]],
									mainValue: array[i]}) ;
					}
				}
				retThreeArr.reverse() ;
				retArr = retArr.concat(retThreeArr) ;
			});

			// 拆单张的处理
			for(let i = retArr.length - 1; i >= 0; i--){
				let v = retArr[i] ;
				let tempPoints = points.slice() ;
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints) ;
				let arr = DdzUtil.getSpecialSortArr(tempPoints) ;
				let beltPoints = arr.sortArr.slice(-1) ;
				if(beltPoints[0] == v.mainValue){
					let filterArr = arr.sortArr.filter((p)=> p !== v.mainValue)
					if(filterArr.length > 0){
						beltPoints = filterArr.slice(-1) ;
					}
				}
				v.points = v.mainPoints.concat(beltPoints) ;
				v.beltPoints = beltPoints ;

				// 3333 这样的 333,3 不如直接 炸弹
				if(v.mainValue == v.beltPoints[0]){
					retArr.splice(i, 1) ;
				}
			}

			return retArr ;
		}
	},

	TripletsBeltDouble: {
		des: '三带对', // 333, 55, or 444, 66
		handType: DdzConst.HandType.TripletsBeltDouble.value, // 手牌类型值
		level: DdzConst.HandType.TripletsBeltDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points){
			if(5 == points.length && 
				points[0] == points[1] && 
				points[0] == points[2] &&
				points[3] == points[4] && 
				points[0] !== points[4]){
				return {des: this.des, handType: this.handType, level: this.level, points: points,
						mainPoints:[points[0], points[1], points[2]],
						beltPoints:[points[3], points[4]], mainValue: points[0]} ;
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCard, points){
			var mainValue = handCard.mainValue ;
			var retArr = [] ;

			// 上家手牌 数量大于自己手牌数量
			if(handCard.points.length > points.length){
				return retArr ;
			}

			// 222 没比较继续检查了
			if(15 == mainValue){
				return retArr ;
			}

			var arr = DdzUtil.getSpecialSortArr(points) ;
			var arrs = [arr.threeArr, arr.fourArr, arr.fiveArr, arr.sixArr, arr.sevenArr, arr.eightArr]		

			// 三张一样的处理
			arrs.forEach((array, arrayi) =>{
				let retThreeArr = [] ;
				for(let i = 0 ; i < array.length; i = i + (3 + arrayi)){
					if(array[i] > mainValue){
						retThreeArr.push({des: this.des, handType: this.handType, level: this.level,
									points: [array[i], array[i + 1], array[i + 2]], mainPoints: [array[i], array[i + 1], array[i + 2]],
									mainValue: array[i]}) ;
					}
				}
				retThreeArr.reverse() ;
				retArr = retArr.concat(retThreeArr) ;
			});

			// 拆对的处理
			for(let i = retArr.length - 1; i >= 0; i--){
				let v = retArr[i] ;
				let tempPoints = points.slice() ;
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints) ;
				let arr = DdzUtil.getSpecialSortArr(tempPoints) ;
				let sortArr = arr.fourArr.concat(arr.threeArr, arr.doubleArr) ;
				sortArr = sortArr.filter((p) => p !== v.mainValue)
				// 至少有一个对
				if(sortArr.length >= 2){
					let beltPoints = sortArr.slice(-2) ;
					v.points = v.mainPoints.concat(beltPoints) ;
					v.beltPoints = beltPoints ;
				}
				else{
					retArr.splice(i, 1) ;
				}

			}

			return retArr ;
		}
	},
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

	Bomb: {
		des: '炸弹', // 3333 or 44444 or 555555 or 6666666 or 7777777 or 88888888
		handType: DdzConst.HandType.Bomb.value, // 手牌类型值
		level: DdzConst.HandType.Bomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points){
			var bombCount = 0;

			for(let i = 0; i < points.length; i++){
				if(points[0] == points[i]){
					bombCount++;
				}
				else{
					return false;
				}

			}
			if(bombCount >= 4){
				return {des: this.des, handType: this.handType, level: this.level,
						points: points, bombCount:bombCount, mainPoints: points, mainValue: points[0]} ;
			}
			return false ;
		},
		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points){
			var mainValue = 0 ;
			var valueCountArr = DdzUtil.getValueCountArr(points) ;
			var bombCount = handCards.bombCount ? handCards.bombCount : 0 ;
			var retArr = [] ;
			//	如果都是炸弹
			if(this.level == handCards.level){
				mainValue = handCards.mainValue ;
			}

			// valueCountArr.forEach((v, i, arr) =>{

			// 	// 值大炸弹个数相等 或者 炸弹个数大
			// 	if((i > mainValue && v == bombCount && v >= 4) ||
			// 		(v > bombCount && v >= 4) ){
			// 		let pnts = new Array(v) ;
			// 		for(let j = 0 ; j < pnts.length ; j++){
			// 			pnts[j] = i ;
			// 		}
			// 		retArr.push({des: this.des, handType: this.handType, level: this.level,
			// 					points: pnts, mainPoints: pnts, mainValue: pnts[0], bombCount: v}) ;
			// 	}
			// }) ;

			var arr = DdzUtil.getSpecialSortArr(points) ;
			var arrs = [arr.fourArr, arr.fiveArr, arr.sixArr, arr.sevenArr, arr.eightArr]		
			// 四张一样的处理
			arrs.forEach((array, arrayi) =>{
				let retFourArr = [] ;
				for(let i = 0 ; i < array.length; i = i + (4 + arrayi)){
					let bCount = 4 + arrayi ;
					if((array[i] > mainValue && bCount == bombCount) || (bCount > bombCount)){
						let pnts = new Array(bCount) ;
						for(let j = 0 ; j < pnts.length ; j++){
							pnts[j] = array[i] ;
						}
						retFourArr.push({des: this.des, handType: this.handType, level: this.level,
									points: pnts, mainPoints: pnts, mainValue: pnts[0], bombCount: bCount}) ;
					}
				}
				retFourArr.reverse() ;
				retArr = retArr.concat(retFourArr) ;
			});

			return retArr ;
		}
	},

	TopKingBomb:{
		des: '天王炸弹', // 55, 50 or 50, 55
		handType: DdzConst.HandType.TopKingBomb.value, // 手牌类型值
		level: DdzConst.HandType.TopKingBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function(points){
			if(4 == points.length &&
				55 == points[0] &&
				55 == points[1] &&
				50 == points[2] &&
				50 == points[3]){
				return {des: this.des, handType: this.handType, level: this.level,
					points: points, mainValue: points[0]} ;
			}
			return false ;
		},

		// 当前类型的所有可能组合
		getAllCombo: function(handCards, points){
			var arr = DdzUtil.getSpecialSortArr(points) ;
			var doubleArr = arr.doubleArr ;
			var findKing = doubleArr.indexOf(55) ;
			var findSmallKing = doubleArr.indexOf(50) ;
			var retArr = [] ;
			if(-1 != findKing &&
				-1 != findSmallKing){
				retArr.push({des: this.des, handType: this.handType, level: this.level,
							points: [55, 50, 55, 50], mainValue: points[0]}) ;
			}

			return retArr ;
		}
	}
} ;

var ddz = {

	//	获取手牌类型
	getHandCards: function(_cards){
		var cards = _cards.slice() ;
		var points = DdzUtil.cardsToPoints(cards) ;
		// 特殊形式排序
		// 先是四个一样的
		// 三个一样的
		// 对子
		// 单张
		points = DdzUtil.getSpecialSortArr(points).sortArr.slice() ;
		var handCardArr = [] ;
		var handPushFunc = (handCard)=> handCardArr.push(handCard) ;
		for(var key in HandCardList){
			var handCards = HandCardList[key].getHandCard(points) ;
			if(handCards){
				if(!(handCards instanceof Array)){
					handCardArr.push(handCards) ;
				}
				else
				{
					handCards.forEach(handPushFunc) ;
				}
			}
		}
		return handCardArr ;
	},

	getAllCombo: function(handType, upCards, selfCards){
		var upHandCardArr = this.getHandCards(upCards) ;
		var selfPoints = DdzUtil.cardsToPoints(selfCards) ;
		var upHandLevel = HandCardList[handType] == undefined ? 0: HandCardList[handType].level ;
		var upHandCard = null ;
		var handCardArr = [] ;

		// 特殊类型排序
		selfPoints = DdzUtil.getSpecialSortArr(selfPoints).sortArr.slice() ;

		// 取出上家手牌中符合手牌类型的
		upHandCardArr.forEach(function(ele){
			if(ele.handType == handType){
				if(!upHandCard){
					upHandCard = ele ;
				}
			}
		}) ;

		if(upHandCard){

			for(let key in HandCardList){
				var t = HandCardList[key] ;

				// 手牌等级
				if(t.level > upHandLevel ||
					(t.level == upHandLevel && handType == t.handType)){
					var comboArr = t.getAllCombo(upHandCard, selfPoints) ;

					if(comboArr){
						handCardArr = handCardArr.concat(comboArr) ;
					}
				}
			}
		}

		if(0 < handCardArr.length){
			// handCardArr.sort(function(a, b){
			// 	// if(a.level == b.level){
			// 	// 	return a.mainValue - b.mainValue ;
			// 	// }
			// 	return a.level - b.level ;
			// }) ;
		}

		return handCardArr ;
	}
} ;

var rule = {

	/**
	 * 检查出牌是否正确
	 * @param cards
	 * @returns {boolean}
	 */
	isCardsValid: function(cards) {
		var handCards = ddz.getHandCards(cards) ;
	    return handCards.length !== 0;
	},

	/**
	 * 对比牌型是否大小
	 * @param playerCards Array 自己手牌
	 * @param targetCards  Array 比较牌型
	 * @param {handType} string 手牌类型(可选)
	 * @returns {boolean}
	 */
	isCardsGreater: function(playerCards, targetCards, handType){
	    handType = handType || null ;
	    var playerHandCards = ddz.getHandCards(playerCards) ;
	    var targetHandCards = ddz.getHandCards(targetCards) ;
	    var playerHandCard = null ;
	    var targetHandCard = null ;

	    if(0 == playerHandCards.length || 0 == targetHandCards.length){
	        return false ;
	    }

	    // 不存在手牌类型
	    if(!handType){
	        targetHandCard = targetHandCards[0] ;
	        handType = targetHandCard.handType ;
	    }
	    else{
	        targetHandCards.forEach(function(c){
	            if(c.handType == handType){
	                targetHandCard = c ;
	            }
	        }) ;
	    }

	    playerHandCards.forEach(function(c){
	        if(c.level >= targetHandCard.level){
	            playerHandCard = c ;
	        }
	    }) ;


	    if(!playerHandCard || !targetHandCard){
	        return false ;
	    }

	    if(playerHandCard.level > targetHandCard.level){
	        return true ;
	    }

	    //  级别相等 判断主数大小
	    if(playerHandCard.level == targetHandCard.level){

	    	// 连续个数
	    	if(playerHandCard.keepCount && targetHandCard.keepCount &&
	    		targetHandCard.keepCount > playerHandCard.keepCount){
	    		return false ;
			}

			// 如果是炸弹类型
			if(targetHandCard.handType == playerHandCard.handType &&
				DdzConst.HandType.Bomb.value == playerHandCard.handType){
				if(playerHandCard.bombCount > targetHandCard.bombCount){
					return true;
				}
				else if(playerHandCard.bombCount < targetHandCard.bombCount){
					return false ;
				}
			}

		    // 主数判断
	        if(playerHandCard.mainValue > targetHandCard.mainValue){
	            return true ;
	        }
	    }

	    return false ;
	},

	/**
	 * 获取可能存在的手牌类型
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} targetCards 目标手牌
	 * @param  {string} handType   （可选）
	 * @return {Array}             手牌组合数组
	 */
	getHandTypes: function(playerCards, targetCards, handType){
		var hands = ddz.getHandCards(playerCards) ;
		var targetHand = null ;
		var retArr = [] ;
		if(handType){
			let targetHands = ddz.getHandCards(targetCards) ;
			if(targetHands){
				targetHands.forEach((hand) =>{
					if(hand.handType == handType){
						targetHand = hand ;
					}
				}) ;
			}

			if(!targetHand){
				console.log("getTargetCard HandType not found：", handType) ;
			}
		}
		else{
			let targetHands = ddz.getHandCards(targetCards)[0] ;
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
				// 类型 相同 主数大 (不是炸弹)
				else if(selfHand.level == targetHand.level &&
						selfHand.handType !== DdzConst.HandType.Bomb.value && 
						selfHand.handType === targetHand.handType &&
						selfHand.mainValue > targetHand.mainValue){
					// 判断是否是顺子类型
					if(!targetHand.keepCount  ||
						(targetHand.keepCount && targetHand.keepCount == selfHand.keepCount)){
						bAdd = true ;
					}
				}
				// 炸弹判断
				else if(selfHand.handType === targetHand.handType &&
						selfHand.handType === DdzConst.HandType.Bomb.value){

					// 炸弹个数多
					if(selfHand.bombCount > targetHand.bombCount){
						bAdd = true ;
					}
					// 炸弹个数相同的情况下 主数大
					else if(selfHand.bombCount == targetHand.bombCount &&
							selfHand.mainValue > targetHand.mainValue){
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
	getTargetCards: function(playerCards, targetCards, handType) {
	    console.log('cardToSelf playerCards: ' + playerCards) ;
	    console.log('cardToSelf targetCards: ' + targetCards) ;
	    var retArr = [] ;
	    if(!handType){
	        let targetHandCards = ddz.getHandCards(targetCards) ;
	        if(0 == targetHandCards.length)
	        {
	            return retArr ;
	        }
	        handType = targetHandCards[0].handType ;
	    }

	    retArr = ddz.getAllCombo(handType, targetCards, playerCards) ;
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
	getStraightHards: function(playerCards){
	    var retArr = [] ;
	    var points = playerCards.map((value) => value % 100) ;
	    var valueNumArr = [] ;

	    // 线性处理牌点数
	    points.forEach(point => valueNumArr[point] = 1) ;
	    var keepCount = 0 ;

	    // 获取顺子数组
	    var straightArr = function(start, keep){
	        var sArr = [] ;
	        for(let i = start ; i < start + keep; i++){
	            sArr.push(i) ;
	        }
	        sArr.sort((a, b)=> b - a) ;
	        return sArr ;
	    } ;

	    // 判断出素有连续的 点数 数组
	    for(let i = 3 ; i < 15 ; i++){

	        // 在连续
	        if(1 == valueNumArr[i]){
	            keepCount++ ;
	        }
	        else{
	            if(keepCount >= 5){
	                retArr.push(straightArr(i - keepCount, keepCount)) ;
	            }
	            keepCount = 0 ;
	        }
	    }

	    // 最后加入 一次
	    if(keepCount >= 5){
	        retArr.push(straightArr(15 - keepCount, keepCount)) ;
	    }

	    // 数组排序
	    retArr.sort(function(a, b){
	        if(a.length == b.length){
	            return b[0] - a[0] ;
	        }
	        return b.length - a.length ;
	    }) ;

	    if(retArr.length > 0){
			retArr = retArr[0] ;
		}
		else
		{
			retArr = points ;
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
} ;
module.exports = e ;