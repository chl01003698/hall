// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
'use strict' ;

cc.Class({
    extends: cc.Component,

    properties: {
        curName: {
            default: "anniu",
            tooltip: "音效名称",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END,this.onClick,this);
    },

    onClick:function (event) {
        var curName = this.curName ;
        //cc.qp.audio.getAudio(curName).playSFX(false) ;
    },

});
