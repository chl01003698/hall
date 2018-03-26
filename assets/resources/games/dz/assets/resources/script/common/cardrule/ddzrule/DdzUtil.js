'use strict' ;

var DdzConst = ('undefined' == typeof(cc)) ? require('./DdzConst') : require('DdzConst') ;

var u = {

	/**
	 * 将外部牌值至转换成自身牌值
	 * @param  {Array} cards  [牌值数组]
	 * @return {Array}       [转换后的牌值数组]
	 */
	cardToSelf:function(cards){
	    var retArr = cards.map((v) => DdzConst.CardSelf[v]) ;
	    return retArr ;
	},

	/**
	 * 将自身排至转换成外部牌值
	 * @param  {Array} cards  [牌值数组]
	 * @return {Array}       [转换后的牌值数组]
	 */
	cardToExtern:function(cards){
	    var retArr = cards.map((v)=> DdzConst.CardExtern[v]) ;
	    return retArr ;
	},

	// 获取牌点数
	cardsToPoints: function(cards){

		var points = [] ;

		for(let value of cards){
			let point = value % 100 ;
			// 癞子牌
			if(value > 1000){
				points.push(1000 + point) ;
			}
			else{
				points.push(point) ;
			}
		}
		return points ;
	},

	/**
	 * arr过滤掉filterArray中的数值
	 * @param  {Array} arr         [元素组]
	 * @param  {Array} filterArray [过滤数组]
	 * @return {Array}             [新数组]
	 */
	filterArray: function(arr, filterArray){
		return arr.filter((v)=> -1 === filterArray.indexOf(v)) ;
	},

	/**
	 * 获取arr和arr1不同元素数组
	 */
	differentArray: function(_arr, _arr1){
		var arr = _arr.slice() ;
		var arr1 = _arr1.slice() ;

		for(let i = arr.length - 1 ; i >= 0; i--){
			let a = arr[i] ;
			for(let j = arr1.length ; j >= 0 ; j--){
				let b = arr1[j] ;
				if(a == b){
					arr.splice(i, 1) ;
					arr1.splice(j, 1) ;
					break ;
				}
			}
		}
		return arr.concat(arr1) ;
	},

	/**
	 * 去重算法，前提是数组得排好序
	 * @param  {[type]} arr      [description]
	 */
	unique: function(arr){
		let re = [] ;

		arr.forEach((v) => {
			if(-1 == re.indexOf(v)){
				re.push(v) ;
			}
		})
		return re ;
	},

	/**
	 * 分离出来癞子和普通数组
	 * @param  {[type]} _arr      [description]
	 * @param  {[type]} _laiziArr [description]
	 * @return {[type]}           [description]
	 */
	splitArrAndLaizi: function(_arr, _laiziArr){
		var normal = this.filterArray(_arr, _laiziArr) ;
		var laiziArr = this.filterArray(_arr, normal) ;
		return {arr: normal, laiziArr: laiziArr} ;
	},

	/**
	 * 将自身牌点数转换成牌值
	 * @param  {Array} cards  牌值数组
	 * @param  {Array} points 点数数组
	 * @return {Array}        牌值数组
	 */
	pointsToCards: function(cards, points){

	    var retArr = [] ;
	    var copyCards = cards.slice() ;

	    var findCardValue = function(point){
	        for(let i = 0 ; i < copyCards.length ; i++){
	            let v = copyCards[i] ;
	            if(parseInt(v) % 100 == point){
	                retArr.push(v) ;
	                copyCards.splice(i, 1) ;
	                break ;
	            }
	        }
	    } ;

	    points.forEach((point)=> findCardValue(point)) ;
	    return retArr ;
	},

	/**
	 * 将外部的cards 转换为自身数据
	 * isChangeLaiziToCards 是否将转换后的癞子牌放到牌值数组
	 * @return {[type]} [description]
	 */
	tranformSelfCardsData: function(_cards, isChangeLaiziToCards){
		var cards = [] ;
		var laiziCards = [] ;

		let laiziChangeToPoint = function(laiziValue){
			let retValue = laiziValue ;
			// 特殊情况 10L0
			if('0' == laiziValue){
				retValue = '10' ;
			}
			else if('J' == laiziValue){
				retValue = '11';
			}
			else if('Q' == laiziValue){
				retValue = '12';
			}
			else if('K' == laiziValue){
				retValue = '13';
			}
			else if('A' == laiziValue){
				retValue = '14';
			}
			else if('2' == laiziValue){
				retValue = '15';
			}
			else if('X' == laiziValue){
				retValue = '50';
			}
			else if('Y' == laiziValue){
				retValue = '55';
			}
			else if('P' == laiziValue){
				retValue = '0';
			}
			return retValue ;
		}
		// 癞子牌 "03L4"  变牌顺序如下  03L 是懒子牌  4是变得牌  加起来就是   03L4
		// 普通牌正常

		// 都是癞子牌算是癞炸
		if(isChangeLaiziToCards && _cards.every((v) => v.length == 4)){
			isChangeLaiziToCards = false ;
		}

		// 如果是软炸 不能是皮子
		if(isChangeLaiziToCards && _cards.every((v) => v.substr(-1) == _cards[0].substr(-1)) &&
			_cards.length >= 4 && _cards.every((v) => 'PL' !== v.substr(0, 2) )){
			isChangeLaiziToCards = false ;
		}

		_cards.forEach((card) =>{

			// 是癞子牌
			if(4 == card.length){
				let firstLaiziValue = card.substr(1, 1) ;
				let endLaiziValue = card.substr(-1) ;
				let endLaizi = laiziChangeToPoint(endLaiziValue) ;
				let firstLaizi = laiziChangeToPoint(endLaiziValue) ;

				if(isChangeLaiziToCards){
					cards.push(parseInt(endLaizi)) ;
				}
				else{
					laiziCards.push(parseInt(endLaizi)) ;
				}
			}
			else if(3 == card.length && 'PL' == card.substr(0, 2)){
				// 特殊情况 皮子 = 66 ;
				let endLaiziValue = card.substr(-1) ;
				let endLaizi = laiziChangeToPoint(endLaiziValue) ;
				if(isChangeLaiziToCards && endLaiziValue !== 'P'){
					cards.push(parseInt(endLaizi)) ;
				}
				else{
					laiziCards.push(parseInt(endLaizi)) ;
				}
			}
			else if(2 == card.length){
				let value = DdzConst.CardSelf[card] ;
				cards.push(value) ;
			}
			else
			{
				console.log('Error card: ' + card) ;
			}
		}) ;
		return {cards: cards, laiziCards: laiziCards} ;
	},

	/**
	 * 点数数组转换成外部牌值数组
	 * @param  {[type]} externCards [description]
	 * @param  {[type]} points      [description]
	 * @return {[type]}             [description]
	 */
	pointsToExternCards: function(externCards, points){
		// console.log("externCards",externCards,points);
		var retArr = [] ;
		var copyCards = externCards.slice() ;

		var findCardValue = function(point){
		    for(let i = 0 ; i < copyCards.length ; i++){
		        let v = copyCards[i] ;
		        let cardValue = DdzConst.CardSelf[v] ;
		        if(cardValue % 100 == point){
		            retArr.push(v) ;
		            copyCards.splice(i, 1) ;
		            break ;
		        }
		    }
		} ;

		points.forEach((point)=> findCardValue(point)) ;
		return retArr ;
	},

	/**
	 * 根据手牌转出 外部牌值
	 * @param  {[type]} externCards [description]
	 * @param  {[type]} handCards [description]
	 * @return {[type]}           [description]
	 */
	transformToExternCards: function (externCards, handCards) {
	    var retArr = handCards.map((handCard) =>{
	    	return {
	    			des: handCard.des,
	    			mainValue: DdzConst.MainValueExtern[handCard.mainValue],
	    			handType: handCard.handType,
	    			arr: this.pointsToExternCards(externCards, handCard.points)
	    		} ;
	    }) ;
	    return retArr ;
	},


	/**
	 * 点数数组转换成外部牌值数组
	 * @param  {[type]} externCards [description]
	 * @param  {[type]} points      [description]
	 * @return {[type]}             [description]
	 */
	pointsToExternCardsLaizi: function(externCards, points, laiziPoints, laiziChangePoints){
		var retArr = [] ;
		var copyCards = externCards.slice() ;
		points = points || [] ;
		laiziPoints = laiziPoints || [] ;
		laiziChangePoints = laiziChangePoints || [] ;
		points = points.slice() ;
		laiziPoints = laiziPoints.slice() ;
		laiziChangePoints = laiziChangePoints.slice() ;

		// 皮子斗地主 王炸 提示 需要特殊处理
		if(55 == points[0] && 50 == points[1] && 0 == laiziPoints[0]){
			let change = laiziChangePoints[0] ;
			if(50 == change)
			{
				return ['4Y', 'PLX'] ;
			}
			else if(55 == change){
				return ['PLY', '4X'] ;
			}
		}

		var findCardValue = function(point){
			let findPoint = false ;
			// 正常牌值查找
		    for(let i = 0 ; i < copyCards.length ; i++){
		        let v = copyCards[i] ;

		        // 癞子 03L3 PLP
		        // 不是癞子
		        if(2 == v.length){
		        	let cardValue = DdzConst.CardSelf[v] ;
		        	// 找到
		        	if(cardValue % 100 == point){
		        	    retArr.push(v) ;
		        	    copyCards.splice(i, 1) ;
		        	    findPoint = true ;
		        	    break ;
		        	}
		        }
		    }

		    // 癞子牌转 字符
		    let laiziToChar = function(laiziPoint){

		    	let laiziChangePoint = laiziPoint ;
		    	if(laiziChangePoint == 10){
		    		laiziChangePoint = '0' ;
		    	}
		    	else if(laiziChangePoint == 11){
		    		laiziChangePoint = 'J' ;
		    	}
		    	else if(laiziChangePoint == 12){
		    		laiziChangePoint = 'Q' ;
		    	}
		    	else if(laiziChangePoint == 13){
		    		laiziChangePoint = 'K' ;
		    	}
		    	else if(laiziChangePoint == 14){
		    		laiziChangePoint = 'A' ;
		    	}
		    	else if(laiziChangePoint == 15){
		    		laiziChangePoint = '2' ;
		    	}
		    	else if(laiziChangePoint == 50){
		    		laiziChangePoint = 'X' ;
		    	}
		    	else if(laiziChangePoint == 55){
		    		laiziChangePoint = 'Y' ;
		    	}
		    	else
		    	{
		    		laiziChangePoint = '' + laiziChangePoint ;
		    	}

		    	return laiziChangePoint ;
		    } ;
		    // 如果没找到正常牌值
		    if(!findPoint){
		    	for(let i = 0 ; i < copyCards.length ; i++){
		    	    let v = copyCards[i] ;

					// 癞子 03L3 PLP
					// 特殊情况 10L0
		    	    // 不是癞子
    	            // 正常癞子 03L3
    	            if(4 == v.length){
    	            	let cardValue = DdzConst.CardSelf[v.substring(0, 2)] ;
    	            	let laiziChangeIndex = laiziChangePoints.indexOf(point) ;
    	            	if(-1 != laiziChangeIndex){
    	            		if(laiziPoints[laiziChangeIndex] != cardValue % 100){
    	            			continue ;
    	            		}

    	            		let laiziChangeChar = laiziToChar(laiziChangePoints[laiziChangeIndex]) ;

    	            		let laiziStr = v.substring(0, 2) + 'L' + laiziChangeChar ;
    	            		retArr.push(laiziStr) ;
    	            		copyCards.splice(i, 1) ;
    	            		laiziPoints.splice(laiziChangeIndex, 1) ;
							laiziChangePoints.splice(laiziChangeIndex, 1) ;
							break ;
    	            	}
    	            }
    	            // 皮子斗地主
    	            else if('PLP' == v){
    	            	let laiziChangeIndex = laiziChangePoints.indexOf(point) ;
    	            	if(-1 != laiziChangeIndex){
    	            		// 皮子牌
    	            		if(0 == laiziPoints[laiziChangeIndex])
    	            		{
    	            			let laiziChangeChar = laiziToChar(laiziChangePoints[laiziChangeIndex]) ;
    	            			let laiziStr = 'PL' + laiziChangeChar ;
    	            			if(0 == point){
    	            				laiziStr = 'PLP' ;
    	            			}
    	            			retArr.push(laiziStr) ;
    	            			copyCards.splice(i, 1) ;
	    	            		laiziPoints.splice(laiziChangeIndex, 1) ;
								laiziChangePoints.splice(laiziChangeIndex, 1) ;
    	            		}
    	            	}
    	            }
		    	}

		    }
		} ;

		points.forEach((point)=> findCardValue(point)) ;
		return retArr ;
	},
	/**
	 * 根据手牌转出 外部牌值 癞子
	 * @param  {[type]} externCards [description]
	 * @param  {[type]} handCards [description]
	 * @return {[type]}           [description]
	 */
	transformToExternCardsLaizi: function(externCards, handCards){
		var retArr = handCards.map((handCard) =>{
			return {
					des: handCard.des,
					mainValue: DdzConst.MainValueExtern[handCard.mainValue],
					handType: handCard.handType,
					arr: this.pointsToExternCardsLaizi(externCards, handCard.points, handCard.laiziPoints,
						handCard.laiziChangePoints)
				} ;
		}) ;
		return retArr ;
	},

	/**
	 * 导出数据 给客户端使用
	 * 只有 getTargetCards接口使用
	 * @return {[type]} [description]
	 */
	exportArrProcess: function(data){
		if(data instanceof Array){
			data.forEach((d) =>{
				d.arr.forEach((v, i, arr) =>{
					if(4 == v.length){
						let changeStr = v.substring(0, 2) + 'L' + v.substring(1, 2) ;
						arr[i] = changeStr ;
					}
					else if(3 == v.length){
						arr[i] = 'PLP' ;
					}
				}) ;
			}) ;
		}
	},

	// 洗牌
	shuffle: function(){
		var randomCards = DdzConst.CardValue.slice() ;

		//保证乱序
		for(let i = 0 ; i < randomCards.length ; i++){
			var randomI = i + Math.floor( Math.random() *  (randomCards.length - i));
			var tmp = randomCards[i] ;
			randomCards[i] = randomCards[randomI] ;
			randomCards[randomI] = tmp ;
		}
		console.log(randomCards) ;
		return randomCards ;
	},

	/**
	 * 删除数组中指定元素
	 * @param  {Array} removeArr 要删除的数组
	 * @param  {Array} eleArr    指定的元素的数组
	 * @return {Array}           删除后的数组
	 */
	removeArrayValue: function(removeArr, eleArr){
		for(let v of eleArr){
			let index = removeArr.indexOf(v) ;
			if(index >= 0){
				removeArr.splice(index, 1) ;
			}
		}
	},

	/**
	 * 获取数值个数的数组
	 * @param  {card}	牌点数数组
	 * @return {arr}	将牌值放在下标位置的
	 */
	getValueCountArr:function(points){
		var valueNumArr = [] ;
		for(let i of points){
			// 未赋值 赋值为1 否则自动累加
			valueNumArr[i] = (null == valueNumArr[i]) ? 1 : valueNumArr[i] + 1 ;
		}
		return valueNumArr ;
	},

	/**
	 * 获取数组中的指定情况
	 * @param  {cards}: 数组
	 * @param  {start}：起始位置
	 * @param  {end}: 结束位置
	 * @param  {valueCount}: 数值出现次数
	 * @return {[type]}:
	 */
	getKeepData: function(points, start, end, valueCount){

		// 将点数值当做数组下标，统计出每个点数的出现次数
		var valueNumArr = this.getValueCountArr(points) ;
		var loseArr = [] ;
		var existArr = [] ;
		var keepCount = 0 ;
		var maxKeepCount = 0 ;
		for(let i = end ; i >= start ; i--){
			let v = valueNumArr[i] ;
			if(null == v){
				v = 0 ;
				// continue ;
			}
			// 数字出现次数不达标
			if(valueCount > v){
				keepCount = 0 ;

				//	添加到丢失数组
				for(let j = 0 ; j < valueCount - v ; j++){
					loseArr.push(i) ;
				}

				// 添加到已经存在的数组
				for(let j = 0 ; j < v ; j++){
					existArr.push(i) ;
				}
			}
			else
			{
				//	添加到存在数组
				for(let j = 0 ; j < valueCount ; j++){
					existArr.push(i) ;
				}
				keepCount++ ;
			}

			//	最大连续数字
			if(keepCount > maxKeepCount){
				maxKeepCount = keepCount ;
			}
		}

		var retArr = {
			loseArr: loseArr,
			existArr: existArr,
			maxKeepCount: maxKeepCount
		} ;
		return retArr ;
	},


	/**
	 * 将癞子填充到指定的数组当中
	 * @param  {Array} points       [点数数组]
	 * @param  {Array} laiziPoints  [癞子点数数组]
	 * @param  {int} valueCount   [数值出现次数]
	 * @param  {int} minKeepCount [最小连续次数]
	 * @param  {bool} isLeftMatch [是否向上匹配]
	 * @return {points: 点数数组, laiziPoints: 使用的癞子点数数组, laiziChange: 癞子变化的点数数组, keepCount: 持续次数,
	 *          unusedLaiziPoints: 没使用的癞子数组}
	 */
	fillPointsLaizi(_points, _laiziPoints, valueCount, minKeepCount, isLeftMatch){
		// 取最大最小值
		var pMax = Math.max.apply(null, _points) ;
		var pMin = Math.min.apply(null, _points) ;
		var keepArr = this.getKeepData(_points, pMin, pMax, valueCount) ;
		var points = _points.slice() ;
		var laiziPoints = _laiziPoints.slice() ;
		var retPoints = [] ;
		var retLaiziPoints = [] ;
		var retLaiziChange = [] ;
		var retUnusedLaiziPoints = [] ;
		var retKeepCount = 0 ;
		isLeftMatch = 'undefined' === typeof(isLeftMatch) ? true : isLeftMatch ;

		// 先把points部分填充完
		// points 数组是非连续的 中间需要填充
		if(keepArr.loseArr.length != 0){
			// 需要填充的数字大于癞子个数
			if(keepArr.loseArr.length > _laiziPoints.length){
				return false ;
			}
			retLaiziPoints = _laiziPoints.slice(0, keepArr.loseArr.length) ;
			retLaiziChange = keepArr.loseArr.slice() ;
			retUnusedLaiziPoints = _laiziPoints.slice(keepArr.loseArr.length) ;
			retPoints = keepArr.existArr.concat(keepArr.loseArr) ;
			retKeepCount = pMax - pMin + 1 ;
		}
		else
		{
			retPoints = keepArr.existArr.slice() ;
			retUnusedLaiziPoints = _laiziPoints.slice() ;
			retKeepCount = keepArr.maxKeepCount ;
		}

		// 填充两边 降序排序，先填充左边
		var fillArray = [] ;
		var fillCount = Math.floor(retUnusedLaiziPoints.length / valueCount) ;
		// 向右填充
		var leftMatch = ()=>{
			for(let i = pMax + 1; i < 15; i++){
				if(fillCount <= 0){
					break ;
				}
				fillArray.push(i) ;
				fillCount-- ;
			}
		} ;

		// 向左填充
		var rightMatch = ()=> {
			for(let i = pMin - 1; i >= 3; i--){
				if(fillCount <= 0){
					break ;
				}
				fillArray.push(i) ;
				fillCount-- ;
			}
		} ;

		// 是否向上匹配
		if(isLeftMatch){
			leftMatch() ;
			rightMatch() ;
		}
		else{
			rightMatch() ;
			leftMatch() ;
		}

		retKeepCount += fillArray.length ;
		// 达到最小连续数字
		if(retKeepCount >= minKeepCount){

			// 返回数据修正
			for(let i = 0 ; i < fillArray.length ; i++){
				for(let j = 0 ; j < valueCount ; j++){
					retLaiziPoints.push(retUnusedLaiziPoints.splice(0, 1)[0]) ;
					retPoints.push(fillArray[i]) ;
					retLaiziChange.push(fillArray[i]) ;
				}
			}

			var sortFunc = (a, b)=> b - a ;
			retPoints.sort(sortFunc) ;
			retLaiziPoints.sort(sortFunc) ;
			retLaiziChange.sort(sortFunc) ;
			retUnusedLaiziPoints.sort(sortFunc) ;

			return {
				points: retPoints,
				laiziPoints: retLaiziPoints,
				laiziChangePoints: retLaiziChange,
				unusedLaiziPoints: retUnusedLaiziPoints,
				keepCount: retKeepCount
			} ;
		}

		return false ;
	},

	//	数组中连续数字的个数（降序）
	getKeepCount: function(arr){
		var continumN = 1;
		for(let i = 0 ; i < arr.length - 1; i++){
			let v = arr[i] ;
			let v1 = arr[i + 1] ;
			if(v1 == v - 1){
				continumN++ ;
			}
			else{
				continumN = 1 ;
			}
		}
		return continumN ;
	},

	/**
	 * 获取特殊排序的数组
	 * @param  {[type]} _cards [description]
	 * @return {[type]}        [description]
	 */
	getSpecialSortArr: function(_cards){
		var card = _cards.slice() ;

		// 降序排序
		var sortFunc = function(a, b){
			return b - a ;
		} ;

		card.sort(sortFunc) ;

		// 将点数值当做数组下标，统计出每个点数的出现次数
		var valueNumArr = this.getValueCountArr(card) ;

		// 特殊排序方法 4张相同，3张相同，对子，单张
		// 扩展 5张 6张 7张 8张
		var eightArr = [] ;
		var sevenArr = [] ;
		var sixArr = [] ;
		var fiveArr = [] ;
		var fourArr = [] ;
		var threeArr = [] ;
		var doubleArr = [] ;
		var singleArr = [] ;
		for(let i in valueNumArr){
			let count = valueNumArr[i] ;
			let iInt = parseInt(i) ;
			switch(count){
				case 8:
					eightArr.push(iInt, iInt, iInt, iInt, iInt, iInt, iInt, iInt) ;
					break;
				case 7:
					sevenArr.push(iInt, iInt, iInt, iInt, iInt, iInt, iInt) ;
					break;
				case 6:
					sixArr.push(iInt, iInt, iInt, iInt, iInt, iInt) ;
					break;
				case 5:
					fiveArr.push(iInt, iInt, iInt, iInt, iInt) ;
					break;
				case 4:
					fourArr.push(iInt, iInt, iInt, iInt) ;
					break;
				case 3:
					threeArr.push(iInt, iInt, iInt) ;
					break;
				case 2:
					doubleArr.push(iInt, iInt) ;
					break;
				case 1:
					singleArr.push(iInt) ;
					break ;
			}
		}
		eightArr.sort(sortFunc) ;
		sevenArr.sort(sortFunc) ;
		sixArr.sort(sortFunc) ;
		fiveArr.sort(sortFunc) ;
		fourArr.sort(sortFunc) ;
		threeArr.sort(sortFunc) ;
		doubleArr.sort(sortFunc) ;
		singleArr.sort(sortFunc) ;
		var retArr = {
			eightArr: eightArr,
			sevenArr: sevenArr,
			sixArr: sixArr,
			fiveArr: fiveArr,
			fourArr: fourArr,
			threeArr: threeArr,
			doubleArr: doubleArr,
			singleArr: singleArr,
			sortArr: eightArr.concat(sevenArr, sixArr, fiveArr, fourArr, threeArr, doubleArr, singleArr)
		} ;
		return retArr ;
	},

	/**
	 * 简化手牌的创建
	 * @param  {[type]} sender [description]
	 * @param  {[type]} obj    [description]
	 * @return {[type]}        [description]
	 */
	creatHandCard: function(sender, obj){
		obj.des = sender.des ;
		obj.handType = sender.handType ;
		obj.level = sender.level ;
		return obj ;
	},


	/**
	 * 癞子点数 转换成正常点数
	 * @param  {[type]} Point [description]
	 * @return {[type]}       [description]
	 */
	laiziPointToPoint: function(point){
		if(point > 1000){
			return point % 1000 ;
		}
		return point % 100 ;
	},

	/**
	 * 去除handcards中重复项
	 * @param  {Array} handCards [手牌数组]
	 * @return {Array}           [handCards]
	 */
	handCardsRemoveRepeat: function(_handCards){
		var handCards = _handCards.slice() ;
		var sortFunc = (a, b)=> b - a ;
		// 数组是否相等 判断
		var arrayEqual = (_arr1, _arr2)=> {
			var arr1 = _arr1.slice() ;
			var arr2 = _arr2.slice() ;
			var isEqual = true            ;
			arr1.sort(sortFunc) ;
			arr2.sort(sortFunc) ;

			if(arr1.length == arr2.length){
				for(let i = 0 ; i < arr1.length ; i++){
					if(arr1[i] != arr2[i]){
						isEqual = false ;
					}
				}
			}
			return isEqual ;
		} ;

		var deleteArr = [] ;
		handCards.forEach((handCard, i)=>{
			for(let j = i + 1 ; j < handCards.length ; j++){
				// 判断出相等
				if(arrayEqual(handCard.points, handCards[j].points)){
					// 删除数组中不存在
					if(-1 == deleteArr.indexOf(j)){
						deleteArr.push(j) ;
					}
				}
			}
		}) ;

		deleteArr.sort(sortFunc) ;
		// 删除掉重复项
		deleteArr.forEach((v) => handCards.splice(v, 1)) ;
		return handCards ;
	},

	/**
	 * 拆单牌(非重复牌型)
	 * @param  {Array} points      [点数数组]
	 * @param  {Array} laiziPoints [癞子点数数组]
	 * @param  {int} count       [个数]
	 * @return {{}}             [拆的信息]
	 */
	tearSingleUnique: function(_points, _laiziPoints, _count){
		let points = _points.slice() ;
		let laiziPoints = _laiziPoints.slice() ;
		// 去重
		let uniqueArr = [] ;
		points.forEach((v)=> {
			if(-1 === uniqueArr.indexOf(v)){
				uniqueArr.push(v) ;
			}
		}) ;

		let uniqueLaiziArr = [] ;
		_laiziPoints.forEach((v)=> {
			if(-1 === uniqueLaiziArr.indexOf(v)){
				uniqueLaiziArr.push(v) ;
			}
		}) ;
		return this.tearSingle(uniqueArr, uniqueLaiziArr, _count) ;
	},

	/**
	 * 拆单牌
	 * @param  {Array} points      [点数数组]
	 * @param  {Array} laiziPoints [癞子点数数组]
	 * @param  {int} count       [个数]
	 * @return {{}}             [拆的信息]
	 */
	tearSingle: function(_points, _laiziPoints, _count){
		var retArr = {
			points: [],
			laiziPoints: [],
			laiziChangePoints: [],
			count:0,
		} ;

		var points = _points.slice() ;
		var laiziPoints = _laiziPoints.slice() ;
		var count = _count ;
		var arr = this.getSpecialSortArr(points) ;

		var singlePoints = [] ;

		do{
			// 如果有单牌
			if(arr.singleArr.length >= 1){

				singlePoints = arr.singleArr.slice(-1) ;
				retArr.points = singlePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(points, singlePoints) ;
				break;
			}

			// 如果有对牌
			if(arr.doubleArr.length >= 2){
				singlePoints = arr.doubleArr.slice(-1) ;
				retArr.points = singlePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(points, retArr.points) ;
				break ;
			}

			// 如果有3个的牌
			if(arr.threeArr.length >= 3){
				singlePoints = arr.threeArr.slice(-1) ;
				retArr.points = singlePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(points, retArr.points) ;
				break ;
			}

			// 如果有4个的牌
			if(arr.fourArr.length >= 4){
				singlePoints = arr.fourArr.slice(-1) ;
				retArr.points = singlePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(points, retArr.points) ;
				break ;
			}

			// 拆癞子
			if(arr.singleArr.length == 0 &&
				laiziPoints.length >= 1){
				singlePoints = laiziPoints.slice(-1) ;
				retArr.points = singlePoints ;
				retArr.laiziPoints = singlePoints ;
				retArr.laiziChangePoints = singlePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(laiziPoints, retArr.laiziPoints) ;
				break ;
			}

			// 没有可拆数据 o 了
			// 没有count 一直拆完
			if(null == count){
				return retArr ;
			}

		}
		while(0) ;

		if(null != count){
			count-- ;
			if(0 == count){
				return retArr ;
			}
		}

		var tmpArr = this.tearSingle(points, laiziPoints, count) ;
		retArr.points = retArr.points.concat(tmpArr.points) ;
		retArr.laiziPoints = retArr.laiziPoints.concat(tmpArr.laiziPoints) ;
		retArr.laiziChangePoints = retArr.laiziChangePoints.concat(tmpArr.laiziChangePoints) ;
		retArr.count = tmpArr.count + 1 ;
		return retArr ;
	},

	/**
	 * 拆对牌
	 * @param  {Array} points      [点数数组]
	 * @param  {Array} laiziPoints [癞子点数数组]
	 * @param  {int} count       [个数]
	 * @return {{}}             [拆的信息]
	 */
	tearDouble: function(_points, _laiziPoints, _count){
		var retArr = {
			points: [],
			laiziPoints: [],
			laiziChangePoints: [],
			count:0,
		} ;

		var points = _points.slice() ;
		var laiziPoints = _laiziPoints.slice() ;
		var count = _count ;
		var arr = this.getSpecialSortArr(points) ;

		var doublePoints = [] ;

		do{

			// 如果有对牌
			if(arr.doubleArr.length >= 2){
				doublePoints = arr.doubleArr.slice(-2) ;
				retArr.points = doublePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(points, retArr.points) ;
				break ;
			}

			// 如果有3个的牌
			if(arr.threeArr.length >= 3){
				doublePoints = arr.threeArr.slice(-2) ;
				retArr.points = doublePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(points, retArr.points) ;
				break ;
			}

			// 如果有4个的牌
			if(arr.fourArr.length >= 4){
				doublePoints = arr.fourArr.slice(-2) ;
				retArr.points = doublePoints ;
				retArr.count = 1 ;
				this.removeArrayValue(points, retArr.points) ;
				break ;
			}

			// 至少有一张单牌
			if(arr.singleArr.length >= 1 &&
				laiziPoints.length >= 1){

				let single = arr.singleArr.slice(-1)[0] ;
				retArr.points = [single, single] ;
				retArr.laiziPoints = [laiziPoints.slice(-1)[0]] ;
				retArr.laiziChangePoints = [single] ;
				retArr.count = 1 ;
				this.removeArrayValue(points, [single]) ;
				this.removeArrayValue(laiziPoints, retArr.laiziPoints) ;
				break;
			}

			// 拆癞子
			if(arr.singleArr.length == 0 &&
				laiziPoints.length >= 2){
				let lai = laiziPoints.slice(-2) ;
				let lmax = Math.max.apply(null, lai) ;
				retArr.points = [lmax, lmax] ;
				retArr.laiziPoints = lai ;
				retArr.laiziChangePoints = [lmax, lmax] ;
				retArr.count = 1 ;
				this.removeArrayValue(laiziPoints, retArr.laiziPoints) ;
				break ;
			}

			// 没有可拆数据 o 了
			// 没有count 一直拆完
			if(null == count){
				return retArr ;
			}

		}
		while(0) ;

		if(null != count){
			count-- ;
			if(0 == count){
				return retArr ;
			}
		}

		var tmpArr = this.tearDouble(points, laiziPoints, count) ;
		retArr.points = retArr.points.concat(tmpArr.points) ;
		retArr.laiziPoints = retArr.laiziPoints.concat(tmpArr.laiziPoints) ;
		retArr.laiziChangePoints = retArr.laiziChangePoints.concat(tmpArr.laiziChangePoints) ;
		retArr.count = tmpArr.count + 1 ;
		return retArr ;
	},

	/**
	 * 深度拷贝对象
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	cloneObject: function (obj){
	   var o = obj.constructor === Array ? [] : {};
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				o[i] = typeof obj[i] === "object" ? this.cloneObject(obj[i]) : obj[i];
			}
		}
		return o ;
	}
} ;

module.exports = u ;