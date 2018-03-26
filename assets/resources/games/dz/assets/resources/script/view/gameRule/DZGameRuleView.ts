/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示游戏中规则界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {DZGameRuleModel} from "./DZGameRuleModel";
import {DZConstant} from "../../common/DZConstant";

 export class DZGameRuleView extends HallBaseView {
     private m_title:any = null;
     private m_content:any = null;
     private m_playType:any = 'lightning3';
    constructor(type){
        super();
        this.m_playType = type;
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            title:{varName:'m_title'},
            item:{varName:'m_content'},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/gameRule/tips_guize");
    }

    onPrefabLoaded(){
        let titleLabel = this.m_title.getComponent(cc.Label);
        let contentLabel = this.m_content.getComponent(cc.RichText);
        let index = 0;
        switch (this.m_playType){
            case DZConstant.playType.ordinaryLz3:
                index = 1;
                break;
            case DZConstant.playType.ddz2:
                index = 2;
                break;
            case DZConstant.playType.lightning3:
                index = 3;
                break;
            case DZConstant.playType.TDLZ3:
                index = 4;
                break;
            case DZConstant.playType.ddz4:
                index = 5;
                break;
            case DZConstant.playType.PZ3:
                index = 6;
                break;
        }
        titleLabel.string = DZGameRuleModel.getInstance().guizeContent[index].title;
        contentLabel.string = DZGameRuleModel.getInstance().guizeContent[index].content;
    }
    closeCallback(){
        h.viewManager.removeView(this);
    }
 }
