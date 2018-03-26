import { HallBaseView } from "../../../../../../../script/common/HallBaseView";
import { h } from "../../../../../../../script/common/H";
import { HallController } from "../../../../../../../script/view/hall/HallController";

export default class DZJoinTableView extends HallBaseView {
    spriteArray: Array<cc.Sprite> = [];
    private labels:[number] = [-1, -1, -1, -1, -1, -1];
    private labelCount: number = 0;
    private labelArray: Array<any> = [];
    private pressNumBtnNode;
    private inputLabel ;
    constructor() {
        super();
        super.showMaskView(true);
        this.setBindDatas({
            "anniu": { varName: "pressNumBtnNode" },
            "input_label": { varName: "inputLabel" },
            "close": { varName: "close", callback: this.closeJoinView.bind(this) },
            "reset": { varName: "reset", callback: this.clearNum.bind(this) },
            "del": { varName: "del", callback: this.delNum.bind(this) },
        });


        for (let i = 0; i <= 9; i++) {
            let btnName = String('anniu/' + i);
            this.addBindDatas({[btnName]: {varName: 'pressNum' + i, callback: this.addNum.bind(this)}})
        }
        this.setPrefab("res/prefab/create/join");

    }

    onPrefabLoaded() {
        h.log.debug("JoinTableView....onPrefabLoaded");
        //h.log.debug(this.input_label);
        this.cleanInput();
        this.cleanInputValue();
    }
    //清空输入框内容
    cleanInput() {
        for (let i = 0; i < 6; i++) {
            this.labelArray[i] = cc.find("label_" + i, this.inputLabel).getComponent(cc.Label);
            this.labelArray[i].string = " ";

            this.spriteArray[i] = cc.find("sprite_" + i, this.inputLabel).getComponent(cc.Sprite);
            this.spriteArray[i].spriteFrame = this.getToumingSpriteFrame();
        }
    }
    //清空输入的值
    cleanInputValue() {
        for (var i = 0; i < this.labelCount; i++) {
            this.labels[i] = -1
        }
        this.labelCount = 0;
    }

    closeJoinView() {
        h.log.debug("JoinTableView....closeJoinView");
        h.viewManager.removeView(this);
    }

    clearNum() {
        h.log.debug("JoinTableView....clearNum");
        this.cleanInputValue();
        this.cleanInput();
    }

    delNum() {
        h.log.debug("JoinTableView....delNum");

        if (0 != this.labelCount) {

            let delIndex = this.labelCount - 1 ;
            this.labelArray[delIndex].string = " ";
            this.spriteArray[delIndex].spriteFrame = this.getToumingSpriteFrame();
            this.labels[delIndex] = -1
            this.labelCount--;
        }
    }

    addNum(event) {
        h.log.debug("JoinTableView....addNum");
        if (this.labelCount >= 6) {
            cc.log("警告：已输入6位数字， 不要再输入数字");
            return;
        }

        h.log.debug(event.target.name);
        let num = event.target.name;
        this.labels[this.labelCount] = num;
        this.labelArray[this.labelCount].string = String(num);
        this.spriteArray[this.labelCount].spriteFrame = this.getNumSriteFrame(num);
        this.labelCount++;
        // 房间号输入结束
        if (6 == this.getNumCount()) {
            this.runAction(cc.sequence(
                    cc.delayTime(0.15),
                    cc.callFunc(function () {
                        //  获取房间号
                        let roomNum = this.getRoomNum();
                        h.log.debug("输入的房间号：", roomNum);
                        HallController.join(this.joinSuccess.bind(this),roomNum);
                    }.bind(this))
                )
            );
        }
    }

    joinSuccess(data){
        h.log.debug("加入成功");
        h.log.debug(data);
        if(data){
            if(data.code == 200){
                h.viewManager.removeView(this);
            }
        }
        this.clearNum();
        
    }
    // 获取数字个数
    getNumCount() {
        return this.labelCount;
    }

    // 获取房间号
    getRoomNum() {
        var retNum = "";
        for (var i = 0; i < this.labelCount; i++) {
            retNum = retNum + "" + this.labels[i];
        }
        return retNum;
    }

    getToumingSpriteFrame() {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/join',cc.SpriteAtlas);
        return plist.getSpriteFrame('touming');
    }

    getNumSriteFrame(num) {
        let plist = cc.loader.getRes('games/sz/assets/resources/res/images/atlas/join',cc.SpriteAtlas);
        return plist.getSpriteFrame('win_' + num);
    }
}
