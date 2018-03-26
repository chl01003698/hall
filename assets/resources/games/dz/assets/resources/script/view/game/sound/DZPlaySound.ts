/*
* 音频路径
* 使用方式：
*	cc.qp.audiopath.anniu.playSFX() or
*	cc.qp.audiopath['anniu'].playSFX()
**/
import {DZConstant} from "../../../common/DZConstant";
import {HallConstant} from "../../../../../../../../script/view/hall/HallConstant";
import {HallStringUtil} from "../../../../../../../../script/util/HallStringUtil";
import {h} from "../../../../../../../../script/common/H";
import {DZGameUtil} from "../../../common/DZGameUtil";
import {HallBaseModel} from "../../../../../../../../script/common/HallBaseModel";
var DdzConst = require('DdzConst');
var playerSexMap = new Map();

export class DZPlaySound extends HallBaseModel{
    private static instance: DZPlaySound = null;
    private playerIpMap = new Map();
    static getInstance(): DZPlaySound {
        if (this.instance == null) {
            this.instance = new DZPlaySound();
        }
        return this.instance;
    }

    constructor(){
        super();
    }

    //按照id 加入ip
    addPlayerIp(playerId,data){
        if(this.playerIpMap.get(playerId) == null)
            this.playerIpMap.set(playerId, data);
    }

    //按照id 移除数据
    removePlayerIp (playerId) {
        if(this.playerIpMap.get(playerId) != null)
            this.playerIpMap.delete(playerId);
    }

    //按照id 加入性别
    addPlayerSex(playerId,sex) {
        if(playerSexMap.get(playerId) == null)
            playerSexMap.set(playerId,sex);
    }

    //根据ID  返回sex
    getPlayerIpMap () {
        return this.playerIpMap;
    }

   //按照id 移除性别
    removePlayerSex (playerId) {
        if(playerSexMap.get(playerId) != null)
            playerSexMap.delete(playerId);
    }

    //清空map里的元素
    clearPlayer () {
        playerSexMap.clear();
        this.playerIpMap.clear();
    }

    //根据ID  返回sex
    getSexById (playerId) {
        if(playerSexMap.get(playerId) != null)
            return playerSexMap.get(playerId);
        return HallConstant.SexType.man;
    }

    //根据sex  返回男女音效_M _W
    getChatStr(sex) {
        if(sex == HallConstant.SexType.woman)
            return DZConstant.sexChatStr.WOMAN;
        else
            return DZConstant.sexChatStr.MAN;
    }

	//打牌音效
    playCardSFX(type,value,chatSex,data) {
        var audioName = null;
        value = value == 'X'?'xiaowang':value;
        value = value == 'Y'?'dawang':value;
        value = value == '0'?'10':value;
        h.audioManager.playSoundByName('chupai' + DZGameUtil.random(1,2));
        switch(type){
            case DdzConst.HandType.KingBomb.value:	//火箭
                audioName = HallStringUtil.format('huojian');
                h.audioManager.playSoundByName('huojian');
                if(!DZConstant.playSpeekNode.isBomb){
                    DZConstant.playSpeekNode.isBomb = true;
                    /*
                    h.audioManager.stopBGM();
                    h.audioManager.playMGBByName('zhadanhou');
                    */
                }
				break;
            case DdzConst.HandType.Bomb.value:   //炸弹
            case DdzConst.HandType.SoftBomb.value:
            case DdzConst.HandType.LaiBomb.value:
            case DdzConst.HandType.ZhongBomb.value:
            case DdzConst.HandType.LianBomb.value:
            case DdzConst.HandType.ZhongBombNoPzKing.value:
                audioName = HallStringUtil.format('zhadan{0}',DZGameUtil.random(1,2));
                this.playBomb();
                if(!DZConstant.playSpeekNode.isBomb){
                    DZConstant.playSpeekNode.isBomb = true;
                    /*
                    h.audioManager.stopBGM();
                    h.audioManager.playMGBByName('zhadanhou');
                    */
                }
                break;
            case DdzConst.HandType.Single.value:    //单张
                audioName = HallStringUtil.format('dan{0}',value);
                break;
            case DdzConst.HandType.Double.value:     //对子
                audioName = HallStringUtil.format('dui{0}',value);
                break;
            case DdzConst.HandType.Straight.value: //顺子
                audioName = HallStringUtil.format('shunzi');
                h.audioManager.playSoundByName('shunzi');
                break;
            case DdzConst.HandType.DoubleStraight.value: //连对
                audioName = HallStringUtil.format('liandui');
                h.audioManager.playSoundByName('shunzi');
                break;
            case DdzConst.HandType.Triplets.value:      //三张
                audioName = HallStringUtil.format('san{0}',value);
                break;
            case DdzConst.HandType.TripletsBeltSingle.value: //三带一
                audioName = HallStringUtil.format('3dai1');
                break;
            case DdzConst.HandType.TripletsBeltDouble.value:  //三带对
                audioName = HallStringUtil.format('3dai2');
                break;
            case DdzConst.HandType.Airplane.value: //飞机
            case DdzConst.HandType.AirplaneBeltSingle.value: //飞机带2单
            case DdzConst.HandType.AirplaneBeltDouble.value: //飞机带2对
                audioName = HallStringUtil.format('feiji');
                h.audioManager.playSoundByName('feiji');
                break;
            case DdzConst.HandType.FourCardsBeltTwoWithSingle.value:   //四带2单
            case DdzConst.HandType.FourCardsBeltTwoWithDouble.value:  //四带一对
                audioName = HallStringUtil.format('4dai2');
                break;
            case DdzConst.HandType.FourCardsBeltTwoDouble.value: //四带2对
                audioName = HallStringUtil.format('4dai22');
                break;
		}
            if(type != DdzConst.HandType.Single.value && type != DdzConst.HandType.Double.value && type != DdzConst.HandType.Triplets.value ){
                h.audioManager.playSoundByName(audioName + chatSex);
            }else{
                if (value == '2' || value == 'xiaowang' || value == 'dawang') {
                    if (data.top && data.top.soundRestart) {
                        h.audioManager.playSoundByName(audioName + chatSex);
                    }else{
                        this.playPipe(DZGameUtil.random(0, 2), chatSex);
                    }
                }else{
                    h.audioManager.playSoundByName(audioName + chatSex);
                }
            }
    }

    //炸弹
    playBomb() {
        h.audioManager.playSoundByName('zhadan' + DZGameUtil.random(1,2));
    }
    //快捷语
    playChatCommon(index,chatSex) {
        var chatName = HallStringUtil.format('kuaijieyu{0}{1}',index ,chatSex);
        h.audioManager.playSoundByName(chatName);
    }

    //发牌
    playFapai(loop) {
        h.audioManager.playSoundByName('fapai',loop);
    }
    //暂停发牌
    stopFapai() {
        h.audioManager.stopSound('fapai');
    }

    //播放癞子动画时的声音
    playChooseLz(loop){
        h.audioManager.playSoundByName('xuanzhonglaizi',loop);
    }
    //癞子动画播完后停止
    stopChooseLz(){
        h.audioManager.stopSound('xuanzhonglaizi');
    }
    //确定癞子
    makeSureLz(){
        h.audioManager.playSoundByName('quedinglaizi');
    }
    //牌提上来的声音
    playChoosePoker(){
        h.audioManager.playSoundByName('xuanpai');
    }
    //抢地主
    playLandGrab(chatSex) {
       var choose = HallStringUtil.format('qiangdizhu{0}' , chatSex);
        h.audioManager.playSoundByName(choose);
        h.audioManager.playSoundByName('qiangdizhu');
    }
    //不抢
    playNotLandGrab(chatSex) {
        var choose = HallStringUtil.format('buqiang{0}' , chatSex);
         h.audioManager.playSoundByName(choose);
        // h.audioManager.playSoundByName('buqiang');
     }
    //不叫
    playNotCall(chatSex) {
        var choose = HallStringUtil.format('bujiao{0}' , chatSex);
        h.audioManager.playSoundByName(choose);
    }
    //叫地主
    playLandOwner(chatSex) {
        var choose = HallStringUtil.format('jiaodizhu{0}' ,chatSex);
        h.audioManager.playSoundByName(choose);
    }
    //确定地主
    playSureLandOwner() {
        h.audioManager.playSoundByName('quedingdizhu');
    }
    //不要  pass  过  要不起
    playPass(index,chatSex) {
        //去掉要不起,'yaobuqi'
        var buyao = ['buyao','pass','guo'];
        var yaobuqi = HallStringUtil.format('{0}{1}' ,buyao[index], chatSex);
        h.audioManager.playSoundByName(yaobuqi);
    }

    //2 王
    playPipe(index,chatSex) {
        var guanshang = ['dani','guanshang','yasi'];
        var yaobuqi = HallStringUtil.format('{0}{1}' ,guanshang[index],chatSex);
        h.audioManager.playSoundByName(yaobuqi);
    }

    //胜利
    playWin() {
        h.audioManager.playSoundByName('shengli');
    }
    //失败
    playFail() {
        h.audioManager.playSoundByName('shibai');
    }
    //进入房间
    playEnterRoom() {
        h.audioManager.playSoundByName('jinru');
    }
    //离开房间
    playExitRoom() {
        h.audioManager.playSoundByName('likai');
    }
    //明牌
    playShowCard(chatSex) {
        var show = HallStringUtil.format('mingpai{0}' ,chatSex);
        h.audioManager.playSoundByName(show);
    }

    //1分
    playOneScore(chatSex) {
        var show = HallStringUtil.format('1fen{0}' ,chatSex);
        h.audioManager.playSoundByName(show);
    }
    //2分
    playTwoScore(chatSex) {
        var show = HallStringUtil.format('2fen{0}' ,chatSex);
        h.audioManager.playSoundByName(show);
    }
    //3分
    playThreeScore (chatSex) {
        var show = HallStringUtil.format('3fen{0}' ,chatSex);
        h.audioManager.playSoundByName(show);
    }
    //春天
    playSpring (chatSex) {
        var spring = HallStringUtil.format('chuntian{0}' ,chatSex);
        h.audioManager.playSoundByName(spring);
        h.audioManager.playSoundByName('chuntian');
    }
    //魔法表情
    //赞
    playLaud () {
        h.audioManager.playSoundByName('zan');
    }
    //杯子
    playCup () {
        h.audioManager.playSoundByName('beizi');
    }
    //柿子
    playTomato () {
        h.audioManager.playSoundByName('shizi');
    }
    //鞋
    playShoes () {
        h.audioManager.playSoundByName('xie');
    }
    //花
    playFlower () {
        h.audioManager.playSoundByName('hua');
    }
    //洗牌
    playShuffle () {
        h.audioManager.playSoundByName('xipai');
    }
    //加倍
    playDouble (chatSex) {
        var jiabei = HallStringUtil.format('jiabei{0}' ,chatSex);
        h.audioManager.playSoundByName(jiabei);
        this.playAddDouble();
    }
    //不加倍
    playNoDouble (chatSex) {
        var bujiabei = HallStringUtil.format('bujiabei{0}' ,chatSex);
        h.audioManager.playSoundByName(bujiabei);
    }
    //倒计时
    playSchedue(){
        h.audioManager.playSoundByName('daojishi');
    }
    //警报
    playAlert(){
        h.audioManager.playSoundByName('jingbao');
    }
    //剩2张
    playTwoCard (chatSex) {
        var show = HallStringUtil.format('sheng2zhang{0}' ,chatSex);
        h.audioManager.playSoundByName(show);
        this.playSchedue();
    }
    //剩1张
    playOneCard (chatSex) {
        var show = HallStringUtil.format('sheng1zhang{0}' ,chatSex);
        h.audioManager.playSoundByName(show);
        this.playSchedue();
    }
    //倍数增加
    playAddDouble () {
        h.audioManager.playSoundByName('jiabeishi');
    }
    //生成癞子
    playBornLz () {
        h.audioManager.playSoundByName('laizi');
    }
    //踢
    playKick(chatSex){
        var ti = HallStringUtil.format('ti{0}' ,chatSex);
        h.audioManager.playSoundByName(ti);
    }
    //不踢
    playNoKick(chatSex){
        var buti = HallStringUtil.format('buti{0}' ,chatSex);
        h.audioManager.playSoundByName(buti);
    }
    //跟
    playFollow(chatSex){
        var gen = HallStringUtil.format('gen{0}' ,chatSex);
        h.audioManager.playSoundByName(gen);
    }
    //不跟
    playNoFollow(chatSex){
        var bugen = HallStringUtil.format('bugen{0}' ,chatSex);
        h.audioManager.playSoundByName(bugen);
    }
    //拉
    playPull(chatSex){
        var la = HallStringUtil.format('la{0}' ,chatSex);
        h.audioManager.playSoundByName(la);
    }
    //不拉
    playNoPull(chatSex){
        var bula = HallStringUtil.format('bula{0}' ,chatSex);
        h.audioManager.playSoundByName(bula);
    }
}