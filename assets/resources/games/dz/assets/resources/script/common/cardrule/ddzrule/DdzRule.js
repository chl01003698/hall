'use strict';
var DdzUtil = ('undefined' == typeof (cc)) ? require('./DdzUtil') : require('DdzUtil');
var DdzConst = ('undefined' == typeof (cc)) ? require('./DdzConst') : require('DdzConst');

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
	Single: {
		des: '单牌', // 3 or 4
		handType: DdzConst.HandType.Single.value, // 手牌类型值
		level: DdzConst.HandType.Single.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (1 == points.length) {
				return {
					des: this.des, handType: this.handType, level: this.level,
					points: points, mainValue: points[0]
				};
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var retArr = [];
			var arr = DdzUtil.getSpecialSortArr(points);

			// 去重算法，前提是数组得排好序
			var unique = function (arr) {
				let re = [];

				arr.forEach((v) => {
					if (-1 == re.indexOf(v)) {
						re.push(v);
					}
				})
				return re;
			};

			var uniqueArr = unique(arr.sortArr);
			var filterKingArr = uniqueArr.filter((v) => 50 === v || 55 === v);
			var filterArr = DdzUtil.differentArray(uniqueArr, filterKingArr);
			filterArr = filterKingArr.concat(filterArr)
			for (let i = filterArr.length - 1; i >= 0; i--) {
				let v = filterArr[i];
				if (v > mainValue) {
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: [v], mainValue: v
					});
				}
			}

			return retArr;
		}
	},

	Double: {
		des: '对牌', // 33 or 44
		handType: DdzConst.HandType.Double.value, // 手牌类型值
		level: DdzConst.HandType.Double.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (2 == points.length &&
				points[0] == points[1]) {
				return {
					des: this.des, handType: this.handType, level: this.level,
					points: points, mainValue: points[0]
				};
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var arr = DdzUtil.getSpecialSortArr(points);
			var doubleArr = arr.doubleArr;
			var threeArr = arr.threeArr;
			var fourArr = arr.fourArr;
			var retArr = [];

			// 上家手牌 数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			var arrs = arr.eightArr.concat(arr.sevenArr, arr.sixArr, arr.fiveArr, arr.fourArr, arr.threeArr, arr.doubleArr);
			var uniqueArr = DdzUtil.unique(arrs);
			var filterKingArr = uniqueArr.filter((v) => 50 === v || 55 === v);
			var filterArr = DdzUtil.differentArray(uniqueArr, filterKingArr);
			filterArr = filterKingArr.concat(filterArr);
			filterArr = filterArr.filter((v) => v > mainValue);
			filterArr.reverse();
			// 三张一样的处理
			filterArr.forEach((p) => {
				retArr.push({
					des: this.des, handType: this.handType, level: this.level,
					points: [p, p], mainPoints: [p, p], mainValue: p
				});
			});

			return retArr;
		}
	},

	Straight: {
		des: '顺子',	// 5, 6, 7, 8 , 9
		handType: DdzConst.HandType.Straight.value, // 手牌类型值
		level: DdzConst.HandType.Straight.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			// 连续数字个数大于5 并且 (2 不能在其中)
			var keepCount = DdzUtil.getKeepCount(points);
			if (5 <= keepCount &&
				points.length == keepCount &&
				15 != points[0]) {
				return {
					des: this.des, handType: this.handType, level: this.level,
					points: points, mainValue: points[0], keepCount: keepCount
				};
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var keepCount = handCard.keepCount;
			var retArr = [];

			// 上家手牌 数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// A带头顺子，没必要继续
			if (14 == mainValue) {
				return retArr;
			}

			//	遍历可用数组
			for (let i = 14; i > mainValue; i--) {
				let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 1);
				if (keepArr.maxKeepCount == keepCount) {
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: keepArr.existArr, mainValue: i, keepCount: keepCount
					});
				}
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	DoubleStraight: {
		des: '连对', // 33, 44, or 33, 44, 55
		handType: DdzConst.HandType.DoubleStraight.value, // 手牌类型值
		level: DdzConst.HandType.DoubleStraight.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			// 长度大于 6 并且 长度可以 %2 == 0, 2不在其中
			if (6 <= points.length &&
				0 == points.length % 2 &&
				15 != points[0]) {
				var doubleMainValueArr = [];
				for (let i = 0; i < points.length; i = i + 2) {
					if (points[i] == points[i + 1]) {
						doubleMainValueArr.push(points[i]);
					}
					else {
						return false;
					}
				}

				// 连续3个以上的对
				var keepCount = DdzUtil.getKeepCount(doubleMainValueArr);
				if (3 <= keepCount && keepCount == doubleMainValueArr.length) {
					return {
						des: this.des, handType: this.handType, level: this.level,
						points: points, mainValue: points[0], keepCount: keepCount
					};
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var keepCount = handCard.keepCount;
			var retArr = [];

			// 上家手牌 数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// A带头连对，没必要继续
			if (14 == mainValue) {
				return retArr;
			}

			//	遍历可用数组
			for (let i = 14; i > mainValue; i--) {
				let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 2);
				if (keepArr.maxKeepCount == keepCount) {
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: keepArr.existArr, mainValue: i, keepCount: keepCount
					});
				}
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	Triplets: {
		des: '三张一样的', // 333 or 444
		handType: DdzConst.HandType.Triplets.value, // 手牌类型值
		level: DdzConst.HandType.Triplets.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (3 == points.length && points[0] == points[1] && points[0] == points[2]) {
				return {
					des: this.des, handType: this.handType, level: this.level,
					points: points, mainValue: points[0]
				};
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var retArr = [];

			// 上家手牌 数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// 222 没有必要继续检测
			if (15 == mainValue) {
				return retArr;
			}

			var arr = DdzUtil.getSpecialSortArr(points);
			var threeArr = arr.threeArr;
			var fourArr = arr.fourArr;

			// 三张一样的处理
			let retThreeArr = [];
			for (let i = 0; i < threeArr.length; i = i + 3) {
				if (threeArr[i] > mainValue) {
					retThreeArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: [threeArr[i], threeArr[i + 1], threeArr[i + 2]], mainValue: threeArr[i]
					});
				}
			}
			retThreeArr.reverse();

			// 拆四张一样的处理
			let retFourArr = [];
			for (let i = 0; i < fourArr.length; i = i + 4) {
				if (fourArr[i] > mainValue) {
					retFourArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: [fourArr[i], fourArr[i + 1], fourArr[i + 2]], mainValue: fourArr[i]
					});
				}
			}
			retFourArr.reverse();

			retArr = retArr.concat(retThreeArr, retFourArr);

			return retArr;
		}
	},

	TripletsBeltSingle: {
		des: '三带一', // 333, 5 or 444, 6
		handType: DdzConst.HandType.TripletsBeltSingle.value, // 手牌类型值
		level: DdzConst.HandType.TripletsBeltSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {

			// 如果是炸 直接返回
			if (4 == points.length && points[0] == points[1] && points[0] == points[2] && points[0] == points[3]) {
				return false;
			}

			if (4 == points.length && points[0] == points[1] && points[0] == points[2]) {
				return {
					des: this.des, handType: this.handType, level: this.level,
					points: points, mainPoints: [points[0], points[1], points[2]],
					beltPoints: [points[3]], mainValue: points[0]
				};
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var retArr = [];

			// 上家手牌 数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// 222 无需比较了
			if (15 == mainValue) {
				return retArr;
			}

			var arr = DdzUtil.getSpecialSortArr(points);
			var threeArr = arr.threeArr;
			var fourArr = arr.fourArr;

			// 三张一样的处理
			let retThreeArr = [];
			for (let i = 0; i < threeArr.length; i = i + 3) {
				if (threeArr[i] > mainValue) {
					retThreeArr.push({
						des: this.des, handType: this.handType, level: this.level,
						mainPoints: [threeArr[i], threeArr[i + 1], threeArr[i + 2]], mainValue: threeArr[i]
					});
				}
			}
			retThreeArr.reverse();

			// 拆四张一样的处理
			let retFourArr = [];
			for (let i = 0; i < fourArr.length; i = i + 4) {
				if (fourArr[i] > mainValue) {
					retFourArr.push({
						des: this.des, handType: this.handType, level: this.level,
						mainPoints: [fourArr[i], fourArr[i + 1], fourArr[i + 2]], mainValue: fourArr[i]
					});
				}
			}
			retFourArr.reverse();

			retArr = retArr.concat(retThreeArr, retFourArr);

			// 拆单张的处理
			for (let i = retArr.length - 1; i >= 0; i--) {
				let v = retArr[i];
				let tempPoints = points.slice();
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints);
				let arr = DdzUtil.getSpecialSortArr(tempPoints);
				let beltPoints = arr.sortArr.slice(-1);
				if (beltPoints[0] == v.mainValue) {
					let filterArr = arr.sortArr.filter((p) => p !== v.mainValue)
					if (filterArr.length > 0) {
						beltPoints = filterArr.slice(-1);
					}
				}
				v.points = v.mainPoints.concat(beltPoints);
				v.beltPoints = beltPoints;

				// 3333 这样的 333,3 不如直接 炸弹
				if (v.mainValue == v.beltPoints[0]) {
					retArr.splice(i, 1);
				}
			}

			return retArr;
		}
	},

	TripletsBeltDouble: {
		des: '三带对', // 333, 55, or 444, 66
		handType: DdzConst.HandType.TripletsBeltDouble.value, // 手牌类型值
		level: DdzConst.HandType.TripletsBeltDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (5 == points.length && points[0] == points[1] && points[0] == points[2] && points[3] == points[4]) {
				return {
					des: this.des, handType: this.handType, level: this.level, points: points,
					mainPoints: [points[0], points[1], points[2]],
					beltPoints: [points[3], points[4]], mainValue: points[0]
				};
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var retArr = [];

			// 上家手牌 数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// 222 没比较继续检查了
			if (15 == mainValue) {
				return retArr;
			}

			var arr = DdzUtil.getSpecialSortArr(points);
			var threeArr = arr.threeArr;
			var fourArr = arr.fourArr;

			// 三张一样的处理
			let retThreeArr = [];
			for (let i = 0; i < threeArr.length; i = i + 3) {
				if (threeArr[i] > mainValue) {
					retThreeArr.push({
						des: this.des, handType: this.handType, level: this.level,
						mainPoints: [threeArr[i], threeArr[i + 1], threeArr[i + 2]], mainValue: threeArr[i]
					});
				}
			}
			retThreeArr.reverse();

			// 四张一样的处理
			let retFourArr = [];
			for (let i = 0; i < fourArr.length; i = i + 4) {
				if (fourArr[i] > mainValue) {
					retFourArr.push({
						des: this.des, handType: this.handType, level: this.level,
						mainPoints: [fourArr[i], fourArr[i + 1], fourArr[i + 2]], mainValue: fourArr[i]
					});
				}
			}
			retFourArr.reverse();
			retArr = retArr.concat(retThreeArr, retFourArr);

			// 拆对的处理
			for (let i = retArr.length - 1; i >= 0; i--) {
				let v = retArr[i];
				let tempPoints = points.slice();
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints);
				let arr = DdzUtil.getSpecialSortArr(tempPoints);
				let sortArr = arr.fourArr.concat(arr.threeArr, arr.doubleArr);
				sortArr = sortArr.filter((p) => p !== v.mainValue)
				// 至少有一个对
				if (sortArr.length >= 2) {
					let beltPoints = sortArr.slice(-2);
					v.points = v.mainPoints.concat(beltPoints);
					v.beltPoints = beltPoints;
				}
				else {
					retArr.splice(i, 1);
				}

			}

			return retArr;
		}
	},

	Airplane: {
		des: '飞机', // 333, 444 or 555, 666
		handType: DdzConst.HandType.Airplane.value, // 手牌类型值
		level: DdzConst.HandType.Airplane.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (6 <= points.length && 0 == points.length % 3 && 15 != points[0]) {
				var threeMainValueArr = [];
				for (let i = 0; i < points.length - 2; i = i + 3) {
					if (points[i] == points[i + 1] &&
						points[i + 1] == points[i + 2]) {
						threeMainValueArr.push(points[i]);
					}
				}
				// 连续2个以上的三连
				var keepCount = DdzUtil.getKeepCount(threeMainValueArr);
				if (keepCount >= 2 && keepCount * 3 == points.length) {
					return {
						des: this.des, handType: this.handType, level: this.level,
						points: points, mainValue: points[0], keepCount: keepCount
					};
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var mainValue = handCard.mainValue;
			var keepCount = handCard.keepCount;
			var retArr = [];

			// 上家手牌 数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// A带头飞机，没必要继续
			if (14 == mainValue) {
				return retArr;
			}
			// var arr = getSpecialSortArr(points) ;

			// 遍历3个同点的连续次数和keepCount一样的组合
			for (let i = 14; i > mainValue; i--) {
				let keepData = DdzUtil.getKeepData(points, i - keepCount + 1, i, 3);
				if (keepCount == keepData.maxKeepCount) {
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: keepData.existArr, mainPoints: keepData.existArr,
						mainValue: keepData.existArr[0], keepCount: keepCount
					});
				}
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	AirplaneBeltSingle: {
		des: '飞机带单', // 333, 444, 5, 6 or 555, 666, 7, 8
		handType: DdzConst.HandType.AirplaneBeltSingle.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			let length = points.length;
			var arr = DdzUtil.getSpecialSortArr(points);
			if (arr.doubleArr.length > 0) return false
			if (length >= 8 && 0 == length % 4) {
				let retArr = [];
				let keepCount = length / 4;
				// 从3 - 15 循环判断 是否可以组成飞机

				for (let i = 3; i < 15 - keepCount + 1; i++) {
					let keepArr = DdzUtil.getKeepData(points, i, i + keepCount - 1, 3);
					if (keepArr.loseArr.length != 0) {
						continue;
					}
					// 计算剩余点数牌和癞子点数牌
					let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);

					// 如果剩余点数和癞子刚好组成带牌 说明可以组成飞机带单
					if (surplusPoints.length == keepCount) {

						let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
						let mainPoints = pts;
						let beltPoints = surplusPoints;
						pts = pts.concat(beltPoints);

						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: pts, mainValue: pts[0], mainPoints: mainPoints, beltPoints: beltPoints,
								keepCount: keepCount
							}));
					}

				}

				// 排序 取出 最大和最小
				retArr.sort((a, b) => a.mainValue - b.mainValue);
				if (retArr.length > 2) {
					retArr = [retArr[0], retArr[retArr.length - 1]];
				}
				return retArr;

			}

			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var retArr = [];

			// 上家手牌数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			var comboArr = HandCardList.Airplane.getAllCombo(handCard, points);
			if (0 == comboArr.length) {
				return retArr;
			}

			// 拆单张的处理
			for (let i = comboArr.length - 1; i >= 0; i--) {
				let v = comboArr[i];
				let tempPoints = points.slice();
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints);
				let arr = DdzUtil.getSpecialSortArr(tempPoints);
				// if (arr.doubleArr.length > 0) continue;
				let beltPoints = arr.sortArr.slice(-v.keepCount);
				retArr.push({
					des: this.des, handType: this.handType, level: this.level,
					points: v.points.concat(beltPoints), mainPoints: v.points, beltPoints: beltPoints,
					mainValue: v.mainValue, keepCount: v.keepCount
				});
			}

			let arr = [];
			for(let i = 0;i<retArr.length;i++){
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if(objArr.doubleArr.length == 0){
					arr.push(obj);
				}
			}
			// 升序排序
			
			if (arr.length > 0) {
				arr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return arr;
		}
	},

	AirplaneOneSingle: {
		des: '飞机带一对', // 333, 444, 5, 6 or 555, 666, 7, 8
		handType: DdzConst.HandType.AirplaneBeltSingle.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			let length = points.length;
			if (length >= 8 && 0 == length % 4) {
				let retArr = [];
				let keepCount = length / 4;
				// 从3 - 15 循环判断 是否可以组成飞机

				for (let i = 3; i < 15 - keepCount + 1; i++) {
					let keepArr = DdzUtil.getKeepData(points, i, i + keepCount - 1, 3);
					if (keepArr.loseArr.length != 0) {
						continue;
					}
					// 计算剩余点数牌和癞子点数牌
					let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);

					// 如果剩余点数和癞子刚好组成带牌 说明可以组成飞机带单
					if (surplusPoints.length == keepCount) {

						let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
						let mainPoints = pts;
						let beltPoints = surplusPoints;
						pts = pts.concat(beltPoints);

						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: pts, mainValue: pts[0], mainPoints: mainPoints, beltPoints: beltPoints,
								keepCount: keepCount
							}));
					}

				}
				let arr = [];
				for(let i = 0;i<retArr.length;i++){
					let obj = retArr[i];
					let objArr = DdzUtil.getSpecialSortArr(obj.points);

					if(objArr.doubleArr.length > 0){
						arr.push(obj);
					}
				}
				// 排序 取出 最大和最小
				arr.sort((a, b)=> b.mainValue - a.mainValue) ;
				if(arr.length > 2)
				{
					arr = [arr[0], arr[retArr.length - 1]] ;
				}
				return arr ;

				// // 排序 取出 最大和最小
				// retArr.sort((a, b) => a.mainValue - b.mainValue);
				// if (retArr.length > 2) {
				// 	retArr = [retArr[0], retArr[retArr.length - 1]];
				// }
				// return retArr;

			}

			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var retArr = [];

			// 上家手牌数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			var comboArr = HandCardList.Airplane.getAllCombo(handCard, points);
			if (0 == comboArr.length) {
				return retArr;
			}

			// 拆单张的处理
			for (let i = comboArr.length - 1; i >= 0; i--) {
				let v = comboArr[i];
				let tempPoints = points.slice();
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints);
				let arr = DdzUtil.getSpecialSortArr(tempPoints);
				let beltPoints = arr.sortArr.slice(-v.keepCount);
				retArr.push({
					des: this.des, handType: this.handType, level: this.level,
					points: v.points.concat(beltPoints), mainPoints: v.points, beltPoints: beltPoints,
					mainValue: v.mainValue, keepCount: v.keepCount
				});
			}

			let arr = [];
			for(let i = 0;i<retArr.length;i++){
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if(objArr.doubleArr.length > 0){
					arr.push(obj);
				}
			}
			// 升序排序
			if (arr.length > 0) {
				arr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return arr;
		}
	},

	AirplaneBeltDouble: {
		des: '飞机带对', // 333, 444, 55, 66 or 555, 666, 77, 88
		handType: DdzConst.HandType.AirplaneBeltDouble.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (10 <= points.length && 15 != points[0]) {
				var arr = DdzUtil.getSpecialSortArr(points);
				console.log("arr====", arr);
				// var threeArrLength = arr.threeArr.length ;
				// var doubleArrLength = arr.doubleArr.length ;
				if (arr.fiveArr.length > 0 || arr.sevenArr.length > 0) {
					arr = HandCardList.AirplaneBeltDouble.getThreeArr(arr, "fiveArr", 5);
					arr = HandCardList.AirplaneBeltDouble.getThreeArr(arr, "sevenArr", 7);
				}

				arr.doubleArr = arr.doubleArr.concat(arr.fourArr);
				arr.doubleArr = arr.doubleArr.concat(arr.sixArr);
				arr.doubleArr = arr.doubleArr.concat(arr.eightArr);
				arr.threeArr.sort((a, b) => { return b - a })
				var uniqueArr = DdzUtil.unique(arr.threeArr);
				var lianxu = true;
				if (uniqueArr.length == 1) return false;
				for (let i = 0; i < uniqueArr.length; i++) {
					let tmpArr = uniqueArr[i];
					let tmpArr2 = uniqueArr[i + 1];
					if (tmpArr2 == undefined) break;
					if (tmpArr - 1 == tmpArr2) {
						continue
					}
					lianxu = false
					break
				}
				console.log("arr", arr);
				var threeArrLength = arr.threeArr.length;
				var doubleArrLength = arr.doubleArr.length;
				if (doubleArrLength == 4) return false;
				// var lianxu = uniqueArr.every((v, i, arr) => {
				// 	console.log("v=",v,"i=",i);
				// 	if(arr.length - 1 != i + 1 && v - 1 == arr[i + 1]){
				// 		return true ;
				// 	}
				// 	return false ;
				// })
				if (threeArrLength / 3 == doubleArrLength / 2 &&
					threeArrLength + doubleArrLength == points.length && lianxu) {
					return {
						des: this.des, handType: this.handType, level: this.level, points: points,
						mainPoints: arr.fourArr, beltPoints: arr.doubleArr, mainValue: points[0],
						keepCount: threeArrLength / 3
					};
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var retArr = [];

			// 上家手牌数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// 找到所有飞机的组合
			var airComboArr = HandCardList.Airplane.getAllCombo(handCard, points);
			if (0 == airComboArr.length) {
				return retArr;
			}

			// 拆对的处理
			for (let i = airComboArr.length - 1; i >= 0; i--) {
				let v = airComboArr[i];
				let tempPoints = points.slice();
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints);

				// 取出 所有 对
				let arr = DdzUtil.getSpecialSortArr(tempPoints);
				let threeArr = arr.threeArr.slice();

				// 删除三张中的一张
				for (let j = threeArr.length - 1; j >= 0; j = j - 3) {
					threeArr.slice(j, 1);
				}

				// 筛选出所有的对
				let beltPoints = arr.fourArr.concat(threeArr, arr.doubleArr);
				if (beltPoints.length / 2 >= v.keepCount) {
					beltPoints = beltPoints.slice(v.keepCount * -2);
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: v.points.concat(beltPoints), mainPoints: v.mainPoints,
						beltPoints: beltPoints, mainValue: v.mainValue, keepCount: v.keepCount
					});
				}
				else {
					airComboArr.splice(i, 1);
				}
			}
			let arr = [];
			for(let i = 0;i<retArr.length;i++){
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if(objArr.doubleArr != 4){
					arr.push(obj);
				}
			}
			// 升序排序
			if (arr.length > 0) {
				arr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return arr;
		},
		getThreeArr: function (arr, key, n) {
			for (let i = (n - 1); i < arr[key].length; i += n) {
				let a = arr[key][i];
				for (let j = 0; j < 3; j++) {
					arr.threeArr.push(a);
				}
				for (let z = 0; z < 2; z++) {
					arr.doubleArr.push(a);
				}
			}
			return arr;
		}
	},
	AirplaneTowDouble: {
		des: '飞机带两对', // 333, 444, 55, 66 or 555, 666, 77, 88
		handType: DdzConst.HandType.AirplaneBeltDouble.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (10 <= points.length && 15 != points[0]) {
				var arr = DdzUtil.getSpecialSortArr(points);
				console.log("arr====", arr);
				// var threeArrLength = arr.threeArr.length ;
				// var doubleArrLength = arr.doubleArr.length ;
				if (arr.fiveArr.length > 0 || arr.sevenArr.length > 0) {
					arr = HandCardList.AirplaneBeltDouble.getThreeArr(arr, "fiveArr", 5);
					arr = HandCardList.AirplaneBeltDouble.getThreeArr(arr, "sevenArr", 7);
				}

				arr.doubleArr = arr.doubleArr.concat(arr.fourArr);
				arr.doubleArr = arr.doubleArr.concat(arr.sixArr);
				arr.doubleArr = arr.doubleArr.concat(arr.eightArr);
				arr.threeArr.sort((a, b) => { return b - a })
				var uniqueArr = DdzUtil.unique(arr.threeArr);
				var lianxu = true;
				if (uniqueArr.length == 1) return false;
				for (let i = 0; i < uniqueArr.length; i++) {
					let tmpArr = uniqueArr[i];
					let tmpArr2 = uniqueArr[i + 1];
					if (tmpArr2 == undefined) break;
					if (tmpArr - 1 == tmpArr2) {
						continue
					}
					lianxu = false
					break
				}
				console.log("arr", arr);
				var threeArrLength = arr.threeArr.length;
				var doubleArrLength = arr.doubleArr.length;
				// var lianxu = uniqueArr.every((v, i, arr) => {
				// 	console.log("v=",v,"i=",i);
				// 	if(arr.length - 1 != i + 1 && v - 1 == arr[i + 1]){
				// 		return true ;
				// 	}
				// 	return false ;
				// })
				if (threeArrLength / 3 == doubleArrLength / 2 &&
					threeArrLength + doubleArrLength == points.length && lianxu) {
					return {
						des: this.des, handType: this.handType, level: this.level, points: points,
						mainPoints: arr.fourArr, beltPoints: arr.doubleArr, mainValue: points[0],
						keepCount: threeArrLength / 3
					};
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var retArr = [];

			// 上家手牌数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// 找到所有飞机的组合
			var airComboArr = HandCardList.Airplane.getAllCombo(handCard, points);
			if (0 == airComboArr.length) {
				return retArr;
			}

			// 拆对的处理
			for (let i = airComboArr.length - 1; i >= 0; i--) {
				let v = airComboArr[i];
				let tempPoints = points.slice();
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints);

				// 取出 所有 对
				let arr = DdzUtil.getSpecialSortArr(tempPoints);
				let threeArr = arr.threeArr.slice();

				// 删除三张中的一张
				for (let j = threeArr.length - 1; j >= 0; j = j - 3) {
					threeArr.slice(j, 1);
				}

				// 筛选出所有的对
				let beltPoints = arr.fourArr.concat(threeArr, arr.doubleArr);
				if (beltPoints.length / 2 >= v.keepCount) {
					beltPoints = beltPoints.slice(v.keepCount * -2);
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: v.points.concat(beltPoints), mainPoints: v.mainPoints,
						beltPoints: beltPoints, mainValue: v.mainValue, keepCount: v.keepCount
					});
				}
				else {
					airComboArr.splice(i, 1);
				}
			}
			let arr = [];
			for(let i = 0;i<retArr.length;i++){
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if(objArr.doubleArr == 4){
					arr.push(obj);
				}
			}
			// 升序排序
			if (arr.length > 0) {
				arr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return arr;
		},
		getThreeArr: function (arr, key, n) {
			for (let i = (n - 1); i < arr[key].length; i += n) {
				let a = arr[key][i];
				for (let j = 0; j < 3; j++) {
					arr.threeArr.push(a);
				}
				for (let z = 0; z < 2; z++) {
					arr.doubleArr.push(a);
				}
			}
			return arr;
		}
	},
	FourCardsBeltTwo: {
		des: '四带二', // 3333, 5, 6 or 4444, 6,6
		handType: DdzConst.HandType.FourCardsBeltTwo.value, // 手牌类型值
		level: DdzConst.HandType.FourCardsBeltTwo.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (6 == points.length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				// 包含一个四张的牌
				if (1 == arr.fourArr.length / 4 &&
					2 == arr.doubleArr.length + arr.singleArr.length) {
					return {
						des: this.des, handType: this.handType, level: this.level, points: points,
						mainPoints: arr.fourArr, beltPoints: [points[4], points[5]], mainValue: arr.fourArr[0]
					};
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			var retArr = [];

			// 上家手牌数量大于自己手牌数量
			if (handCard.points.length > points.length) {
				return retArr;
			}

			// 获取所有炸弹的组合
			var bombComboArr = HandCardList.Bomb.getAllCombo(handCard, points);
			if (0 == bombComboArr.length) {
				return retArr;
			}

			// 拆单牌
			for (let v of bombComboArr) {
				let tempPoints = points.slice();
				// 删除数组中 主数
				DdzUtil.removeArrayValue(tempPoints, v.mainPoints);
				let arr = DdzUtil.getSpecialSortArr(tempPoints);
				let beltPoints = arr.sortArr.slice(-2);
				v.points = v.mainPoints.concat(beltPoints);
				v.beltPoints = beltPoints;

				retArr.push({
					des: this.des, handType: this.handType, level: this.level, points:
						v.mainPoints.concat(beltPoints), mainPoints: v.mainPoints, beltPoints: beltPoints,
					mainValue: points[0]
				});
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	// 四带二(只能带单)
	FourCardsBeltTwoWithSingle: {
		des: '四带二(只能带单)', // 3333, 5, 6 or 4444, 6,6
		handType: DdzConst.HandType.FourCardsBeltTwoWithSingle.value, // 手牌类型值
		level: DdzConst.HandType.FourCardsBeltTwoWithSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (6 == points.length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				// 包含一个四张的牌 和两个一样的牌
				if (4 == arr.fourArr.length &&
					2 == arr.singleArr.length) {
					return {
						des: this.des, handType: this.handType, level: this.level, points: points,
						mainPoints: arr.fourArr, beltPoints: [points[4], points[5]], mainValue: arr.fourArr[0]
					};
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			let length = points.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			for (let i = 15; i > mainValue; i--) {
				let keepArr = DdzUtil.getKeepData(points, i, i, 4);

				// 癞子可以补充完整 并且不能全是癞子
				if (keepArr.loseArr.length == 0) {
					let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);

					// 拆单牌
					let tearArr = DdzUtil.tearSingleUnique(surplusPoints, [], 2);
					if (2 == tearArr.count) {
						let pts = keepArr.existArr;
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: pts.concat(tearArr.points), mainValue: pts[0],
								mainPoints: pts, beltPoints: tearArr.points
							}));
					}
				}
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	// 四带二(只能带对)
	FourCardsBeltTwoWithDouble: {
		des: '四带二(只能带对)', // 3333, 5, 6 or 4444, 6,6
		handType: DdzConst.HandType.FourCardsBeltTwoWithDouble.value, // 手牌类型值
		level: DdzConst.HandType.FourCardsBeltTwoWithDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (6 == points.length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				// 包含一个四张的牌 和两个一样的牌
				if (4 == arr.fourArr.length &&
					2 == arr.doubleArr.length) {
					return {
						des: this.des, handType: this.handType, level: this.level, points: points,
						mainPoints: arr.fourArr, beltPoints: [points[4], points[5]], mainValue: arr.fourArr[0]
					};
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			let length = points.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			for (let i = 15; i > mainValue; i--) {
				let keepArr = DdzUtil.getKeepData(points, i, i, 4);

				// 癞子可以补充完整 并且不能全是癞子
				if (keepArr.loseArr.length == 0) {
					let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);

					// 拆单牌
					let tearArr = DdzUtil.tearDouble(surplusPoints, [], 1);
					if (1 == tearArr.count) {
						let pts = keepArr.existArr;
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: pts.concat(tearArr.points), mainValue: pts[0],
								mainPoints: pts, beltPoints: tearArr.points
							}));
					}
				}
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	// 四带两对
	FourCardsBeltTwoDouble: {
		des: '四带两对', // 3333, 5, 6 or 4444, 6,6
		handType: DdzConst.HandType.FourCardsBeltTwoDouble.value, // 手牌类型值
		level: DdzConst.HandType.FourCardsBeltTwoDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (8 == points.length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				let retArr = [];
				// 包含一个四张的牌
				if (4 == arr.fourArr.length &&
					4 == arr.doubleArr.length) {
					retArr.push({
						des: this.des, handType: this.handType, level: this.level, points: points,
						mainPoints: arr.fourArr, beltPoints: arr.doubleArr, mainValue: arr.fourArr[0]
					});
				}
				else if (8 == arr.fourArr.length) {
					let maxValue = Math.max.apply(null, arr.fourArr);
					let minValue = Math.min.apply(null, arr.fourArr);
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: [maxValue, maxValue, maxValue, maxValue, minValue, minValue, minValue, minValue],
						mainPoints: [maxValue, maxValue, maxValue, maxValue],
						beltPoints: [minValue, minValue, minValue, minValue], mainValue: maxValue
					});

					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: [minValue, minValue, minValue, minValue, maxValue, maxValue, maxValue, maxValue],
						mainPoints: [minValue, minValue, minValue, minValue],
						beltPoints: [maxValue, maxValue, maxValue, maxValue], mainValue: minValue
					});

				}
				return retArr;
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points) {
			let length = points.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			for (let i = 15; i > mainValue; i--) {
				let keepArr = DdzUtil.getKeepData(points, i, i, 4);

				// 癞子可以补充完整 并且不能全是癞子
				if (keepArr.loseArr.length == 0) {
					let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);

					// 拆对牌
					let tearArr = DdzUtil.tearDouble(surplusPoints, [], 2);
					if (2 == tearArr.count) {
						let pts = keepArr.existArr;
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: pts.concat(tearArr.points), mainValue: pts[0],
								mainPoints: pts, beltPoints: tearArr.points
							}));
					}
				}
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	Bomb: {
		des: '炸弹', // 3333 or 4444
		handType: DdzConst.HandType.Bomb.value, // 手牌类型值
		level: DdzConst.HandType.Bomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (4 == points.length &&
				points[0] == points[1] &&
				points[0] == points[2] &&
				points[0] == points[3]) {
				return {
					des: this.des, handType: this.handType, level: this.level,
					points: points, mainPoints: points, mainValue: points[0], bombCount: 4
				};
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCards, points) {
			var mainValue = 0;
			var arr = DdzUtil.getSpecialSortArr(points);
			var fourArr = arr.fourArr;
			var retArr = [];

			// 2炸是炸弹里最大的（王炸算火箭，火箭管一切）
			if (15 == handCards.mainValue) {

			}

			//	如果都是炸弹
			if (this.level == handCards.level) {
				mainValue = handCards.mainValue;
			}

			// 炸弹处理
			for (let i = 0; i < fourArr.length; i = i + 4) {
				if (mainValue < fourArr[i]) {
					let pnts = fourArr.slice(i, i + 4);
					retArr.push({
						des: this.des, handType: this.handType, level: this.level,
						points: pnts, mainPoints: pnts, mainValue: fourArr[i], bombCount: 4
					});
				}
			}

			// 升序排序
			if (retArr.length > 0) {
				retArr.sort((a, b) => a.mainValue - b.mainValue);
			}

			return retArr;
		}
	},

	KingBomb: {
		des: '王炸', // 55, 50 or 50, 55
		handType: DdzConst.HandType.KingBomb.value, // 手牌类型值
		level: DdzConst.HandType.KingBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points) {
			if (2 == points.length &&
				55 == points[0] &&
				50 == points[1]) {
				return { des: this.des, handType: this.handType, level: this.level, points: points, mainValue: points[0] };
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCards, points) {
			var findKing = points.indexOf(55);
			var findSmallKing = points.indexOf(50);
			var retArr = [];
			if (-1 != findKing &&
				-1 != findSmallKing) {
				retArr.push({
					des: this.des, handType: this.handType, level: this.level,
					points: [55, 50], mainValue: 55
				});
			}

			return retArr;
		}
	}
};

var ddz = {

	//	获取手牌类型
	getHandCards: function (_cards) {
		console.log("getHandCards"._cards);
		var cards = _cards.slice();
		var points = DdzUtil.cardsToPoints(cards);

		// 特殊形式排序
		// 先是四个一样的
		// 三个一样的
		// 对子
		// 单张
		points = DdzUtil.getSpecialSortArr(points).sortArr.slice();

		var handCardArr = [];
		var handPushFunc = (handCard) => handCardArr.push(handCard);
		for (var key in HandCardList) {

			var handCards = HandCardList[key].getHandCard(points);
			if (handCards) {
				if (!(handCards instanceof Array)) {
					handCardArr.push(handCards);
				}
				else {
					handCards.forEach(handPushFunc);
				}
			}
		}
		return handCardArr;
	},

	getAllCombo: function (handType, upCards, selfCards) {
		console.log("upCards===",upCards);
		var upHandCardArr = this.getHandCards(upCards);
		var selfPoints = DdzUtil.cardsToPoints(selfCards);
		var upHandLevel = HandCardList[handType].level;
		var upHandCard = null;
		var handCardArr = [];

		// 特殊类型排序
		selfPoints = DdzUtil.getSpecialSortArr(selfPoints).sortArr.slice();
		// 取出上家手牌中符合手牌类型的
		upHandCardArr.forEach(function (ele) {
			if (ele.handType == handType) {
				if (!upHandCard) {
					upHandCard = ele;
				}
			}
		});

		if (upHandCard) {

			for (let key in HandCardList) {
				var t = HandCardList[key];
				console.log("t=",t);
				// 手牌等级
				if (t.level > upHandLevel ||
					(t.level == upHandLevel && handType == t.handType)) {
					var comboArr = t.getAllCombo(upHandCard, selfPoints);

					if (comboArr) {
						handCardArr = handCardArr.concat(comboArr);
					}
				}
			}
		}

		if (0 < handCardArr.length) {
			// handCardArr.sort(function(a, b){
			// 	// if(a.level == b.level){
			// 	// 	return a.mainValue - b.mainValue ;
			// 	// }
			// 	return a.level - b.level ;
			// }) ;
		}

		return handCardArr;
	}
};

var rule = {

	/**
	 * 检查出牌是否正确
	 * @param cards
	 * @returns {boolean}
	 */
	isCardsValid: function (cards) {
		var handCards = ddz.getHandCards(cards);
		return handCards.length !== 0;
	},

	/**
	 * 对比牌型是否大小
	 * @param playerCards Array 自己手牌
	 * @param targetCards  Array 比较牌型
	 * @param {handType} string 手牌类型(可选)
	 * @returns {boolean}
	 */
	isCardsGreater: function (playerCards, targetCards, handType) {
		handType = handType || null;
		var playerHandCards = ddz.getHandCards(playerCards);
		var targetHandCards = ddz.getHandCards(targetCards);
		var playerHandCard = null;
		var targetHandCard = null;

		if (0 == playerHandCards.length || 0 == targetHandCards.length) {
			return false;
		}

		// 不存在手牌类型
		if (!handType) {
			targetHandCard = targetHandCards[0];
			handType = targetHandCard.handType;
		}
		else {
			targetHandCards.forEach(function (c) {
				if (c.handType == handType) {
					targetHandCard = c;
				}
			});
		}

		playerHandCards.forEach(function (c) {
			if (c.level >= targetHandCard.level) {
				playerHandCard = c;
			}
		});


		if (!playerHandCard || !targetHandCard) {
			return false;
		}

		if (playerHandCard.level > targetHandCard.level) {
			return true;
		}

		//  级别相等
		if (playerHandCard.level == targetHandCard.level) {

			// 如果类型不同
			if (playerHandCard.handType !== targetHandCard.handType) {
				return false;
			}

			// 连续个数
			if (playerHandCard.keepCount && targetHandCard.keepCount &&
				targetHandCard.keepCount > playerHandCard.keepCount) {
				return false;
			}

			// 主数判断
			if (playerHandCard.mainValue > targetHandCard.mainValue) {
				return true;
			}
		}

		return false;
	},

	/**
	 * 获取可能存在的手牌类型
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} targetCards 目标手牌
	 * @param  {string} handType   （可选）
	 * @return {Array}             手牌组合数组
	 */
	getHandTypes: function (playerCards, targetCards, handType) {
		var hands = ddz.getHandCards(playerCards);
		var targetHand = null;
		var retArr = [];
		if (handType) {
			let targetHands = ddz.getHandCards(targetCards);
			if (targetHands) {
				targetHands.forEach((hand) => {
					if (hand.handType == handType) {
						targetHand = hand;
					}
				});
			}

			if (!targetHand) {
				console.log("getTargetCard HandType not found：", handType);
			}
		}
		else {
			let targetHands = ddz.getHandCards(targetCards)[0];
			console.log("Warning, getHandTypes no handType");
		}


		if (!targetHand) {
			retArr = hands;
		}
		else {
			for (let i = 0; i < hands.length; i++) {
				let selfHand = hands[i];
				// 等级 相同 主数大 或者 等级大
				if ((selfHand.handType === targetHand.handType &&
					selfHand.mainValue > targetHand.mainValue) ||
					selfHand.level > targetHand.level) {
					// 判断是否是顺子类型
					if (!targetHand.keepCount ||
						(targetHand.keepCount && targetHand.keepCount == selfHand.keepCount) ||
						selfHand.level > targetHand.level) {
						retArr.push(selfHand);
					}
				}
			}
		}
		return retArr;
	},

	/**
	 * 获取大过目标牌型的所有手牌组合
	 * @param  {Array} playerCards 玩家手牌
	 * @param  {Array} targetCards 目标手牌
	 * @param  {string} handType   （可选）
	 * @return {Array}             手牌组合数组
	 */
	getTargetCards: function (playerCards, targetCards, handType) {
		console.log('cardToSelf playerCards: ' + playerCards);
		console.log('cardToSelf targetCards: ' + targetCards);
		var retArr = [];
		if (!handType) {
			let targetHandCards = ddz.getHandCards(targetCards);
			if (0 == targetHandCards.length) {
				return retArr;
			}
			handType = targetHandCards[0].handType;
		}
		retArr = ddz.getAllCombo(handType, targetCards, playerCards);
		return retArr;
	},

	/**
	 * 获取手牌中的顺子
	 * @param  {Array} playerCards 玩家手牌
	 * @return {Array}             顺子手牌 或者 原样不变返回
	 */
	getStraightHards: function (playerCards) {
		var retArr = [];
		var points = playerCards.map((value) => value % 100);
		var valueNumArr = [];

		// 线性处理牌点数
		points.forEach(point => valueNumArr[point] = 1);
		var keepCount = 0;

		// 获取顺子数组
		var straightArr = function (start, keep) {
			var sArr = [];
			for (let i = start; i < start + keep; i++) {
				sArr.push(i);
			}
			sArr.sort((a, b) => b - a);
			return sArr;
		};

		// 判断出素有连续的 点数 数组
		for (let i = 3; i < 15; i++) {

			// 在连续
			if (1 == valueNumArr[i]) {
				keepCount++;
			}
			else {
				if (keepCount >= 5) {
					retArr.push(straightArr(i - keepCount, keepCount));
				}
				keepCount = 0;
			}
		}

		// 最后加入 一次
		if (keepCount >= 5) {
			retArr.push(straightArr(15 - keepCount, keepCount));
		}

		// 数组排序
		retArr.sort(function (a, b) {
			if (a.length == b.length) {
				return b[0] - a[0];
			}
			return b.length - a.length;
		});

		if (retArr.length > 0) {
			retArr = retArr[0];
		}
		else {
			retArr = points;
		}
		return retArr;
	},
};

var e = {
	ddz: ddz,
	rule: rule,
	HandCardList: HandCardList,
	getHandCardList: function () { return HandCardList; },
	setHandCardList: function (handCardList) {
		this.HandCardList = handCardList;
		HandCardList = handCardList;
	}
}
module.exports = e;