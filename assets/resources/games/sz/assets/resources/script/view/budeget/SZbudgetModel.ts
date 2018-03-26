import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";

export class SZbudgetModel extends HallBaseModel {
    private static instance:SZbudgetModel;

    static getInstance():SZbudgetModel{
        if (!this.instance){
            this.instance = new SZbudgetModel();
        }
        return this.instance;
    }
 }