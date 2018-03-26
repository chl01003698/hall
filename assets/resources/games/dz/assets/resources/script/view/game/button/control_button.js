

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var Constants = require('DZConstant').DZConstant;
var HallGameUtil = require('HallGameUtil').HallGameUtil;
var h = require('H').h;
var DZGameController = require('DZGameController');
var DZGameUtil =  require( "DZGameUtil").DZGameUtil;

//按钮属性集合
//var buttonObjMap = new Map();
//已经创建好的的按钮的集合
var btnMap = new Map();
var self = null;
var mingPaiName = "明牌";
cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("control_button..onload");
        if (!this.btnMap) {
            this.btnMap = new Map();
        }
        self = this;


    },

    start() {

    },

    statics: {
        //改变按钮标题
        changeBtnTitleByName: function (name, title) {
            //self = this;
            let btnNode = self.btnMap.get(name);
            if(btnNode){
                let btn = btnNode.getComponent('DZButtonItem');
                let labelTitle = btn.btnTitle.getComponent(cc.Label);
                labelTitle.string = title;
            }
            
        },
        //更新明牌倍数
        changeMingPaiBtnTitle(title){
           // self = this;
            if(self && self.btnMingPai && !DZGameUtil.click_mingpai && DZGameUtil.showCard == 1 ){
                let btn = self.btnMingPai.getComponent('DZButtonItem');
                if(btn){
                    let labelTitle = btn.btnTitle.getComponent(cc.Label);
                    labelTitle.string = title;
                }
                
            }
        }
    },



    initButton: function (data) {
        self = this;
        let action = data.data.action;
        //按钮所属游戏步骤状态
        let state = data.data.state;
        if (!self.btnMap) {
            self.btnMap = new Map();
            cc.log("initButton...new map" + self.btnMap);
        }
        if (action) {
            cc.log("删除 state = " + state + " 的按钮");
            self.deleteAllBtn();
            for (let i = 0; i < action.length; i++) {
                //let actionObj = action[key];
                let landownerObj = action[i];
                //cc.log("key=" + key);
                landownerObj.state = state;
                cc.log("创建按钮..." + JSON.stringify(landownerObj));
                this.createButton(landownerObj);
            }
        }
    },

    btnCall: function (btnkey) {
        self = this;
        let btn = self.btnMap.get(btnkey);
        if( !btn ) return;
        cc.log("btn.type = " + btn.type + " status = " + btn.status);
        if (btn.status == Constants.buttonStatus.gray) {
            //灰色不让点击
            cc.log("灰色不让点击");
            return;
        } else {
            cc.log("%%%可以点击 btn.type="+btn.type + " btn.state=" + btn.state);
            let data = {
                //即是按钮类型，也是要发送给服务器的值
                type: btn.type,
                state: btn.state
            }
            //此处添加按钮点击处理事件,发送通知事件
            h.log.debug("%%%通知点击按钮事件。。。");
            //h.eventManager.dispatchEvent(Constants.dataType.btnCall, data);
            //var DZGameController = require('DZGameController').DZGameController;
            
            if(btn.type != 'tip' && btn.type != 'sendCard_restart' && btn.type != 'sendCard' && btn.type != Constants.buttonType.weChatFriend && btn.type != Constants.buttonType.ready && btn.type != Constants.buttonType.gameFriend){
                //提示按钮不删
                h.log.debug("提示 出牌 按钮不删");
                //self.node.removeAllChildren();
                self = this;
                self.deteAllBtnByState(btn.state);
            }

            if(btn.type == Constants.buttonType.ready){
                //隐藏准备按钮
                let btnNode = self.btnMap.get("准 备");
                //btnNode.active = false;
                btnNode.opacity = 0;
            }

            if (btn.type == 'showCard_2' ) {
                //明牌*5 特殊处理 点了之后置空
                self = this;
                self.btnMingPai = null;
            }
            DZGameController.DZGameController.getInstance().whole_btn_click(data);
        }
    },


    createButton: function (dataObj) {
        self = this;
        //cc.loader.getRes("prefab/sheji/button_item",cc.Prefab);
        //取按钮预制体 resources/games/dz/assets/resources/res/prefab
        let buttonPrefab = h.resManager.getPrefabByName("res/prefab/button/ButtonItem");
        cc.log("buttonPrefab = " + buttonPrefab);
        //取挂在按钮预制体上脚本
        let btnNode = cc.instantiate(buttonPrefab);
        //cc.log("btnNode = " + btnNode);
        let buttonItem = btnNode.getComponent('DZButtonItem');
        cc.log("buttonItem ====" + buttonItem);
        //cc.log("buttonItem = " + buttonItem);
        dataObj.atlas = 'res/images/atlas/youxizhong';
        switch (dataObj.color) {
            case Constants.buttonBgColor.blue:
                dataObj.frame = 'zhuomian_button_anniu01';
                dataObj.outlinecolor = new cc.Color(48, 104, 161);
                break;
            case Constants.buttonBgColor.green:
                dataObj.frame = 'zhuomian_button_anniu02';
                dataObj.outlinecolor = new cc.Color(32, 127, 19);
                break;
            case Constants.buttonBgColor.yellow:
                dataObj.frame = 'zhuomian_button_anniu03';
                dataObj.outlinecolor = new cc.Color(162, 87, 47);
                break;
            case Constants.buttonBgColor.purple:
                //紫色
                dataObj.frame = 'zhuomian_button_anniu03';
                dataObj.outlinecolor = new cc.Color(84, 46, 155);
                break;
            case Constants.buttonBgColor.gray:
                //灰
                dataObj.frame = 'zhuomian_button_anniu03';
                dataObj.outlinecolor = new cc.Color(89, 89, 89);
                break;
        }

        //调用按钮的初始化 dataObj.type
        buttonItem.createButton(dataObj.title, dataObj.atlas, dataObj.frame, this.btnCall.bind(this), dataObj.status, dataObj.state, dataObj.outlinecolor);
        //返回根据预制体生成的node
        btnNode.parent = this.node;//parentNode;
        btnNode.name = dataObj.title;
        btnNode.type = dataObj.type;
        //按钮本身的状态
        btnNode.status = dataObj.status;
        //按钮所处的游戏进程状态
        btnNode.state = dataObj.state;
        btnNode.bgColor = dataObj.color;

        if (dataObj.type == 'showCard_2' && !DZGameUtil.click_mingpai) {
            //明牌*5 特殊处理
            self.btnMingPai = btnNode;

        }

        cc.log("self.btnMap = " + self.btnMap + " dataObj.title=" + dataObj.title + " btnNode=" + btnNode);
        self.btnMap.set(dataObj.title, btnNode);
        self.changeBtnStatus(dataObj.title, dataObj.status);

        //btnNode.setPosition(pos.x,pos.y);
        return btnNode;
    },



    /**
     *  改变按钮状态
     * name 按钮名称
     * 
     */
    changeBtnStatus: function (name, btn_status) {
        self = this;
        let btnNode = self.btnMap.get(name);
        if (btnNode) {
            cc.log("改变按钮状态..name=" + btnNode.name);
            let btn = btnNode.getComponent('DZButtonItem');
            let btnComponent = btn.btnBg.getComponent(cc.Button);
            let labelOutline = btn.btnTitle.getComponent(cc.LabelOutline);
            if (name == '不 叫') {
                btn.zhanWeiNode.active = true;
            } else {
                btn.zhanWeiNode.active = false;
            }
            switch (btn_status) {
                case Constants.buttonStatus.gray:
                    //ShaderUtils.setShader(btn.btnBg, Constants.buttonStatus.gray);
                    //ShaderUtils.setShader(btn.btnTitle, Constants.buttonStatus.gray);
                    btnComponent.interactable = false;
                    labelOutline.color = new cc.Color(89, 89, 89);
                    cc.log("btnComponent=" + btnComponent);
                    //btn.setGray();
                    break;
                case Constants.buttonStatus.normal:
                    btnComponent.interactable = true;
                    switch (btnNode.bgColor) {
                        case Constants.buttonBgColor.blue:
                            labelOutline.color = new cc.Color(48, 104, 161);
                            break;
                        case Constants.buttonBgColor.green:
                            labelOutline.color = new cc.Color(32, 127, 19);
                            break;
                        case Constants.buttonBgColor.yellow:
                            labelOutline.color = new cc.Color(162, 87, 47);
                            break;
                        case Constants.buttonBgColor.purple:
                            labelOutline.color = new cc.Color(84, 46, 155);
                            break;
                    }

                    //ShaderUtils.setShader(btn.btnBg, Constants.buttonStatus.normal);
                    //ShaderUtils.setShader(btn.btnTitle, Constants.buttonStatus.normal);
                    //btn.setNormal();
                    break;
                case Constants.buttonStatus.highLight:
                    //btn.setHighLight();
                    break;
            }
            btnNode.status = btn_status;
        }
    },

    //删除指定名称（name）按钮
    deleteBtn: function (name) {
        self = this;
        let btn = self.btnMap.get(name);
        btn.removeFromParent();
        self.btnMap.delete(name);
        if( name.indexOf( "明牌" ) > -1 ){
            self.btnMingPai = null;
        }

    },

    //通过名字获取单个按钮
    getSingleBtnByName: function (name) {
        self = this;
        let btn = self.btnMap.get(name);
        return btn;
    },




    /**
     * 删除除了name(数组) 之外的按钮
     * actionarr 是服务器返回的数据
     */
    deleteAllBtn: function () {
        self = this;
        self.btnMap.forEach((v, k, map) => {
            cc.log("删除循环 k:" + k + " v.state =" + v.state + " map=" + map);
            //if(v.state == state){
            self.btnMap.delete(k);
            v.removeFromParent();
            v.destroy();
            cc.log("删除 btn...");
            //}
        });
        self.btnMingPai = null;
    },

    /**
     * 按按钮游戏状态删除按钮
     * state 按钮所处状态
     */
    deteAllBtnByState: function (state) {
        self = this;
        h.log.debug("删除按钮state=" + state + " self.btnMap.size.." + self.btnMap.size);
        self.btnMap.forEach((v, k, map) => {
            cc.log("循环 k:" + k + " v.state =" + v.state + " map=" + map);
            if (v.state == state) {
                self.btnMap.delete(k);
                v.removeFromParent();
                v.destroy();
                cc.log("删除 btn...");
            }
        });
    },

    setButtonActive: function (array) {
        self = this;
        cc.log('setButtonActive' + JSON.stringify(array));
        self.btnMap.forEach((v, k, map) => {
            cc.log('setButtonActive k   ' +k);
            cc.log('setButtonActive v   ' +JSON.stringify(v.type));

            if(k != '不 叫') {
                if(array.indexOf(v.type - 0) >= 0) {
                    v.active = true;
                }else{
                    v.active = false;
                }
            }
        });

    },
    // update (dt) {},

    /**
         * 生成按钮
         *
         */
    getButtonByType: function (type) {
        cc.log("showButtonByType 生成按钮 type = " + type);
        //h.log.logObj(Constants);
        //cc.log("Constants.buttonType=" + Constants.buttonType);
        //保存消失前的按钮类型
        
        let btndata = {};
        switch (type) {
            case Constants.buttonType.ready:
                btndata = {
                    data: {
                        state: "ready",
                        action: [
                            // {
                            //     title: "微信好友",
                            //     color: "green",
                            //     type: "weChatFriend",
                            //     status: "normal",//normal gray light
                            // },
                            {
                                title: "准 备",
                                color: "blue",
                                type: "ready",
                                status: "normal",//normal gray light
                            }
                            // ,
                            // {
                            //     title: "游戏好友",
                            //     color: "yellow",
                            //     type: "gameFriend",
                            //     status: "normal",//normal gray light
                            // },
                        ]
                    }
                };
                break;
            case Constants.buttonType.play:
                btndata = {
                    data: {
                        state: 'play',
                        action: [
                            {
                                title: "不 出",
                                color: 'yellow',
                                type: 'giveUp',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "提 示",
                                color: 'green',
                                type: 'tip',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "出 牌",
                                color: 'blue',
                                type: 'sendCard',
                                status: 'gray',//normal gray light
                            }
                        ]
                    }
                };
                break;
            case Constants.buttonType.yaobuqi:
                btndata = {
                    data: {
                        state: 'yaobuqi',
                        action: [
                            {
                                title: "要不起",
                                color: 'yellow',
                                type: 'yaobuqi',
                                status: 'normal',//normal gray light
                            }
                        ]
                    }
                };
                break;
            
            case Constants.buttonType.sendCard:
                btndata = {
                    data: {
                        state: 'sendCard',
                        action: [
                            {
                                title: "出 牌",
                                color: 'yellow',
                                type: 'sendCard_restart',
                                status: 'gray',//normal gray light
                            }
                        ]
                    }
                };
                break;
            case Constants.buttonType.addTimes:
                btndata = {
                    data: {
                        state: 'addTimes',
                        action: [
                            {
                                title: "加 倍",
                                color: 'yellow',
                                type: 'addTimes',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "不加倍",
                                color: 'blue',
                                type: 'notAddTimes',
                                status: 'normal',//normal gray light
                            },

                        ]
                    }
                };
                break;
            case Constants.buttonType.pull:
                btndata = {

                    data: {
                        state: 'pull',
                        action: [
                            {
                                title: "拉×2",
                                color: 'yellow',
                                type: 'pull',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "不 拉",
                                color: 'blue',
                                type: 'notPull',
                                status: 'normal',//normal gray light
                            },

                        ]
                    }
                };
                break;
            case Constants.buttonType.kick:
                btndata = {
                    data: {
                        state: 'kick',
                        action: [
                            {
                                title: "踢×2",
                                color: 'yellow',
                                type: 'kick',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "不 踢",
                                color: 'blue',
                                type: 'notKick',
                                status: 'normal',//normal gray light
                            },

                        ]
                    }
                };
                break;
            case Constants.buttonType.callPoints:
                btndata = {
                    data: {
                        state: 'callPoints',
                        action: [
                            {
                                title: "不 叫",
                                color: 'yellow',
                                type: 'notCall',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "1 分",
                                color: 'blue',
                                type: '1',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "2 分",
                                color: 'blue',
                                type: '2',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "3 分",
                                color: 'blue',
                                type: '3',
                                status: 'normal',//normal gray light
                            },

                        ]
                    }
                };
                break;
            case Constants.buttonType.landGrab:
                btndata = {
                    data: {
                        state: 'landGrab',
                        action: [
                            {
                                title: "不 抢",
                                color: 'blue',
                                type: 'notCall',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "抢地主",
                                color: 'yellow',
                                type: 'landGrab',
                                status: 'normal',//normal gray light
                            },

                        ]
                    }
                };
                break;
            case Constants.buttonType.landOwner:
                btndata = {
                    data: {
                        state: 'landOwner',
                        action: [
                            {
                                title: "不 叫",
                                color: 'blue',
                                type: 'notCall',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "叫地主",
                                color: 'yellow',
                                type: 'landOwner',
                                status: 'normal',//normal gray light
                            }
                        ]
                    }
                };
                break;
            case Constants.buttonType.grasp:
                btndata = {
                    data: {
                        state: 'grasp',
                        action: [
                            {
                                title: "闷 抓",
                                color: 'yellow',
                                type: 'grasp',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "看 牌",
                                color: 'blue',
                                type: 'lookCards',
                                status: 'normal',//normal gray light
                            },
                        ]
                    }
                };
                break;
            case Constants.buttonType.gsp:
                //抓
                btndata = {
                    data: {
                        state: 'gsp',
                        action: [
                            {
                                title: " 抓 ",
                                color: 'yellow',
                                type: 'gsp',
                                status: 'normal',//normal gray light
                            }
                        ]
                    }
                };
                break;
            case Constants.buttonType.notGsp:
                //抓和不抓
                btndata = {
                    code: 0,
                    data: {
                        state: 'notGsp',
                        action: [
                            {
                                title: " 抓 ",
                                color: 'yellow',
                                type: 'gsp',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "不 抓",
                                color: 'yellow',
                                type: 'notGsp',
                                status: 'normal',//normal gray light
                            }
                        ]
                    }
                };
                break;
            case Constants.buttonType.pour:
                btndata = {
                    data: {
                        state: 'pour',
                        action: [
                            {
                                title: " 倒 ",
                                color: 'yellow',
                                type: 'kick',
                                status: 'normal',//normal gray light
                            }
                        ]
                    }
                };
                break;
            case Constants.buttonType.notPour:
                btndata = {
                    data: {
                        state: 'notPour',
                        action: [
                            {
                                title: " 倒 ",
                                color: 'yellow',
                                type: 'kick',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "不 倒",
                                color: 'blue',
                                type: 'notKick',
                                status: 'normal',//normal gray light
                            },
                        ]
                    }
                };
                break;
            case Constants.buttonType.gameStart:
                btndata = {
                    data: {
                        state: 'showCard',
                        action: [
                            {
                                title: "明牌开始x5",
                                color: 'yellow',
                                type: 'showCard',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "开始游戏",
                                color: 'blue',
                                type: 'gameStart',
                                status: 'normal',//normal gray light
                            },
                        ]
                    }
                };
                break;
            case Constants.buttonType.showCard:
                btndata = {
                    data: {
                        state: 'showCard_2',
                        action: [
                            {
                                title: "明 牌 x5",
                                color: 'yellow',
                                type: 'showCard_2',
                                status: 'normal',//normal gray light
                            }
                        ]
                    }
                };
                break;
            case Constants.buttonType.follow:
                btndata = {
                    data: {
                        state: 'follow',
                        action: [
                            {
                                title: "不 踢",
                                color: 'yellow',
                                type: 'notFollow',
                                status: 'normal',//normal gray light
                            },
                            {
                                title: "跟 踢",
                                color: 'green',
                                type: 'follow',
                                status: 'normal',//normal gray light
                            }
                        ]
                    }
                };
                break;
        }
        return btndata;
    }

});
