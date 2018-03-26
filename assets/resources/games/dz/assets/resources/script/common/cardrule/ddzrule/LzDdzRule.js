'use strict';

//
var DdzUtil = ('undefined' == typeof (cc)) ? require('./DdzUtil') : require('DdzUtil');
var DdzConst = ('undefined' == typeof (cc)) ? require('./DdzConst') : require('DdzConst');
var DdzRule = ('undefined' == typeof (cc)) ? require('./DdzRule') : require('DdzRule');
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
	Single: {
		des: '单牌', // 3 or 4
		handType: DdzConst.HandType.Single.value, // 手牌类型值
		level: DdzConst.HandType.Single.level, // 手牌等级

		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			var length = points.length + laiziPoints.length;
			if (1 == length) {
				if (1 == points.length) {
					return DdzRule.HandCardList.Single.getHandCard(points);
				}
				else {
					var point = DdzUtil.laiziPointToPoint(laiziPoints[0]);
					return DdzUtil.creatHandCard(this,
						{ points: laiziPoints, mainValue: laiziPoints[0], laiziPoints: laiziPoints, laiziChangePoints: laiziPoints });
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (points.length + laiziPoints.length >= 1) {
				// 去除重复
				let uniueArr = [];
				points.forEach((v) => {
					if (-1 === uniueArr.indexOf(v)) {
						uniueArr.push(v);
					}
				});

				// 逆序
				uniueArr.reverse();
				// 遍历points 不重复的
				uniueArr.forEach((v) => {
					if (v > mainValue) {
						retArr.push(DdzUtil.creatHandCard(this, { points: [v], mainValue: v }));
					}
				});

				// 癞子去重
				uniueArr = [];
				laiziPoints.forEach((v) => {
					if (-1 === uniueArr.indexOf(v)) {
						uniueArr.push(v);
					}
				});

				// 逆序
				uniueArr.reverse();

				// 遍历laiziPoints 不重复的
				uniueArr.forEach((v) => {
					if (v > mainValue) {
						retArr.push(DdzUtil.creatHandCard(this, {
							points: [v], mainValue: v,
							laiziPoints: [v], laiziChangePoints: [v]
						}));
					}
				});
			}

			return retArr;
		}
	},

	Double: {
		des: '对牌', // 33 or 44
		handType: DdzConst.HandType.Double.value, // 手牌类型值
		level: DdzConst.HandType.Double.level, // 手牌等级

		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			if (points.length + laiziPoints.length == 2) {
				if (laiziPoints.length != 0) {

					// 一张癞子
					if (1 == laiziPoints.length) {
						if (1 == points.length && 55 != points[0] && 50 != points[0]) {
							return DdzUtil.creatHandCard(this,
								{
									points: [points[0], points[0]], mainValue: points[0],
									laiziPoints: [laiziPoints[0]], laiziChangePoints: [points[0]]
								});
						}
						else {
							return false;
						}
					}

					// 两张癞子
					if (2 == laiziPoints.length) {
						// 两张癞子必须保持一致
						if (laiziPoints[0] == laiziPoints[1]) {
							var laiziPoint = laiziPoints[0];
							return DdzUtil.creatHandCard(this,
								{
									points: [laiziPoint, laiziPoint], mainValue: laiziPoint,
									laiziPoints: laiziPoints, laiziChangePoints: [laiziPoint, laiziPoint]
								});
						}
					}
				}
				else {
					// 返回普通斗地主检测
					return DdzRule.HandCardList.Double.getHandCard(points);
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];

			// 牌个数至少是2张
			if (points.length + laiziPoints.length >= 2) {
				let uniueArr = [];
				let arr = DdzUtil.getSpecialSortArr(points);
				let sortPoints = arr.fourArr.concat(arr.threeArr, arr.doubleArr);
				sortPoints.forEach((v) => {
					if (-1 === uniueArr.indexOf(v)) {
						// 大于上家手牌 主值
						if (v > mainValue) {
							uniueArr.push(v);
						}
					}
				});

				// 正常牌值处理
				uniueArr.reverse();
				uniueArr.forEach((v) => {
					retArr.push(DdzUtil.creatHandCard(this, { points: [v, v], mainValue: v }));
				});

				// 癞子 + 单张牌值
				if (laiziPoints.length >= 1) {
					let singleArr = arr.singleArr.slice();
					singleArr = singleArr.filter((v) => 55 !== v && 50 !== v)
					singleArr.forEach((v) => {
						if (v > mainValue) {
							retArr.push(DdzUtil.creatHandCard(this, {
								points: [v, v], mainValue: v,
								laiziPoints: [laiziPoints[0]], laiziChangePoints: [v]
							}));
						}
					});
				}

				// 两张癞子
				if (laiziPoints.length >= 2) {
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziDoubleArr = laiziArr.doubleArr;
					// 去除重复
					uniueArr = [];
					laiziDoubleArr.forEach((v) => {
						if (-1 === uniueArr.indexOf(v)) {
							if (v > mainValue) {
								uniueArr.push(v);
							}
						}
					});

					// 癞子牌值处理
					uniueArr.forEach((v) => {
						retArr.push(DdzUtil.creatHandCard(this, {
							points: [v, v], mainValue: v,
							laiziPoints: [v, v], laiziChangePoints: [v, v]
						}));
					});

				}
			}

			return retArr;
		}
	},

	Straight: {
		des: '顺子',	// 5, 6, 7, 8 , 9
		handType: DdzConst.HandType.Straight.value, // 手牌类型值
		level: DdzConst.HandType.Straight.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			// 返回普通斗地主检测
			if (laiziPoints.length == 0) {
				return DdzRule.HandCardList.Straight.getHandCard(points);
			}
			else {
				// 纯癞子牌是炸弹
				if (0 == points.length) {
					return false;
				}

				// 找到大小王
				if (points.some((v) => 55 == v || 50 == v)) {
					return false;
				}
				var retArr = [];
				var leftFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 1, 5, true);
				var rightFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 1, 5, false);
				if (leftFillArr && 0 == leftFillArr.unusedLaiziPoints.length &&
					leftFillArr.keepCount == points.length + laiziPoints.length) {
					retArr.push(DdzUtil.creatHandCard(this,
						{
							points: leftFillArr.points, mainValue: leftFillArr.points[0],
							laiziPoints: leftFillArr.laiziPoints, keepCount: leftFillArr.keepCount,
							laiziChangePoints: leftFillArr.laiziChangePoints
						}));
				}

				if (rightFillArr && 0 == rightFillArr.unusedLaiziPoints.length &&
					rightFillArr.keepCount == points.length + laiziPoints.length) {
					retArr.push(DdzUtil.creatHandCard(this,
						{
							points: rightFillArr.points, mainValue: rightFillArr.points[0],
							laiziPoints: rightFillArr.laiziPoints, keepCount: rightFillArr.keepCount,
							laiziChangePoints: rightFillArr.laiziChangePoints
						}));
				}
				// 去除重复
				retArr = DdzUtil.handCardsRemoveRepeat(retArr);
				return retArr;
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let keepCount = handCard.keepCount;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.Straight.getAllCombo(handCard, points);
			}
			else {
				if (length >= keepCount) {

					// 从A 判断 是否可以组成顺子
					for (let i = 14; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 1);

						// 癞子可以补充
						if (keepArr.loseArr.length <= laiziPoints.length) {
							// 不能全是癞子
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							if (keepArr.existArr.length >= 1) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts, mainValue: pts[0],
										laiziPoints: useLaiziPoints, keepCount: keepArr.keepCount,
										laiziChangePoints: keepArr.loseArr
									}));
							}
						}
					}

					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			return retArr;
		}
	},

	DoubleStraight: {
		des: '连对', // 33, 44, or 33, 44, 55
		handType: DdzConst.HandType.DoubleStraight.value, // 手牌类型值
		level: DdzConst.HandType.DoubleStraight.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			// 返回普通斗地主检测
			if (laiziPoints.length == 0) {
				return DdzRule.HandCardList.DoubleStraight.getHandCard(points);
			}
			else {

				// 不能全是癞子
				if (0 == points.length) {
					return false;
				}
				// 找到大小王
				if (points.some((v) => 55 == v || 50 == v)) {
					return false;
				}
				var retArr = [];
				var leftFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 2, 3, true);
				var rightFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 2, 3, false);
				if (leftFillArr && 0 == leftFillArr.unusedLaiziPoints.length &&
					leftFillArr.keepCount == (points.length + laiziPoints.length) / 2) {
					retArr.push(DdzUtil.creatHandCard(this,
						{
							points: leftFillArr.points, mainValue: leftFillArr.points[0],
							laiziPoints: leftFillArr.laiziPoints, keepCount: leftFillArr.keepCount,
							laiziChangePoints: leftFillArr.laiziChangePoints
						}));
				}
				if (rightFillArr && 0 == rightFillArr.unusedLaiziPoints.length &&
					rightFillArr.keepCount == (points.length + laiziPoints.length) / 2) {
					retArr.push(DdzUtil.creatHandCard(this,
						{
							points: rightFillArr.points, mainValue: rightFillArr.points[0],
							laiziPoints: rightFillArr.laiziPoints, keepCount: rightFillArr.keepCount,
							laiziChangePoints: rightFillArr.laiziChangePoints
						}));
				}
				// 去除重复
				retArr = DdzUtil.handCardsRemoveRepeat(retArr);

				// 去除 2
				let tmp = [];
				retArr.forEach((v) => {
					if (15 !== v.mainValue) {
						tmp.push(v);
					}
				});
				retArr = tmp;
				return retArr;
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let keepCount = handCard.keepCount;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.DoubleStraight.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成顺子
					for (let i = 14; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 2);

						// 癞子可以补充完整
						if (keepArr.loseArr.length <= laiziPoints.length) {
							// 不能全是癞子
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							if (keepArr.existArr.length >= 1) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts, mainValue: pts[0],
										laiziPoints: useLaiziPoints, keepCount: keepArr.keepCount,
										laiziChangePoints: keepArr.loseArr
									}));
							}
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			return retArr;
		}
	},

	Triplets: {
		des: '三张一样的', // 333 or 444
		handType: DdzConst.HandType.Triplets.value, // 手牌类型值
		level: DdzConst.HandType.Triplets.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			var length = points.length + laiziPoints.length;
			if (3 == length) {
				// 返回普通斗地主检测
				if (laiziPoints.length == 0) {
					return DdzRule.HandCardList.Triplets.getHandCard(points);
				}
				else {

					// 找到大小王
					if (points.some((v) => 55 == v || 50 == v)) {
						return false;
					}
					// 一张癞子牌
					if (1 == laiziPoints.length) {
						if (points[0] == points[1]) {
							return DdzUtil.creatHandCard(this,
								{
									points: [points[0], points[0], points[0]], mainValue: points[0],
									laiziPoints: [laiziPoints[0]], laiziChangePoints: [points[0]]
								});
						}
					}
					// 两张癞子牌
					else if (2 == laiziPoints.length) {
						return DdzUtil.creatHandCard(this,
							{
								points: [points[0], points[0], points[0]], mainValue: points[0],
								laiziPoints: [laiziPoints[0], laiziPoints[1]],
								laiziChangePoints: [points[0], points[0]]
							});
					}
					// 三张癞子牌
					else {
						// 三张癞子牌保持一致 否则返回false
						var laiziMax = Math.max.apply(null, laiziPoints);
						var theSame = laiziPoints.every((p) => p == laiziPoints[0]);
						if (theSame) {
							return DdzUtil.creatHandCard(this,
								{
									points: [laiziMax, laiziMax, laiziMax], mainValue: laiziMax,
									laiziPoints: laiziPoints,
									laiziChangePoints: [laiziMax, laiziMax, laiziMax]
								});
						}
					}
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.Triplets.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 3);

						// 癞子可以补充完整
						if (keepArr.loseArr.length <= laiziPoints.length) {
							// 不能全是癞子
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							if (keepArr.existArr.length >= 1) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts, mainValue: pts[0],
										laiziPoints: useLaiziPoints,
										laiziChangePoints: keepArr.loseArr
									}));
							}
						}
					}

					// 如果癞子大于三张，并且一致
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziThreeArr = laiziArr.threeArr;
					let threeUniueArr = [];
					if (3 <= laiziThreeArr.length) {
						laiziThreeArr.forEach((v) => {
							if (-1 === threeUniueArr.indexOf(v)) {
								threeUniueArr.push(v);
							}
						});

						// 癞子三个的去重
						threeUniueArr.forEach((v) => {
							if (v > mainValue) {
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: [v, v, v], mainValue: v,
										laiziPoints: [v, v, v],
										laiziChangePoints: [v, v, v]
									}));
							}
						});
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			return retArr;
		}
	},

	TripletsBeltSingle: {
		des: '三带一', // 333, 5 or 444, 6
		handType: DdzConst.HandType.TripletsBeltSingle.value, // 手牌类型值
		level: DdzConst.HandType.TripletsBeltSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			var length = points.length + laiziPoints.length;
			if (4 == length) {
				// 返回普通斗地主检测
				if (laiziPoints.length == 0) {
					return DdzRule.HandCardList.TripletsBeltSingle.getHandCard(points);
				}
				else {
					// 一张癞子牌
					if (1 == laiziPoints.length) {
						// 如果癞子是带牌 可以是炸
						if (points[0] == points[1] &&
							points[0] == points[2]) {
							return DdzUtil.creatHandCard(this,
								{
									points: [points[0], points[1], points[2], laiziPoints[0]],
									mainValue: points[0], mainPoints: [points[0], points[1], points[2]],
									beltPoints: [laiziPoints[0]],
									laiziPoints: [laiziPoints[0]],
									laiziChangePoints: [laiziPoints[0]]
								});
						}
						// 如果癞子是放到主牌中
						// 找到两个相同的牌
						let arr = DdzUtil.getSpecialSortArr(points);
						let doubleArr = arr.doubleArr;
						let singleArr = arr.singleArr;
						if (doubleArr.length == 2) {
							return DdzUtil.creatHandCard(this,
								{
									points: [doubleArr[0], doubleArr[0], doubleArr[0], singleArr[0]],
									mainValue: points[0], mainPoints: [doubleArr[0], doubleArr[0], doubleArr[0]],
									beltPoints: [singleArr[0]],
									laiziPoints: [laiziPoints[0]],
									laiziChangePoints: [doubleArr[0]]
								});
						}
					}
					// 两张癞子牌
					else if (2 == laiziPoints.length) {

						// 两张一样的牌
						if (points[0] == points[1]) {
							return DdzUtil.creatHandCard(this,
								{
									points: [points[0], points[0], points[0], laiziPoints[1]],
									mainValue: points[0], mainPoints: [points[0], points[0], points[0]],
									beltPoints: [laiziPoints[1]],
									laiziPoints: laiziPoints,
									laiziChangePoints: [points[0], laiziPoints[1]]
								});
						}
						else {
							let maxValue = Math.max.apply(null, points);
							let minValue = Math.min.apply(null, points);
							let retArr = [];
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [maxValue, maxValue, maxValue, minValue],
									mainValue: maxValue, mainPoints: [maxValue, maxValue, maxValue],
									beltPoints: [minValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [maxValue, maxValue]
								}));
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [minValue, minValue, minValue, maxValue],
									mainValue: minValue, mainPoints: [minValue, minValue, minValue],
									beltPoints: [maxValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [minValue, minValue]
								}));
							// 去除重复
							retArr = DdzUtil.handCardsRemoveRepeat(retArr);
							retArr = retArr.filter((v) => v.mainValue !== 55 && v.mainValue !== 50);
							return retArr;
						}
					}
					// 三张癞子牌
					else if (3 == laiziPoints.length) {
						// 如果是三张癞子牌  默认产生 222，单，+ 333，单
						// 如果单牌是2 则为 AAA，单 + 333，单
						// 如果单牌是3 则为 222，单 + 444，单
						let maxLaizi = 15;
						let minLaizi = 3;
						let retArr = [];
						if (15 == points[0]) {
							maxLaizi--; // 14
						}
						else if (3 == points[0]) {
							minLaizi++;
						}
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: [maxLaizi, maxLaizi, maxLaizi, points[0]],
								mainValue: maxLaizi, mainPoints: [maxLaizi, maxLaizi, maxLaizi],
								beltPoints: [points[0]],
								laiziPoints: laiziPoints,
								laiziChangePoints: [maxLaizi, maxLaizi, maxLaizi]
							}));
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: [minLaizi, minLaizi, minLaizi, points[0]],
								mainValue: minLaizi, mainPoints: [minLaizi, minLaizi, minLaizi],
								beltPoints: [points[0]],
								laiziPoints: laiziPoints,
								laiziChangePoints: [minLaizi, minLaizi, minLaizi]
							}));
						// 去除重复
						retArr = DdzUtil.handCardsRemoveRepeat(retArr);
						retArr = retArr.filter((v) => v.mainValue !== 55 && v.mainValue !== 50);
						return retArr;
					}
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.TripletsBeltSingle.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 3);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌
							let tearArr = DdzUtil.tearSingle(surplusPoints, surplusLaiziPoints, 1);
							if (1 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziThreeArr = laiziArr.threeArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziThreeArr);

					if (3 <= laiziThreeArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearSingle(points, surplusLaiziPoints, 1);

						// 可拆出单牌，并且没有用到癞子（4张癞子是炸）
						if (1 == tearArr.count &&
							0 == tearArr.laiziPoints.length) {
							let single = tearArr.points[0];
							let pts = laiziThreeArr.slice(-3);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat([single]), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points,
									laiziPoints: pts, laiziChangePoints: pts
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
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
		getHandCard: function (points, laiziPoints) {
			var length = points.length + laiziPoints.length;

			if (5 == length) {
				// 返回普通斗地主检测
				if (laiziPoints.length == 0) {
					return DdzRule.HandCardList.TripletsBeltDouble.getHandCard(points);
				}
				else {
					let arr = DdzUtil.getSpecialSortArr(points);
					let threeArr = arr.threeArr;
					let doubleArr = arr.doubleArr;
					let singleArr = arr.singleArr;
					// 一张癞子牌
					if (1 == laiziPoints.length) {
						// 癞子在带牌中
						if (3 == threeArr.length) {
							return DdzUtil.creatHandCard(this,
								{
									points: [threeArr[0], threeArr[1], threeArr[2], singleArr[0], singleArr[0]],
									mainValue: threeArr[0], beltPoints: [singleArr[0], singleArr[0]],
									mainPoints: [threeArr[0], threeArr[1], threeArr[2], singleArr[0]],
									laiziPoints: laiziPoints,
									laiziChangePoints: [singleArr[0]]
								});
						}

						// 癞子在主牌中
						if (4 == doubleArr.length) {
							let maxValue = Math.max.apply(null, points);
							let minValue = Math.min.apply(null, points);
							let retArr = [];
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [maxValue, maxValue, maxValue, minValue, minValue],
									mainValue: maxValue, beltPoints: [minValue, minValue],
									mainPoints: [maxValue, maxValue, maxValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [maxValue]
								}));
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [minValue, minValue, minValue, maxValue, maxValue],
									mainValue: minValue, beltPoints: [maxValue, maxValue],
									mainPoints: [minValue, minValue, minValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [minValue]
								}));
							// 去除重复
							retArr = DdzUtil.handCardsRemoveRepeat(retArr);
							return retArr;
						}
					}
					// 两张癞子牌
					else if (2 == laiziPoints.length) {

						// 癞子是携带牌
						if (3 == threeArr.length) {
							let lmaxValue = Math.max.apply(null, laiziPoints);
							let lminValue = Math.min.apply(null, laiziPoints);
							return DdzUtil.creatHandCard(this,
								{
									points: [threeArr[0], threeArr[0], threeArr[0], lmaxValue, lmaxValue],
									mainValue: threeArr[0], beltPoints: [lmaxValue, lmaxValue],
									mainPoints: [threeArr[0], threeArr[0], threeArr[0]],
									laiziPoints: laiziPoints,
									laiziChangePoints: [lmaxValue, lmaxValue]
								});
						}

						// 两种可能性 6, 6, 5, *, * ; 7, 7, 8, *, *
						if (2 == doubleArr.length && 1 == singleArr.length) {
							let doubleValue = doubleArr[0]
							let singleValue = singleArr[0];
							let retArr = [];
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [doubleValue, doubleValue, doubleValue, singleValue, singleValue],
									mainValue: doubleValue, beltPoints: [singleValue, singleValue],
									mainPoints: [doubleValue, doubleValue, doubleValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [doubleValue, singleValue]
								}));
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [singleValue, singleValue, singleValue, doubleValue, doubleValue],
									mainValue: singleValue, beltPoints: [doubleValue, doubleValue],
									mainPoints: [singleValue, singleValue, singleValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [singleValue, singleValue]
								}));
							// 去除重复
							retArr = DdzUtil.handCardsRemoveRepeat(retArr);
							retArr = retArr.filter((v) => v.mainValue !== 55 && v.mainValue !== 50);
							return retArr;
						}
					}
					// 三张癞子牌
					else if (3 == laiziPoints.length) {
						// 正常牌值相等 ***, 对 出现两个返回值 222, 对, + 333, 对
						// 如果 对牌为 2 则变 AAA + 22，+ 333, 22
						// 如果 对牌为 3 则变 222, 33 + 444,33
						if (points[0] == points[1]) {
							let maxLaizi = 15;
							let minLaizi = 3;
							let retArr = [];
							if (15 == points[0]) {
								maxLaizi--; // 14
							}
							else if (3 == points[0]) {
								minLaizi++;
							}
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [maxLaizi, maxLaizi, maxLaizi, points[0], points[0]],
									mainValue: maxLaizi, mainPoints: [maxLaizi, maxLaizi, maxLaizi],
									beltPoints: [points[0], points[0]],
									laiziPoints: laiziPoints,
									laiziChangePoints: [maxLaizi, maxLaizi, maxLaizi]
								}));
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [minLaizi, minLaizi, minLaizi, points[0], points[0]],
									mainValue: minLaizi, mainPoints: [minLaizi, minLaizi, minLaizi],
									beltPoints: [points[0], points[0]],
									laiziPoints: laiziPoints,
									laiziChangePoints: [minLaizi, minLaizi, minLaizi]
								}));
							// 去除重复
							retArr = DdzUtil.handCardsRemoveRepeat(retArr);
							retArr = retArr.filter((v) => v.mainValue !== 55 && v.mainValue !== 50);
							return retArr;
						}
						// 两张牌不相等
						else {
							let maxValue = Math.max.apply(null, points);
							let minValue = Math.min.apply(null, points);
							let retArr = [];
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [maxValue, maxValue, maxValue, minValue, minValue],
									mainValue: maxValue, beltPoints: [minValue, minValue],
									mainPoints: [maxValue, maxValue, maxValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [maxValue, maxValue, minValue]
								}));
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: [minValue, minValue, minValue, maxValue, maxValue],
									mainValue: minValue, beltPoints: [maxValue, maxValue],
									mainPoints: [minValue, minValue, minValue],
									laiziPoints: laiziPoints,
									laiziChangePoints: [maxValue, minValue, minValue]
								}));
							// 去除重复
							retArr = DdzUtil.handCardsRemoveRepeat(retArr);
							retArr = retArr.filter((v) => v.mainValue !== 55 && v.mainValue !== 50);
							return retArr;
						}
					}
					// 四张癞子牌
					// 特殊情况 ****，单 变化 222，单(单*) + 333，单（单*）
					// 如果单牌为2 则为 AAA + 22，+ 333, 22
					// 如果单牌为3 则为 222, 33 + 444,33
					else if (4 == laiziPoints.length) {
						let maxLaizi = 15;
						let minLaizi = 3;
						let retArr = [];
						if (15 == points[0]) {
							maxLaizi--; // 14
						}
						else if (3 == points[0]) {
							minLaizi++;
						}
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: [maxLaizi, maxLaizi, maxLaizi, points[0], points[0]],
								mainValue: maxLaizi, mainPoints: [maxLaizi, maxLaizi, maxLaizi],
								beltPoints: [points[0], points[0]],
								laiziPoints: laiziPoints,
								laiziChangePoints: [maxLaizi, maxLaizi, maxLaizi, points[0]]
							}));
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: [minLaizi, minLaizi, minLaizi, points[0], points[0]],
								mainValue: minLaizi, mainPoints: [minLaizi, minLaizi, minLaizi],
								beltPoints: [points[0], points[0]],
								laiziPoints: laiziPoints,
								laiziChangePoints: [minLaizi, minLaizi, minLaizi, points[0]]
							}));
						// 去除重复
						retArr = DdzUtil.handCardsRemoveRepeat(retArr);
						retArr = retArr.filter((v) => v.mainValue !== 55 && v.mainValue !== 50);
						return retArr;
					}

				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.TripletsBeltDouble.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 3);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌
							let tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, 1);
							if (1 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziThreeArr = laiziArr.threeArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziThreeArr);

					if (3 <= laiziThreeArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearDouble(points, surplusLaiziPoints, 1);

						// 可拆出单牌，并且没有用到癞子（4张癞子是炸）
						if (1 == tearArr.count &&
							2 != tearArr.laiziPoints.length) {
							let pts = laiziThreeArr.slice(-3);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points,
									laiziPoints: pts.concat(tearArr.laiziPoints),
									laiziChangePoints: pts.concat(tearArr.laiziChangePoints)
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
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
		getHandCard: function (points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			if (length >= 6 && 0 == length % 3) {
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.Airplane.getHandCard(points);
				}
				else if (0 != points.length) {

					var retArr = [];
					var leftFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 3, 2, true);
					var rightFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 3, 2, false);
					if (leftFillArr && 0 == leftFillArr.unusedLaiziPoints.length &&
						leftFillArr.keepCount == length / 3) {
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: leftFillArr.points, mainValue: leftFillArr.points[0],
								mainPoints: leftFillArr.points, keepCount: leftFillArr.keepCount,
								laiziPoints: leftFillArr.laiziPoints,
								laiziChangePoints: leftFillArr.laiziChangePoints
							}));
					}
					if (rightFillArr && 0 == rightFillArr.unusedLaiziPoints.length &&
						rightFillArr.keepCount == length / 3) {
						retArr.push(DdzUtil.creatHandCard(this,
							{
								points: rightFillArr.points, mainValue: rightFillArr.points[0],
								mainPoints: rightFillArr.points, keepCount: leftFillArr.keepCount,
								laiziPoints: rightFillArr.laiziPoints,
								laiziChangePoints: rightFillArr.laiziChangePoints
							}));
					}
					// 去除重复
					retArr = DdzUtil.handCardsRemoveRepeat(retArr);

					// 去除 2
					let tmp = [];
					retArr.forEach((v) => {
						if (15 !== v.mainValue) {
							tmp.push(v);
						}
					});
					retArr = tmp;
					return retArr;
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let keepCount = handCard.keepCount;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.Airplane.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成大于上家手牌的飞机
					for (let i = 14; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 3);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts, mainValue: pts[0], keepCount: keepCount,
									mainPoints: pts, laiziPoints: useLaiziPoints,
									laiziChangePoints: keepArr.loseArr
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			return retArr;
		}
	},

	AirplaneBeltSingle: {
		des: '飞机带单', // 333, 444, 5, 6 or 555, 666, 7, 8
		handType: DdzConst.HandType.AirplaneBeltSingle.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			if (length >= 8 && 0 == length % 4) {
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.AirplaneBeltSingle.getHandCard(points);
				}
				else {
					let retArr = [];
					let keepCount = length / 4;
					let pMax = Math.max.apply(null, points);
					let pMin = Math.min.apply(null, points);

					// 从3 - 15 循环判断 是否可以组成飞机
					for (let i = 3; i < 15 - keepCount + 1; i++) {
						let keepArr = DdzUtil.getKeepData(points, i, i + keepCount - 1, 3);
						// 癞子不能支持补充到飞机上
						if (keepArr.loseArr.length > laiziPoints.length) {
							continue;
						}
						// 计算剩余点数牌和癞子点数牌
						let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
						let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

						// 如果剩余点数和癞子刚好组成带牌 说明可以组成飞机带单
						if (surplusPoints.length + surplusLaiziPoints.length == keepCount) {

							let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
							let mainPoints = pts;
							let beltPoints = surplusPoints.concat(surplusLaiziPoints);
							pts = pts.concat(beltPoints);

							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts, mainValue: pts[0], mainPoints: mainPoints, beltPoints: beltPoints,
									laiziPoints: laiziPoints, keepCount: keepCount,
									laiziChangePoints: keepArr.loseArr.concat(surplusLaiziPoints)
								}));
						}

					}
					let arr = [];
					for (let i = 0; i < retArr.length; i++) {
						let obj = retArr[i];
						let objArr = DdzUtil.getSpecialSortArr(obj.points);
						if (objArr.doubleArr.length == 0) {
							arr.push(obj);
						}
					}
					// 排序 取出 最大和最小
					arr.sort((a, b) => b.mainValue - a.mainValue);
					if (arr.length > 2) {
						arr = [arr[0], arr[retArr.length - 1]];
					}
					return arr;
				}
			}

			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let keepCount = handCard.keepCount;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.AirplaneBeltSingle.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成大于上家手牌的飞机
					for (let i = 14; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 3);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);
							// 拆单牌
							let tearArr = DdzUtil.tearSingle(surplusPoints, surplusLaiziPoints, keepCount);
							if (keepCount == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziThreeArr = laiziArr.threeArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziThreeArr);

					if (keepCount * 3 <= laiziThreeArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearSingle(points, surplusLaiziPoints, keepCount);

						// 可拆出单牌，并且拆出的不都是癞子牌
						if (keepCount == tearArr.count &&
							0 != tearArr.points.length) {
							let pts = laiziThreeArr.slice(-keepCount * 3);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
									laiziPoints: pts.concat(tearArr.laiziPoints),
									laiziChangePoints: pts.concat(tearArr.laiziChangePoints)
								}));
						}
					}
				}
			}
			let arr = [];
			for (let i = 0; i < retArr.length; i++) {
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if (objArr.doubleArr.length == 0) {
					arr.push(obj);
				}
			}
			// 排序 取出 最大和最小

			// 升序排序
			if (arr.length > 0) {
				arr.sort((a, b) => b.mainValue - a.mainValue);
			}
			return arr;
		}
	},

	AirplaneOneSingle: {
		des: '飞机带单', // 333, 444, 5, 6 or 555, 666, 7, 8
		handType: DdzConst.HandType.AirplaneBeltSingle.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			console.log("points", points);
			let length = points.length + laiziPoints.length;
			console.log("length=", length, "length%4", length % 4);
			if (length >= 8 && 0 == length % 4) {
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.AirplaneOneSingle.getHandCard(points);
				}
				else {
					let retArr = [];
					let keepCount = length / 4;
					let pMax = Math.max.apply(null, points);
					let pMin = Math.min.apply(null, points);
					console.log("====keepCount", keepCount);
					// 从3 - 15 循环判断 是否可以组成飞机
					for (let i = 3; i < 15 - keepCount + 1; i++) {
						let keepArr = DdzUtil.getKeepData(points, i, i + keepCount - 1, 3);
						// 癞子不能支持补充到飞机上
						if (keepArr.loseArr.length > laiziPoints.length) {
							continue;
						}
						// 计算剩余点数牌和癞子点数牌
						let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
						let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

						// 如果剩余点数和癞子刚好组成带牌 说明可以组成飞机带单
						if (surplusPoints.length + surplusLaiziPoints.length == keepCount) {

							let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
							let mainPoints = pts;
							let beltPoints = surplusPoints.concat(surplusLaiziPoints);
							pts = pts.concat(beltPoints);

							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts, mainValue: pts[0], mainPoints: mainPoints, beltPoints: beltPoints,
									laiziPoints: laiziPoints, keepCount: keepCount,
									laiziChangePoints: keepArr.loseArr.concat(surplusLaiziPoints)
								}));
						}

					}

					let arr = [];
					for (let i = 0; i < retArr.length; i++) {
						let obj = retArr[i];
						let objArr = DdzUtil.getSpecialSortArr(obj.points);

						if (objArr.doubleArr.length > 0) {
							arr.push(obj);
						}
					}
					// 排序 取出 最大和最小
					arr.sort((a, b) => b.mainValue - a.mainValue);
					if (arr.length > 2) {
						arr = [arr[0], arr[retArr.length - 1]];
					}
					return arr;
				}
			}

			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let keepCount = handCard.keepCount;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.AirplaneBeltSingle.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成大于上家手牌的飞机
					for (let i = 14; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 3);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);
							// 拆单牌
							let tearArr = DdzUtil.tearSingle(surplusPoints, surplusLaiziPoints, keepCount);
							if (keepCount == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziThreeArr = laiziArr.threeArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziThreeArr);

					if (keepCount * 3 <= laiziThreeArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearSingle(points, surplusLaiziPoints, keepCount);

						// 可拆出单牌，并且拆出的不都是癞子牌
						if (keepCount == tearArr.count &&
							0 != tearArr.points.length) {
							let pts = laiziThreeArr.slice(-keepCount * 3);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
									laiziPoints: pts.concat(tearArr.laiziPoints),
									laiziChangePoints: pts.concat(tearArr.laiziChangePoints)
								}));
						}
					}

				}
			}
			let arr = [];
			for (let i = 0; i < retArr.length; i++) {
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if (objArr.doubleArr.length == 0) {
					arr.push(obj);
				}
			}
			// 排序 取出 最大和最小

			// 升序排序
			if (arr.length > 0) {
				arr.sort((a, b) => b.mainValue - a.mainValue);
			}
			return arr;
		}
	},
	AirplaneBeltDouble: {
		des: '飞机带对', // 333, 444, 55, 66 or 555, 666, 77, 88
		handType: DdzConst.HandType.AirplaneBeltDouble.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			if (length >= 10 && 0 == length % 5) {
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.AirplaneBeltDouble.getHandCard(points);
				}
				else {
					// let arr = DdzUtil.getSpecialSortArr(points) ;
					// let threeArr = arr.threeArr ;
					// let doubelArr = arr.doubleArr ;
					// let singleArr = arr.singleArr ;

					// // 主牌中是可能是飞机
					// if(arr.threeArr.length == points.length){

					// }
					let retArr = [];
					let keepCount = length / 5;
					let pMax = Math.max.apply(null, points);
					let pMin = Math.min.apply(null, points);
					// 从3 - 15 循环判断 是否可以组成飞机
					for (let i = 3; i < 15 - keepCount + 1; i++) {
						let keepArr = DdzUtil.getKeepData(points, i, i + keepCount - 1, 3);
						// 癞子不能支持补充到飞机上
						if (keepArr.loseArr.length > laiziPoints.length) {
							continue;
						}
						// 计算剩余点数牌和癞子点数牌
						let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
						let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

						// 如果剩余点数和癞子刚好组成带牌 说明可以组成飞机带对
						if (surplusPoints.length + surplusLaiziPoints.length == keepCount * 2) {
							var tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, keepCount);

							// 拆对儿的个数 正确
							if (tearArr.count == keepCount) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								let mainPoints = pts;
								let beltPoints = tearArr.points;
								pts = pts.concat(beltPoints);
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts, mainValue: pts[0], mainPoints: mainPoints, beltPoints: beltPoints,
										laiziPoints: laiziPoints, keepCount: keepCount,
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 排序 取出 最大和最小
					let arr = [];
					for (let i = 0; i < retArr.length; i++) {
						let obj = retArr[i];
						let objArr = DdzUtil.getSpecialSortArr(obj.points);
						if (objArr.doubleArr.length != 4) {
							arr.push(obj);
						}
					}
					arr.sort((a, b) => b.mainValue - a.mainValue);
					if (arr.length > 2) {
						arr = [arr[0], arr[arr.length - 1]];
					}
					return arr;
				}
			}

			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let keepCount = handCard.keepCount;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.AirplaneTowDouble.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成大于上家手牌的飞机
					for (let i = 14; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 3);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);
							// 拆单牌
							let tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, keepCount);
							if (keepCount == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziThreeArr = laiziArr.threeArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziThreeArr);

					if (keepCount * 3 <= laiziThreeArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearDouble(points, surplusLaiziPoints, keepCount);

						// 可拆出单牌，并且拆出的不都是癞子牌
						if (keepCount == tearArr.count &&
							0 != tearArr.points.length) {
							let pts = laiziThreeArr.slice(-keepCount * 3);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
									laiziPoints: pts.concat(tearArr.laiziPoints),
									laiziChangePoints: pts.concat(tearArr.laiziChangePoints)
								}));
						}
					}


					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			let arr = [];
			for (let i = 0; i < retArr.length; i++) {
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if (objArr.doubleArr.length != 4) {
					arr.push(obj);
				}
			}
			if (arr.length > 0)
				arr.sort((a, b) => b.mainValue - a.mainValue);
			return arr;
		}
	},
	AirplaneTowDouble: {
		des: '飞机带两对', // 333, 444, 55, 66 or 555, 666, 77, 88
		handType: DdzConst.HandType.AirplaneBeltDouble.value, // 手牌类型值
		level: DdzConst.HandType.AirplaneBeltDouble.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			if (length >= 10 && 0 == length % 5) {
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.AirplaneTowDouble.getHandCard(points);
				}
				else {
					// let arr = DdzUtil.getSpecialSortArr(points) ;
					// let threeArr = arr.threeArr ;
					// let doubelArr = arr.doubleArr ;
					// let singleArr = arr.singleArr ;

					// // 主牌中是可能是飞机
					// if(arr.threeArr.length == points.length){

					// }
					let retArr = [];
					let keepCount = length / 5;
					let pMax = Math.max.apply(null, points);
					let pMin = Math.min.apply(null, points);

					// 从3 - 15 循环判断 是否可以组成飞机
					for (let i = 3; i < 15 - keepCount + 1; i++) {
						let keepArr = DdzUtil.getKeepData(points, i, i + keepCount - 1, 3);
						// 癞子不能支持补充到飞机上
						if (keepArr.loseArr.length > laiziPoints.length) {
							continue;
						}
						// 计算剩余点数牌和癞子点数牌
						let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
						let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

						// 如果剩余点数和癞子刚好组成带牌 说明可以组成飞机带对
						if (surplusPoints.length + surplusLaiziPoints.length == keepCount * 2) {
							var tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, keepCount);

							// 拆对儿的个数 正确
							if (tearArr.count == keepCount) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								let mainPoints = pts;
								let beltPoints = tearArr.points;
								pts = pts.concat(beltPoints);
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts, mainValue: pts[0], mainPoints: mainPoints, beltPoints: beltPoints,
										laiziPoints: laiziPoints, keepCount: keepCount,
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					let arr = [];
					for (let i = 0; i < retArr.length; i++) {
						let obj = retArr[i];
						let objArr = DdzUtil.getSpecialSortArr(obj.points);
						if (objArr.doubleArr.length == 4) {
							arr.push(obj);
						}
					}
					arr.sort((a, b) => b.mainValue - a.mainValue);
					if (arr.length > 2) {
						arr = [arr[0], arr[arr.length - 1]];
					}
					return arr;
				}
			}

			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let keepCount = handCard.keepCount;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.AirplaneBeltDouble.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成大于上家手牌的飞机
					for (let i = 14; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i - keepCount + 1, i, 3);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);
							// 拆单牌
							let tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, keepCount);
							if (keepCount == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziThreeArr = laiziArr.threeArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziThreeArr);

					if (keepCount * 3 <= laiziThreeArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearDouble(points, surplusLaiziPoints, keepCount);

						// 可拆出单牌，并且拆出的不都是癞子牌
						if (keepCount == tearArr.count &&
							0 != tearArr.points.length) {
							let pts = laiziThreeArr.slice(-keepCount * 3);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points, keepCount: keepCount,
									laiziPoints: pts.concat(tearArr.laiziPoints),
									laiziChangePoints: pts.concat(tearArr.laiziChangePoints)
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			let arr = [];
			for (let i = 0; i < retArr.length; i++) {
				let obj = retArr[i];
				let objArr = DdzUtil.getSpecialSortArr(obj.points);
				if (objArr.doubleArr.length == 4) {
					arr.push(obj);
				}
			}
			if (arr.length > 0)
				arr.sort((a, b) => b.mainValue - a.mainValue);

			return arr;
		}
	},

	FourCardsBeltTwo: {
		des: '四带二', // 3333, 5, 6 or 4444, 6,6
		handType: DdzConst.HandType.FourCardsBeltTwo.value, // 手牌类型值
		level: DdzConst.HandType.FourCardsBeltTwo.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let retArr = [];
			let length = points.length + laiziPoints.length;
			if (6 == length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.FourCardsBeltTwoWithSingle.getHandCard(points);
				}
				else {
					// 全是癞子 是炸
					if (6 == laiziPoints.length) {
						return false;
					}

					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i >= 3; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子 癞子不能匹配王
						if (keepArr.loseArr.length <= laiziPoints.length &&
							!keepArr.existArr.some((v) => 55 == v || 50 == v)) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌 去重
							let tearArr = DdzUtil.tearSingle(surplusPoints, surplusLaiziPoints, 2);
							if (2 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					if (retArr.length >= 2) {
						retArr = retArr.slice(0, 1).concat(retArr.slice(-1));
					}

					var arr = [];
					for (let i = 0; i < retArr.length; i++) {
						let obj = retArr[i];
						var _retArr = DdzUtil.getSpecialSortArr(obj.points);
						if (_retArr.doubleArr.length > 0) {
							if (_retArr.doubleArr.indexOf(55) >= 0 || _retArr.doubleArr.indexOf(50) >= 0) {
								continue;
							}
							arr.push(obj);
						}
			
					}
					if (arr.length >= 2) {
						arr = arr.slice(0, 1).concat(arr.slice(-1));
					}
					return arr;
					// return retArr;
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.FourCardsBeltTwo.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌
							let tearArr = DdzUtil.tearSingle(surplusPoints, surplusLaiziPoints, 2);
							if (2 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziFourArr = laiziArr.fourArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziFourArr);

					if (4 <= laiziFourArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearSingle(points, surplusLaiziPoints, 2);

						// 可拆出单牌，拆出来的不能都是癞子（6张癞子是炸）
						if (2 == tearArr.count &&
							tearArr.laiziPoints.length < 2) {
							let pts = laiziFourArr.slice(-4);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points,
									laiziPoints: pts.concat(tearArr.points),
									laiziChangePoints: pts.concat(tearArr.laiziPoints)
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			return retArr;
		}
	},
	// // 四带一
	// FourCardsBeltSingle: {
	// 	des: '四带一', // 3333, 5, 6 or 4444, 6,6
	// 	handType: DdzConst.HandType.FourCardsBeltSingle.value, // 手牌类型值
	// 	level: DdzConst.HandType.FourCardsBeltSingle.level, // 手牌等级
	// 	// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
	// 	getHandCard: function(points, laiziPoints){
	// 		let retArr = [] ;
	// 		let length = points.length + laiziPoints.length ;
	// 		if(5 == length){
	// 			var arr = DdzUtil.getSpecialSortArr(points) ;
	// 			// 包含一个四张的牌
	// 			if(0 == laiziPoints.length){
	// 				return DdzRule.HandCardList.FourCardsBeltSingle.getHandCard(points) ;
	// 			}
	// 			else
	// 			{

	// 				// 全是癞子 是炸
	// 				if(5 == laiziPoints.length){
	// 					return false ;
	// 				}

	// 				// 从A - 3 判断 是否可以组成三顺
	// 				for(let i = 15 ; i >= 3 ; i--){
	// 					let keepArr = DdzUtil.getKeepData(points, i, i, 4) ;

	// 					// 癞子可以补充完整 并且不能全是癞子
	// 					if(keepArr.loseArr.length <= laiziPoints.length){
	// 						let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length) ;
	// 						let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr) ;
	// 						let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length) ;

	// 						// 拆单牌
	// 						let tearArr = DdzUtil.tearSingle(surplusPoints, surplusLaiziPoints, 1) ;
	// 						if(1 == tearArr.count){
	// 							let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr ;
	// 							retArr.push(DdzUtil.creatHandCard(this,
	// 										{points: pts.concat(tearArr.points), mainValue: pts[0],
	// 										mainPoints: pts, beltPoints: tearArr.points,
	// 										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
	// 										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)})) ;
	// 						}
	// 					}
	// 				}

	// 				if(retArr.length >= 2){
	// 					retArr = retArr.slice(0, 1).concat(retArr.slice(-1)) ;
	// 				}

	// 				return retArr ;
	// 			}
	// 		}
	// 		return false ;
	// 	},

	// 	// 当前类型的所有可能组合
	// 	getAllCombo: function(handCard, points, laiziPoints){
	// 		let length = points.length + laiziPoints.length ;
	// 		let mainValue = handCard.mainValue ;
	// 		let retArr = [] ;
	// 		if(0 == laiziPoints.length){
	// 			return DdzRule.HandCardList.FourCardsBeltSingle.getAllCombo(handCard, points) ;
	// 		}
	// 		else{
	// 			// 上家手牌数量
	// 			if(length >= handCard.points.length){
	// 				// 从A - 3 判断 是否可以组成三顺
	// 				for(let i = 15 ; i > mainValue ; i--){
	// 					let keepArr = DdzUtil.getKeepData(points, i, i, 4) ;

	// 					// 癞子可以补充完整 并且不能全是癞子
	// 					if(keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1){
	// 						let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length) ;
	// 						let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr) ;
	// 						let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length) ;

	// 						// 拆单牌
	// 						let tearArr = DdzUtil.tearSingle(surplusPoints, surplusLaiziPoints, 1) ;
	// 						if(1 == tearArr.count){
	// 							let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr ;
	// 							retArr.push(DdzUtil.creatHandCard(this,
	// 										{points: pts.concat(tearArr.points), mainValue: pts[0],
	// 										mainPoints: pts, beltPoints: tearArr.points,
	// 										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
	// 										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)})) ;
	// 						}
	// 					}
	// 				}

	// 				// 如果癞子大于三张，并且值相同
	// 				let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints) ;
	// 				let laiziFourArr = laiziArr.fourArr ;
	// 				let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziFourArr) ;

	// 				if(4 <= laiziFourArr.length){
	// 					// 拆单牌
	// 					let tearArr = DdzUtil.tearSingle(points, surplusLaiziPoints, 1) ;

	// 					// 可拆出单牌，拆出来的不能都是癞子（6张癞子是炸）
	// 					if(1 == tearArr.count &&
	// 						tearArr.laiziPoints.length == 0){
	// 						let pts = laiziFourArr.slice(-4) ;
	// 						retArr.push(DdzUtil.creatHandCard(this,
	// 									{points: pts.concat(tearArr.points), mainValue: pts[0],
	// 									mainPoints: pts, beltPoints: tearArr.points,
	// 									laiziPoints: pts.concat(tearArr.points),
	// 									laiziChangePoints: pts.concat(tearArr.laiziPoints)})) ;
	// 					}
	// 				}

	// 				// 升序排序
	// 				if(retArr.length > 0){
	// 					retArr.sort((a, b) => a.mainValue - b.mainValue) ;
	// 				}
	// 			}
	// 		}
	// 		return retArr ;
	// 	}
	// },

	// 四带二(只能带单)
	FourCardsBeltTwoWithSingle: {
		des: '四带二(只能带单)', // 3333, 5, 6 or 4444, 6,6
		handType: DdzConst.HandType.FourCardsBeltTwoWithSingle.value, // 手牌类型值
		level: DdzConst.HandType.FourCardsBeltTwoWithSingle.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let retArr = [];
			let length = points.length + laiziPoints.length;
			if (6 == length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.FourCardsBeltTwoWithSingle.getHandCard(points);
				}
				else {
					// 全是癞子 是炸
					if (6 == laiziPoints.length) {
						return false;
					}

					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i >= 3; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子 癞子不能匹配王
						if (keepArr.loseArr.length <= laiziPoints.length &&
							!keepArr.existArr.some((v) => 55 == v || 50 == v)) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌 去重
							let tearArr = DdzUtil.tearSingleUnique(surplusPoints, surplusLaiziPoints, 2);
							if (2 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					if (retArr.length >= 2) {
						retArr = retArr.slice(0, 1).concat(retArr.slice(-1));
					}

					return retArr;
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.FourCardsBeltTwoWithSingle.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌 去重
							let tearArr = DdzUtil.tearSingleUnique(surplusPoints, surplusLaiziPoints, 2);
							if (2 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziFourArr = laiziArr.fourArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziFourArr);

					if (4 <= laiziFourArr.length) {
						// 拆对牌
						let tearArr = DdzUtil.tearSingleUnique(points, surplusLaiziPoints, 2);

						// 可拆出单牌，拆出来的不能都是癞子（6张癞子是炸）
						if (2 == tearArr.count &&
							tearArr.laiziPoints.length !== 2) {
							let pts = laiziFourArr.slice(-4);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points,
									laiziPoints: pts.concat(tearArr.points),
									laiziChangePoints: pts.concat(tearArr.laiziPoints)
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
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
		getHandCard: function (points, laiziPoints) {
			let retArr = [];
			let length = points.length + laiziPoints.length;
			console.log("length=========", length);
			if (6 == length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				// 包含一个四张的牌
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.FourCardsBeltTwoWithDouble.getHandCard(points);
				}
				else {

					// 全是癞子 是炸
					if (6 == laiziPoints.length) {
						return false;
					}

					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i >= 3; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子 不能匹配王
						if (keepArr.loseArr.length <= laiziPoints.length &&
							!keepArr.existArr.some((v) => 55 == v || 50 == v)) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌
							let tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, 1);
							if (1 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					if (retArr.length >= 2) {
						retArr = retArr.slice(0, 1).concat(retArr.slice(-1));
					}
					var arr = [];
					for (let i = 0; i < retArr.length; i++) {
						let obj = retArr[i];
						var _retArr = DdzUtil.getSpecialSortArr(obj.points);
						if (_retArr.doubleArr.length > 0) {
							if (_retArr.doubleArr.indexOf(55) >= 0 || _retArr.doubleArr.indexOf(50) >= 0) {
								continue;
							}
						}
						arr.push(obj);
					}
					if (arr.length >= 2) {
						arr = arr.slice(0, 1).concat(arr.slice(-1));
					}
					return arr;
					// return retArr;
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.FourCardsBeltTwoWithDouble.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆对牌
							let tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, 1);
							if (1 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziFourArr = laiziArr.fourArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziFourArr);

					if (4 <= laiziFourArr.length) {
						// 拆对牌
						let tearArr = DdzUtil.tearDouble(points, surplusLaiziPoints, 1);

						// 可拆出单牌，拆出来的不能都是癞子（6张癞子是炸）
						if (1 == tearArr.count &&
							tearArr.laiziPoints.length !== 2) {
							let pts = laiziFourArr.slice(-4);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points,
									laiziPoints: pts.concat(tearArr.points),
									laiziChangePoints: pts.concat(tearArr.laiziPoints)
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
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
		getHandCard: function (points, laiziPoints) {
			let retArr = [];
			let length = points.length + laiziPoints.length;
			console.log("points======", points);
			if (8 == length) {
				var arr = DdzUtil.getSpecialSortArr(points);
				// 包含一个四张的牌
				if (arr.singleArr.length == 2) {
					if (arr.singleArr[0] == 55 || arr.singleArr[0] == 50) { return false; }
				}
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.FourCardsBeltTwoDouble.getHandCard(points);
				}
				else {
					// 全是癞子 是炸
					if (8 == laiziPoints.length) {
						return false;
					}

					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i >= 3; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length &&
							!keepArr.existArr.some((v) => 55 == v || 50 == v)) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌
							let tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, 2);
							if (2 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					if (retArr.length >= 2) {
						retArr = retArr.slice(0, 1).concat(retArr.slice(-1));
					}

					var arr = [];
					for (let i = 0; i < retArr.length; i++) {
						let obj = retArr[i];
						var _retArr = DdzUtil.getSpecialSortArr(obj.points);
						if (_retArr.doubleArr.length > 0) {
							if (_retArr.doubleArr.indexOf(55) >= 0 || _retArr.doubleArr.indexOf(50) >= 0) {
								continue;
							}
						}
						arr.push(obj);
					}
					if (arr.length >= 2) {
						arr = arr.slice(0, 1).concat(arr.slice(-1));
					}
					return arr;
					// return retArr;
				}
			}
			return false;
		},

		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = handCard.mainValue;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return DdzRule.HandCardList.FourCardsBeltTwoDouble.getAllCombo(handCard, points);
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length >= 1) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);
							let surplusPoints = DdzUtil.differentArray(points, keepArr.existArr);
							let surplusLaiziPoints = laiziPoints.slice(keepArr.loseArr.length);

							// 拆单牌
							let tearArr = DdzUtil.tearDouble(surplusPoints, surplusLaiziPoints, 2);
							if (2 == tearArr.count) {
								let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
								retArr.push(DdzUtil.creatHandCard(this,
									{
										points: pts.concat(tearArr.points), mainValue: pts[0],
										mainPoints: pts, beltPoints: tearArr.points,
										laiziPoints: useLaiziPoints.concat(tearArr.laiziPoints),
										laiziChangePoints: keepArr.loseArr.concat(tearArr.laiziChangePoints)
									}));
							}
						}
					}

					// 如果癞子大于三张，并且值相同
					let laiziArr = DdzUtil.getSpecialSortArr(laiziPoints);
					let laiziFourArr = laiziArr.fourArr;
					let surplusLaiziPoints = DdzUtil.differentArray(laiziPoints, laiziFourArr);

					if (4 <= laiziFourArr.length) {
						// 拆单牌
						let tearArr = DdzUtil.tearDouble(points, surplusLaiziPoints, 2);

						// 可拆出对牌，不能全是癞子
						if (2 == tearArr.count &&
							tearArr.laiziPoints.length !== 4) {
							let pts = laiziFourArr.slice(-4);
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts.concat(tearArr.points), mainValue: pts[0],
									mainPoints: pts, beltPoints: tearArr.points,
									laiziPoints: pts.concat(tearArr.points),
									laiziChangePoints: pts.concat(tearArr.laiziPoints)
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			return retArr;
		}
	},

	SoftBomb: {
		des: '软炸', // 3333 or 4444
		handType: DdzConst.HandType.SoftBomb.value, // 手牌类型值
		level: DdzConst.HandType.SoftBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			var length = points.length + laiziPoints.length;
			if (length == 4 && points.length > 0 && laiziPoints.length > 0 &&
				-1 == points.indexOf(55) && -1 == points.indexOf(50)) {
				// 判断points 值是否一致
				let valueSame = points.every((p) => p == points[0]);

				// points 里 值相同
				if (valueSame) {
					var retPoints = [];
					var retLaiziChangePoints = [];

					for (let i = 0; i < length; i++) {
						retPoints.push(points[0]);
					}

					for (let i = 0; i < laiziPoints.length; i++) {
						retLaiziChangePoints.push(points[0]);
					}

					return DdzUtil.creatHandCard(this,
						{
							points: retPoints, mainValue: retPoints[0], mainPoints: retPoints,
							laiziPoints: laiziPoints, bombCount: length,
							laiziChangePoints: retLaiziChangePoints
						});
				}
			}

		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCard, points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			let mainValue = (handCard.level == this.level) ? handCard.mainValue : 0;
			let retArr = [];
			if (0 == laiziPoints.length) {
				return false;
			}
			else {
				// 上家手牌数量
				if (length >= handCard.points.length) {
					// 从A - 3 判断 是否可以组成三顺
					for (let i = 15; i > mainValue; i--) {
						let keepArr = DdzUtil.getKeepData(points, i, i, 4);

						// 癞子可以补充完整 并且不能全是癞子
						if (keepArr.loseArr.length <= laiziPoints.length && keepArr.existArr.length > 0 &&
							keepArr.loseArr.length > 0) {
							let useLaiziPoints = laiziPoints.slice(0, keepArr.loseArr.length);

							let pts = DdzUtil.getSpecialSortArr(keepArr.existArr.concat(keepArr.loseArr)).sortArr;
							retArr.push(DdzUtil.creatHandCard(this,
								{
									points: pts, mainValue: pts[0], mainPoints: pts,
									laiziPoints: useLaiziPoints, laiziChangePoints: keepArr.loseArr
								}));
						}
					}

					// 升序排序
					if (retArr.length > 0) {
						retArr.sort((a, b) => a.mainValue - b.mainValue);
					}
				}
			}
			return retArr;
		}
	},

	Bomb: {
		des: '炸弹', // 3333 or 4444
		handType: DdzConst.HandType.Bomb.value, // 手牌类型值
		level: DdzConst.HandType.Bomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			if (4 == length) {
				if (0 == laiziPoints.length) {
					var handCard = DdzRule.HandCardList.Bomb.getHandCard(points);
					if (handCard) {
						handCard.bombCount = 4;
					}
					return handCard;
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCards, points, laiziPoints) {
			return DdzRule.HandCardList.Bomb.getAllCombo(handCards, points);
		}
	},

	LaiBomb: {
		des: '癞子炸弹', // 3333 or 4444
		handType: DdzConst.HandType.LaiBomb.value,
		level: DdzConst.HandType.LaiBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			if (4 == length) {
				if (0 == points.length) {
					return DdzUtil.creatHandCard(this,
						{
							points: laiziPoints, mainValue: laiziPoints[0], mainPoints: laiziPoints,
							laiziPoints: laiziPoints, bombCount: length,
							laiziChangePoints: laiziPoints
						});
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCards, points, laiziPoints) {
			let length = laiziPoints.length;
			if (4 == length) {
				return DdzUtil.creatHandCard(this,
					{
						points: laiziPoints, mainValue: laiziPoints[0], mainPoints: laiziPoints,
						laiziPoints: laiziPoints, bombCount: length,
						laiziChangePoints: laiziPoints
					});
			}
			return [];
		}
	},

	KingBomb: {
		des: '王炸', // 55, 50 or 50, 55
		handType: DdzConst.HandType.KingBomb.value, // 手牌类型值
		level: DdzConst.HandType.KingBomb.level, // 手牌等级
		// 获取一条手牌数据，如果是同类型，返回一条手牌数据，否则返回false
		getHandCard: function (points, laiziPoints) {
			let length = points.length + laiziPoints.length;
			if (2 == length) {
				if (0 == laiziPoints.length) {
					return DdzRule.HandCardList.KingBomb.getHandCard(points);
				}
			}
			return false;
		},
		// 当前类型的所有可能组合
		getAllCombo: function (handCards, points) {
			return DdzRule.HandCardList.KingBomb.getAllCombo(handCards, points);
		}
	}
};

var ddz = {

	//	获取手牌类型
	getHandCards: function (_cards, _laiziCards = []) {
		var cards = _cards.slice();
		var laiziCards = _laiziCards.slice();
		var points = DdzUtil.cardsToPoints(cards);
		var laiziPoints = DdzUtil.cardsToPoints(_laiziCards || []);


		// 特殊形式排序
		// 先是四个一样的
		// 三个一样的
		// 对子
		// 单张
		points = DdzUtil.getSpecialSortArr(points).sortArr.slice();
		laiziPoints = DdzUtil.getSpecialSortArr(laiziPoints).sortArr.slice();

		// 癞子手牌 降序
		laiziPoints.sort((a, b) => b - a);

		var handCardArr = [];
		var handPushFunc = (handCard) => handCardArr.push(handCard);
		for (var key in HandCardList) {
			var handCards = HandCardList[key].getHandCard(points, laiziPoints);

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

	getAllCombo: function (handType, upCards, upCardLaizi, selfCards, laiziCards) {
		var upHandCardArr = this.getHandCards(upCards, upCardLaizi);
		var selfPoints = DdzUtil.cardsToPoints(selfCards);
		var laiziPoints = DdzUtil.cardsToPoints(laiziCards);
		var upHandLevel = HandCardList[handType].level;
		var upHandCard = null;
		var handCardArr = [];

		// 特殊类型排序
		selfPoints = DdzUtil.getSpecialSortArr(selfPoints).sortArr.slice();
		laiziPoints = DdzUtil.getSpecialSortArr(laiziPoints).sortArr.slice();
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

				// 手牌等级
				if (t.level > upHandLevel ||
					(t.level == upHandLevel && handType == t.handType)) {
					console.log("upHandCard", upHandCard, "selfPoints", selfPoints, "laiziPoints", laiziPoints);
					var comboArr = t.getAllCombo(upHandCard, selfPoints, laiziPoints);

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
	 * @param cards 包含癞子牌
	 * @param laiziCards 同种类癞子牌 只包含一张
	 * @returns {boolean}
	 */
	isCardsValid: function (cards, laiziCards) {
		var handCards = ddz.getHandCards(cards, laiziCards);
		return handCards.length !== 0;
	},

	/**
	 * 对比牌型是否大小
	 * @param playerCards Array 自己手牌
	 * @param targetCards  Array 比较牌型
	 * @param {handType} string 手牌类型(可选)
	 * @returns {boolean}
	 */
	isCardsGreater: function (playerCards, laiziCards, targetCards, targetLaiziCards, handType) {
		return this.getHandTypes(playerCards, laiziCards, targetCards, targetLaiziCards, handType).length !== 0
		// handType = handType || null ;
		// var playerHandCards = ddz.getHandCards(playerCards, laiziCards) ;
		// var targetHandCards = ddz.getHandCards(targetCards, targetLaiziCards) ;
		// var playerHandCard = null ;
		// var targetHandCard = null ;

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
		//         if(!playerHandCard){
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
	getHandTypes: function (playerCards, laiziCards, targetCards, targetLaiziCards, handType) {
		var hands = ddz.getHandCards(playerCards, laiziCards);
		var targetHand = null;
		var retArr = [];
		if (handType) {
			let targetHands = ddz.getHandCards(targetCards, targetLaiziCards);
			if (targetHands) {
				targetHands.forEach((hand) => {
					if (hand.handType == handType) {
						if (!targetHand) {
							targetHand = hand;
						}
					}
				});
			}

			if (!targetHand) {
				console.log("Error, getTargetCard HandType not found：", handType);
			}
		}
		else {
			targetHand = ddz.getHandCards(targetCards, targetLaiziCards)[0];
			console.log("Warning, getHandTypes no handType");
		}
		if (!targetHand) {
			retArr = hands;
		}
		else {
			for (let i = 0; i < hands.length; i++) {
				let selfHand = hands[i];
				// 等级 相同
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
	getTargetCards: function (playerCards, laiziCards, targetCards, targetLaiziCards, handType) {
		console.log('cardToSelf playerCards: ' + playerCards);
		console.log('cardToSelf targetCards: ' + targetCards);
		console.log("cardToSelf laiziCards:" + laiziCards);
		console.log("cardToSelf targetLaiziCards:" + targetLaiziCards);
		console.log("cardToSelf handType:" + handType);

		var retArr = [];
		if (!handType) {
			let targetHandCards = ddz.getHandCards(targetCards);
			if (0 == targetHandCards.length) {
				return retArr;
			}
			handType = targetHandCards[0].handType;
		}

		retArr = ddz.getAllCombo(handType, targetCards, targetLaiziCards, playerCards, laiziCards);
		// for(let v of retArr){
		//     console.log('getTargetCards retArr: ' + v) ;
		// }
		return retArr;
	},

	/**
	 * 获取手牌中的顺子
	 * @param  {Array} playerCards 玩家手牌
	 * @return {Array}             顺子手牌 或者 原样不变返回
	 */
	getStraightHards: function (playerCards, laiziCards) {
		var retArr = [];
		var points = playerCards.map((value) => value % 100);
		var laiziPoints = laiziCards.map((value) => value % 100);

		var leftFillArr = DdzUtil.fillPointsLaizi(points, laiziPoints, 1, 5, true);
		if (leftFillArr && 0 == leftFillArr.unusedLaiziPoints.length &&
			leftFillArr.keepCount == points.length + laiziPoints.length) {
			retArr.push(DdzUtil.creatHandCard(this,
				{
					points: leftFillArr.points, mainValue: leftFillArr.points[0],
					laiziPoints: leftFillArr.laiziPoints, keepCount: leftFillArr.keepCount,
					laiziChangePoints: leftFillArr.laiziChangePoints
				}));
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