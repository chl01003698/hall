import { SZGameUtil } from "../../common/SZGameUtil";
import { HallUtil } from "../../../../../../../script/util/HallUtil";
import SZgameControler from "../game/SZgameControler";
import { SZConstant } from "../../common/SZConstant";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZTest")
export default class SZTest extends cc.Component {


    @property(cc.EditBox)
    first:cc.EditBox = null;

    @property(cc.EditBox)
    two:cc.EditBox = null;

    @property(cc.EditBox)
    three:cc.EditBox = null;

    onLoad() {
        this.first.string = "0.2";
        this.two.string = "0.3";
        this.three.string = "0.4";
    }
    
    jinhuaTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.jinhua);
    }

    shunziTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.shunzi);
    }

    jsunjinTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.sunjin);
    }

    baoziTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.baozi);
    }

    zhahuaTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.zhahua);
    }

    tianlongTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.tianlong);
    }

    dilongTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.dilong);
    }

    dantiaoTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.dantiao);
    }

    jduiziTest() {
        SZgameControler.setTestPoker(SZConstant.testPeipei.duizi);
    }

    inputTest() {
        let pokerArray = [];
        pokerArray.push(this.first.string);
        pokerArray.push(this.two.string);
        pokerArray.push(this.three.string);
        cc.log('#### first' + this.first.string + 'two' + this.two.string + 'three' + this.three.string);
        SZgameControler.setTestPoker(pokerArray);
    }

    inputSecend() {
    }

    inputThree() {

    }

    inputFirst() {

    }
}
