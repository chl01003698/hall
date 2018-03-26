import { SZcreateTableMode } from "./SZcreateTableMode";


const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZwanfaItem")
export default class SZwanfaItem extends cc.Component {
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
    lineNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    updateView(playType,createTable) {
        this.btnArray = [];
        this.hasGsp = false;        
        this.playType = playType;
        this.defaultSelect = playType.defaultSelect;
        this.selectType = playType.selectType;
        this.typeNmae.string = playType.playTypeName;
        this.select = playType.defaultSelect;
        this.createTable = createTable;
        this.changeSendParam();
        this._updateItem(playType.selectItem);

        if(playType.name == "commonSetting" ) {
            this.lineNode.active = false;
        }else {
            this.lineNode.active = true;
        }
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
                var prefab = cc.loader.getRes('games/sz/assets/resources/res/prefab/create/btnItem', cc.Prefab) 
                item = cc.instantiate(prefab);
            }   
            item.parent = this.btnLayout;
            let btnItem = item.getComponent('SZbtnItem');
            btnItem.updateView(selectArray[i],this,i);
            this.btnArray.push(btnItem);

            this.createTable.userNode.push(item);
        }
    }

    //改变单选组状态
    changeRadioSelect(index) {
        cc.log('changeRadioSelect333');
        this.defaultSelect = [];
        this.defaultSelect.push(index);
        cc.log('changeRadioSelect'  + this.btnArray.length);
        for(let i=0;i<this.btnArray.length;i++) {
            cc.log('changeRadioSelect');
            this.btnArray[i]._showMark(this.defaultSelect);
        }
        this.changeSendParam();
        this.changeDefaultArray();
    }

    //改变多选状态
    changeCheckSelect() {
        this.defaultSelect = [];
        for(let i=0;i<this.btnArray.length;i++) {
            if(this.btnArray[i].getSelectState()) {
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
        for(let i=0;i<this.defaultSelect.length;i++) {
            array.push(this.playType.selectItem[this.defaultSelect[i]].value);
        }
        SZcreateTableMode.getInstance().setConfigItem(this.playType.name,array);
        SZcreateTableMode.getInstance().setDefaultItem(this.playType.name,this.defaultSelect);
    }

    //改变Default状态
    changeDefaultArray() {
        SZcreateTableMode.getInstance().setDefaultArray(this.playType.name,this.createTable.createInfo.type,this.defaultSelect);
    }
}
