
const {ccclass, property, menu} = cc._decorator;

@ccclass
export default class BtnGroup extends cc.Component {

    // 按钮列表
    btnArr: any[] = [];

    @property(cc.Node)
    layout: cc.Node = null ;

    @property(cc.Label)
    label: cc.Label = null ;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    onDestroy(){
        this.btnArr.forEach(function(v) {
            v.node.targetOff(this) ;
        }.bind(this));
    }

    /**
     * 添加按钮
     * @param btn 
     */
    addBtn(btn: any){
        btn.setIndex(this.btnArr.length + 1) ;
        this.btnArr.push(btn) ;
        btn.node.on('onBtnClick', this.onBtnStateChange, this) ;
        this.layout.addChild(btn.node) ;
    }

    /**
     * 设置名字
     * @param name 
     */
    setName(name: string){
        this.label.string = this.typeNameChange(name) ;
    }

    /**
     * 字符变换
     * @param name 
     */
    typeNameChange(name:string){
        let splitArr = name.split('') ;
        let intervalArr = {
            '2': '        ',
            '3': '  ',
            '4': '',
        }
        let interval = intervalArr[splitArr.length] ;
        let splitArrLength = splitArr.length ;
        let retArr = splitArr.map((v, i) => splitArrLength - 1 == i ? v : v + interval ) ;
        let retStr = retArr.reduce((allString, next) => allString + next) ;
        return retStr + " :  ";
    }

    /**
     * 按钮状态变换回调
     */
    onBtnStateChange(event){
        let btn = event.detail.btn;
        // 将所有raido类型按钮置false
        if('radio' === btn.getType()){
            let filterBtnArr = this.btnArr.filter(v => v.getIndex() !== btn.getIndex()) ;
            filterBtnArr.forEach((v) => 'radio' === v.getType() ? v.setSelectState(false) : v) ;
            this.node.emit('onBtnStateChange', {btn: btn}) ;
        }
    }
}
