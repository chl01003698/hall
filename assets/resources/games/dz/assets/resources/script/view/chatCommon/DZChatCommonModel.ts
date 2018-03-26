/*
 * @Author: lijian
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 游戏规则数据
 */


import {HallBaseModel} from "../../../../../../../script/common/HallBaseModel";
import {DZGameUtil} from "../../common/DZGameUtil";

export class DZChatCommonModel extends HallBaseModel {
    private static instance: DZChatCommonModel = null;
    static getInstance(): DZChatCommonModel {
        if (this.instance == null) {
            this.instance = new DZChatCommonModel();
        }
        return this.instance;
    }

    chatMainCommonList:any = [
        {
            index:1,
            speek: '快点吧，哥都睡了一觉了',
        },
        {
            index:2,
            speek: '我了个擦，实在太厉害了你',
        },
        {
            index:3,
            speek: '和你合作就是爽快',
        },
        {
            index:4,
            speek: '哎，这牌整个就是一悲剧啊',
        },
        {
            index:5,
            speek: '今天的炸弹不要钱的吗？',
        },
        {
            index:6,
            speek: '别吵，让我想想',
        },
        {
            index:7,
            speek: '哎，这队友也太不给力了吧',
        },
        {
            index:8,
            speek: '吵什么吵，多大个事',
        },
        {
            index:9,
            speek: '出来混迟早是要还的',
        },
        {
            index:10,
            speek: '给个出牌的机会吧',
        },
        ];
    chatWonmenCommonList: any =[
        {
            index:12,
            speek: '快点吧，我等的花都谢了',
        },
        {
            index:13,
            speek: '你这么厉害，你家里人知道吗？',
        },
        {
            index:14,
            speek: '和你合作真是太愉快了',
        },
        {
            index:15,
            speek: '哎，我今天怎么这么倒霉啊',
        },
        {
            index:16,
            speek: '你们炸死老娘算了',
        },
        {
            index:17,
            speek: '该怎么办呢？怎么办呢',
        },
        {
            index:18,
            speek: '哎，不怕神一样的对手，就怕猪一样的队友',

        },
        {
            index:19,
            speek: '我就不懂了，到底有什么好吵的',
        },
        {
            index:20,
            speek: '哼，欠老娘的统统要换回来',
        },
        {
            index:21,
            speek: '不许欺负我',
        },
        ];
    chatLookList: any =[
        {
            index: 0,
            lookName: 'anger',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 1,
            lookName: 'clap',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 2,
            lookName: 'cry',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 3,
            lookName: 'dizzy',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 4,
            lookName: 'goat',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 5,
            lookName: 'proud',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 6,
            lookName: 'smile',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 7,
            lookName: 'spit',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        {
            index: 8,
            lookName: 'sweat',
            atlas:'res/images/atlas/emoji',
            frameRate:5,
        },
        ];

    getChatLook() {
        return this.chatLookList;
    }

    getMainChatCommon() {
        return this.chatMainCommonList;
    }

    getWonmenChatCommon() {
        return this.chatWonmenCommonList;
    }

    //根据id获取常用聊天数据
    getCommonById(id) {
        var commonData = null;
        if(id > 10){
            commonData = DZGameUtil.getDataById(this.chatWonmenCommonList,id);
        }else{
            commonData = DZGameUtil.getDataById(this.chatMainCommonList,id);
        }
        return commonData;
    }
    //根据id获取表情数据
    getLookById(id) {
        var lookData = DZGameUtil.getDataById(this.chatLookList,id);
        return lookData;
    }
}