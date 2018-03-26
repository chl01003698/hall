// Learn TypeScript:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/typescript/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MyListCell extends cc.Component {

    index:number = 0;
    data:any = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    }
    // update (dt) {},
    setData(data){
        this.data = data;
    }

    getData(){
        return this.data;
    }

    setIndex(index){
        this.index = index;
    }

    getIndex(){
        return this.index;
    }
}
