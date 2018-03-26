/*
 * @Author: wang jun wei 
 * @Date: 2018-01-20 11:56:16 
 * @Last Modified by: wang jun wei
 * @Last Modified time: 2018-03-01 17:17:14
 */
import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { h } from "../../../../../../../script/common/H";
import { CreateModel } from "../../createTable/DZCreateModel";

export class DZGameModel extends HallBaseModel {
    ZhongData: any;
    private static instance: DZGameModel = null;
    private tableData: any = null;
    //创建房间时的配置信息，用于再开一局
    private roomConfig: any = null;
    private restoreGameInfo:any = null;
    //游戏开始时，保存所有玩家的信息
    playerMap: { [key: string]: any } = {};

    static getInstance(): DZGameModel {
        if (this.instance == null) {
            this.instance = new DZGameModel();
        }
        return this.instance;
    }

    getRestoreGameInfo(){
        return this.restoreGameInfo;
    }

    setRestoreGameInfo(data){
        this.restoreGameInfo = data;
    }
    //设置桌子数据
    public setTableData(data: any) {
        this.tableData = data;
    }

    // 获取桌子数据
    public getTableData(){
        return this.tableData;
    }

    //
    public setRoomConfig(config: any){
        this.roomConfig = config;
    }

    //取上一次房间配置
    public getRoomConfig(){
        return this.roomConfig;
    }

    //根据配置返回玩法文字描述
    public getRoomConfigDesc(roomConfig:any){
        let descInfo = [];
        h.log.debug("roomConfig.type=" + roomConfig.type);
        let createInfo = CreateModel.getInstance().getCreateData(roomConfig.type);
        h.log.debug("createInfo=" + createInfo);
        let infoArr = createInfo[0].playType;
        h.log.debug("infoArr=" + infoArr);
        h.log.debug("roomConfig.expendIndex=" + roomConfig.expendIndex);
        h.log.debug("roomConfig.payway=" + roomConfig.payway);
        for(let k in roomConfig) {
            //h.log.debug("k=" + k);//payway
            //h.log.debug("roomConfig[k]=" + roomConfig[k]);//owner
            if(k == 'game' || k == 'type' || k == 'join' || k == 'score' || k == 'roundCount') {
                //不需要的信息
            }else {
                let configValue = roomConfig[k];
                //
                for(let i = 0;i < infoArr.length; i++){
                    let singleInfo = infoArr[i];
                    if(singleInfo.name == k){
                        let selectArr = singleInfo.selectItem;
                        for(let j = 0;j < selectArr.length;j++){
                            if(selectArr[j].value == configValue){                               
                                descInfo.push(/*singleInfo.playTypeName + " : " + */selectArr[j].des);
                            }
                        }
                    }
                }
            }
        }
        h.log.debug("==========");
        for(let i = 0;i < descInfo.length;i++){
            h.log.debug("descInfo[i]" + descInfo[i]);
        }
        return descInfo;
    }

    //取记牌器状态
    public getJipaiqiStates() {
       let roomConfig = this.tableData.roomConfig;
       cc.log('getJipaiqiStates' + JSON.stringify(roomConfig));
       if(roomConfig.JiPaiQi[0] == 1) {
           return true;
       }else {
           return false;
       }
    }
   

    //取当前局数
    public getCurrentRound(): string{
        if(!this.tableData){
            return '';
        }
        return String(this.tableData.currentRound);
    }

    

    setCallZhongData(data:any) {
        this.ZhongData = data;
    }

    getCallZhongData() {
        return this.ZhongData;
    }

    //
    setPlayerData(uid:string,data: any){
        h.log.debug("===DZGameModle收到有单个玩家加入房间。。uid=" + uid + " data=" );
        h.log.debug(data);
        this.playerMap[uid] = data;
    }

    getAllPlayersData():any{
        return this.playerMap;
    }

    getPlayerData(uid:string):any{
        return this.playerMap[uid];
    }

    //根据uid返回用户昵称
    getUserNickName(uid:string){
        h.log.debug(uid+",this.playerMap[uid]=" + this.playerMap[uid] );
        h.log.debug("nickname=" + this.playerMap[uid].nickname);
       return this.playerMap[uid].nickname;
    }
    //根据uid返回用户头像
    getUserIcon(uid:string){
        return this.playerMap[uid].headimgurl || '';
    }

    getUserSex(uid:string){
       return this.playerMap[uid].sex;
    }
    //取用户倍数
    getUserMultiple(uid:string){
        return this.playerMap[uid].multiple;
    }

    //更新用户倍数
    setUserMultiple(uid:string,multiple:number){
        this.playerMap[uid].multiple = multiple;
    }

    //根据uid返回服务器座位号
    getSeverSeatId(uid:string):number{
       return this.playerMap[uid].index;
    }

    getUserIp(uid: string) {
        return this.playerMap[uid].ip || '';
    }

    getUserGPS(uid: string) {
        return this.playerMap[uid].gps || '';
    }

    getShortId(uid: string){
        return this.playerMap[uid].shortId || '';
    }

    clearAllData() {
        this.ZhongData = {};
        this.tableData = {};
    }

    clearPlayerMap(){
        this.playerMap = {};
    }
}