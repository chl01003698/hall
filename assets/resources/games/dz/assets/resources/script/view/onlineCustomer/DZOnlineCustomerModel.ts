/*
 * @Author: lijian
 * @Date: 2018-01-16 20:02:42 
 * @Desc: 游戏规则数据
 */


import {HallBaseModel} from "../../../../../../../script/common/HallBaseModel";
import {DZConstant} from "../../common/DZConstant";

export class DZOnlineCustomerModel extends HallBaseModel {
    private static instance: DZOnlineCustomerModel = null;
    static getInstance(): DZOnlineCustomerModel {
        if (this.instance == null) {
            this.instance = new DZOnlineCustomerModel();
        }
        return this.instance;
    }

    inLineKeHu: any =[
        {
            head: '',
            nameDes: '兜兜有糖1',
            id: 10,
            state: DZConstant.kehuState.kehu_game,
        },
        {
            head: '',
            nameDes: '兜兜有糖2',
            id: 11,
            state: DZConstant.kehuState.kehu_free,
        },
        {
            head: '',
            nameDes: '兜兜有糖3',
            id: 12,
            state:DZConstant.kehuState.kehu_outline,
        },
        {
            head: '',
            nameDes: '兜兜有糖4',
            id: 13,
            state: DZConstant.kehuState.kehu_game,
        },
        {
            head: '',
            nameDes: '兜兜有糖5',
            id: 14,
            state: DZConstant.kehuState.kehu_outline,
        },
        {
            head: '',
            nameDes: '兜兜有糖6',
            id: 15,
            state: DZConstant.kehuState.kehu_free,
        },
        ];

    linkKeHu: any =[
        {
            head: '',
            nameDes: '兜兜没糖1',
            id: 110,
            state: DZConstant.kehuState.kehu_game,
        },
        {
            head: '',
            nameDes: '兜兜没糖2',
            id: 111,
            state: DZConstant.kehuState.kehu_free,
        },
        {
            head: '',
            nameDes: '兜兜没糖3',
            id: 112,
            state:DZConstant.kehuState.kehu_outline,
        },
        {
            head: '',
            nameDes: '兜兜没糖4',
            id: 113,
            state: DZConstant.kehuState.kehu_game,
        },
        {
            head: '',
            nameDes: '兜兜没糖5',
            id: 114,
            state: DZConstant.kehuState.kehu_outline,
        },
        {
            head: '',
            nameDes: '兜兜没糖6',
            id: 115,
            state: DZConstant.kehuState.kehu_free,
        },
        ];

    getInlineKeHu () {
        return this.inLineKeHu;
    }

    getLinkKeHu () {
        return this.linkKeHu;
    }
}