
const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class SelectBtn extends cc.Component {

    /**
     * 是否是选中状态
     */
    isSelect: boolean;
    index: number;
    type: string;

    @property(cc.Label)
    text: cc.Label = null ;

    // 选中节点
    @property(cc.Node)
    radio: cc.Node = null ;

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    onDestroy(){
    }

    setIndex(index: number){
        this.index = index ;
    }

    getIndex(index: number){
        return this.index
    }

    setType(type: string){
        this.type = type;
    }

    getType(){
        return this.type ;
    }

    /**
     * 
     * @param isSelect 设置按钮状态
     */
    setSelectState(isSelect: boolean){
        this.isSelect = isSelect ;
        this._updateView(isSelect) ;
    }

    getSelectState(){
        return this.isSelect
    }

    /**
     * 设置字符串
     * @param text 
     */
    setName(text:string){
        this.text.string = text ;
    }

    _updateView(slectState: boolean){
        this.radio.active = slectState ;
        // this.text.node.color = slectState ? cc.color(0x0B,0x2E,0xA2) : cc.color(255, 255, 255) ;
    }

    /**
     * 点击事件
     */
    onClick(){
        this.setSelectState(!this.getSelectState()) ;
        this.node.emit('onBtnClick', {btn: this}) ;
    }
}
