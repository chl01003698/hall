/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 19:54:57 
 * @Desc: 文件描述
 */

import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { h } from "../../../../../../../script/common/H";

export class SZFightReportModel extends HallBaseModel {
    private static instance: SZFightReportModel = null;
    private data: any;
    private bigWinUid:string;
    private roundDatas = null;

    static getInstance(): SZFightReportModel {
        if (!this.instance) {
            this.instance = new SZFightReportModel();
        }
        return this.instance;
    }

    setData(data) {
        this.data = data;
        if(this.data.rounds){
            this.roundDatas = this.data.rounds;
        }
        this.initBigWin();
    }

    getData(): any[] {
        return this.data;
    }

    getTotalScore(index){
        let score = 0;
        // for(let i in this.roundDatas){
        //     for (let j in this.roundDatas[i].players){
        //         let playerData:any = this.roundDatas[i].players[j];
        //         if(playerData.uid == uid){
        //             score += playerData.win;
        //         }
        //     }
        // }
        // return score;
        
        let lastData = this.roundDatas[this.roundDatas.length -1];
        cc.log('### last' + JSON.stringify(lastData));
        return lastData.players[index].score;
    }

    initBigWin(){
        let player = this.data.players[0];
        for(let i = 0; i < this.data.players.length; ++i){
            let playerTemp = this.data.players[i];
            if(playerTemp.score > player.score){
                player = playerTemp;
            }
        }
        if(player){
            this.bigWinUid = player.user._id;
        }
    }

    isBigWin(uid){
        return this.bigWinUid == uid;
    }

    getPlayers(): any[] {
        return this.data.players;
    }

    getPlayer(uid) {
        for (let i in this.data.players) {
            let player = this.data.players[i];
            if(player.user._id == uid){
                return player;
            }
        }
    }

    getRoundsPlayer(roundIndex, uid): any {
        let roundData = this.roundDatas[roundIndex];
        for (var i in roundData.players) {
            let player = roundData.players[i];
            if (player.uid == uid) {
                return player;
            }
        }
    }

    setRoundDatas(datas){
        this.roundDatas = [];
        for(let i = 0; i < datas.length; ++i){
            this.roundDatas.push({players:datas[i]});
        }
    }

    getRoundDatas(): any[] {
        return this.roundDatas;
    }

    getTableId() {
        return this.data.roomId;
    }

    getTime() {
        return new Date(this.data.startAt).getTime();
    }

    getCurrentRound() {
        return this.round;
    }

    setCurrentRound(round) {
        this.round = round;
    }
}