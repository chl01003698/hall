/*
 * @Author= wang jun wei 
 * @Date= 2018-01-20 11=45=14 
 * @Last Modified by= wang jun wei
 * @Last Modified time= 2018-01-20 14=43=00
 */

export module DZConstant {

    export let gameName:string = "doudizhu";
    export let resultName:string = "result";
    export let ruleName:string = "dz_rule_view";

    export enum reqType{
        showCards = 1,//刚进入游戏 点明牌
        startGame = 2,//开始
        lookCards = 3//发牌后点击明牌
    }

    export enum respCode{
        not_accord_rule = 4026,//卡牌不符合标准
        no_hand_poker = 4025,//用户手牌已出完
        xingpai_error = 4027//行牌错误
    }
    
    export enum jiesan {
        waiting = 0,
        agreed = 1,
        refused = 2,
    }
    // export enum PlayType {
    //     common = "common",                 // 普通馆员
    //     correlation = "correlation",       // 已经关联的馆员
    //     curator = "curator",               // 馆长
    //     proxy = "proxy",                   // 代理
    // }
    export enum shareWeb {
        ReciveFriend = 0,//邀请好友
        SendRedPackge = 1,//发红包
        GiveJingDong = 2,//送京东卡
    }

    export enum sexChatStr {
        MAN = '_M',
        WOMAN = '_W',
    }

    export enum webType{
        service = '客服',
        rule = '规则',
        backStage = '后台管理',
        record = '游戏记录',
        message = '消息',
        active = '活动',
        agent = '代理申请',
        curator = '我要当馆长',
        statement = '声明',
    }

    export enum chatType {
        sysVoice = 0,        // 系统语音
        expression = 1,      // 普通表情
        skill = 2,            // 魔法表情
        voice = 3             // 语音
    }
    //魔法表情对应索引
    export enum magicType{
        good = 0,//赞
        shoes = 1,//鞋子
        tomato = 2,//西红柿
        cup = 3,//茶杯
        flower = 4,//花
    }

    export enum userState {
        offline = 'offline',
        online = 'online',
        waiting = 'waiting',
        gaming = 'gaming',
    }

    export enum friendState {
        allowed = 'allowed',//已接受
        invite = 'invite',//邀请中的
    }
    export enum cardType {
        desk = 'desk',//桌卡
    }


    export const playSpeekNode = {
        speekNode: false,
        isBomb: false,
    }

    export enum cardState {
        common = 'common',//自由的
        correlation = 'correlation ',//已关联的卡
        activity = 'activity ',//活动卡
    }


    // 支付
    export enum payState {
        paystate_onload = 'paystate_onload', // 加载
        paystate_start = 'paystate_start', // 启动
    };

    // 巡视
    export enum xunShiState {
        xunshistate_onload = 'xunshistate_onload', //加载
        xunshistate_start = 'xunshistate_start',//启动
        xunshistate_success = 'xunshistate_success', // 请求数据成功
        xunshistate_error = 'xunshistate_error', // 请求数据失败
    }

    // 战绩
    export enum zhanJiState {
        zhanji_onload = 'zhanji_onload', //加载
        zhanji_start = 'zhanji_start',//启动
        zhanjireq_success = 'zhanjireq_success', // 请求数据成功
        zhanjireq_error = 'zhanjireq_error', // 请求数据失败
    }

    export enum shopState {
        shop_onload = 'shop_onload', //加载
        shop_start = 'shop_start',//启动
    }

    // 输入邀请码
    export enum shuRuYaoQingMaState {
        shuruyaoqingmastate_load = 'shuruyaoqingmastate_load', // 加载
        shuruyaoqingmastate_start = 'shuruyaoqingmastate_start', // 启动
    }

    // 邀好友有礼
    export enum yaoHaoYouYouLiState {
        yaohaoyouyouli_onload = 'yaohaoyouyouli_onload', // 加载
        yaohaoyouyouli_start = 'yaohaoyouyouli_start', // 启动
    }

    // 发红包
    export enum faHongBaoState {
        fahongbao_onload = 'fahongbao_onload', // 加载
        fahongbao_start = 'fahongbao_start', // 启动
        fahongbao_reqdatasuccess = 'fahongbao_reqdatasuccess', // 请求数据成功
        fahongbao_reqdataerror = 'fahongbao_reqdataerror', // 请求数据失败
    }

    // 进桌
    export enum jinZhuoState {
        jinzhuo_onload = 'jinzhuo_onload', // 加载
        jinzhuo_start = 'jinzhuo_start', // 启动
    }

    //关联棋牌馆
    export enum guanLianQiPaiState {
        guanlianqipai_onload = 'guanlianqipai_onload', //加载
        guanlianqipai_start = 'guanlianqipai_start',//启动
        guanyuan_guanlianqipai_onload = 'guanyuan_guanlianqipai_onload',//馆员大厅的关联棋牌室
        guanlianqipai_reqdatasuccess = 'guanlianqipai_reqdatasuccess', // 请求数据成功
        guanlianqipai_reqdataerror = 'guanlianqipai_reqdataerror', // 请求数据失败
    }
    //搜索棋牌室_搜索
    export enum souSuoQiPaiState {
        sousuoqipai_onload = 'sousuoqipai_onload', //加载
        sousuoqipai_start = 'sousuoqipai_start',//启动
        sousuoqipai_update = 'sousuoqipai_update',//更新

    }
    //搜索关联
    export enum souSuoGuanLianState {
        sousuoguanlian_onload = 'sousuoguanlian_onload', //加载
        sousuoguanlian_start = 'sousuoguanlian_start',//启动
    }
    //搜索棋牌室主界面
    export enum souSuoMainState {
        sousuomain_onload = 'sousuomain_onload', //加载
        sousuomain_start = 'sousuomain_start',//启动
        sousuomain_update = 'sousuomain_update',//更新数据
    }
    //棋牌室客户
    export enum qiPaiShiKeHuState {
        qipaishikehu_onload = 'qipaishikehu_onload', //加载
        qipaishikehu_start = 'qipaishikehu_start',//启动
        qipaishikehu_update = 'qipaishikehu_update',//启动
    }
    //牌桌列表
    export enum paiZhuoState {
        paizhuo_update = 'paizhuo_update',
    }

    //战报总
    export enum zhanBaoZongState {
        zhanbaozong_onload = 'zhanbaozong_onload', //加载
        zhanbaozong_start = 'zhanbaozong_start', //启动
        zhanbaozong_update = 'zhanbaozong_update',//启动
    }
    //聊天常用语
    export enum chatCommonState {
        chatCommon_onload = 'chatCommon_onload', //加载
        chatCommon_start = 'chatCommon_start', //启动
        chatCommon_update = 'chatCommon_update',//更新数据
    }
    //我要当馆长
    export enum beGuanZhangState {
        beguanzhang_onload = 'beguanzhang_onload', //加载
        beguanzhang_start = 'beguanzhang_start',//启动
    }

    //馆员界面联系馆长
    export enum lianXiGuanZhangState {
        lianxiguanzhang_onload = 'lianxiguanzhang_onload', //加载
        lianxiguanzhang_start = 'lianxiguanzhang_start',//启动
    }

    //返回按钮
    export enum backState {
        default_back = 'default_back', //默认大厅的返回按钮
        guanyuan_back = 'guanyuan_back',//馆员大厅的返回按钮
        guanzhang_back = 'guanzhang_back',//馆长大厅的返回按钮
        game_ddz_back = 'game_ddz_back',//斗地主场景的返回按钮
    }

    export enum createTableState {
        create_table_onload = 'create_table_onload', //加载三人正常
        create_table_start = 'create_table_start',//启动

        create_table_onload_spe = 'create_table_onload_spe', //加载二人或四人
        create_table_start_siren = 'create_table_start_siren',//启动
        create_table_start_liangren = 'create_table_start_liangren',//启动

        create_table_success = 'create_table_success',//短链数据成功
        create_table_defeat = 'create_table_defeat',//数据失败

        create_put_success = 'create_put_success',//发送创桌请求成功
        create_put_defeat = 'create_put_defeat',//发送创桌请求成功失败

        create_room_success = 'create_room_success',//发送创建桌子长链成功
        create_room_fail = 'create_room_fail',//发送创建桌子长链失败
        create_room_success_return = 'create_room_success_return',//创建桌子长链成功返回数据通知mediator

        join_room_success = 'join_room_success',//发送加入桌子长链成功
        join_room_fail = 'join_room_fail',//发送加入桌子长链失败
        join_room_success_return = 'create_room_success_return',//加入桌子长链成功返回数据通知mediator

        already_in_table_enter = 'already_in_table_enter',//已经在桌子里
    }

    // 游戏中用户信息
    export enum gameUserInfoState {
        gameuserinfostate_onload = 'gameuserinfostate_onload',
        gameuserinfostate_start = 'gameuserinfostate_start',
    }

    export enum pesonalDataState {
        pesonal_onload = 'pesonal_onload', //加载
        pesonal_start = 'pesonal_start',//启动
        pesonal_update = 'pesonal_update',//刷新
    }

    export enum playGuiZeState {
        playGuiZe_onload = 'playGuiZe_onload', //加载
        playGuiZe_start = 'playGuiZe_start',//启动
    }

    export enum settingState {
        setting_onload = 'setting_onload', //加载
        setting_start = 'setting_start',//启动
        setting_update = 'setting_update',//刷新
    }

    export enum BindPhoneState {
        bindphone_onload = 'bindphone_onload', //加载
        bindphone_start = 'bindphone_start',//启动
        bindphone_getcode_sus = 'bindphone_getcode_sus',
        bindphone_getcode_defeat = 'bindphone_getcode_defeat',

        bindphone_putcode_sus = 'bindphone_putcode_sus',
        bindphone_putcode_defeat = 'bindphone_putcode_defeat',
    }

    export enum RealAutoState {
        realauto_onload = 'realauto_onload', //加载
        realauto_start = 'realauto_start',//启动

        realauto_put_success = 'realauto_put_success',
        realauto_put_defeate = 'realauto_put_defeate'
    }

    export enum FriendState {
        friend_onload = 'friend_onload', //加载
        friend_start = 'friend_start',//启动

        friend_update = 'friend_update',//刷新
        friend_update_new = 'friend_update_new',//新的好友刷新

        friend_get_success = 'friend_get_success',//数据成功
        friend_get_defeat = 'friend_get_defeat',//数据失败

        friend_put_success = 'friend_put_success',//数据成功
        friend_put_defeat = 'friend_put_defeat',//数据失败
    }

    export enum shopState2 {
        shop2_onload = 'shop2_onload', //加载
        shop2_start = 'shop2_start',//启动
    }

    export enum HorseState {
        housestate_onload = 'housestate_onload', //加载
        housestate_start = 'housestate_start',//启动
        housestate_success = 'housestate_success',//数据成功
        housestate_defeat = 'housestate_defeat',//数据失败
    }

    export enum chatInfoState {
        chatCommon = 'chatCommon',//常用语
        chatLook = 'chatLook',//表情
    }

    export enum utilNetError {
        errCode = "9001",
        error = "net error",
        errMsg = "网络异常，服务访问失败",

    }

    export enum utilNetPutSccess {
        code = "0",
        message = "更新数据成功",


    }

    //区分哪一个调用的 WholeMediator
    export enum ClickType {
        huodong = 'huodong', //活动
        xiaoxi = 'xiaoxi',//消息
        guize = 'guize',//规则
        kefu = 'kefu', //客服
        yaoqinghaoyou = 'yaoqinghaoyou', //邀请好友
        dailishenqing = 'dailishenqing',//代理申请
        guanlianqipaishi = 'guanlianqipaishi',//关联棋牌室
        woyaodangguanzhang = 'woyaodangguanzhang',//我要当馆长
        yingsanzhang = 'yingsanzhang',//赢三张
        majiang = 'majiang',//麻将
        houtaiguanli = 'houtaiguanli',//后台管理
        shengming = 'shengming', // 369声明

        doudizhu2people = 'doudizhu2people',
        doudizhu4people = 'doudizhu4people'
    }
    //统一mediator
    export enum wholeTypeState {
        whole_onload = 'whole_onload', //加载
        whole_start = 'whole_start',//启动
    }
    // 推广分享
    export enum generalizeShareState {
        generalize_share_onload = 'generalize_share_onload', // 加载
        generalize_share_start = 'generalize_share_start', // 启动
    }
    //排行筛选
    export enum rankState {
        rank_renqi = 'rank_renqi',//人气排行
        rank_redu = 'rank_redu',//热度排行
        rank_tuijian = 'rank_tuijian',//推荐排行
    }
    // 已邀好友
    export enum invitedFriendsState {
        invited_friends_onload = 'invited_friends_onload', // 加载
        invited_friends_start = 'invited_friends_start', // 启动
        invited_get_success = 'invited_get_success',//数据成功
        invited_get_defeat = 'invited_get_defeat',//数据失败
    }
    //客户状态
    export enum kehuState {
        kehu_game = 'kehu_game',
        kehu_free = 'kehu_free',
        kehu_outline = 'kehu_outline',
    }
    //在线好友
    export enum onLineFriend {
        onLineFriend_onload = 'onLineFriend_onload', //加载
        onLineFriend_start = 'onLineFriend_start',//启动
        onLineFriend_update = 'onLineFriend_update',//启动
    }
    //查看牌桌
    export enum lookPaiZhuo {
        lookPaiZhuo_onload = 'lookPaiZhuo_onload',
        lookPaiZhuo_start = 'lookPaiZhuo_start',
    }
    //试玩
    export enum shiWan {
        shiWan_onload = 'shiWan_onload',
        shiWan_start = 'shiWan_start',
    }
    //送京东卡
    export enum jingDongKa {
        jingDongKa_onload = 'jingDongKa_onload',
        jingDongKa_start = 'jingDongKa_start',
        jingDongKa_sucess = 'jingDongKa_sucess',
    }
    //邀请好友状态
    export enum inviteFriendState {
        onRecive = 0,//已接收
        invite = 1,//邀请
        invited = 2,//已邀请
        gaming = 3, //游戏中
    }
    //0 黑  1 红桃  2 梅花  3 方块  4 小/大王
    export const poker = [
        "03", "13", "23", "33",   //3
        "04", "14", "24", "34",  //4
        "05", "15", "25", "35",  //5
        "06", "16", "26", "36",  //6
        "07", "17", "27", "37",  //7
        "08", "18", "28", "38",  //8
        "09", "19", "29", "39",  //9
        "00", "10", "20", "30",  //10
        "0J", "1J", "2J", "3J",  //J
        "0Q", "1Q", "2Q", "3Q",  //Q
        "0K", "1K", "2K", "3K",  //K
        "0A", "1A", "2A", "3A",  //A
        "02", "12", "22", "32",   //2
        "4X", "4Y"        //小王/大王
    ];
    // 专门排序的一个数组  0 黑  1 红桃  2 梅花  3 方块  4 小/大王从大到小排
    export const pokerSort = [
        "4Y", "4X",
        "02", "12", "22", "32",
        "0A", "1A", "2A", "3A",
        "0K", "1K", "2K", "3K",
        "0Q", "1Q", "2Q", "3Q",
        "0J", "1J", "2J", "3J",
        "00", "10", "20", "30",
        "09", "19", "29", "39",
        "08", "18", "28", "38",
        "07", "17", "27", "37",
        "06", "16", "26", "36",
        "05", "15", "25", "35",
        "04", "14", "24", "34",
        "03", "13", "23", "33",];

    //牌的花色黑桃，红桃，梅花，方片，大小王
    export enum pokerColor {
        spade = 0,
        hearts = 1,
        club = 2,
        diamond = 3,
        joker = 4
    }

    //大小王
    export enum joker {
        bigJoker = 'Y',
        smallJoker = 'X',
    }

    //每张牌之间的间距，根据玩法定
    export enum pokerOffset {
        ddz3People = 42,//50
        ddz4People = 36,
    }
    // 单局战报
    export enum battleReportState {
        battle_report_onload = 'battle_report_onload', // 加载
        battle_report_start = 'battle_report_start', // 启动
    }

    //更新桌卡
    export enum updateCardState {
        updateCuratorCard = 'updateCuratorCard',
        updateCard = 'updateCard',
    }

    //座位id
    export enum seatId {
        bottomSeat = 0,
        rightSeat = 1,
        leftSeat = 2,
        upSeat = 3,
    }

    //不同的地方牌的大小
    export enum scaleType {
        discardPoker = 0.65,      //弃牌区牌的大小
        four_discardPoker = 0.5,      //4人弃牌区牌的大小
        budgetScalePoker = 0.47, //
    }

    //接收的数据类型
    export enum dataType {
        receive = 'receive',//收数据
        send = 'send',//发送数据
        online = 'online',//好友上线
        offline = 'offline',//好友下线
        join = 'join',//加入房间
        ready = 'ready',//准备
        sendCard = 'sendCard',//发牌
        chooseLord = 'chooseLord',//叫地主 轮到自己叫不叫地主 给玩家推送按钮 根据服务器返回的信息显示按钮
        lordChoosed = 'lordChoosed',//广播玩家状态 其它玩家选择地主情况
        identity = 'identity',//确定地主
        flow_bureau = 'flow_bureau',//流局
        start = 'start',//游戏开始 广播谁先出牌
        victory = 'victory',//推送胜利消息
        result = 'result',//结算
        play = 'play', //广播玩家出的牌
        brightCard = 'brightCard',//明牌按钮
        lookCard = "lookCard",//明牌
        kickPull = 'kickPull',//踢拉
        totalResult = 'totalResult',//总结算
        totalMultiple = 'totalMultiple',//总倍数
        quitGame = 'quitGame',//退出广播
        dissolutionRoom = 'dissolutionRoom',//解散房间
        reconnection = 'reconnection',//断线重连
        vote = 'vote',//
        chat = 'chat',//
        //新协议字段 
        enter = 'enter',//创建和加入房间
        otherJoin = 'otherJoin',//别人加入房间
        ddzPrefabLoadOk = 'ddzPrefabLoadOk',//加载完成
        btnCall = 'btnCall',//按钮统一响应事件
        addBtn = 'addBtn',//添加行牌按钮
    }

    //按钮颜色
    export enum buttonBgColor {
        blue = 'blue',
        yellow = 'yellow',
        purple = 'purple',
        green = 'green',
        gray = 'gray',
    }

    //按钮状态
    export enum buttonStatus {
        normal = 'normal', //正常
        gray = 'gray', //禁用
        highLight = 'highLight',//高亮
    }

    //native数据来源
    export const sender = {
        sdk: 'sdk',      // sdk
    }

    //刷新出牌按——根据抬起的牌实时检测出牌是否能用
    export enum updateSendBtn {
        updateBtn = 'updateBtn',
    }

    //按钮类型
    export enum buttonType {
        landOwner = 'landOwner', //叫地主
        notCall = 'notCall', //不叫
        landGrab = 'landGrab',//抢地主
        onePoint = '1',//1分
        twoPoint = '2',//2分
        threePoint = '3',//3分
        kick = 'kick',//踢
        notKick = 'notKick',//不踢
        pull = 'pull',//拉
        notPull = 'notPull',//不拉
        ready = 'ready',//准备
        ready_invite = 'ready_invite',//除了准备之外的2个邀请按钮
        hitCard = 'hitCard',//打牌 出牌
        continueGame = 'continueGame',//继续
        giveUp = 'giveUp',//不出
        yaobuqi = 'yaobuqi',//要不起
        tip = 'tip',//提示
        weChatFriend = 'weChatFriend',//微信好友
        gameFriend = 'gameFriend',//游戏好友
        lookCard = "lookCard",//
        addTimes = 'addTimes',//加倍
        notAddTimes = 'notAddTimes',//不加倍
        grasp = 'grasp',//闷抓
        gsp = 'gsp',//抓
        notGsp = 'notGsp',//不抓
        lookCards = 'lookCards',//看牌
        play = "notSendCard",//3个按钮（出，不出，提示）
        callPoints = "callPoints",//叫分 1 2 3
        pour = "pour",//
        notPour = "notPour",//

        showCard = "showCard",//明牌
        gameStart = "gameStart",//开始
        showCard_2 = "showCard_2",//发牌后点击明牌
        follow = "follow",//跟
        notFollow = "notFollow",//不跟
        sendCard = 'sendCard',//出牌
        notSendCard = 'notSendCard',//不出，提示，出牌
        sendCard_restart = 'sendCard_restart',//新一轮只有一个按钮出牌
    }


    //状态对应的图片
    export const image = {
        landOwner: 'doudizhu_paizhuo_jiaodizhu', //叫地主
        notCall: 'doudizhu_paizhuo_bujiao', //不叫
        notGrab: 'doudizhu_paizhuo_buqiang',//不抢
        landGrab: 'doudizhu_paizhuo_qiangdizhu',//抢地主
        "1": 'doudizhu_paizhuo_1fen',//1分
        "2": 'doudizhu_paizhuo_2fen',//2分
        "3": 'doudizhu_paizhuo_3fen',//3分
        kick: 'doudizhu_paizhuo_ti',//踢
        notKick: 'doudizhu_paizhuo_buti',//不踢
        pull: 'doudizhu_paizhuo_la',//拉
        notPull: 'doudizhu_paizhuo_bula',//不拉
        lookCard: "doudizhu_paizhuo_mingpai",//
        addTimes: 'doudizhu_paizhuo_jiabei',//加倍
        notAddTimes: 'doudizhu_paizhuo_bujiabei',//不加倍
        grasp: 'doudizhu_paizhuo_menzhua',//闷抓
        gsp: 'doudizhu_paizhuo_zhua',//抓
        notGsp: 'doudizhu_paizhuo_buzhua',//不抓
        lookCards: 'doudizhu_paizhuo_kanpai',//看牌
        pour: 'doudizhu_paizhuo_dao',   //倒
        notPour: 'doudizhu_paizhuo_budao', //不倒
        ready: 'doudizhu_paizhuo_yizhunbei',//准备
        notFollow: 'doudizhu_paizhuo_buti',//不跟doudizhu_paizhuo_bugen
        follow: 'doudizhu_paizhuo_gen',//跟
    }

    //游戏类型
    export enum gameTypeState{
        ddz2people = 'doudizhu2people',//2人斗地主
        ddz3people = 'doudizhu3people',//3人斗地主
        ddz4people = 'doudizhu4people',//4人斗地主
    }


    export enum gameProgress {
        table = 'table',//桌子中 以准备为分割点，包括准备是桌子中
        game = 'game',//游戏中
        result = 'result',//结算
        vote = 'vote',//解散投票
    }
    
    export enum playType {
        ddz3 = 'ddz3',           //经典
        ddz2 = 'ddz2',           //二人斗地主
        lightning3 = 'sd3',       //闪电斗地主
        ordinaryLz3 = 'lz3',     //癞子
        ddz4 = 'ddz4',   //四人玩法，俩副牌
        TDLZ3 = 'tdlz3',     //天地癞子
        PZ3 = 'pz3',     //皮子玩法
    }

    export const handType = {
        // 单牌
        Single: {
            value: 'Single',
            level: 1
        },

        // 对牌
        Double: {
            value: 'Double',
            level: 1
        },

        // 顺子
        Straight: {
            value: 'Straight',
            level: 1
        },

        // 连对
        DoubleStraight: {
            value: 'DoubleStraight',
            level: 1
        },

        // 三张一样的
        Triplets: {
            value: 'Triplets',
            level: 1
        },

        // 三带一
        TripletsBeltSingle: {
            value: 'TripletsBeltSingle',
            level: 1
        },

        // 三带对
        TripletsBeltDouble: {
            value: 'TripletsBeltDouble',
            level: 1
        },

        // 飞机
        Airplane: {
            value: 'Airplane',
            level: 1
        },

        // 飞机带单
        AirplaneBeltSingle: {
            value: 'AirplaneBeltSingle',
            level: 1
        },

        // 飞机带对
        AirplaneBeltDouble: {
            value: 'AirplaneBeltDouble',
            level: 1
        },

        // 四带二
        FourCardsBeltTwo: {
            value: 'FourCardsBeltTwo',
            level: 1
        },

        // 炸弹
        Bomb: {
            value: 'Bomb',
            level: 3
        },

        // 王炸
        KingBomb: {
            value: 'KingBomb',
            level: 5
        },

        // 癞子玩法 添加
        // 软炸
        SoftBomb: {
            value: 'SoftBomb',
            level: 2
        },

        // 癞炸
        LaiBomb: {
            value: 'LaiBomb',
            level: 4
        }
    }


     //按钮颜色
     export enum EventName {
       BtnStateChange =  "BtnStateChange",
    }

}
