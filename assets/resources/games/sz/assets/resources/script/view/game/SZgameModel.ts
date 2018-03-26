import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { HallModel } from "../../../../../../../script/view/hall/HallModel";
import { HallUserModel } from "../../../../../../../script/view/login/HallUserModel";
import { h } from "../../../../../../../script/common/H";

export default class SZgameModel extends HallBaseModel {
    hasLaizi: boolean;
    roomConfig: any;
    restoreGameInfo: any;
    playerMap: { [key: string]: any } = {};
    tableData: any;
    gameResult:any;

    private static instance: SZgameModel = null;

    static getInstance(): SZgameModel {
        if (this.instance == null) {
            this.instance = new SZgameModel();
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

    setPlayerData(uid:string,data: any){
        h.log.debug("===DZGameModle收到有单个玩家加入房间。。uid=" + uid + " data=" );
        this.playerMap[uid] = data;
    }

    getPlayerData(uid:string):any{
        return this.playerMap[uid];
    }

    getPlayerSex(uid) {
        return this.playerMap[uid].sex;
    }

    getPlayerMap(){
        return this.playerMap;
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

    // 桌号
    getTableId():string{
        if(this.tableData){
            return this.tableData.roomId;
        }
    }
    /**
     * 设置是否有赖子
     * 
     * @param {boolean} hasLaizi 
     * @memberof SZgameModel
     */
    setHasLaizi(hasLaizi:boolean) {
        this.hasLaizi = hasLaizi;
    }

    // 是否有癞子
    getHasLaizi() {
        return this.hasLaizi;
    }
}
