import { NNGameUtil } from "../../common/NNGameUtil";
import NNgameControler from "../game/NNgameControler";
import { NNConstant } from "../../common/NNConstant";
import NNStatisticCell from "./NNStatisticCell";
import { HallUIUtil } from "../../../../../../../script/util/HallUIUtil";

const {ccclass, property, menu} = cc._decorator;

export class PlayerStatistic {
    uid:string = ''
    niuniuCount:number
    wuniuCount:number
    winCount:number
    score:number
}

class Statistic {
    data : PlayerStatistic[] = []
}

@ccclass
@menu("nn/StatisticLayer")
export default class NNStatisticLayer extends cc.Component {
    
    @property(cc.Button)
    btnShare:cc.Button
    
    @property(cc.Button)
    btnGameOver:cc.Button
    
    @property(cc.Layout)
    layout:cc.Layout
    
    @property(cc.Label)
    playModeTip:cc.Label

    onLoad() {
        this.btnShare.node.on('touchend', function() {
            
        }.bind(this))

        this.btnGameOver.node.on('touchend', function() {

        }.bind(this))
    }

    /**
     * 
     * @param data from server
     */
    setData(data:Statistic) {
        let score = 0
        data.data.forEach(cellData => {
            if (score < cellData.score) {
                score = cellData.score
            }
        })

        data.data.forEach(cellData => {
            let prefab = cc.loader.getRes("games/nn/assets/resources/res/prefab/jiesuan/cell", cc.Prefab)
            let cell : NNStatisticCell = cc.instantiate(prefab).getComponent('NNStatisticCell')
            cell.setData(cellData, score == cellData.score)
            this.layout.node.addChild(cell.node)
        })
    }
}
