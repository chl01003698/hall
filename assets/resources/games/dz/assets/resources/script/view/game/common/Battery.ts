import { h } from "../../../../../../../../script/common/H";
import { HallUtil } from "../../../../../../../../script/util/HallUtil";
const {ccclass, property, menu} = cc._decorator;

@ccclass
//@menu("369/Button")
export default class Battery extends cc.Component {

    @property([cc.Node])
    greenNode: cc.Node[] = [];
    
    onLoad () {
        this.showElectric();
   
        this.showElectricAction = HallUtil.schedule(function(){
            this.showElectric();
        }.bind(this), this.node, 300,true);
    }

    showElectric() {
        this.hideAllGreenNode();
        
        let batteryNum = h.commonSDK.getBatteryNum();
        let greenNodeNum = Math.ceil(batteryNum / 20);
        cc.log('showElectric::::::::::::' + batteryNum +'     ' + greenNodeNum);
        if(greenNodeNum == 1) {

        }else {
            for(let i=0;i<greenNodeNum - 1;i++) {
                this.greenNode[i].active = true;
            }
        }
    }


    /**
     * 把所有的都隐藏
     */
    hideAllGreenNode(){
        this.greenNode.forEach(element => {
            element.active = false;
        });
    }

    onDestroy(){
        this.node.stopAction(this.showElectricAction);
    }

    start () {

    }

    // update (dt) {},
}
