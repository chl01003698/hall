
import { HallBaseModel } from "../../../../../../script/common/HallBaseModel";
import { DZConstant } from "../common/DZConstant";
import { h } from "../../../../../../script/common/H";
import { DZGameUtil } from "../common/DZGameUtil";



export class DZjiesuanModel extends HallBaseModel {
    data: any;
    private static instance: DZjiesuanModel = null;
    //当前局数
    currentRound:number = 0;
    //总局数
    roundCount:number = 0;
    static getInstance(): DZjiesuanModel {
        if (this.instance == null) {
            this.instance = new DZjiesuanModel();
        }
        return this.instance;
    }

    setData(data:any) {
        this.data = data;
    }

    getData():any{
        return this.data;
    }

    setCurrentRound(round){
        this.currentRound = round + 1;
    }

    getCurrentRound():number{
        return this.currentRound;
    }
    
    setRoundCount(round){
        this.roundCount = round;
    }

    getRoundCount():number{
        return this.roundCount;
    }
}