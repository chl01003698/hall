import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";
import { SZConstant } from "../../common/SZConstant";
import { h } from "../../../../../../../script/common/H";


export class SZcreateTableMode extends HallBaseModel {
    selectCreateInfo: any;
    createData: any;


    Tempparam:any = 
    {
        "config": {
            "game":"sanzhang",
            "type":"sanzhang",  //类型
            "expendIndex": 0,       //局数
            "join": true,//{ "type": boolean, "default": true, "desc": "是否直接加入房间" }
            "wanfa": []
        },
        "defaultSelect": {

        }
    }

    param:any = 
    {
        "config": {
           
        },
        "defaultSelect": {
            
        }
    }

    private static instance:SZcreateTableMode;

    static getInstance():SZcreateTableMode{
        if (!this.instance){
            this.instance = new SZcreateTableMode();
        }
        return this.instance;
    }

    setCreateData(data: any) {
        this.createData = data;
        //this.setCreateDataDefaultSelect();
    }

    getCreateData(type:any){
        h.log.debug("this.createData=" + this.createData);
        let createInfo = this.createData.filter(function (element) {
            return element.type == type;
        });
        return createInfo[0];
    }


    getCreateInfoArray(type:any) {
        this.selectCreateInfo = this.getCreateData(type);
       
        this.param = JSON.parse(JSON.stringify(this.Tempparam));
        //this.setConfigType(this.selectCreateInfo.type);
        cc.log('getCreateInfoArray' + JSON.stringify(this.selectCreateInfo));
        for(let i=0;i<this.selectCreateInfo.playType.length;i++) {
            let item = this.selectCreateInfo.playType[i];
            var array = [];
            for(let j = 0;j < item.defaultSelect.length;j++) {
                array.push(item.selectItem[item.defaultSelect[j]].value);
            }
            this.setConfigItem(item.name,array);
            //this.setDefaultItem(item.name,item.defaultSelect);
        }
        cc.log('onClickBegin + ' + "   " + JSON.stringify(this.getConfig()));
        return this.selectCreateInfo;
    }

    setConfigType(type) {
        this.param.config.wanfa[0] = type;
    }

    setConfigItem(key,value) {
        if(key == "expendIndex" || key == "payway") {
            this.param.config[key] = value[0];
        }else {
            this.param.config[key] = value;
        }
        cc.log('setConfigItem' + JSON.stringify(this.param.config));
    }

    setDefaultItem(key,value) {
        this.param.defaultSelect[key] = value;
        cc.log('setDefaultItem' + JSON.stringify(this.param.defaultSelect));
    }

    getConfig() {
        return this.param.config;
    }


    getBeginConfig() {
        if(this.param.config.commonSetting) {
            for(let i=0;i<this.param.config.commonSetting.length;i++) {
                this.param.config[this.param.config.commonSetting[i]] = [1];
            }
            delete this.param.config.commonSetting;
        }
        if(this.param.config.dilongselect) {
            for(let i=0;i<this.param.config.dilongselect.length;i++) {
                this.param.config[this.param.config.dilongselect[i]] = [1];
            }
            delete this.param.config.dilongselect;
        }
        
        if(this.param.config.gexingSetting) {
            for(let i=0;i<this.param.config.gexingSetting.length;i++) {
                this.param.config[this.param.config.gexingSetting[i]] = [1];
            }
        }
        delete this.param.config.gexingSetting;
        return this.param.config;
    }

    setDefaultArray(name,type,defaultSelect) {
        cc.log('setDefaultArray   ' + name + "   " + type + "   " + defaultSelect);

        for(let i= 0; i <this.selectCreateInfo.length; i++) {
            if(this.selectCreateInfo[i].type == type) {
                for(let j = 0; j < this.selectCreateInfo[i].playType.length;j++) {
                    if(this.selectCreateInfo[i].playType[j].name == name) {
                        this.selectCreateInfo[i].playType[j].defaultSelect = defaultSelect;
                    }
                }
            }
        }
    }
 }