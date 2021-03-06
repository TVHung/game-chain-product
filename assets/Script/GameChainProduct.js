var Level = cc.Enum({               //so luong thung ơ moi level
    level1: 40,
    level2: 80,
    level3: 120
});

//doan duong la 1800px => v = 1800/4 
//v1 = 360, v2 = 480, v3 = 640
var Speed = cc.Enum({               //tốc độ thùng hàng             
    speed1: 5,
    speed2: 3.75,
    speed3: 2.8125,
    speedWheel1: 0.5,               //toc do banh xe
    speedWheel2: 0.7,
    speedWheel3: 1
});

//khoang cach ca thung là 240
var Duration = cc.Enum({                //thoi gian cho cua thùng hàng
    duration1: 2/3,
    duration2: 0.5,
    duration3: 0.375
});

//360 480 640
//timewait = 1280/v
//speed = 
var speedChain = cc.Enum({              //toc do day chuyenf và thời gian chờ đợi     
    speedChain1 : 7.11111,
    timeWait1   : 3.5555,
    speedChain2 : 5.33333,
    timeWait2   : 1.01, 
    speedChain3 : 4,
    timeWait3   : 2
});

var numChains = cc.Enum({               //so luong day chuyen o moi level
    numChain1: 7,
    numChain2: 24,
    numChain3: Infinity
});

cc.Class({
    extends: cc.Component,

    properties: {
        objectPrefab: {             //thung hang
            default: null,
            type: cc.Prefab
        },
        arrWheel: {                 //mang banh xe
            default: [],
            type: cc.Prefab
        },
        wheelPrefab: {              //banh xe
            default: null,
            type: cc.Prefab
        },
        objectChainPrefab: {        //day chuyen
            default: null,
            type: cc.Prefab
        },
        power: {                    //thanh nang luong
            default: null,
            type: cc.Node
        },
        check: {
            default: null,
            type: cc.Prefab         
        },
        countDown: {                //dem nguoc
            default: null,
            type: cc.Prefab
        },
        icon: {                     //icon 
            default: null,
            type: cc.SpriteAtlas
        },
        wheelParent: {              //layer cua banh xe
            default: null,
            type: cc.Node
        },
        chainsParent: {             //layer day chuyen
            default: null,
            type: cc.Node
        },
        chainsParent2: {            
            default: null,
            type: cc.Node
        },
        productParent: {            //layer thung hang
            default: null,
            type: cc.Node
        },
        character: {                //nhan vat dong hanh
            default: null,
            type: cc.Node
        },
        score:{                     //diem
            default: null,
            type: cc.Label
        },

        tableResult:{               //bang ket qua
            default: null,
            type: cc.Node
        },
        scoreTable:{                //bang diem
            default: null,
            type: cc.Label
        },
        tableResume:{               //bang tam dung
            default: null,
            type: cc.Node
        },

        lesson: "",
        scoreWin: 30,
        _isWin: false,
        _productNode: null,
        _level: 1,
        _speed: 0,
        _speedWheel: 0,
        _speedChain: 0,
        _timeWait: 0,
        _duration: 0.7,
        _checkCovu1: true,
        _checkCovu2: true,
        _nextLevel: true,
        _countProduct: 0,
        _totalProduct: 100,
    },

    start () {
        setTimeout(()=>{
            // this.node.getComponent("SoundManager").playBackGroundSound();
        }, 2500);
    },

    onLoad () {
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.debug.setDisplayStats(false);

        window.lesson = this.lesson;                        //key
        window.scoreGlobal = 0;             
        window._isGameOver = false;
        window.screenWidth = 1280;
        window.screenHeight = 720;
        window.speedProduct = Speed.speed1;
        this.score.string = window.scoreGlobal;
        this._speedWheel = Speed.speedWheel1;
        this._speed = Speed.speed1;
        this._speedChain = speedChain.speedChain1;
        this._timeWait = speedChain.timeWait1;                  //time chờ của dây chuyền
        this._duration = Duration.duration1;

        arrPositionWheel = new Array();
        this.createComponent();
        //chạy aniamtion nhan vat dong hanh
        this.character.getComponent(cc.Animation).play('monsterIn');
        cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con hãy chọn những\nvật theo yêu cầu!';
        this.node.getComponent("SoundManager").playEffectSound("batdau", false);   
        setTimeout(() => {
            cc.find("Canvas/Background/LevelTable").getComponent(cc.Animation).play('levelTable');
            cc.find("Canvas/Background/LevelTable/Level label").getComponent(cc.Label).string = 'Level 1';
            cc.find("Canvas/Background/LevelBox/LevelGame").getComponent(cc.Label).string = 'Level 1';
        }, 1000); 
        setTimeout(() => {
            this.character.getComponent(cc.Animation).play('monsterOut');
            this.startTimeRoller();
        }, 2500);
        chainfirst = this.spawnNewChain(0, -160);                   //dây chuyền ban đầu
        chainSecond = this.spawnNewChain(window.screenWidth, -160);
        this.tableResume.active = false;
    },

    createComponent(){              //tao ra các bánh xe và set vị trí
        this.arrPositionWheel = [{'x':-427, 'y':-218}, {'x':-347, 'y':-218}, {'x':-267, 'y':-218}, {'x':-187, 'y':-218}, {'x':-107, 'y':-218}, {'x':-27, 'y':-218}, {'x':63, 'y':-218}, {'x':143, 'y':-218}, {'x':223, 'y':-218}, {'x':303, 'y':-218}, {'x':383, 'y':-218}, {'x':463, 'y':-218}, {'x':543, 'y':-218}, {'x':623, 'y':-218}];
        this.spawnNewWheel(this.arrPositionWheel);
    },

    runWheels(){                    //ham run 2 dây chuyền đầu và bánh xe
        chainfirst.getComponent("ObjectChain").runChain(this._speedChain/2);
        chainSecond.getComponent("ObjectChain").runChain(this._speedChain);
        var i = 0;
        while(this.arrWheel[i] != null){
            this.arrWheel[i].getComponent("WheelManager").turnWheel(this._speedWheel);
            i++;
        }
    },

    runChains(){                //chạy các dây chuyền ứng với mỗi level
        if(this._level === 1){
            this.schedule(()=> {  
                if (window._isGameOver === false) {
                    var chain = this.spawnNewChain(window.screenWidth, -160);               //khởi tạo
                    chain.getComponent("ObjectChain").runChain(this._speedChain);           //chạy
                }
            }, this._timeWait, numChains.numChain1);
        }else if(this._level === 2){
            var chainfirst = this.spawnNewChain(0, -160);
            chainfirst.parent = this.chainsParent2;                     
            chainfirst.getComponent("ObjectChain").runChain(this._speedChain/2);
            this.schedule(()=> {  
                if (window._isGameOver === false) {
                    var chain = this.spawnNewChain(window.screenWidth, -160);
                    chain.getComponent("ObjectChain").runChain(this._speedChain);
                }
            }, this._timeWait, numChains.numChain2);                        //chạy và thời gian chờ nhau
        }else{
            var chainfirst = this.spawnNewChain(0, -160);
            chainfirst.parent = this.chainsParent2;
            chainfirst.getComponent("ObjectChain").runChain(this._speedChain/2);
            this.schedule(()=> {  
                if (window._isGameOver === false) {
                    var chain = this.spawnNewChain(window.screenWidth, -160);
                    chain.getComponent("ObjectChain").runChain(this._speedChain);
                }
            }, this._timeWait, numChains.numChain3);  
        }
    },

    startTimeRoller () {                        //hàm đếm ngược
        var times = 3; 
        this.schedule(()=> {    
            if (times !== 0) {
                if (!this.countDownNode) {
                    this.countDownNode = cc.instantiate(this.countDown);
                    this.node.addChild(this.countDownNode);
                    this.countDownNode.parent = this.wheelParent;
                }
                this.countDownNode.getChildByName("Sp Num").opacity = 255;
                this.countDownNode.getChildByName("Nodes start").opacity = 0;
                let spriteFrameName = "num_" + times;
                this.countDownNode.getChildByName("Sp Num").getComponent(cc.Sprite).spriteFrame = this.icon.getSpriteFrame(spriteFrameName);
                this.node.getComponent("SoundManager").playEffectSound("second", false);
            }   
            else {
                this.countDownNode.getChildByName("Sp Num").opacity = 0;
                this.countDownNode.getChildByName("Nodes start").opacity = 255;
                this.countDownNode.runAction(cc.fadeOut(1));
                this.node.getComponent("SoundManager").playEffectSound("begin", false);
                this.schedule(this.countDownScheduleCallBack);
                this.createChainProduct();
                this.runWheels();
                this.runChains();
            }
            times--;
        }, 1, 3);  
    },

    countDownScheduleCallBack () {                      //các thông số qua các level khác nhau
        if(this._countProduct >= Level.level1 && this._countProduct < Level.level2){        
            if(this._checkCovu1 === true){
                this._checkCovu1 = false;
                this.character.getComponent(cc.Animation).play('monsterIn');
                cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con làm tốt lắm,\ntiếp tục nào';
                this.node.getComponent("SoundManager").playEffectSound("tieptuc", false);   
                setTimeout(() => {
                    this.character.getComponent(cc.Animation).play('monsterOut');
                }, 2500);

                this._speed = Speed.speed2;
                window.speedProduct = Speed.speed2;
                this._duration = Duration.duration2;
                this._level = 2;  
                this._speedWheel = Speed.speedWheel2;
                this._speedChain = speedChain.speedChain2;
                this._timeWait = speedChain.timeWait2;
                this._nextLevel = false;
                this.runChains();
                setTimeout(() => {
                    cc.find("Canvas/Background/LevelTable").getComponent(cc.Animation).play('levelTable');
                    cc.find("Canvas/Background/LevelTable/Level label").getComponent(cc.Label).string = 'Level 2';
                    cc.find("Canvas/Background/LevelBox/LevelGame").getComponent(cc.Label).string = 'Level 2';
                }, 3000); 
                setTimeout(() => {
                    this._nextLevel = true;
                    this.createChainProduct();
                }, 5000); 
            }
        }
        if(this._countProduct >= Level.level2 && this._countProduct < Level.level3){
            if(this._checkCovu2 === true){
                this._checkCovu2 = false;
                this.character.getComponent(cc.Animation).play('monsterIn');
                cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con làm tốt lắm,\ntiếp tục nào';
                this.node.getComponent("SoundManager").playEffectSound("tieptuc", false);   
                setTimeout(() => {
                    this.character.getComponent(cc.Animation).play('monsterOut');
                }, 2500);

                this._speed = Speed.speed3;
                window.speedProduct = Speed.speed3;
                this._duration = Duration.duration3;
                this._level = 3;
                this._speedWheel = Speed.speedWheel3;
                this._speedChain = speedChain.speedChain3;
                this._timeWait = speedChain.timeWait3;
                this._nextLevel = false;
                this.runChains();
                setTimeout(() => {
                    cc.find("Canvas/Background/LevelTable").getComponent(cc.Animation).play('levelTable'); 
                    cc.find("Canvas/Background/LevelTable/Level label").getComponent(cc.Label).string = 'Level 3';
                    cc.find("Canvas/Background/LevelBox/LevelGame").getComponent(cc.Label).string = 'Level 3';
                }, 3000);
                setTimeout(() => {
                    this._nextLevel = true;
                    this.createChainProduct();
                }, 5000); 
            }
        }
        if (this._countProduct === Level.level3) {
            // window._isGameOver = true;
            this.unschedule(this.countDownScheduleCallBack);
            if(window.scoreGlobal > 10){
                this._isWin = true;
            }else{
                this._isWin = false;
            }
            setTimeout(() => {
                this.onFinishGameEvent();
            }, 2500);
        }
    },

    createChainProduct(){                           //tao chuỗi sản phẩm
        this.schedule(()=> {  
            if (window._isGameOver === false && this._nextLevel === true) {
                this.spawnNewProduct();
                this._countProduct++;
            }
        }, this._duration, Level.level1);  
    },

    spawnNewProduct() {                                     //tạo ra thùng hàng mới
        var newProduct = cc.instantiate(this.objectPrefab);
        this.node.addChild(newProduct);
        newProduct.setPosition(1080, -100);
        newProduct.parent = this.productParent;
        newProduct.getComponent("Object").runObjectProduct(this._speed);
    },

    spawnNewWheel(arrPos) {                                 //tạo ra bánh xe 
        var i = 0;
        while(arrPos[i] != null){
            var newWheel = cc.instantiate(this.wheelPrefab);
            this.node.addChild(newWheel);
            newWheel.setPosition(arrPos[i].x, arrPos[i].y);
            newWheel.parent = this.wheelParent;
            this.arrWheel[i] = newWheel;
            i++;
        } 
    },
    spawnNewChain(x, y){                                    //tạo dây chuyền
        var newChain = cc.instantiate(this.objectChainPrefab);
        this.node.addChild(newChain);
        newChain.setPosition(x, y);
        newChain.parent = this.chainsParent;
        return newChain;
    },

    onFinishGameEvent(){                                    //kết thúc game
        cc.director.getCollisionManager().enabled = false;
        this.tableResult.getComponent(cc.Animation).play();
        this.scoreTable.string = "Score: " + window.scoreGlobal;
        this.character.getComponent(cc.Animation).play('monsterIn');
        if(this._isWin === true){
            cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Chúc mừng còn đã\nchiến thắng!';
            this.node.getComponent("SoundManager").playEffectSound("hoanthanh", false);   
            this.node.getComponent("SoundManager").playEffectSound("win", false);
        }else{
            cc.find("Canvas/Character/Mess").getComponent(cc.Label).string = 'Con cần cố gắng\nhơn nữa nhé!';
            this.node.getComponent("SoundManager").playEffectSound("cancogang", false);   
            this.node.getComponent("SoundManager").playEffectSound("lose", false);
        }
        setTimeout(() => {
            this.character.getComponent(cc.Animation).play('monsterOut');
        }, 2500);
    },

    onClickBack(){
        // cc.director.loadScene("MainGame");
    },
    
    onClickReplay(){
        cc.director.resume();
        cc.director.loadScene("ChainProduct");
    },

    onclickHomeInBackGround(){
        this.tableResume.active = true;
        cc.director.pause();
    },

    onClickResume(){
        cc.director.resume();
        this.tableResume.active = false;
    },

    setPower(){
        if(this.power.height < 170){
            this.power.height = window.scoreGlobal*5;
        }
    },

    update (dt) {
        this.setPower();
        this.score.string = window.scoreGlobal;
    },
});
