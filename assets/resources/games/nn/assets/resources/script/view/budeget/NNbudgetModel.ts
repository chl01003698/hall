import { HallBaseModel } from "../../../../../../../script/common/HallBaseModel";

export class NNbudgetModel extends HallBaseModel {
    private static instance:NNbudgetModel;

    static getInstance():NNbudgetModel{
        if (!this.instance){
            this.instance = new NNbudgetModel();
        }
        return this.instance;
    }
 }