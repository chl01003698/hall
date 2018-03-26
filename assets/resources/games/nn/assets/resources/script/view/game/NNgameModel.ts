import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { HallModel } from "../../../../../../../script/view/hall/HallModel";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { h } from "../../../../../../../script/common/H";

export default class NNgameModel extends HallBaseModel {
    roomConfig: any;
    restoreGameInfo: any;
    playerMap: { [key: string]: any } = {};
    tableData: any;
    gameResult:any;
    zhuangSeatId:number;

    private static instance: NNgameModel = null;

    static getInstance(): NNgameModel {
        if (this.instance == null) {
            this.instance = new NNgameModel();
        }
        return this.instance;
    }

    //
    public setRoomConfig(config: any){
        this.roomConfig = config;
    }

    //取上一次房间配置
    public getRoomConfig(){
        return this.roomConfig;
    }


    //设置桌子数据
    public setTableData(data: any) {
        this.tableData = data;
    }

    // 获取桌子数据
    public getTableData(){
        return this.tableData;
    }

    //获取自己是不是房主
    isOwner() {
        let myId = HallUserModel.getInstance().getUserID();
        if(this.tableData.ownerId == myId) {
            return true;
        }
        return false;
    }

    setPlayerData(uid:string, data: any){
        h.log.debug("=== NNgameModel 收到有单个玩家加入房间。。uid=" + uid + " data=" + data);
        this.playerMap[uid] = data;
    }

    getPlayerData(uid:string):any{
        return this.playerMap[uid];
    }

    getPlayerMap(){
        return this.playerMap;
    }

    getPlayerUids(){
        this.playerMap = {
            "5a7bcaa38452de2114e29f5d":{
                "checked" : "false",
                "giveup" : "false",
                "loser" : "false",
                "id" : "5a7bcaa38452de2114e29f5d",
                "shortId" : 103231,
                "nickname" : "测试103231",
                "isGuest" : "false",
                "sex" : "0",
                "headimgurl" : "/public/source/headimg.jpg",
                "count":{
                    "name" : "",
                    "seriesMax" : "0",
                    "series" : "0",
                    "winCount" : "0",
                    "count" : "0",
                 },
                "signature" : "",
                "index" : "0",
                "watcher" : "false",
                "ip" : "192.168.225.127",
                "isOwner" : true,
             },
            "5a7bca9f8452de2114e29f5b":{
                "checked" : "false",
                "giveup" : "false",
                "loser" : "false",
                "id" : "5a7bca9f8452de2114e29f5b",
                "shortId" : 103230,
                "nickname" : "测试103230",
                "isGuest" : "false",
                "sex" : "0",
                "headimgurl" : "/public/source/headimg.jpg",
                "count":{
                    "name" : "",
                    "seriesMax" : "0",
                    "series" : "0",
                    "winCount" : "0",
                    "count" : "0",
                 },
                "signature" : "",
                "index" : 1,
                "watcher" : "false",
                "ip" : "192.168.225.127",
                "isOwner" : "false",
             },
            };
        let uids = [];
        for(let uid in this.playerMap){
            uids.push(uid);
        }
        return uids;
    }

    //根据uid返回服务器座位号
    getSeverSeatId(uid:string):number{
        return this.playerMap[uid].index;
    }

    //取断线重连数据
    getRestoreGameInfo(){
        return this.restoreGameInfo;
    }

    //设置断线重连数据
    setRestoreGameInfo(data){
        this.restoreGameInfo = data;
    }

    setGameResult(data){
        this.gameResult = data;
    }

    getGameResult():any{
        return this.gameResult;
    }
}
