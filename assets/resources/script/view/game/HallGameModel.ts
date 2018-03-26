/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-26 13:16:16 
 * @Desc: 文件描述
 */

import { HallBaseModel } from "../../common/HallBaseModel";
import { HallConstant } from "../hall/HallConstant";

export class HallGameModel extends HallBaseModel {
    private static instance: HallGameModel = null;
    private status:string = HallConstant.GameStatus.free;

    static getInstance(): HallGameModel {
        if (this.instance == null) {
            this.instance = new HallGameModel();
        }
        return this.instance;
    }

    setStatus(status:string) {
        this.status = status;
    }

    getStatus():string {
        return this.status;
    }
}

