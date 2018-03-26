/*
 * @Author: lijian
 * @Date: 2018-01-20 01:45:11 
 * @Desc: 显示个人资料界面
 */

import { h } from "../../../../../../../script/common/H";
import {HallBaseView} from "../../../../../../../script/common/HallBaseView";
import {HallUserModel} from "../../../../../../../script/view/login/HallUserModel";
import {HallController} from "../../../../../../../script/view/hall/HallController";
import {DZConstant} from "../../common/DZConstant";
import isNumber = cc.js.isNumber;
import {DZGameModel} from "../game/DZGameModel";
import { DZToast } from "../../../../../../sz/assets/resources/script/view/common/SZToast";
import {DZFriendModel} from "../friend/DZFriendModel";
import { HallFriendController } from "../../../../../../../script/view/friend/HallFriendController";
import {HallUIUtil} from "../../../../../../../script/util/HallUIUtil";
import {HallConstant} from "../../../../../../../script/view/hall/HallConstant";

 export class DZGameSelfInfoView extends HallBaseView {
     private m_name:any = null;
     private m_id:any = null;
     private m_ip:any = null;
     private m_gps:any = null;
     private m_data:any = null;
     private m_friend:any = null;
     private m_head:any = null;
     private m_boy:any = null;
     private m_girl:any = null;
    constructor(data:any){
        super();
        this.m_data = data;
        this.setBindDatas({
            x:{callback:this.closeCallback.bind(this)},
            name:{varName:'m_name'},
            id:{varName:'m_id'},
            ip:{varName:'m_ip'},
            gps:{varName:'m_gps'},
            jiahaoyou:{varName:'m_friend'},
            boy:{varName:'m_boy'},
            girl:{varName:'m_girl'},
            head:{varName:'m_head'},
            goodBtn:{callback:this.magicCallBack.bind(this)},
            shoesBtn:{callback:this.magicCallBack.bind(this)},
            tomatoBtn:{callback:this.magicCallBack.bind(this)},
            cupBtn:{callback:this.magicCallBack.bind(this)},
            flowerBtn:{callback:this.magicCallBack.bind(this)},
            jiahaoyouBtn:{callback:this.addFriendCallback.bind(this)},
        });
        this.showMaskView(true);
        let prefab = '';
        if (this.m_data.uid == HallUserModel.getInstance().getUserID()) {
            prefab = 'res/prefab/gameSelfInfo/youxizhong_gerenziliao_ziji';
        }else{
            prefab = 'res/prefab/gameSelfInfo/youxizhong_gerenziliao';
        }
        this.setPrefab(prefab);
    }

    onPrefabLoaded(){
        let nameLabel = this.m_name.getComponent(cc.Label);
        let idLabel = this.m_id.getComponent(cc.Label);
        let ipLabel = this.m_ip.getComponent(cc.Label);
        let gpsLabel = this.m_gps.getComponent(cc.Label);
        if(this.m_friend != null){
            let friendLabel = this.m_friend.getComponent(cc.Label);
            if(DZFriendModel.getInstance().isFriend(this.m_data.shortId){
                friendLabel.string = '删除好友';
            }else{
                friendLabel.string = '添加好友';
            }
        }
        nameLabel.string = this.m_data.nickname;
        idLabel.string = this.m_data.shortId;
        ipLabel.string = this.m_data.ip;
        if(this.m_data.loc == null){
            this.m_data.loc ={  long: 40.6, lat: 25.22 };
        }
        gpsLabel.string = HallUIUtil.getGPSDesc(this.m_data.loc.long, this.m_data.loc.lat);
        HallUIUtil.urlSprite(this.m_data.headimgurl, this.m_head);
        this.m_boy.active = false;
        this.m_girl.active = false;
        this.m_data.sex == HallConstant.SexType.woman ?  this.m_girl.active = true : this.m_boy.active = true;
    }

    magicCallBack(event){
        let type;
        switch (event.target.name){
            case 'goodBtn':
                type = DZConstant.magicType.good;
                break;
            case 'shoesBtn':
                type = DZConstant.magicType.shoes;
                break;
            case 'tomatoBtn':
                type = DZConstant.magicType.tomato;
                break;
            case 'cupBtn':
                type = DZConstant.magicType.cup;
                break;
            case 'flowerBtn':
                type = DZConstant.magicType.flower;
                break;
        }
        HallController.chat(this.sendMagicCallBack.bind(this),2,type,this.m_data.uid);
        h.viewManager.removeView(this);
    }

    sendMagicCallBack(){

    }

    closeCallback(){
        h.viewManager.removeView(this);
    }

    addFriendCallback(){
        if(DZFriendModel.getInstance().isFriend(DZGameModel.getInstance().getShortId(this.m_data.uid))){
            HallFriendController.removeFriend(function(data){
                DZToast.show("请求成功");
            }, this.m_data.shortId);
        }else{
            HallFriendController.addFriend(function(data){
                DZToast.show("请求成功");
            }, this.m_data.shortId);
        }
    }
 }
