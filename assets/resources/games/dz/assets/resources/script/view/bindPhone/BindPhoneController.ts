/*
 * @Author: lijian
 * @Date: 2018-01-20 01:14:43 
 * @Desc: 文件描述
 */

import { BindPhoneView } from "./BindPhoneView";
import { h } from "../../../../../../../script/common/H";
import {DZJingDongModel} from "../jingDong/DZJingDongModel";
import {DZGameUrl} from "../../common/DZGameUrl";
import {HallStringUtil} from "../../../../../../../script/util/HallStringUtil";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallNetConfig} from "../../../../../../../script/net/HallNetConfig";

export class BindPhoneController {
    static showBindPhoneView() {
        let view = new BindPhoneView();
        h.viewManager.pushView(view);
    }

    //获取验证码
    static requsetVerityCode(callback:Function,phoneNumber:string){
        var info = {
            //'id':HallUserModel.getInstance().getUserID(),//'5a65e07ee695e13c68565411',
            'phone': phoneNumber,
        }
        h.http.post(HallNetConfig.VerityCode/*DZGameUrl.getVerityCode()*/,function(data){
            if (callback) {
                callback(data);
            }
        },info);
    }
    //绑定手机
    static requsetBindPhone(callback:Function,phoneNumber:string,verityCode:string){
        var info = {
            'id':HallUserModel.getInstance().getUserID(),//'5a65e07ee695e13c68565411',
            'phone': phoneNumber,
            'code':verityCode,
        }
        h.http.put(HallNetConfig.BindPhone/*DZGameUrl.getBindPhone()*/, function(data){
            if (callback) {
                callback(data);
            }
        },info);
    }
}