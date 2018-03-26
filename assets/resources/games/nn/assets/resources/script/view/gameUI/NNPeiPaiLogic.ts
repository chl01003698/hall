import { NNGameUtil } from "../../common/NNGameUtil";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { h } from "../../../../../../../script/common/H";
import NNgameControler from "../game/NNgameControler";
import NNpokerItem from "../poker/NNpokerItem";
import NNpokersControl from "../game/NNpokersControl";
import { HallAlert } from "../../../../../../../script/common/HallAlert";
import { NNConstant } from "../../common/NNConstant";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/PeiPaiLogic")
export default class NNPeiPaiLogic extends cc.Component {

    @property([cc.Node])
    btns: cc.Node[] = []

    @property([cc.Node])
    cardValueNodes: cc.Node[] = []

    labels: cc.Label[] = []

    cardsValues: number[] = []

    totalValue: number = 0

    onLoad() {
        for (let i = 0; i < this.btns.length; i++) {
            const btn = this.btns[i];
            btn.tag = i
        }
        
        for (let i = 0; i < this.cardValueNodes.length; i++) {
            let label = this.cardValueNodes[i].getComponent(cc.Label)
            label.string = '0'
            this.labels.push(label)
        }

        this.setBtn0Enable(false)
    }

    reset() {
        this.cardsValues = []
        this.totalValue = 0
        this.refreshLabels()
    }

    pushValue(cardValue: number) {
        if (this.cardsValues.length >= 3) {
            return
        }
        this.cardsValues.push(cardValue)
        this.refreshLabels()
    }

    popValue(cardValue: number) {
        if (this.cardsValues.length == 0) {
            return
        }
        let idx = this.cardsValues.indexOf(cardValue, 0)
        this.cardsValues.splice(idx, 1)
        this.refreshLabels()
    }

    private refreshLabels() {
        this.totalValue = 0
        let i = 0
        for (let i = 0; i < 3; i++) {
            if (i < this.cardsValues.length) {
                const v = this.cardsValues[i];
                this.labels[i].string = '' + v
                this.totalValue += v
            } else {
                this.labels[i].string = '0'
            }
        }
        this.labels[3].string = '' + this.totalValue

        this.setBtn0Enable(this.cardsValues.length == 3 && this.totalValue % 10 == 0)
    }

    private setBtn0Enable(enable: boolean) {
        this.btns[0].getComponent(cc.Button).interactable = enable;
    }

    initView(parent:cc.Node, pokersControl:NNpokersControl) {
        this.btns.forEach(btn => {
            btn.on('touchend', function() {
                let msg = {index : btn.tag, cards3 : [], cards2 : []}
                if (btn.tag == 0) {
                    let pokers = pokersControl.pokersArray[0]
                    let pokersSelected = pokersControl.pokersSelected
                    for (let i = 0; i < pokers.length; i++) {
                        const poker = pokers[i];
                        let x = pokersSelected.find(p => p._pokerNum == poker._pokerNum)
                        if (x) {
                            msg['cards3'].push(poker._pokerNum)
                        } else {
                            msg['cards2'].push(poker._pokerNum)
                        }
                    }
                }
                NNgameControler.matchCard(this.onBottomPour.bind(this), msg);
                parent.active = false
            }.bind(this))
        })
    }

    private onBottomPour() {

    }
}
