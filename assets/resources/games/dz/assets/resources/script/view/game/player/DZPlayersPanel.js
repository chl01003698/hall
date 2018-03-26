/**
 * 头像层
 */
var h = require('H').h;
var headprefabs = [ //0，2都用左边的预制体，1用右边，3用上边
    "player_bottom", "playerRight", "player_left", "playerUp"
];
var DZGameUtil = require('DZGameUtil').DZGameUtil;
var DZConstant = require('DZConstant').DZConstant;
cc.Class({
    extends: cc.Component,

    properties: {
        playersNode: [cc.Node],     //3人以下 四个头像
        four_PlayersNode: [cc.Node],     //4人玩法 四个头像
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },

    initPlayers: function () {
        h.log.debug("$$$DZPlayersPanel...初始化player");
        this.players = [];      //所有的玩家
        if (DZGameUtil.playType == DZConstant.playType.ddz4) {
            //4人
            headprefabs = [ //0，2都用左边的预制体，1用右边，3用上边
                "player_bottom_4", "playerRight_4", "player_left_4", "playerUp"
            ];
            for (let i = 0; i < this.four_PlayersNode.length; i++) {
                h.log.debug("$$$DZPlayersPanel..i=" + i + " headprefabs=" + headprefabs[i]);
                var prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/player/' + headprefabs[i], cc.Prefab)
                let player = cc.instantiate(prefab).getComponent('playerHead');
                player.initInfo();
                this.four_PlayersNode[i].addChild(player.node);
                this.players.push(player);
                player.node.active = false;
            }
        } else {
            //3人及以下
            headprefabs = [ //0，2都用左边的预制体，1用右边，3用上边
                "player_bottom", "playerRight", "player_left", "playerUp"
            ];
            for (let i = 0; i < this.playersNode.length; i++) {
                h.log.debug("$$$DZPlayersPanel..i=" + i + " headprefabs=" + headprefabs[i]);
                var prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/player/' + headprefabs[i], cc.Prefab)
                let player = cc.instantiate(prefab).getComponent('playerHead');
                player.initInfo();
                this.playersNode[i].addChild(player.node);
                this.players.push(player);
                player.node.active = false;
            }
        }

       
    },

    /**
     * 刷新指定玩家的信息
     */
    updatePlayerInfo: function (index, data) {
        cc.log('updatePlayerInfo  111111' + this.players.length + " index=" + index);
        this.players[index].node.active = true;
        this.players[index].updatePlayerInfo(data);
    },

    /** 
     * 隐藏头像
    */
    hidePlayer: function (index) {
        this.players[index].node.active = false;
    },


    /**
     * 获取头像位置
     */

    getPlayrePostion: function (index) {
        if (DZGameUtil.playType == DZConstant.playType.ddz4) {
            return this.four_PlayersNode[index].getPosition();
        }
        return this.playersNode[index].getPosition();
    },

    /**
     * 在指定头像上播放emoji
     */

    playEmoji: function (data, sid) {
        //cc.log('playEmoji' + JSON.stringify(data));
        var seatId = DZGameUtil.toLocalSeatId(sid);
        this.players[seatId].playEmoji(data);
    },

    showChat: function (data, sid, uid) {
        var seatId = DZGameUtil.toLocalSeatId(sid);
        this.players[seatId].showChat(data, seatId, uid);
    },

    /**
     * 播放魔法表情
     * */
    playMagic: function (startSid, endSid, data) {
        this.playMagicAnimation(startSid, endSid, data.atlas, data.magicName);
    },

    // 播放魔法动画
    playMagicAnimation: function (startPlayer, endPlayer, atlasName, aniName) {
        var atlas = atlasName;
        var animation = aniName;
        var effectLayer = cc.find('Canvas/effect_layer');
        var player1 = cc.find('Canvas/ui_layer/playersPanel/player' + startPlayer);
        var player2 = cc.find('Canvas/ui_layer/playersPanel/player' + endPlayer);
        var startPos = player1.getPosition();
        var endPos = player2.getPosition();
        var animationNode = this.getAnimationNode(atlas, animation, startPos, endPos);
        animationNode.play();
        effectLayer.addChild(animationNode);
    },

    // 获取动画节点
    getAnimationNode: function (atlasName, aniName, startPos, endPos) {
        var node = new cc.Node();
        node.setPosition(startPos);
        var sprite = node.addComponent(cc.Sprite);
        var animation = node.addComponent(cc.Animation);
        var clip = node.addComponent('CreateClip');
        var winSize = cc.winSize;
        var winDistance = cc.pLength(cc.p(winSize.width, winSize.height));
        var moveDistance = cc.pDistance(startPos, endPos);
        var moveTime = (moveDistance / winDistance) * 1.5;
        var fadeInTime = 0.3;
        // 加载第一帧图片
        cc.loader.loadRes(atlasName, cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame(aniName + '_00');
            sprite.spriteFrame = frame;
            // 初始化动作数据
            var clipData = {
                path: atlasName,
                name: aniName,
                frameRate: 20,
                loop: false,
            };
            clip.init(clipData);
        });

        // 动作
        node.opacity = 0;
        var action = cc.sequence(
            cc.fadeIn(fadeInTime),
            cc.moveTo(0.65, endPos),
            cc.delayTime(0.1),
            cc.callFunc(function () {
                clip.play();
            })
        );

        // 缓动
        action.easing(cc.easeOut(1.0));

        // play 接口
        node.play = function () {
            node.runAction(action);
        };
        return node;
    },


    /**
     * 显示或隐藏 准备ok的手
     */

    hideOkStatus: function (index, isHide, isAll) {
        if (isAll) {     //全部显示或隐藏
            this.players.forEach(element => {
                element.hideOkStatus(isHide);
            });
        } else {
            this.players[index].hideOkStatus(isHide);
        }
    },

    /**
     * 显示地主的标志
     */

    showlandlordStatus: function (index) {
        cc.log('showlandlordStatus  22' + index);
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].showlandlordStatus(index == i);
        }
    },

    /**
     * 显示房主标记
     */
    showOwnerStatus: function (index) {
        this.players[index].showOwnerStatus(true);
    },


    /**
     * 刷新手牌数
     */
    updatePokersNum: function (index, num) {
        this.players[index].updatePokersNum(num);
    },

    //初始化所有的手牌数
    initAllPokersNum: function (num) {
        this.players.forEach(element => {
            element.updatePokersNum(num);
        });
        this.players[0].hidenPokersNum();
    },

    /** 
   * 显示或隐掉有多少张牌，等待界隐藏，牌桌内显示 
   */

    showPokersNum: function (isShow) {
        this.players.forEach(element => {
            element.showPokersNum(isShow);
        });
        this.players[0].hidenPokersNum();
    },

    /**
   * 显示闹钟
   */

    showAlarmClock: function (index) {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].showAlarmClock(index == i);
        }
    },

    /**
     * 重置倍数为1倍
     */
    resetAllMultiple: function () {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].updateMultiple(1);
        }
    },

    /**
    * 显示明牌
    */

    showMingStatus: function (index) {
        this.players[index].showMingStatus(true);
    },

    /**
     * 清楚上一局的明牌状态
     */
    clearLookCard: function () {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].showMingStatus(false);

            this.players[i].showMingPokers([]);
            this.players[i].updatePokersNum("0");
        }
    },

    /**
     * 明牌 牌是否显示
     */
    showMingpaiCards: function (is) {
        this.players.forEach((player) => player.shwoMingpaiCards(is));
    },

    /**
     * 隐藏所有闹钟
     */
    hideAllAlarmClock: function () {
        this.players.forEach(element => {
            element.showAlarmClock(false);
        });
    },

    /**
     * 隐藏所有地主
     */
    hideAlllandlordStatus: function () {
        this.players.forEach(element => {
            element.showlandlordStatus(false);
        });
    },

    /**
     * 明牌显示 自己不做处理
     */

    showMingPokers: function (seatId, pokers) {
        if (seatId == 0) {
            return;
        }
        this.players[seatId].showMingPokers(pokers,seatId);
    },


    /**
     * 倍数刷新
     */
    updateMultiple: function (seateId, multiple) {
        this.players[seateId].updateMultiple(multiple);
    },

    /**
    * 分数刷新
    */
    updateScore: function (seateId, score) {
        this.players[seateId].updateScore(score);
    },

    /**
     * 刷新单局输赢分数
     */
    updateRoundScore: function (seateId, score) {
        this.players[seateId].updateRoundScore(score);
    },

    //隐藏所有单局输赢分数
    hidenAllRoundScore: function () {
        this.players.forEach(element => {
            element.updateRoundScore("");
        });
    },

    /**
     * 离线标志
     */

    showLostConect: function (seateId, state) {
        this.players[seateId].showLostConect(state);
    },

    /**
     * 
     * 
     * @param {any} seatId 本地座位号
     * @param {any} isShow  是否显示
     */
    showRedLight: function (seatId, isShow) {
        if (seatId == 0) {
            return;
        }
        this.players[seatId].showRedLight(isShow);
    },

    isShowRedLight: function(seatId){
        return this.players[seatId].hadShowRedLight();
    },
    /**
     * 
     * 当结算时清空一些状态
     */
    clearAllRedLight: function () {
        this.players.forEach(element => {
            element.showRedLight(false);
        });
    }


    // update (dt) {},
});
