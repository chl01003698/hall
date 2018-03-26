const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("sz/SZbtnItem")
export default class SZbtnItem extends cc.Component {
    isGsp: boolean;
    isSelect: any;
    index: number;
    selectType: any;
    wanfaItem: any;

    @property(cc.Label)
    text: cc.Label = null;
    @property(cc.Node)
    CirCleNode: cc.Node = null;
    @property(cc.Node)
    SquareNode: cc.Node = null;
    @property(cc.Node)
    CircleMark: cc.Node = null;
    @property(cc.Node)
    SquareMark: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    updateView(playType:any,wanfaItem:any,i:number) {
        //this.node.targetOff(); 
        this.wanfaItem = wanfaItem;
        this.selectType = wanfaItem.selectType;
        this.index = i;
        cc.log('xxxxxxxxxxxxxxxxxxxxxxxxxx' + JSON.stringify(playType));
        this.text.string = playType.des;
        if(wanfaItem.selectType == 'Radio') {
            this.CirCleNode.active = true;
            this.SquareNode.active = false;
            this._showMark(wanfaItem.defaultSelect);
        }else {
            this.CirCleNode.active = false;
            this.SquareNode.active = true;
            this._showMark(wanfaItem.defaultSelect);
        }
    }

    getSelectState() {
        return this.isSelect;
    }

    onBtnClick() {
        cc.log('onBtnClickonBtnClickonBtnClick  ' + this.wanfaItem.selectType + this.index  + this.isSelect);
        if(this.wanfaItem.selectType == 'Radio') {  //单选
            if(! this.isSelect) {
                this.wanfaItem.changeRadioSelect(this.index);
            }
        }else {         //多选
            this.changCheckBox();
        }   
    }

    changCheckBox() {
        cc.log('changCheckBox');
        this.isSelect = ! this.isSelect;
        this.wanfaItem.changeCheckSelect();
        this.CircleMark.active = this.isSelect;
        this.SquareMark.active = this.isSelect;

        this.text.node.color = this.isSelect ? cc.color(0xfb,0xfb,0xb6) : cc.color(0xfb,0xfb,0xb6);
    }

    _showMark(defaultSelect:any) {
        cc.log('_showMarK' + JSON.stringify(defaultSelect));
        if(defaultSelect.indexOf(this.index) >= 0) {
            this.isSelect = true;
            this.CircleMark.active = true;
            this.SquareMark.active = true;
            this.text.node.color = cc.color(0xfb,0xfb,0xb6);
        }else {
            this.isSelect = false;
            this.CircleMark.active = false;
            this.SquareMark.active = false;
            this.text.node.color = cc.color(0xfb,0xfb,0xb6);
        }
    }
}
