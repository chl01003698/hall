/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示试玩界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {DZTestPlayModel} from "./DZTestPlayModel";
import {HallToast} from "../../../../../../../script/common/HallToast";

 export class TestPlayView extends HallBaseView {
     private m_testPlayNum:any;
     private m_testPlayStr:any;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            copy:{callback:this.copyCallback.bind(this)},
            testPlayNum:{varName:'m_testPlayNum'},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/testPlay/shiwanqun");
    }

    onPrefabLoaded(){
        this.m_testPlayStr = this.m_testPlayNum.getComponent(cc.Label);
        this.m_testPlayStr.string = DZTestPlayModel.getInstance().FN_GetWeChat();
    }
    closeCallback(){
        h.viewManager.removeView(this);
    }
     copyCallback(){
         h.commonSDK.copy(this.m_testPlayStr.string);
         HallToast.show("复制成功！");
     }
 }
