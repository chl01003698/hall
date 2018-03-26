import { SZGameUtil } from "../../common/SZGameUtil";
import SZgameControler from "../game/SZgameControler";
import { SZConstant } from "../../common/SZConstant";
import { h } from "../../../../../../../script/common/H";
import { HallUtil } from "../../../../../../../script/util/HallUtil";



const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/gameBtn")
export default class gameBtn extends cc.Component {
    timeLabel: number;
    alarmTimer: any;
    canGiveUP: boolean;
    jettonArray: any;
    canflow: boolean;
    canHotFight: boolean;
    canCompare: boolean;
    canMutil: boolean;
    gameView: any;
    allBtn: any[];  //五个按钮总的

    @property(cc.Node)
    addMulti:cc.Node = null;    //加注

    @property(cc.Node)
    compare:cc.Node = null;     //比牌

    @property(cc.Node) 
    hotFight:cc.Node = null;       //火拼

    @property(cc.Node) 
    giveUP: cc.Node = null;     //弃牌

    @property(cc.Node)
    flowMulti: cc.Node = null;      //跟注

    @property(cc.Node)
    jettonLayout: cc.Node = null;    //加倍的layout

    @property(cc.Node) 
    lookCard: cc.Node = null;       //看牌按钮

    @property(cc.Node) 
    showCard: cc.Node = null;       //亮牌

    @property(cc.Label) 
    liangpaiLabel: cc.Label = null; //亮牌倒计时

    initView(gameView) {
        this.gameView = gameView;
        this.addMulti.on('touchend',this.addMultiClick.bind(this));
        this.compare.on('touchend',this.compareClick.bind(this));
        this.hotFight.on('touchend',this.hotFightClick.bind(this));
        this.giveUP.on('touchend',this.giveUpClick.bind(this));
        this.flowMulti.on('touchend',this.flowMultiClick.bind(this));
        this.lookCard.on('touchend',this.lookCardClick.bind(this));
        this.showCard.on('touchend',this.showCardClick.bind(this))
        this.setAllGray();
        this.jettonArray = [];
        

    }

    /**
     * 把所有按钮变灰(弃牌亮)
     * 
     * @memberof gameBtn
     */
    setAllGray() {
        this.setMultilbtnLight(false);
        this.setComparebtnLight(false);
        this.setHotFightbtnLight(false);
        this.setFlowbtnLight(false);
        this.setLookCardActive(false);
        this.canGiveUP = true;
    }

    setAllGray1() {
        this.setMultilbtnLight(false);
        this.setComparebtnLight(false);
        this.setHotFightbtnLight(false);
        this.setFlowbtnLight(false);
        this.canGiveUP = true;
    }

    /**
     * 设置弃牌按钮不可点
     * 
     * @memberof gameBtn
     */
    setAllBtnFailure() {
        this.canMutil = false;
        this.canCompare = false;
        this.canHotFight = false;
        this.canflow = false;
        this.canGiveUP = false;
    }

    /**
     * 
     * 设置加注按钮亮或暗
     * @param {*} type 
     * @param {boolean} state 
     * @memberof gameBtn
     */
    setMultilbtnLight(isLight:boolean) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
        if(isLight) {
            this.canMutil = true;
            this.addMulti.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b4');
            this.addMulti.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x99,0x48,0x0c);
        }else {
            this.canMutil = false;
            this.addMulti.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b3');
            this.addMulti.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x6b,0x6b,0x6b);
        }
    }

       /**
     * 
     * 设置弃牌按钮亮或暗
     * @param {*} type 
     * @param {boolean} state 
     * @memberof gameBtn
     */
    setGiveUpbtnLight(isLight:boolean) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
        if(isLight) {
            this.canGiveUP = true;
            this.giveUP.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b2');
            this.giveUP.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0xaa,0x8b,0x34);
        }else {
            this.canGiveUP = false;            
            this.giveUP.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b3');
            this.giveUP.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x6b,0x6b,0x6b);
        }
    }

    /**
     * 
     * 设置比牌按钮亮或暗
     * @param {*} type 
     * @param {boolean} state 
     * @memberof gameBtn
     */
    setComparebtnLight(isLight:boolean) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
        if(isLight) {
            this.canCompare = true;
            this.compare.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b2');
            this.compare.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0xaa,0x8b,0x34);
        }else {
            this.canCompare = false;
            this.compare.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b3');
            this.compare.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x6b,0x6b,0x6b);
        }
    }

    /**
     * 
     * 设置火拼按钮亮或暗
     * @param {*} type 
     * @param {boolean} state 
     * @memberof gameBtn
     */
    setHotFightbtnLight(isLight:boolean) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
        if(isLight) {
            this.canHotFight = true;
            this.hotFight.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b1');
            this.hotFight.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x34,0x5d,0x88);
        }else {
            this.canHotFight = false;
            this.hotFight.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b3');
            this.hotFight.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x6b,0x6b,0x6b);
        }
    }

    /**
     * 
     * 设置跟注按钮亮或暗
     * @param {*} type 
     * @param {boolean} state 
     * @memberof gameBtn
     */
    setFlowbtnLight(isLight:boolean) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/sz_youxizhong',cc.SpriteAtlas);
        if(isLight) {
            this.canflow = true;
            this.flowMulti.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b4');
            this.flowMulti.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x99,0x48,0x0c);
        }else {
            this.canflow = false;
            this.flowMulti.getComponent(cc.Sprite).spriteFrame = plist.getSpriteFrame('button_b3');
            this.flowMulti.getChildByName('label').getComponent(cc.LabelOutline).color = cc.color(0x6b,0x6b,0x6b);
        }
    }

    /**
     * 看牌按钮显示不显示
     * 
     * @param {any} isShow 
     * @memberof gameBtn
     */
    setLookCardActive(isShow) {
        this.lookCard.active = isShow;
    }

    /**
     * 亮牌按钮显示不显示
     * 
     * @param {any} isShow 
     * @memberof gameBtn
     */
    setShowCardActive(isShow) {
        this.showCard.active = isShow;
        if(this.showCard.activeInHierarchy) {
            this.timeLabel = 2;
            this.liangpaiLabel.string = '亮牌' + this.timeLabel;
            this.alarmTimer = HallUtil.schedule(function () {
                this.updateTime();
            }.bind(this), this.node, 1.0, true);
        }
    }

    updateTime() {
        this.timeLabel -= 1;
        this.liangpaiLabel.string = '亮牌' + this.timeLabel;
        if (this.timeLabel <= 0) {
            this.node.stopAction(this.alarmTimer);
            this.showCard.active = false;
        }
    }


    /**
     * 隐藏筹码按钮组
     * 
     * @memberof gameBtn
     */
    closeJettonPnael() {
        if(this.jettonLayout.activeInHierarchy) {
            this.jettonLayout.active = false;
        }
    }

    /**
     * 加注
     * 
     * @memberof gameBtn
     */
    addMultiClick() {
        if(!this.canMutil) {
            return;
        }

        if(this.jettonLayout.activeInHierarchy) {
            this.jettonLayout.active = false;
        }else {
            this.jettonLayout.active = true;
            if(SZConstant.hasLook) {
                this.produceJettons(SZConstant.sAddBets);
            }else {
                this.produceJettons(SZConstant.mAddBets);
            }

            for(let i=0;i < this.jettonArray.length;i++) {
                if(SZConstant.addBets.indexOf(this.jettonArray[i].getJettonNum()) >=0 ) {
                    this.jettonArray[i].setMaskShow(false);
                }else {
                    this.jettonArray[i].setMaskShow(true);
                }
            }
        }

        this.gameView.hideSelectPk();
    }

    /**
     * 点击看牌
     * 
     * @memberof gameBtn
     */
    lookCardClick() {
        SZgameControler.checked();
        this.setLookCardActive(false);
        this.gameView.hideSelectPk();

        this.setJettonLayoutActive(false);
    }

    /**
     * 点击亮牌
     * 
     * @memberof gameBtn
     */
    showCardClick() {
        SZgameControler.showCards();
        this.setShowCardActive(false);

        this.setJettonLayoutActive(false);
    }

    /**
     * 
     * 根据服务器数据动态生成按钮
     * @param {[number]} array 
     * @memberof gameBtn
     */
    produceJettons(array:any){
        this.jettonLayout.removeAllChildren();
        this.jettonArray = [];
        for(let i=0;i<array.length;i++) {
            let jettonNode = cc.loader.getRes("games/sz/assets/resources/res/prefab/chip/chipItem",cc.Prefab)
            
            let jetton = cc.instantiate(jettonNode).getComponent('SZjetton');
            jetton.initView(array[i],this,true);
            this.jettonLayout.addChild(jetton.node); 
            this.jettonArray.push(jetton);
        }
    }

    /**
     * 比牌按钮点击
     * 
     * @returns 
     * @memberof gameBtn
     */
    compareClick() {
        if(!this.canCompare) {
            return;
        }
        this.jettonLayout.active = false;
        if(this.gameView.uiNode_slectPkPlayer.activeInHierarchy) {
            this.gameView.hideSelectPk();
        }else {
            SZgameControler.getBeatPlayer();
        }
    }

    /**
     * 
     * 火拼按钮点击
     * @returns 
     * @memberof gameBtn
     */
    hotFightClick() {
        if(!this.canHotFight) {
            return;
        }
        this.setJettonLayoutActive(false);
        SZgameControler.inputAdd(SZConstant.inputState.hotFight);
        this.gameView.hideSelectPk();
    }

    /**
     * 
     * 放弃按钮点击
     * @returns 
     * @memberof gameBtn
     */
    giveUpClick() {
        if(!this.canGiveUP) {
            return;
        }
        this.setJettonLayoutActive(false);
        SZgameControler.giveup();
        this.gameView.hideSelectPk();
    }

    /**
     * 跟注按钮点击
     * 
     * @memberof gameBtn
     */
    flowMultiClick () {
        if(!this.canflow) {
            return;
        }
        this.setJettonLayoutActive(false);
        SZgameControler.inputAdd(SZConstant.inputState.call);
        this.gameView.hideSelectPk();
    }

    /**
     * 加注时选择筹码发给服务器
     * 
     * @memberof gameBtn
     */
    sendJetton(num) {
        cc.log('sendJetton' + num);
        this.setJettonLayoutActive(false);
        SZgameControler.input(SZConstant.inputState.add,num);
    }

    /**
     * 设置加注的选项显示隐藏
     * 
     * @param {any} isShow 
     * @memberof gameBtn
     */
    setJettonLayoutActive(isShow) {
        this.jettonLayout.active = isShow;
    }

    /**
     * 根据服务器消息
     * 
     * @memberof gameBtn
     */
    refreshBtnState(data:any) {
        cc.log('refreshBtnState' + JSON.stringify(data));
        this.setMultilbtnLight(data.jiazhu || 0);
        this.setComparebtnLight(data.bipai || 0);
        this.setHotFightbtnLight(data.huopin || 0);
        this.setFlowbtnLight(data.genzhu || 0);
        this.setGiveUpbtnLight(true);
        //加注
        // if(data.jiazhu && data.addBets.length >= 0) {
        //     cc.log('refreshBtnState' + this.jettonArray.length);
        //     for(let i=0;i < this.jettonArray.length;i++) {
        //         if(data.addBets.indexOf(this.jettonArray[i].getJettonNum()) >=0 ) {
        //             this.jettonArray[i].setMaskShow(false);
        //         }else {
        //             this.jettonArray[i].setMaskShow(true);
        //         }
        //     }
        // }

        if(data.addBets) {
            SZConstant.addBets = data.addBets;
        }
    }
    /**
     * 
     * 看牌按钮刷新
     * @param {*} data 
     * @memberof gameBtn
     */
    refreshLookCard(data:any) {
        this.setLookCardActive(data.kanpai || 0);
    }
    
}
