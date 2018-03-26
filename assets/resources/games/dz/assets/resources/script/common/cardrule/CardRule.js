'use strict' ;
var DdzConst = ('undefined' == typeof(cc)) ? require('./ddzrule/DdzConst') : require('DdzConst') ;
var DdzUtil = ('undefined' == typeof(cc)) ? require('./ddzrule/DdzUtil') : require('DdzUtil') ;
var ddz = ('undefined' == typeof(cc)) ? require('./ddzrule/DdzRule') : require('DdzRule') ;
var lzddz = ('undefined' == typeof(cc)) ? require('./ddzrule/LzDdzRule') : require('LzDdzRule') ;
var pzddz = ('undefined' == typeof(cc)) ? require('./ddzrule/PzDdzRule') : require('PzDdzRule') ;
var ddz4 = ('undefined' == typeof(cc)) ? require('./ddzrule/Ddz4Rule') : require('Ddz4Rule') ;
var sdddz = ('undefined' == typeof(cc)) ? require('./ddzrule/SdDdzRule') : require('SdDdzRule') ;
var tdddz = ('undefined' == typeof(cc)) ? require('./ddzrule/TdDdzRule') : require('TdDdzRule') ;
var CardConfig = ('undefined' == typeof(cc)) ? require('./CardConfig') : require('CardConfig') ;
var AllPlayHandType = [] ;
var CardRule = {

    // /**
    //  * 将手牌数据转换为
    //  * @param  {[type]} cards    [description]
    //  * @param  {[type]} playType [description]
    //  * @return {[type]}          [description]
    //  */
    // transformCards: function(cards, playType){

    //     var retArr = [] ;
    //     playType = playType || DdzConst.PlayType.ddz ;
    //     switch(playType){
    //         case DdzConst.PlayType.ddz:
    //             retArr = ddz.rule.isCardsValid(cards) ;
    //             break ;
    //         case DdzConst.PlayType.lzddz:
    //             retArr = lzddz.rule.isCardsValid(cards) ;
    //             break ;
    //     }

    //     return retArr ;
    // },

    /**
     * 检查出牌是否正确
     * @param cards
     * @param {string} playType 玩法类型(可选)
     * @returns {boolean}
     */
    isCardsValid: function(cards, playType) {
        // var splitCards =
        // var selfCards
        var ret = false ;
        /**
         * {cards: cards, laiziCards: laiziCards} ;
         * 分离出普通牌和癞子牌
         */
        var tranformCards = DdzUtil.tranformSelfCardsData(cards) ;
        playType = playType || DdzConst.PlayType.ddz3 ;
        switch(playType){
            case DdzConst.PlayType.ddz3:
            case DdzConst.PlayType.ddz2:
                ret = ddz.rule.isCardsValid(tranformCards.cards) ;
                break ;
            case DdzConst.PlayType.sdddz:
                ret = sdddz.rule.isCardsValid(tranformCards.cards) ;
                break ;
            case DdzConst.PlayType.pzddz:
                ret = pzddz.rule.isCardsValid(tranformCards.cards, tranformCards.laiziCards) ;
                break ;
            case DdzConst.PlayType.lzddz:
                console.log("=======isCardsValid====");
                ret = lzddz.rule.isCardsValid(tranformCards.cards, tranformCards.laiziCards) ;
                break ;
            case DdzConst.PlayType.tdddz:
                ret = tdddz.rule.isCardsValid(tranformCards.cards, tranformCards.laiziCards) ;
                break ;
            case DdzConst.PlayType.ddz4:
                ret = ddz4.rule.isCardsValid(tranformCards.cards) ;
                break ;
        }

        return ret ;
    },

    /**
     * 对比牌型是否大小
     * @param {Array} playerCards 自己手牌
     * @param {Array} targetCards  比较牌型
     * @param {string} handType 手牌类型(可选)
     * @param {string} playType 玩法类型(可选)
     * @returns {boolean}
     */
    isCardsGreater: function(playerCards, targetCards, handType, playType){
        var ret = false ;
        playType = playType || DdzConst.PlayType.ddz3 ;
        /**
         * {cards: cards, laiziCards: laiziCards} ;
         * 分离出普通牌和癞子牌
         */
        var tranformPlayerCards = DdzUtil.tranformSelfCardsData(playerCards) ;
        var tranformTargetCards = DdzUtil.tranformSelfCardsData(targetCards, true) ;
        switch(playType){
            case DdzConst.PlayType.ddz3:
            case DdzConst.PlayType.ddz2:
                ret = ddz.rule.isCardsGreater(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                break ;
            case DdzConst.PlayType.sdddz:
                ret = sdddz.rule.isCardsGreater(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                break ;
            case DdzConst.PlayType.pzddz:
                ret = pzddz.rule.isCardsGreater(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                                                tranformTargetCards.cards, tranformTargetCards.laiziCards,
                                                handType) ;
                break ;
            case DdzConst.PlayType.lzddz:
                ret = lzddz.rule.isCardsGreater(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                                                tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                break ;
            case DdzConst.PlayType.tdddz:
                ret = tdddz.rule.isCardsGreater(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                                                tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                break ;
            case DdzConst.PlayType.ddz4:
                ret = ddz4.rule.isCardsGreater(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                break ;
        }
        return ret ;
    },

    /**
     * 获取大过目标牌型的所有手牌组合
     * @param  {Array} playerCards 玩家手牌
     * @param  {Array} targetCards 目标手牌
     * @param  {string} handType   （可选）
     * @return {Array}             手牌组合数组
     */
    getHandTypes: function(playerCards, targetCards, handType, playType){
        var retArr = [] ;
        playType = playType || DdzConst.PlayType.ddz3 ;
        targetCards = targetCards || [] ;
        /**
         * {cards: cards, laiziCards: laiziCards} ;
         * 分离出普通牌和癞子牌 并且转换成自己的数据
         */
        var tranformPlayerCards = DdzUtil.tranformSelfCardsData(playerCards) ;
        var tranformTargetCards = DdzUtil.tranformSelfCardsData(targetCards, true) ;
        switch(playType){
            case DdzConst.PlayType.ddz3:
            case DdzConst.PlayType.ddz2:
                retArr = ddz.rule.getHandTypes(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                retArr = DdzUtil.transformToExternCards(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.sdddz:
                retArr = sdddz.rule.getHandTypes(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                retArr = DdzUtil.transformToExternCards(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.pzddz:
                retArr = pzddz.rule.getHandTypes(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                            tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                retArr = DdzUtil.transformToExternCardsLaizi(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.lzddz:
                retArr = lzddz.rule.getHandTypes(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                            tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                retArr = DdzUtil.transformToExternCardsLaizi(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.tdddz:
                retArr = tdddz.rule.getHandTypes(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                            tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                retArr = DdzUtil.transformToExternCardsLaizi(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.ddz4:
                retArr = ddz4.rule.getHandTypes(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                retArr = DdzUtil.transformToExternCards(playerCards, retArr) ;
                break ;
        }
        return retArr ;
    },

    /**
     * 获取大过目标牌型的所有手牌组合
     * @param  {Array} playerCards 玩家手牌
     * @param  {Array} laiziCards  癞子手牌数组
     * @param  {Array} targetCards 目标手牌
     * @param  {string} handType   （可选）
     * @return {Array}             手牌组合数组
     */
    getTargetCards: function(playerCards, targetCards, handType, playType) {
        var retArr = [] ;
        playType = playType || DdzConst.PlayType.ddz3 ;
        /**
         * {cards: cards, laiziCards: laiziCards} ;
         * 分离出普通牌和癞子牌 并且转换成自己的数据
         */
        var tranformPlayerCards = DdzUtil.tranformSelfCardsData(playerCards) ;
        var tranformTargetCards = DdzUtil.tranformSelfCardsData(targetCards, true) ;
        switch(playType){
            case DdzConst.PlayType.ddz3:
            case DdzConst.PlayType.ddz2:
                retArr = ddz.rule.getTargetCards(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                retArr = DdzUtil.transformToExternCards(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.sdddz:
                retArr = sdddz.rule.getTargetCards(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                retArr = DdzUtil.transformToExternCards(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.pzddz:
                retArr = pzddz.rule.getTargetCards(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                            tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                retArr = DdzUtil.transformToExternCardsLaizi(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.lzddz:
                console.log("=====getTargetCards==");
                retArr = lzddz.rule.getTargetCards(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                            tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                retArr = DdzUtil.transformToExternCardsLaizi(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.tdddz:
                retArr = tdddz.rule.getTargetCards(tranformPlayerCards.cards, tranformPlayerCards.laiziCards,
                            tranformTargetCards.cards, tranformTargetCards.laiziCards, handType) ;
                retArr = DdzUtil.transformToExternCardsLaizi(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.ddz4:
                retArr = ddz4.rule.getTargetCards(tranformPlayerCards.cards, tranformTargetCards.cards, handType) ;
                retArr = DdzUtil.transformToExternCards(playerCards, retArr) ;
                break ;
        }

        // 导出数据 如果有癞子牌，癞子值转化成原值
        DdzUtil.exportArrProcess(retArr) ;
        return retArr ;
    },

    /**
     * 添加最后一手手牌判断
     * @param  {[type]} playerCards [description]
     * @param  {[type]} targetCards [description]
     * @param  {[type]} handType    [description]
     * @param  {[type]} playType    [description]
     * @return {[type]}             [description]
     */
    getTargetCardsEx: function(playerCards, targetCards, handType, playType){
        let retHands = this.getTargetCards(playerCards, targetCards, handType, playType) ;
        let endHandFilter = AllPlayHandType.endHandFilter ;
        if(endHandFilter){
            retHands = retHands.filter((v) => -1 != endHandFilter.indexOf(v.handType) &&
                playerCards.length !== v.arr.length ) ;
        }
    },

    /**
     * 添加最后一手手牌判断
     * @param  {[type]} playerCards [description]
     * @param  {[type]} targetCards [description]
     * @param  {[type]} handType    [description]
     * @param  {[type]} playType    [description]
     * @return {[type]}             [description]
     */
    getHandTypesEx: function(playerCards, targetCards, handType, playType, isEndHand){
        let retHands = this.getHandTypes(playerCards, targetCards, handType, playType) ;
        let endHandFilter = AllPlayHandType.endHandFilter ;
        if(!isEndHand && endHandFilter){
            retHands = retHands.filter((v) =>  -1 == endHandFilter.indexOf(v.handType)) ;
        }
        return retHands ;
    },

    /**
     * 获取手牌中的顺子
     * @param  {Array} playerCards 玩家手牌
     * @param  {Array} laiziCards  癞子手牌数组
     * @return {Array}             顺子手牌 或者 原样不变返回
     */
    getStraightHards: function(playerCards, playType){

        // 临时处理 有癞子直接原路返回，否则返回3人斗地主处理
        var tranformPlayerCards = DdzUtil.tranformSelfCardsData(playerCards) ;
        if(tranformPlayerCards.laiziCards.length == 0){
            playType = DdzConst.PlayType.ddz3 ;
        }
        else
        {
            return playerCards ;
        }

        // 如果是有效牌型，直接返回
        if(this.isCardsValid(playerCards, playType)){
            return playerCards ;
        }

        var retArr = [] ;
        playType = playType || DdzConst.PlayType.ddz3 ;
        // if()

        /**
         * {cards: cards, laiziCards: laiziCards} ;
         * 分离出普通牌和癞子牌 并且转换成自己的数据
         */
        // var tranformPlayerCards = DdzUtil.tranformSelfCardsData(playerCards) ;

        switch(playType){
            case DdzConst.PlayType.ddz3:
            case DdzConst.PlayType.ddz2:
            case DdzConst.PlayType.pzddz:
                retArr = ddz.rule.getStraightHards(tranformPlayerCards.cards) ;
                retArr = DdzUtil.pointsToExternCards(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.sdddz:
                retArr = sdddz.rule.getStraightHards(tranformPlayerCards.cards) ;
                retArr = DdzUtil.pointsToExternCards(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.lzddz:
            case DdzConst.PlayType.tdddz:
                retArr = lzddz.rule.getStraightHards(tranformPlayerCards.cards, tranformPlayerCards.laiziCards) ;
                retArr = DdzUtil.transformToExternCardsLaizi(playerCards, retArr) ;
                break ;
            case DdzConst.PlayType.ddz4:
                retArr = ddz4.rule.getStraightHards(tranformPlayerCards.cards) ;
                retArr = DdzUtil.pointsToExternCards(playerCards, retArr) ;
                break ;
        }
        return retArr ;
    },

    /**
     * 初始化所有玩法配置
     * @return {[type]} [description]
     */
    backUpAllPlayHandType: function(){
        AllPlayHandType = {} ;

        let allHandCardList = {
            ddz3: ddz.getHandCardList(),
            ddz2: ddz.getHandCardList(),
            sd3: sdddz.getHandCardList(),
            lz3: lzddz.getHandCardList(),
            ddz4: ddz4.getHandCardList(),
            tdlz3: tdddz.getHandCardList(),
            pz3:pzddz.getHandCardList(),
        } ;


        // 备份所有玩法手牌
        for(let key in allHandCardList){
            let handCardList = allHandCardList[key] ;
            AllPlayHandType[key] = {} ;
            for(let k in handCardList){
                AllPlayHandType[key][k] = handCardList[k] ;
            }
        }

        return AllPlayHandType ;
    },

    /**
     * 手牌类型配置 （）
     * @param {[Json Object]} config 玩法配置文件
     * @param {[String]} playType 玩法类型
     */
    setPlayConfig: function(config, playType){
        // 恢复所有手牌类型
        ddz.setHandCardList(AllPlayHandType.ddz3) ;
        sdddz.setHandCardList(AllPlayHandType.sd3) ;
        lzddz.setHandCardList(AllPlayHandType.lz3) ;
        ddz4.setHandCardList(AllPlayHandType.ddz4) ;
        tdddz.setHandCardList(AllPlayHandType.tdlz3) ;
        pzddz.setHandCardList(AllPlayHandType.pz3) ;

        let diff = function(obj, arr){
            let retObj = {} ;
            Object.keys(obj).forEach((key) =>{
                if(-1 == arr.indexOf(key)){
                    retObj[key] = obj[key];
                }
            }) ;
            return retObj ;
        } ;
        let filterArr = CardConfig.getFilterTable(config) ;
        AllPlayHandType.endHandFilter = CardConfig.getEndHandFilter(config) ;
        let diffHandCardList = diff(AllPlayHandType[playType], filterArr) ;
        switch(playType){
            case DdzConst.PlayType.ddz3:
            case DdzConst.PlayType.ddz2:
                ddz.setHandCardList(diffHandCardList) ;
                break ;
            case DdzConst.PlayType.sdddz:
                sdddz.setHandCardList(diffHandCardList) ;
                break ;
            case DdzConst.PlayType.pzddz:
                pzddz.setHandCardList(diffHandCardList) ;
                break ;
            case DdzConst.PlayType.lzddz:
                lzddz.setHandCardList(diffHandCardList) ;
                break ;
            case DdzConst.PlayType.tdddz:
                tdddz.setHandCardList(diffHandCardList) ;
                break ;
            case DdzConst.PlayType.ddz4:
                ddz4.setHandCardList(diffHandCardList) ;
                break ;
        }

        return true ;
    }
} ;

CardRule.backUpAllPlayHandType() ;
module.exports = CardRule ;
