/*
 * @Author: lijian
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 战报数据
 */


import {HallBaseModel} from "../../../../../../../script/common/HallBaseModel";
import {DZjiesuanModel} from "../../jiesuan/DZjiesuanModel";
import {DZGameUtil} from "../../common/DZGameUtil";
import {DZGameModel} from "../game/DZGameModel";

export class DZBattleReportModel extends HallBaseModel {
    private m_totalData:any;
    // private m_playInfo:any;
    // private m_gameInfo:any;
    private m_showAllBtn:boolean = false;
    private m_isGaming:boolean = false;

    private static instance: DZBattleReportModel = null;
    static getInstance(): DZBattleReportModel {
        if (this.instance == null) {
            this.instance = new DZBattleReportModel();
        }
        return this.instance;
    }

    public FN_SetShowAll(show){
        this.m_showAllBtn =  show;
    }

    public FN_SetIsGaming(show){
        this.m_isGaming =  show;
    }
    public FN_GetIsGaming():any{
        return this.m_isGaming;
    }

    public FN_GetShowAll():any{
        return this.m_showAllBtn;
    }

    public FN_SetTotalData(totalData) {
        if(this.m_showAllBtn){
            var data:any = {};
           // data.players = totalData.gamePlayers;
            data.players = this.addPlayerData( totalData.results );
            data.payUIds = totalData.payUIds;
            data.createdAt = "2018-01-29T06:37:48.977Z";
            data.rounds = [];
            for(let i = 0; i<totalData.results.length; i++){
                data.rounds.push({players:totalData.results[i]});
            }
            data.currentRound = DZjiesuanModel.getInstance().getCurrentRound();
            data.roundCount = DZjiesuanModel.getInstance().getRoundCount();
            data.roomId = DZGameUtil.tableId;
            data.configStrs = DZGameModel.getInstance().getRoomConfigDesc(DZGameModel.getInstance().getRoomConfig());
            this.m_totalData = data;
        }else{
            if(this.m_isGaming){
                var gameplayer = [];
                var data:any = {};
                data.createdAt = "2018-01-29T06:37:48.977Z";
                data.payUIds = [];
                data.rounds = [];
                for(let i = 0; i<totalData.results.length; i++){
                    data.rounds.push({players:totalData.results[i]});
                }

                /*
                for(let i = 0; i<data.rounds.length; i++){
                    var players = data.rounds[i].players;
                    for(let j = 0;j <players.length;j++){
                        if(this.FN_CheckUid(players[j],gameplayer) == null){
                            var tempplay:any = {};
                            tempplay.uid = players[j].playerId;
                            tempplay.score = players[j].score;
                            tempplay.winCount = players[j].victory;
                            gameplayer.push(tempplay);
                        }
                    }
                }
                */
                data.players = this.addPlayerData( totalData.results );
                data.currentRound = DZjiesuanModel.getInstance().getCurrentRound();
                data.roundCount = DZjiesuanModel.getInstance().getRoundCount();
                data.roomId = DZGameUtil.tableId;
                data.configStrs = DZGameModel.getInstance().getRoomConfigDesc(DZGameModel.getInstance().getRoomConfig());
                this.m_totalData = data;
                cc.log('----zhanbao--- ' + JSON.stringify(this.m_totalData));
            }else{
                this.m_totalData        = totalData;
                this.m_totalData.players  = this.addPlayerDataInHall( totalData.rounds, totalData.players );
                 DZGameModel.getInstance().setRoomConfig(this.m_totalData.config);
                this.m_totalData.configStrs = DZGameModel.getInstance().getRoomConfigDesc(DZGameModel.getInstance().getRoomConfig());
            }

        }
    }

    /*
     * 计算大厅内的结算的输赢局数
     */
    private addPlayerDataInHall ( rounds,players ){
        var winCountObj = {};
        for( var i = 0; i < rounds.length; ++i ){
             for( var j = 0; j < rounds[i].players.length; ++j ){
                 var tempPlayers = rounds[i].players;
                 if( !winCountObj[ tempPlayers[j].playerId + "" ]  ){
                     winCountObj[ tempPlayers[j].playerId + "" ] = 0;
                 }
                 var addCount = tempPlayers[j].win > 0 ? 1 : 0;
                 winCountObj[ tempPlayers[j].playerId + "" ] += addCount;
             }
        }

        for( var i = 0; i < players.length; ++i ){
            var player       = players[i];
            player.winCount  = winCountObj[ player.user._id + "" ];
        }

        return players;
    }

    /*
     * 计算总的游戏结果
     */
    private addPlayerData ( data ){
        //整理数据
        var temp = {};
        for( var i = 0; i < data.length; ++i ){
            for( var j = 0; j < data[i].length; ++j ){

                if( !temp[ ""+data[i][j].playerId ] ){
                    var obj = {
                        winCount : 0,
                        score    :  data[i][j].score
                    }
                    temp[ ""+data[i][j].playerId ] = obj;
                }

                temp[ ""+data[i][j].playerId ].winCount += data[i][j].win > 0 ? 1 : 0;
                temp[ ""+data[i][j].playerId ].score     = data[i][j].score;
            }
        }

        //  将obj转换成数组
        var ret = [];
        for( var key in temp ){
            var obj = {
                uid     : key,
                score   : temp[key].score,
                winCount: temp[key].winCount
            }
            ret.push( obj );
        }

        return ret ;
    }

    public FN_CheckUid(playData,gameplayer):any{
        for(let i = 0; i <gameplayer.length;i++){
            if(playData.playerId == gameplayer[i].uid){
                gameplayer[i].score = playData.score;
                gameplayer[i].winCount += playData.victory;
                return gameplayer[i];
            }
        }
        return null;
    }

    public  FN_GetTotalData():any{
        return this.m_totalData;
    }

    // public FN_SetPlayInfoList(playInfo){
    //     this.m_playInfo = playInfo;
    // }
    //
    // public FN_SetGameInfoList(gameInfo){
    //     this.m_gameInfo = gameInfo;
    // }

    public FN_GetCurRound():any{
        return this.m_totalData.currentRound;
    }

    public FN_GetRound():any{
        return this.m_totalData.roundCount;
    }
    public FN_GetRoomId():any{
        return this.m_totalData.roomId;
    }
    public FN_GetConfig():any{
        return this.m_totalData.configStrs;
    }

    //得到人物数据
    public FN_GetPlayInfoList():any{
        // if(this.m_playInfo != null){
        //     return this.m_playInfo;
        // }
        if(this.m_totalData != null){
            return this.m_totalData.players;
        }
        return null;
    }
    //得到每局数据
    public FN_GetGameInfoList():any{
        // if(this.m_gameInfo != null){
        //     return this.m_gameInfo;
        // }
        if(this.m_totalData != null){
            return this.m_totalData.rounds;
        }
        return null;
    }

    //得到桌号
    public FN_GetPayUid():any{
        if(this.m_totalData != null){
            return this.m_totalData.payUIds;
        }
        return null;
    }

}