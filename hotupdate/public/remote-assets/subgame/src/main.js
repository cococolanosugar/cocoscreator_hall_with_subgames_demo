(function() {


    // 这是为了解决一个重启的 bug 而添加的
    cc.director.startAnimation();
    'use strict';
    var _CCSettings = null;

    cc.INGAME = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "ALLGame/subgame";

    if (!cc.subgame) {

        cc.subgame = _CCSettings = require(cc.INGAME + '/src/settings.js');
        require(cc.INGAME + '/src/project.js');

    } else {

        _CCSettings = cc.subgame;
    }

    var settings = _CCSettings;

    if (!settings.debug) {

        var rawAssets = settings.rawAssets;
        var assetTypes = settings.assetTypes;
        for (var mount in rawAssets) {
            var entries = rawAssets[mount];
            for (var uuid in entries) {
                var entry = entries[uuid];
                var type = entry[1];
                if (typeof type === 'number') {
                    entry[1] = assetTypes[type];
                }
            }
        }
    }


    var canvas;
    var onStart = function() {


        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.os !== cc.sys.OS_ANDROID || cc.sys.browserType !== cc.sys.BROWSER_TYPE_UC) {
            cc.view.enableRetina(true);
        }

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            } else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }

            cc.view.enableAutoFullScreen(
                cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU &&
                cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT &&
                cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ
            );
        }

        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
        }




        cc.AssetLibrary.init({
            libraryPath: cc.INGAME + '/res/import',
            rawAssetsBase: cc.INGAME + '/res/raw-',
            rawAssets: settings.rawAssets,
            packedAssets: settings.packedAssets
        });

        var launchScene = settings.launchScene;
        cc.director.loadScene(launchScene, null, function() {});

    };



    var jsList = settings.jsList;
    var bundledScript = settings.debug ? 'project.dev.js' : 'project.js';
    if (jsList) {
        jsList.push(bundledScript);
    } else {
        jsList = [bundledScript];
    }


    if (cc.sys.isNative && cc.sys.isMobile) {
        jsList = jsList.concat(['jsb_anysdk.js', 'jsb_anysdk_constants.js']);
    }

    jsList = jsList.map(function(x) { return cc.INGAME + 'src/' + x; });
    var option = {
        id: 'GameCanvas',
        scenes: settings.scenes,
        debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
        showFPS: 0,
        frameRate: 60,
        jsList: jsList,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
        renderMode: 0
    };
    cc.game.run(option, onStart);
})();