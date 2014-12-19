# Zero-1.0

1号店H5前端开发框架

##目录

*	[功能](#功能)
*	[下载及安装](#下载及安装)
*	[使用](#使用)
*	[项目目录](#项目目录)
*	[项目初始化以及快速创建](#项目初始化以及快速创建)
*	[TODO](#TODO)
*	[授权协议](#授权协议)

##功能
1.  使用ejs模版引擎模块化开发
2.  可视化开发，快速浏览项目以及网页
3.  支持浏览器与手机访问时的同步，浏览器页面切换的同时，手机浏览器将会同步切换(需手机浏览器对websocket的支持)
4.  快速切换屏幕尺寸，可测试浏览器尺寸兼容性。
5.  项目依赖gulp进行快速开发并同时对less进行编译

##下载及安装
1.  切换到任意目录执行 ``git clone git@github.com:TVVT/Zero.git``
2.  同级目录执行``git clone git@github.com:TVVT/Projects.git``
3.  ``cd Zero && npm install``
4.  ``cd Projects && npm install``

##使用
1.  启动Zero(Zero将会占用您的3000端口用于web服务以及8000端口用于websocket,如果有端口冲突,可以在跟目录的settings.json中修改)
    cd Zero && node app.js

##项目目录
目前Zero对项目目录要求很高,需要严格按照要求的目录来建立项目,当然，我们提供了方便的方法用于快速建立项目以及页面和模块。

项目目录结构如下：
```
-Zero
-Projects
	-YourProject
		-pages
			-demo.ejs
			-demo.config.json
			-demo.data.json
		-components
			-demoModule.ejs
			-demoModule.json
		-resource
			-css
				-demo.css
			-images
			-less
				-components
					-demoModule.less
				-pages
					-demo.less
			-scripts
				-demo.js
		-layouts
```

目录解析：
1.  项目由pages组成,即demo.ejs
2.  页面可以include模块,即demoModule.ejs
3.  每个模块拥有对应的默认数据--demoModule.json以及对应的less--demoModule.less
4.  页面引用模块的同时，模块less将会和页面less一同编译成css文件--demo.css
5.  当页面中有数据要覆盖模块默认数据的时候，使用如下：
    ``include(demoModule,pageData)``
    此时，pageData将会代替默认数据成为demoModule模块的数据

##项目初始化以及快速创建
1.  进入Projects目录并打开less监听``gulp watchless``
2.  创建一个新的项目--YourProject ``gulp new --name YourProject``
3.  创建一个新的页面--demo ``gulp newp --name YourProject:demo``
	注：如果需要项目中自动加入requirejs的代码并且异步加载页面js--demo.js，那么只需要在命令后面跟上:js，即``gulp newp --name YourProject:demo:js``
4.  创建一个新的模块--demoModule ``gulp newc --name YourProject:demoModule``

##TODO
1.  增加对ArtTemplate的支持
2.  降低Zero对Projects目录的要求,继续不断的updating
3.  近期提交一个全新的demo引导新的用户

##授权协议
Released under the MIT, BSD, and GPL Licenses



