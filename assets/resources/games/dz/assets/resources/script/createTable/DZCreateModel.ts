
import { HallBaseModel } from "../../../../../../script/common/HallBaseModel";
import { DZConstant } from "../common/DZConstant";
import { h } from "../../../../../../script/common/H";
import { DZGameUtil } from "../common/DZGameUtil";



export class CreateModel extends HallBaseModel {
    selectCreateInfo: any;
    create3Info: any;
    create4Info: any;
    create2Info: any;
    private static instance: CreateModel = null;
    private createData: any = null;
    createInfoArray: any = [];
    index: number = 0;

    Tempparam: any =
        {
            "config": {
                "game": DZConstant.gameName,
                "type": "",  //类型
                "expendIndex": 0,       //局数
                "join": true//{ "type": boolean, "default": true, "desc": "是否直接加入房间" }
            },
            "defaultSelect": {

            }
        }

    param: any =
        {
            "config": {

            },
            "defaultSelect": {

            }
        }

    info: any = {

    }

    setIndexs(index) {
        this.index = index;
    }

    // select: 

    getLocalByType(type) {
        let localValue: any = h.storage.getItem(type);
        if (!localValue) {
            localValue = "{}";
        }
        cc.log('setLocalInfo  1111   ' + localValue + "  type   " + type);
        return JSON.parse(localValue);
    }

    setLocalInfo() {
        //保存相对type的数据
        cc.log("setLocalInfo" + JSON.stringify(this.param.defaultSelect) + "TYPE  " + this.param.config.type);
        h.storage.setItem(this.param.config.type, JSON.stringify(this.param.defaultSelect));
    }

    getConfig() {
        return this.param.config;
    }

    getDefaultSelect() {
        return this.param.defaultSelect;
    }


    setConfigType(type) {
        this.param.config.type = type;
    }

    setDefaultItem(key, value) {
        this.param.defaultSelect[key] = value;
        cc.log('setDefaultItem' + JSON.stringify(this.param.defaultSelect));
    }

    setConfigItem(key, value) {
        if (key == "expendIndex" || key == "payway") {
            this.param.config[key] = value[0];
        } else {
            this.param.config[key] = value;
        }
        cc.log('setConfigItem' + JSON.stringify(this.param.config));
    }

    static getInstance(): CreateModel {
        if (this.instance == null) {
            this.instance = new CreateModel();
        }
        return this.instance;
    }

    getCreateData(type: string) {
        h.log.debug("this.createData=" + this.createData);
        let createInfo = this.createData.filter(function (element) {
            return element.type == type;
        });
        return createInfo;
    }

    setCreateData(data: any) {
        this.createData = data;
        this.setCreateDataDefaultSelect();
        //分出二人，三人，四人
        this.create2Info = this.createData.filter(function (element) {
            return element.kindType == DZConstant.gameTypeState.ddz2people;
        })

        this.create3Info = this.createData.filter(function (element) {
            return element.kindType == DZConstant.gameTypeState.ddz3people;;
        })

        this.create4Info = this.createData.filter(function (element) {
            return element.kindType == DZConstant.gameTypeState.ddz4people;;;
        })

        //在这块初始化值
        cc.log('setCreateData:' + JSON.stringify(this.createData));
    }

    setCreateDataDefaultSelect() {
        cc.log('setCreateDataDefaultSelect' + JSON.stringify(this.createData))
        for (let i = 0; i < this.createData.length; i++) {
            let defaultSelect = this.getLocalByType(this.createData[i].type);
            for (let j = 0; j < this.createData[i].playType.length; j++) {
                let name = this.createData[i].playType[j].name;
                if (defaultSelect[name]) {
                    this.createData[i].playType[j].defaultSelect = defaultSelect[name];
                }
            }
        }
    }


    getCreateInfoArray(type: string) {
        if (type == DZConstant.gameTypeState.ddz2people) {
            this.selectCreateInfo = this.create2Info;
        } else if (type == DZConstant.gameTypeState.ddz3people) {
            this.selectCreateInfo = this.create3Info;
        } else {
            this.selectCreateInfo = this.create4Info;
        }
        this.param = JSON.parse(JSON.stringify(this.Tempparam));
        this.setConfigType(this.selectCreateInfo[this.index].type);
        cc.log('getCreateInfoArray' + JSON.stringify(this.selectCreateInfo[this.index]));
        for (let i = 0; i < this.selectCreateInfo[this.index].playType.length; i++) {
            let item = this.selectCreateInfo[this.index].playType[i];
            var array = [];
            for (let j = 0; j < item.defaultSelect.length; j++) {
                array.push(item.selectItem[item.defaultSelect[j]].value);
            }
            this.setConfigItem(item.name, array);
            this.setDefaultItem(item.name, item.defaultSelect);
        }
        cc.log('onClickBegin + ' + "   " + JSON.stringify(this.getConfig()));
        return this.selectCreateInfo[this.index];
    }


    setIndex(index: number) {
        this.index = index;
    }

    getIndex() {
        return this.index;
    }

    getAllPlayType(type: string) {
        let createInfo = this.createData.filter(function (element) {
            return element.kindType == type;
        })

        var playNameArray = [];
        for (var i = 0; i < createInfo.length; i++) {
            playNameArray.push(createInfo[i].name);
        }
        return playNameArray;
    }


    getWanfaConfig(type) {
        let typeConifg = this.createData.filter(function (item) {
            return item.type == type;
        })
        return typeConifg;
    }

    getDesByData(value) {

    }

    setDefaultArray(name, type, defaultSelect) {
        cc.log('setDefaultArray   ' + name + "   " + type + "   " + defaultSelect);

        for (let i = 0; i < this.selectCreateInfo.length; i++) {
            if (this.selectCreateInfo[i].type == type) {
                for (let j = 0; j < this.selectCreateInfo[i].playType.length; j++) {
                    if (this.selectCreateInfo[i].playType[j].name == name) {
                        this.selectCreateInfo[i].playType[j].defaultSelect = defaultSelect;
                    }
                }
            }
        }
    }



}