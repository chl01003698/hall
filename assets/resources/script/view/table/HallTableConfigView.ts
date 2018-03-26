/*
 * @Author: baizhanxiao 
 * @Date: 2018-02-26 19:22:43 
 * @Desc: 文件描述
 */

import { HallBaseView } from "../../common/HallBaseView";
import { HallTableConfigItem } from "./HallTableConfigItem";
import { h } from "../../common/H";
import { HallUtil } from "../../util/HallUtil";
import { HallStringUtil } from "../../util/HallStringUtil";

export class HallTableConfigView extends HallBaseView {
    private config: any;
    private configScrollview: cc.Node;
    private lineSpace: number = 10;
    private lineHeight: number = 50;
    private nodeDatas: any[] = [];
    private curColumn: number = -1;
    private curRow: number = -1;
    private nodeDataMap: any = {};

    constructor(config: any) {
        super();
        this.config = config;
        this.setBindDatas({
            scrollview: { varName: "configScrollview" }
        });
        this.setSwallowTouch(false);
        this.setPrefab("res/prefab/createTable/config");
    }

    onPrefabLoaded() {
        for (let i = 0; i < this.config.children.length; ++i) {
            this.createNode(this.config.children[i]);
        }
        h.log.debug("haha====", this.nodeDatas);
        this.addNodes();
        this.refreshConditionNodes();
    }

    addNodes() {
        let height = this.getHeight();
        for (let i = 0; i < this.nodeDatas.length; ++i) {
            for (let j = 0; j < this.config.column; ++j) {
                let nodeData = this.nodeDatas[i][j];
                if (nodeData) {
                    this.configScrollview.getComponent(cc.ScrollView).content.addChild(nodeData.node);
                    nodeData.node.x = this.config.colWidth * j + nodeData.node.width * 0.5;
                    nodeData.node.y = height - this.config.colHeight * (i + 1) + nodeData.node.height * 0.5;
                }
            }
        }
        this.configScrollview.getComponent(cc.ScrollView).content.height = height;
        this.configScrollview.getComponent(cc.ScrollView).scrollToTopLeft();
    }

    createNode(data: any) {
        switch (data.type) {
            case "radio":
                for (let i = 0; i < data.options.length; ++i) {
                    let optionData = data.options[i];
                    let nodeData = {
                        optionData: optionData,
                        data: data
                    }
                    this.loadNodeData(nodeData);
                }
                break;
            case "check":
                for (let i = 0; i < data.options.length; ++i) {
                    let optionData = data.options[i];
                    let nodeData = {
                        optionData: optionData,
                        data: data,
                    }
                    this.loadNodeData(nodeData);
                }
                break;
            case "group":
                let nodeData = {
                    data: data
                }
                this.loadNodeData(nodeData);
                for (let i = 0; i < data.children.length; ++i) {
                    let childData = data.children[i];
                    this.createNode(childData);
                }
                break;
        }
    }

    loadNodeData(nodeData) {
        nodeData.node = new HallTableConfigItem(nodeData);
        nodeData.node.setCallback(this.itemCallback.bind(this));
        if (nodeData.data.type == "group") {
            ++this.curRow;
            this.curColumn = 0;
        } else if (this.curColumn >= this.config.column - 1) {
            ++this.curRow;
            this.curColumn = 1;
        } else if (nodeData.optionData.isNewLine) {
            ++this.curRow;
            this.curColumn = 1;
        } else {
            ++this.curColumn;
        }
        this.nodeDatas[this.curRow] = this.nodeDatas[this.curRow] || {};
        this.nodeDatas[this.curRow][this.curColumn] = nodeData;
        if (nodeData.optionData && nodeData.optionData.name) {
            this.nodeDataMap[nodeData.optionData.name] = nodeData;
        }
    }

    get

    getHeight() {
        return this.config.colHeight * this.nodeDatas.length;
    }

    getNodeData(name) {
        return this.nodeDataMap[name];
    }

    itemCallback(event, data) {
        h.log.debug("evet22", event, data);
        if (!data.node.isEnabled()) {
            return;
        }
        switch (data.data.type) {
            case "radio":
                for (let i = 0; i < data.data.options.length; ++i) {
                    let optionData = data.data.options[i];
                    let nodeData = this.getNodeData(optionData.name);
                    nodeData.node.setSelected(false);
                }
                data.node.setSelected(true);
                break;
            case "check":
                let isSelected = data.node.isSelected();
                if (data.data.limit <= 1) {
                    for (let i = 0; i < data.data.options.length; ++i) {
                        let optionData = data.data.options[i];
                        let nodeData = this.getNodeData(optionData.name);
                        nodeData.node.setSelected(false);
                    }
                }
                data.node.setSelected(!isSelected);
                break;
        }
        this.refreshConditionNodes();
    }

    refreshConditionNodes() {
        for (let name in this.nodeDataMap) {
            let nodeData = this.getNodeData(name);
            if (nodeData.optionData.condition) {
                let names = nodeData.optionData.condition.match(/[A-Za-z0-9]+/g);
                let codeStr = "";
                for (let i in names) {
                    let nameTemp = names[i];
                    let nodeDataTemp = this.getNodeData(nameTemp)
                    codeStr += HallStringUtil.format("let {0} = {1};\n", nameTemp, nodeDataTemp.optionData.selected || false);
                }
                codeStr += nodeData.optionData.condition
                let ret = eval(codeStr);
                nodeData.node.setEnabled(ret);
            }
        }
    }
}
