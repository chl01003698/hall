import { NNGameUtil } from "../../common/NNGameUtil";
import { HallController } from "../../../../../../../script/view/hall/HallController";
import { h } from "../../../../../../../script/common/H";
import NNgameControler from "../game/NNgameControler";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("nn/LootZhuangBtns")
export default class NNLootZhuangBtns extends cc.Component {

    @property([cc.Node])
    btns: cc.Node[] = []

    onLoad() {
        for (let i = 0; i < this.btns.length; i++) {
            const btn = this.btns[i];
            btn.tag = i
        }
    }

    initView(parent:cc.Node) {
        this.btns.forEach(btn => {
            btn.on('touchend', function() {
                NNgameControler.lootZhuang(this.onLootZhuang.bind(this), {index:btn.tag});
                parent.active = false
            }.bind(this))
        })
    }

    private onLootZhuang() {

    }
}
