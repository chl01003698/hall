
export module SZConstant {

    export let gameName:string = "sanzhang";
    export let laiziAnimationTime = 2000;

    export let mAddBets = [];
    export let sAddBets = [];
    export let hasLook = false;
    export let addBets = [];

    export enum bigBudgetType {
        gaming = 'gaming',
        gameEnd = 'gameEnd'
    }

    export enum sexChatStr {
        MAN = '_M',
        WOMAN = '_W',
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

    export enum testPeipei {
        jinhua = 'jinhua',     
        shunzi = 'shunzi',       
        sunjin = 'sunjin',
        baozi = 'baozi',
        zhahua = 'zhahua',
        tianlong = 'tianlong',
        dilong = 'dilong',
        dantiao = 'dantiao',
        duizi = 'duizi',
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

    //牌的花色黑桃，红桃，梅花，方片，大小王
    export enum pokerColor {
        spade = '0',
        hearts = '1',
        club = '2',
        diamond = '3',
    }


    //座位id
    export enum seatId {
        bottomSeat = 0,
        rightSeat = 1,
        leftSeat = 2,
        upSeat = 3,
    }

    //native数据来源
    export const sender = {
        sdk: 'sdk',      // sdk
    }


    export enum inputState {
        call = 0,       //跟注
        add = 1,        //加注
        compare = 2,    //比牌
        hotFight = 3,   //火拼
    }

    //桌布颜色
    export enum clothColor {
        red = 'red',
        blue = 'blue',
    }

    //游戏状态
    export enum gameState {
        game = 'game',
        ready = 'ready',
        laizi = 'laizi',
        autoEnter = 'autoEnter' //动态加入
    }

    //接收数据类型
    export enum outputState {
        follow = 'follow',       //跟注
        bet = 'bet',        //加注
        bipai = 'bipai',     //比牌
        qipai = 'qipai',    //弃牌
        kanpai = 'kanpai',  //看牌
        huopin = 'huopin',    //火拼
    }

     //玩法类型
     export enum wanfaType {
        normal = 0,       //普通玩未予
        quite = 1,        //闪电玩法
    }
}
