import { CreateModel } from "./DZCreateModel";


const { ccclass, property, menu } = cc._decorator;

@ccclass
//@menu("369/Button")
export default class wanfaItem extends cc.Component {
    createTable: any;
    select: any;
    selectType: any;
    defaultSelect: any;
    playType: any;
    btnArray: any[];
    hasGsp: boolean;

    @property(cc.Label)
    typeNmae: cc.Label = null;

    @property(cc.Node)
    btnLayout: cc.Node = null;

    @property(cc.Node)
    speDes: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    updateView(playType, createTable) {
        this.btnArray = [];
        this.hasGsp = false;
        this.playType = playType;
        this.defaultSelect = playType.defaultSelect;
        this.selectType = playType.selectType;
        this.typeNmae.string = this.typeNameChange(playType.playTypeName);
        this.select = playType.defaultSelect;
        this.createTable = createTable;
        this.changeSendParam();
        this._updateItem(playType.selectItem);
        // if(playType.name == 'article3' || playType.name == 'plane' || playType.name == 'four') {
        //     this.speDes.active = true;
        // }else {
        //     this.speDes.active = false;
        // }
        this.speDes.active = false;
    }

    _updateItem(selectArray) {
        this.btnLayout.removeAllChildren();
        for (var i = 0; i < selectArray.length; i++) {
            let item = null;
            if (this.createTable.btnItemPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                item = this.createTable.btnItemPool.get();
                cc.log('节点中取' + this.createTable.btnItemPool.size());
            } else {
                cc.log('节点池中放的对象太少，下次多放点,这块直接把它生成够,或者程序哪块写错了，对象没有重新放回来');
                var prefab = cc.loader.getRes('games/dz/assets/resources/res/prefab/createTable/btnItem', cc.Prefab)
                item = cc.instantiate(prefab);
            }
            item.parent = this.btnLayout;
            let btnItem = item.getComponent('btnItem');
            btnItem.updateView(selectArray[i], this, i);
            this.btnArray.push(btnItem);

            this.createTable.userNode.push(item);
        }
    }

    //改变单选组状态
    changeRadioSelect(index) {
        cc.log('changeRadioSelect333');
        this.defaultSelect = [];
        this.defaultSelect.push(index);
        cc.log('changeRadioSelect' + this.btnArray.length);
        for (let i = 0; i < this.btnArray.length; i++) {
            cc.log('changeRadioSelect');
            this.btnArray[i]._showMark(this.defaultSelect);
        }
        this.changeSendParam();
        this.changeDefaultArray();
    }

    //改变单选组状态有gsp
    changeRadioGsp(index, isGsp) {
        cc.log('changeRadioGsp');
        this.defaultSelect = [];
        this.defaultSelect.push(index);
        cc.log('changeRadioSelect' + this.btnArray.length);
        for (let i = 0; i < this.btnArray.length - 1; i++) {
            cc.log('changeRadioSelect');
            this.btnArray[i]._showMark(this.defaultSelect);
        }
        if (this.canTouchGsp()) {
            if (this.btnArray[this.btnArray.length - 1].getSelectState()) {
                this.defaultSelect(this.btnArray.length - 1);
                let btnItem = this.btnArray[this.btnArray.length - 1]
                btnItem.setColor("black");
                // let lineOut: cc.LabelOutline = btnItem.getComponent(cc.LabelOutline);
                // lineOut.color = cc.color(39, 82, 216, 255);
            }
            else {
                let btnItem = this.btnArray[this.btnArray.length - 1]
                btnItem.setColor("black");
                // let lineOut: cc.LabelOutline = btnItem.getComponent(cc.LabelOutline);
                // lineOut.color = cc.color(39, 82, 216, 255);
            }
        } else {
            let btnItem = this.btnArray[this.btnArray.length - 1]
            btnItem.setColor("gray");
            let lineOut: cc.LabelOutline = btnItem.getComponent(cc.LabelOutline);
            if(lineOut){
                lineOut.color = cc.color(1, 2, 3, 255);
            }
            
        }
        this.changeSendParam();
        this.changeDefaultArray();
    }

    //改变多选状态
    changeCheckSelect() {
        this.defaultSelect = [];
        for (let i = 0; i < this.btnArray.length; i++) {
            if (this.btnArray[i].getSelectState()) {
                this.defaultSelect.push(i);
            }
        }
        this.changeSendParam();
        this.changeDefaultArray();
    }

    //改变要传的参数
    changeSendParam() {
        cc.log('changeSendParam + ' + this.playType.name + "   " + JSON.stringify(this.defaultSelect));
        let array = [];
        for (let i = 0; i < this.defaultSelect.length; i++) {
            array.push(this.playType.selectItem[this.defaultSelect[i]].value);
        }
        CreateModel.getInstance().setConfigItem(this.playType.name, array);
        CreateModel.getInstance().setDefaultItem(this.playType.name, this.defaultSelect);
    }

    //改变Default状态
    changeDefaultArray() {
        CreateModel.getInstance().setDefaultArray(this.playType.name, this.createTable.createInfo.type, this.defaultSelect);
    }

    canTouchGsp() {
        cc.log('canTouchGsp ' + this.hasGsp + "xxxxxxx" + JSON.stringify(this.defaultSelect));
        if (this.hasGsp) {
            if (this.defaultSelect.indexOf(2) >= 0) {     //点击的是抢三倍
                cc.log('canTouchGsp111');
                return false;
            } else {
                cc.log('canTouchGsp222');
                return true;
            }
        }
    }

    /**
     * 字符变换
     * @param name 
     */
    typeNameChange(name: string) {
        let splitArr = name.split('');
        let intervalArr = {
            '2': '        ',
            '3': '  ',
            '4': '',
        }
        let interval = intervalArr[splitArr.length];
        let splitArrLength = splitArr.length;
        let retArr = splitArr.map((v, i) => splitArrLength - 1 == i ? v : v + interval);
        let retStr = retArr.reduce((allString, next) => allString + next);
        return retStr + " :  ";
    }
}
