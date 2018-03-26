// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
//按钮抽象
var Constants = require('DZConstant');
var h = require('H').h;
//var ShaderUtils = require("ShaderUtils");
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        btnBg: cc.Sprite,//按钮背景
        btnTitle: cc.Label,//按钮名称
        zhanWeiNode : cc.Node,//占位
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
    },

    onEnable: function () {
        // 
    },

    onDisable: function () {

    },
    /**
     * 初始化按钮
     */
    initButton(titleString, bgAtlasPath, bgSpritName, callback) {
        //h.resManager..log("initButton-->titleString= " + titleString + " bgAtlasPath=" + bgAtlasPath + " bgSpritName=" + bgSpritName + " callback=" + callback);
        this.btnTitle.string = titleString;

        let btnSpriteFrame = h.resManager.getSpriteFrameByName(bgAtlasPath, bgSpritName);
        //h.resManager..log("btnSpriteFrame = " + btnSpriteFrame);
        this.btnBg.spriteFrame = btnSpriteFrame;
        this.btnBg.type = cc.Sprite.Type.SLICED;
        this.btnBg.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        let outlinecolor = new cc.Color(48, 104, 161);
        switch (bgSpritName) {
            case 'zhuomian_button_anniu01':
                outlinecolor = new cc.Color(48, 104, 161);
                break;
            case 'zhuomian_button_anniu02':
                outlinecolor = new cc.Color(32, 127, 19);
                break;
            case 'zhuomian_button_anniu03':
                outlinecolor = new cc.Color(162, 87, 47);
                break;
            case 'zhuomian_button_anniu03':
                outlinecolor = new cc.Color(84, 46, 155);
                break;
        }
        this.btnTitle.getComponent(cc.LabelOutline).color = outlinecolor;
        //h.resManager..log("btnBg = " + this.btnBg);
        //先把cb 挂到this.btnBg.node上
        this.btnBg.node.cb = callback;
        //挂载按钮事件
        this.btnBg.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //此时的this就代表this.btnBg.node
            this.cb();
        });
    },
    //type
    createButton(titleString, bgAtlasPath, bgSpritName, callback, btn_status, game_status, outline_color) {
        //h.resManager..log("initButton-->titleString= " + titleString + " bgAtlasPath=" + bgAtlasPath + " bgSpritName=" + bgSpritName + " callback=" + callback);
        this.btnTitle.string = titleString;
        self = this;
        let btnSpriteFrame = h.resManager.getSpriteFrameByName(bgAtlasPath, bgSpritName);
        //h.resManager..log("btnSpriteFrame = " + btnSpriteFrame);
        this.btnBg.spriteFrame = btnSpriteFrame;
        this.btnTitle.getComponent(cc.LabelOutline).color = outline_color;
        //h.resManager..log("btnBg = " + this.btnBg);
        //先把cb 挂到this.btnBg.node上
        // switch (btn_status) {
        //     case Constants.buttonStatus.gray:
        //         this.setGray();
        //         break;
        //     case Constants.buttonStatus.normal:
        //     this.setNormal();
        //         break;
        //     case Constants.buttonStatus.highLight:
        //     this.setHighLight();
        //         break;
        // }
        //this.btnBg.node.cb = callback;
        //挂载按钮事件
        this.btnBg.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //此时的this就代表this.btnBg.node  
            // this.cb(titleString);
            callback(titleString) ;
        });
    },
    //变灰
    setGray() {
        // ShaderUtils.setShader(this.btnBg, Constants.buttonStatus.gray);
        // ShaderUtils.setShader(this.btnTitle, Constants.buttonStatus.gray);
    },
    //正常self.btnBg
    setNormal() {
        // ShaderUtils.setShader(this.btnBg, Constants.buttonStatus.normal);
        // ShaderUtils.setShader(this.btnTitle, Constants.buttonStatus.normal);
    },
    //变亮
    setHighLight() {
        // ShaderUtils.setShader(self.btnBg, Constants.buttonStatus.highLight);
        // ShaderUtils.setShader(self.btnTitle, Constants.buttonStatus.highLight);
    },

    start() {

    },

    // update (dt) {},
});
