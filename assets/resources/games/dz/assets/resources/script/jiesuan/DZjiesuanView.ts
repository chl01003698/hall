
import { HallBaseView } from "../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../script/common/H";
import { HallController } from "../../../../../../script/view/hall/HallController";
import { DZjiesuanModel } from "./DZjiesuanModel";
import { DZPlaySound } from "../view/game/sound/DZPlaySound";
import { DZBattleReportController } from "../view/battleReport/DZBattleReportController";
import { DZGameController } from "../view/game/DZGameController";
import { DZBattleReportModel } from "../view/battleReport/DZBattleReportModel";
import { DZGameUtil } from "../common/DZGameUtil";
import { DZConstant } from "../common/DZConstant";
import { HallUtil } from "../../../../../../script/util/HallUtil";



export class DZjiesuanView extends HallBaseView {
    name_title: cc.Node;
    diSpt: cc.Node;
    renwuSpt: cc.Node;
    desLable: cc.Node;
    di: cc.Node;
    result: cc.Node;
    total_score: cc.Node;
    //spine动画控制器
    spine_win: sp.Skeleton;
    spine_lose: sp.Skeleton;
    sp_win: cc.Node;
    sp_lose: cc.Node;
    constructor() {
        super();
        this.setBindDatas({
            jixv: { varName: "jixv", callback: this.onClickContinue.bind(this) },
            fenxiang: { varName: "fenxiang", callback: this.onClickFenxing.bind(this) },
            di: { varName: "di" },
            desLable: { varName: "desLable" },
            renwuSpt: { varName: "renwuSpt" },
            diSpt: { varName: "diSpt" },
            name_title: { varName: "name_title" },
            result: { varName: "result" },
            total_score: { varName: "total_score" },
            sp_win: { varName: "sp_win" },
            sp_lose: { varName: "sp_lose" }
        });
        this.setPrefab("res/prefab/game/jiesuan");
    }
    playJieSuanAni(type, isWin) {
        if (isWin > 0) {
            this.sp_win.active = true;
        } else {
            this.sp_lose.active = true;
        }
        if (type == 'landlord') {
            //地主
            if (isWin > 0) {
                this.spine_win.setAnimation(0, 'LordWin', false);
            } else {
                this.spine_lose.setAnimation(0, 'lordfail', false);
            }
        } else {
            //农民
            if (isWin > 0) {
                this.spine_win.setAnimation(0, 'peopleWin', false);
            } else {
                this.spine_lose.setAnimation(0, 'proplefail', false);
            }
        }
    }
    stop_JieSuanAnim(){
         this.sp_win.active = false;
         this.sp_lose.active = false;
    }
    onPrefabLoaded() {
        h.log.debug("加载结算界面...");
        this.spine_win = this.sp_win.getComponent(sp.Skeleton);
        this.spine_lose = this.sp_lose.getComponent(sp.Skeleton);
        //let view = h.viewManager.getViewBySign(DZConstant.gameName);
        let yxzPlist = h.resManager.getAtlasByName('res/images/atlas/youxizhong');
        let resultData = DZjiesuanModel.getInstance().getData();
        
        cc.log('onPrefabLoaded ' + JSON.stringify(resultData));
        if (resultData.isFlowBureau == 0) {
            //正常结算
            var result = '总分：' + resultData.win + "分";
            var myResult = '';
            if (resultData.grabLandlord > 1) {
                let strMult = "抢地主×" + resultData.grabLandlord + "    ";
                myResult += strMult;
            }
            if (resultData.bomb > 1) {
                let strMult = "炸弹×" + resultData.bomb + "    ";
                myResult += strMult;
            }
            if (resultData.spring > 1) {
                let strMult = "春天×" + resultData.spring + "    ";
                myResult += strMult;
            }
            if (resultData.brandCard > 1) {
                let strMult = "明牌×" + resultData.brandCard + "    ";
                myResult += strMult;
            }
            if (resultData.lowCard > 1) {
                let strMult = "抓底×" + resultData.lowCard + "    ";
                myResult += strMult;
            }
            if (resultData.friedBomb > 1) {
                let strMult = "连炸×" + resultData.friedBomb + "    ";
                myResult += strMult;
            }
            if (resultData.tilagen > 1) {
                let strMult = "踢拉×" + resultData.tilagen + "    ";
                myResult += strMult;
            }
            if (resultData.jiabei > 1) {
                let strMult = "加倍×" + resultData.jiabei + "    ";
                myResult += strMult;
            }
            if (resultData.rockets > 1) {
                let strMult = "火箭×" + resultData.rockets + "    ";
                myResult += strMult;
            }
            if (resultData.type == 'landlord') {
                //地主加上农民个数
                // if (DZGameUtil.playType != DZConstant.playType.ddz2) {
                //     if (DZGameUtil.playType == DZConstant.playType.ddz4) {
                //         let strMult = "农民 ×3" + "    ";
                //         myResult += strMult;
                //     }else{
                //         let strMult = "农民 ×2"  + "    ";
                //         myResult += strMult;
                //     }
                // }
            }
            const _ = window['node_require']('lodash')
            myResult = _.trimEnd(myResult);
            DZGameUtil.resultInfo = myResult;
            if (myResult != '') {
                result = result + "  （" + myResult + "）";
            }
            this.desLable.getComponent(cc.Label).string = myResult;
            if(resultData.win >= 0){
                this.total_score.getComponent(cc.Label).font = cc.loader.getRes("resources/res/images/atlas/addNumLabelAtlas");
            }
            this.total_score.getComponent(cc.Label).string = resultData.win;
            // if (result == '') {
            //     //隐藏黑色背景框
            //     this.di.active = false;
            // }
            if (resultData.type == 'landlord') {
                //地主
                if (resultData.win >= 0) {
                    //胜利
                    DZPlaySound.getInstance().playWin();
                    this.renwuSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('dizhu_shengli_renwu');
                    this.diSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('shengli_zhuangshi_bj');
                    this.name_title.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('dizhu_shengli_txt');
                } else {
                    //失败
                    DZPlaySound.getInstance().playFail();
                    this.renwuSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('dizhu_shibai_renwu');
                    this.diSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('shiban_zhuangshi_bj');
                    this.name_title.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('dizhu_shiban_txt');
                }
            } else {
                //farmers 农民
                //地主
                if (resultData.win >= 0) {
                    //胜利
                    DZPlaySound.getInstance().playWin();
                    this.renwuSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('nongmin_shengli_renwu');
                    this.diSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('shengli_zhuangshi_bj');
                    this.name_title.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('nongmin_shengli_txt');
                } else {
                    //失败
                    DZPlaySound.getInstance().playFail();
                    this.renwuSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('nongmin_shiban_renwu');
                    this.diSpt.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('shiban_zhuangshi_bj');
                    this.name_title.getComponent(cc.Sprite).spriteFrame = yxzPlist.getSpriteFrame('nongmin_shiban_txt');
                }
            }
            this.renwuSpt.active = false;
            this.diSpt.active = false;
            this.name_title.active = false;
        } else if (resultData.isFlowBureau == 1) {
            //流局

        }
        HallUtil.schedule(function(){
            let result2Data = DZjiesuanModel.getInstance().getData();
            this.playJieSuanAni(result2Data.type, result2Data.win);
        }.bind(this), this, 1);
        
    }

    //点击继续准备后的返回
    clickReadyBtn() {
        h.log.debug("继续准备 callback");
    }
    //继续
    onClickContinue() {
        cc.log('onClickContinue');
        this.stop_JieSuanAnim();
        //DZGameController.cleanAllDiscard();
        h.viewManager.removeView(this);
        if ((DZjiesuanModel.getInstance().getCurrentRound()) == DZjiesuanModel.getInstance().getRoundCount()) {
            //到最后一局点继续，显示总结算
            DZBattleReportModel.getInstance().FN_SetShowAll(true);
            DZBattleReportModel.getInstance().FN_SetIsGaming(false);
            DZBattleReportController.showBattleReportView();
        } else {
            HallController.ready(this.clickReadyBtn.bind(this));
        }
        h.audioManager.stopBGM();
        h.audioManager.playMGBByName('youxizhong');

    }

    onClickFenxing() {
        cc.log('onClickFenxing');
        this.spine_win.setAnimation(0, 'LordWin', false);
        // h.commonSDK.screenshot(cc.director.getScene(), null, function (filepath, filename) {
        //     h.commonSDK.shareImage(filepath);
        // });
    }
}