/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 用户数据
 */

import { HallBaseModel } from "../../common/HallBaseModel";
import { HallConstant } from "../hall/HallConstant";
import { HallStorage } from "../../common/HallStorage";
import { h } from "../../common/H";
import { HallCommonSDK } from "../../sdk/HallCommonSDK";
import {HallUIUtil} from "../../util/HallUIUtil";

export class HallUserModel extends HallBaseModel {
    private static instance: HallUserModel = null;
    private userData: any = null;
    private token:string = ""
    private ip:string = "";
    static getInstance(): HallUserModel {
        if (this.instance == null) {
            this.instance = new HallUserModel();
        }
        return this.instance;
    }

    setUserData(data: any) {
        this.userData = data;
    }

    getUserID(): string {
        if(this.userData == null){
            return ""
        }
        return this.userData._id;
    }

    getName(){
        return this.userData.nickname;
    }

    getCardCount(){
        return this.userData.coin.card;
    }

    addCardCount(count){
        this.userData.coin.card += count;
    }

    getHeadUrl(){
        return this.userData.headimgurl;
    }

    getSex():HallConstant.SexType{
        return this.userData.sex;
    }

    getLocalSortID():string{
        let sortID:string = h.storage.getItem("sortID", false);
        if(sortID == null){
            sortID = ""
        }
        return sortID;
    }

    setLocalSortID(sortID:string){
        h.storage.setItem("sortID", sortID, false);
    }

    getShortID():string {
        return this.userData.shortId;
    }

    getToken():string {
        return this.token;
    }

    setToken(token:string){
        if(!token){
            return;
        }
        this.token = token;
        h.http.setAuthorization(token) ;
    }

    getLocalUserID(): string {
        return "5a5d6f4984074933e48a978a";
    }

    getIdentityType():HallConstant.IdentityType{
        let identityType:HallConstant.IdentityType = HallConstant.IdentityType.common;
        if(this.userData.curator){
            // if(!this.userData.curator.block && this.userData.curator.enabled){
            //     identityType = HallConstant.IdentityType.curator;
            // }
            if(this.userData.curator.enabled){
                identityType = HallConstant.IdentityType.curator;
            }
        }
        identityType = HallConstant.IdentityType.proxy;
        return identityType;
    }

    getIp(){
        return this.ip;
    }

    setIp(ip:string){
        this.ip = ip;
    }

    getGpsDesc(){
        return HallUIUtil.getGPSDesc(this.userData.loc.long, this.userData.loc.lat);
    }
}