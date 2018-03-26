/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示实名认证界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {RealNameController} from "./RealNameController";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallAlert} from "../../../../../../../script/common/HallAlert";

 export class RealNameView extends HallBaseView {
     private m_real:any = null;
     private m_id:any;
    constructor(){
        super();
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
        });
        this.showMaskView(true);
        this.setPrefab("res/prefab/selfInfo/shimingrenzheng");
    }

    onPrefabLoaded(){
        this.m_real =this.getPrefabNode().getComponent('DZRealAuth');
        this.m_real.comfire = function (name, sex, id) {
            this.m_id = id;
            var info = {
                "id":HallUserModel.getInstance().getUserID(),//'5a65e07ee695e13c68565411',
                "realName": name,
                "addrCode":id,
            }
            RealNameController.requsetRealName(this.FN_RealNameCallBack.bind(this),info);
            // self._gameProxy.sendComfire(info,Constants.RealAutoState.realauto_put_success,Constants.RealAutoState.realauto_put_defeate);
        }.bind(this);
    }
    closeCallback(){
        h.viewManager.removeView(this);
    }
    //实名认证回调
     FN_RealNameCallBack(){
         // cc.qp.userinfo.certification.realId = self.id;
         h.viewManager.removeView(this);
         HallAlert.show('您已绑定成功',this.ok.bind(this));
     }
     ok() {
         h.viewManager.removeView(this);
     }

 }
