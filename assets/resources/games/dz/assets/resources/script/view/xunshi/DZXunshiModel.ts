/*
 * @Author: baizhanxiao 
 * @Date: 2018-01-22 22:09:57 
 * @Desc: 文件描述
 */

import { HallBaseView } from "../../../../../../../script/common/HallBaseView";

export class DZXunshiModel extends HallBaseView {
    private static instance:DZXunshiModel = null;

    static getInstance(){
        if(!this.instance){
            this.instance = new DZXunshiModel();
        }
        return this.instance;
    }
}