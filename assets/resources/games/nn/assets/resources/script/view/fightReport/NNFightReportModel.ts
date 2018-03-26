/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-08 19:54:57 
 * @Desc: 文件描述
 */

import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { h } from "../../../../../../../script/common/H";

export class NNFightReportModel extends HallBaseModel {
    private static instance: NNFightReportModel = null;
    private data: any;

    static getInstance(): NNFightReportModel {
        if (!this.instance) {
            this.instance = new NNFightReportModel();
        }
        return this.instance;
    }

    setData(data) {
        this.data = data;
    }

    getData(): any[] {
        return this.data;
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
        let roundData = this.data.rounds[roundIndex];
        for (var i in roundData.players) {
            let player = roundData.players[i];
            if (player.uid == uid) {
                return player;
            }
        }
    }

    getRoundDatas(): any[] {
        return this.data.rounds;
    }

    getTableId() {
        return this.data.roomId;
    }

    getTime() {
        return new Date(this.data.startAt).getTime();
    }

    getCurrentRound() {
        return this.data.currentRound;
    }
}