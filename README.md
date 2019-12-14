# 前言

## 为什么会有这个模块？

以前一直使用原生JS开发，出于代码洁癖并不想用框架，但是代价就是代码耦合度高，并且累死个人。尝试了一下Vue，真香！

对于刚用Vue、连Vue的文档都还看的云里雾里的人来说，Vue-Router的文档实在看着头疼。有一个不用太多配置就能够用的路由模块，那该多好。

另一方面，Vue-Router确实满足不了我的需求。

那么，当然是选择造轮子啦！

# 功能

* 几乎和Vue没什么耦合，拆开来稍稍改动即可用于其它框架，或者原生js页面。

* 通过字段（可自定义）的形式来区分页面，可以说兼容性是很好了。下一个版本会把目录模式的路由加进入（肝不动了 =_=!）。

* 带有权限管理，通过cookie实现类似session的本地化权限控制（比如，未登录强制跳转到登录页）。

* 高度自定义的周期管理，说人话就是，可以对指定的页面的各个流程进行控制（比如，不同的页面不同的Loading动画，或者特定的页面禁止后退，等等）。

* 支持数据桥进行数据预加载。

* 可以自定义控制页面和数据缓存。

* 尤其适合WebApp。

* 自动销毁Vue实例。

* 支持引入js文件，并自动销毁。

* 404页面、重定向路由啥的，该有的都有。

* 不需要安装，引入Js然后new一个实例即可。

* 仅仅10KB不到的代码。

# 兼容性

IE10、IE11和主流浏览器都支持。

# 依赖项

* axios

* Vue2

# 官方CDN

> https://static.cdn.bux.cn/open/vuer/1.0.0/vuer.min.js

> https://static.cdn.bux.cn/open/vuer/1.0.0/vuer.js

# 开始使用

## 流程

1. 引入 <font color="#c7254e">`vue.js`</font> 和 <font color="#c7254e">`axios.min.js`</font>（用 <font color="#c7254e">`<script>`</font> 标签引用就行，不需要import）。

2. 引入js文件 <font color="#c7254e">`vuer.min.js`</font> 和配置项文件 <font color="#c7254e">`config.js`</font> （也可以不引入，后面会讲到）。

3. 给主元素（后面会讲到）设定一个id，这里为 <font color="#c7254e">`context`</font> 。

4. 在主元素之后的任意位置，<font color="#c7254e">`new`</font> 一个实例。

```html
<!doctype html>
<html>
<head>
	<title>title</title>
	<script type="text/javascript" src="js/vue.js"></script>
	<script type="text/javascript" src="js/vuer.min.js"></script>
	<script type="text/javascript" src="js/config.js"></script>
	<script type="text/javascript" src="js/axios.min.js"></script>
</head>
<body>
	
	<!--头部Start-->
	<div class="header"></div>
	<!--头部End-->
	
	<!--主体内容Start-->
	<div class="main" id="context"></div>
	<!--主体内容End-->
	
	
	<!--尾部Start-->
	<div class="footer"></div>
	<!--尾部End-->
	<script>
		var vr=new Vuer(RouterConfig);
	</script>
</body>
</html>
```

* **主元素**

  主元素就是活动的元素，对于网站应用而言，一般顶部是LOGO和导航，中部是主要内容，底部是版权信息。所以切换页面时，头部和尾部一般是不变的，只需要把中部的内容改动即可。而对于app，也是如此。

  >网页的形式千变万化，你也可以把 <font color="#c7254e">`body`</font> 标签设置为主元素，具体情况具体分析。

	![主元素说明](https://github.com/userofjack/Vuer/blob/master/readme-part.jpg?raw=true)

> 如果说明图片无法显示，请翻墙查看。

* **不引入配置项**
  上面的代码中，<font color="#c7254e">`RouterConfig`</font> 变量来自于引入的配置项文件 <font color="#c7254e">`config.js`</font> ，也可以不引入配置项文件，也就是把配置项写在实例化语句中：

```js
var vr=new Vuer({
    //配置项
});
```


## 全局配置项

* **<font color="#ff6600">`debug`</font>** <font color="#0099ff">`(Bool)`</font> <font color="#bbbbbb">`true`</font> <font color="#66aa66">`<必须>`</font>：

  调试模式。

  关闭的状态下，大部分错误不会在控制台输出，并且每次切换到新页面时会清空控制台。

* **<font color="#ff6600">`siteName`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`''`</font> <font color="#66aa66">`<必须>`</font>：

  站点名称。

  页面的标题由 <font color="#c7254e">`页面标题`</font> + <font color="#c7254e">`站点名称`</font> 两部分组成。

* **<font color="#ff6600">`field`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`'space'`</font> <font color="#66aa66">`<必须>`</font>：

  路由字段。

  在URI中，根据指定的字段的值进行路由判定。例如，当值为 <font color="#c7254e">`space`</font> 时，访问 <font color="#c7254e">`/?space=index`</font> 则代表访问的是 <font color="#c7254e">`index`</font> 页面。

* **<font color="#ff6600">`default`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`'index'`</font> <font color="#66aa66">`<必须>`</font>：

  默认页面。

  如果在URI中，没有路由字段（没有指定访问哪个页面），那么将会访问 <font color="#c7254e">`default`</font> 中设置的页面。

* **<font color="#ff6600">`context`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`'context'`</font> <font color="#66aa66">`<必须>`</font>：

  主元素的id名称。

* **<font color="#ff6600">`templatePath`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`'/template/'`</font> <font color="#66aa66">`<必须>`</font>：

  模板页面的目录路径。

  必须以 <font color="#c7254e">`/`</font> 开头，以 <font color="#c7254e">`/`</font> 结束。

* **<font color="#ff6600">`dataPath`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`'/'`</font> <font color="#66aa66">`<必须>`</font>：

  模板页面的目录路径。

  必须以 <font color="#c7254e">`/`</font> 开头，以 <font color="#c7254e">`/`</font> 结束。


* **<font color="#ff6600">`page`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

  路由规则。

  值为 <font color="#c7254e">`{ "页面名" : {页面配置项} , ...}`</font> ，页面配置项会在之后详述。

* **<font color="#ff6600">`auth`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

  身份认证规则。

  * * **<font color="#ff6600">`state`</font>** <font color="#0099ff">`(Bool)`</font> <font color="#bbbbbb">`false`</font> <font color="#66aa66">`<必须>`</font>：

    是否启用身份认证。

  * * **<font color="#ff6600">`pageName`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`login`</font> <font color="#66aa66">`<必须>`</font>：

    身份未经认证时，加载的页面（一般是登录页）。

  * * **<font color="#ff6600">`success`</font>** <font color="#0099ff">`(Function)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

    仅在网页（这里的网页不是模板页，而是浏览器窗口内的页面）首次加载时，通过身份认证的情况下执行的方法。

  * * **<font color="#ff6600">`outRule`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

    不需要身份认证的页面（比如404页面）。

* **<font color="#ff6600">`cache`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

  缓存规则。

  这里的缓存依赖的是浏览器的默认缓存，而非自身实现的缓存，换句话说，可以理解成“是否获取最新数据”。

  当值为 <font color="#c7254e">`false`</font> 时，会在请求的url后附带一个包含时间戳的 <font color="#c7254e">`vuer_no_cache`</font> 字段用于避免命中浏览器缓存，从而获取最新数据。

  * * **<font color="#ff6600">`page`</font>** <font color="#0099ff">`(Bool)`</font> <font color="#bbbbbb">`true`</font> <font color="#66aa66">`<必须>`</font>：

    是否缓存模板页。

  * * **<font color="#ff6600">`data`</font>** <font color="#0099ff">`(Bool)`</font> <font color="#bbbbbb">`false`</font> <font color="#66aa66">`<必须>`</font>：

    是否缓存数据。

* **<font color="#ff6600">`loading`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

  页面加载期间运行的方法，例如可以用来显示loading动画。

  * * **<font color="#ff6600">`start`</font>** <font color="#0099ff">`(Function)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

    页面加载开始时执行的方法。

  * * **<font color="#ff6600">`close`</font>** <font color="#0099ff">`(Function)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

    页面加载结束时执行的方法。

  * * **<font color="#ff6600">`failed`</font>** <font color="#0099ff">`(Function)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

    页面加载失败时执行的方法。

* **<font color="#ff6600">`action`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

  页面前进/后退时触发。如果自定义方法返回的值是 <font color="#c7254e">`false`</font> ，则会中断流程。

  * * **<font color="#ff6600">`next`</font>** <font color="#0099ff">`(Function)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

    切换新页面时触发。

  * * **<font color="#ff6600">`last`</font>** <font color="#0099ff">`(Function)`</font> <font color="#bbbbbb">`...`</font> <font color="#66aa66">`<必须>`</font>：

    点击浏览器“返回”按钮时触发。

## 页面配置项

* **<font color="#ff6600">`title`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`''`</font> <font color="#66aa66">`<必须>`</font>：

  页面标题。

* **<font color="#ff6600">`path`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`''`</font> <font color="#66aa66">`<必须>`</font>：

  模板路径。

* **<font color="#ff6600">`fulltitle`</font>** <font color="#0099ff">`(Bool)`</font> <font color="#bbbbbb">`可选`</font>

  是否只显示页面标题，而不显示站点名称。

* **<font color="#ff6600">`data`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`可选`</font>

  数据路径。

  > 加载的数据必须是json字符串。

* **<font color="#ff6600">`dataKey`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`可选`</font>

  数据路径。

  获取到的加载的数据中，把哪个对象的属性作为数据加载到vue实例上，必须以 <font color="#c7254e">`.`</font> 开头。

  通常，后端的响应还包含其他信息，例如如下的响应：

  ```js
  {
    "code":200,
    "status":"success",
    "message":"",
    "data":{
      "title":"文章标题",
      "time":"2019-12-14",
      "context":"正文"	
    }
  }
  ```

  很明显，<font color="#c7254e">`data`</font> 内的数据才是我们需要的。

  因此要把此配置项的值设置为 <font color="#c7254e">`.data`</font> ，Vuer会自动地遍历这个元素，把 <font color="#c7254e">`title`</font> 、 <font color="#c7254e">`time`</font> 、 <font color="#c7254e">`context`</font> 这三个属性自动加载到Vue实例上。

* **<font color="#ff6600">`preview`</font>** <font color="#0099ff">`(Bool)`</font> <font color="#bbbbbb">`可选`</font>

  预览模式。

  开启时，加载完模板页即执行 <font color="#c7254e">`loading.close()`</font> 方法，而不等待数据加载完毕，可与 <font color="#c7254e">`数据桥`</font> 配合使用。

* **<font color="#ff6600">`jump`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`可选`</font>

  重定向页面。

  值为页面的名称。

* **<font color="#ff6600">`js`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`可选`</font>

  需要额外加载的js（支持多个js）。

  比如用ueditor的时候就需要加载额外的js文件，Vuer会自动在 <font color="#c7254e">`<head>`</font> 标签内加载js，并在离开页面时自动销毁。

  > 需要注意的是，额外加载的js并不是阻塞的，所以记得把用到了额外js文件的代码，放在 <font color="#c7254e">`window.onload=function(){}`</font> 里。

* **<font color="#ff6600">`cache`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`可选`</font>

  仅对本页面生效的缓存规则，取值和详细说明请阅读 <font color="#c7254e">`全局配置项`</font> 一节中有关 <font color="#c7254e">`cache`</font> 配置项的说明。

  > 此时每一个子配置项都为可选，不存在的子配置项将会取值于对应的全局配置项。

* **<font color="#ff6600">`loading`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`可选`</font>

  仅对本页面生效的loading规则，取值和详细说明请阅读 <font color="#c7254e">`全局配置项`</font> 一节中有关 <font color="#c7254e">`loading`</font> 配置项的说明。

  > 此时每一个子配置项都为可选，不存在的子配置项将会取值于对应的全局配置项。

* **<font color="#ff6600">`action`</font>** <font color="#0099ff">`(Object)`</font> <font color="#bbbbbb">`可选`</font>

  仅对本页面生效的action规则，取值和详细说明请阅读 <font color="#c7254e">`全局配置项`</font> 一节中有关 <font color="#c7254e">`action`</font> 配置项的说明。

  > 此时每一个子配置项都为可选，不存在的子配置项将会取值于对应的全局配置项。

## 身份认证机制

当Cookie中存在一个键为 <font color="#c7254e">`AuthToken`</font> 、值不为空的键值对时，即认为通过身份认证。

具体的实现方式就是，登录成功后，通过后端或js在Cookie中设置一个键为 <font color="#c7254e">`AuthToken`</font> 、值不为空的键值对，此时Vuer将允许访问其他页面；当用户退出时，删除Cookie中键为 <font color="#c7254e">`AuthToken`</font> 的键值对，那么Vuer将仅允许用户访问 <font color="#c7254e">`pageName`</font> 和 <font color="#c7254e">`outRule`</font> 中的页面。

> 务必注意Cookie的有效时间，避免Cookie在浏览器关闭之后依然保存，这样才能达到类似后端session的身份认证效果。不然用户下一次打开浏览器，由于Cookie中rengran存在 <font color="#c7254e">`AuthToken`</font> 键值对，但实际上用户并未登录，进而导致错误。

## 模板页的使用

模板页，可以不包含任何vue代码，一样能够加载。

但是如果需要加载数据（比如文章列表页），或者想要在模板内使用vue语法，那就需要加载Vue实例了。

在开头的代码中，加载Vuer实例的时候，变量名是 <font color="#c7254e">`vr`</font> :


```html
<!doctype html>
<html>
<head>
	<title>title</title>
	<script type="text/javascript" src="js/vue.js"></script>
	<script type="text/javascript" src="js/vuer.min.js"></script>
	<script type="text/javascript" src="js/config.js"></script>
	<script type="text/javascript" src="js/axios.min.js"></script>
</head>
<body>
	
	<!--头部Start-->
	<div class="header"></div>
	<!--头部End-->
	
	<!--主体内容Start-->
	<div class="main" id="context"></div>
	<!--主体内容End-->
	
	
	<!--尾部Start-->
	<div class="footer"></div>
	<!--尾部End-->
	<script>
		var vr=new Vuer(RouterConfig);
	</script>
</body>
</html>
```

假设有一个文章列表页，要加载 <font color="#c7254e">`newsList`</font> 中的数据，则：

```html
  <div class="article-list">
    <div class="article-list-item" v-for="item in newsList" v-cloak>
      <div class="article-list-item-title" v-text="item.title"></div>
    </div>
  </div>

<script>
vr.vue=new Vue({
	data: {
		"newsList":null
	},
	methods: {
		
	}
})
</script>
```

Vuer中有一个属性 <font color="#c7254e">`vue`</font> ，用来加载模板页中的vue实例。

* 必须把模板中的Vue实例加载到Vuer实例的 <font color="#c7254e">`vue`</font> 属性上。

* 不需要挂载节点，数据加载完成后Vuer会自动挂载。

* Vuer会在获取到数据之后自动家在数据到模板页中的Vue实例上。


* 加载新页面时，Vuer会自动销毁已加载的模板页中的Vue实例。

此外，模板页中可以直接书写js代码，这些代码在加载新页面时会被销毁。

## 设置标题

如果想在页面加载完之后，设置页面标题，只需要用 <font color="#c7254e">`setTitle()`</font> 方法即可。

该方法可在任意位置（包括Vue的methods内）直接使用。

### function setTitle(pageTitle,siteName)

* **<font color="#ff6600">`pageTitle`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`可选`</font>

  页面标题，此参数不存在时，将使用Config中的配置项的值。

* **<font color="#ff6600">`siteName`</font>** <font color="#0099ff">`(String)`</font> <font color="#bbbbbb">`可选`</font>

  站点名称，此参数不存在时，将使用Config中的配置项的值。

## 加载新页面

该方法可在任意位置（包括Vue的methods内）直接使用。

### function jump(href)

* **<font color="#ff6600">`href`</font>** <font color="#0099ff">`(String)`</font> <font color="#66aa66">`<必须>`</font>

  形式为 <font color="#c7254e">`页面名称?自定义参数`</font> ，比如  <font color="#c7254e">`userinfo?id=3`</font> ，其中自定义参数可选。

## 小数据桥

其实就是在不同页面中共享数据，并且优先于获取到的页面数据加载到模板的Vue实例，同时会被页面数据覆盖。

一个简单的场景就是，从商品列表进入到商品详情页面的时候，由于此商品的价格、标题、图片是已经有的，可以通过数据桥传递到下一个页面，这样即使后端返回的商品详情数据会慢一些，但商品的价格、标题、图片已经展示在页面中了。

小数据桥中的数据，在新的页面加载完成后，会被 <font color="#c7254e">`清空`</font> 。

Vuer会自动地遍历传入的对象，把其中的属性加载到模板的Vue实例上。

该方法可在任意位置（包括Vue的methods内）直接使用。

### function bridge(obj)

* **<font color="#ff6600">`obj`</font>** <font color="#0099ff">`(Object)`</font> <font color="#66aa66">`<必须>`</font>

  要传递的数据。

## 大数据桥

大数据桥中的数据，在新的页面加载完成后，<font color="#c7254e">`不会`</font> 被清空。

该方法可在任意位置（包括Vue的methods内）直接使用。

### function bigBridge(obj)

* **<font color="#ff6600">`obj`</font>** <font color="#0099ff">`(Object)`</font> <font color="#66aa66">`<必须>`</font>

  要传递的数据。

# 配置项示例

```js
var RouterConfig={
	debug:true,
	siteName:" - Bux 贝硕",
	field:"space",
	default:"index",
	context:"bux_context",
	templatePath:"/template/",
	dataPath:"/api/",
	
	pages:{
		"index":{
			title:"Bux 贝硕",
			path:"index.html",
			fulltitle:true,
		},
		"404":{
			title:"页面不存在",
			path:"404.html",
		},
		"news":{
			title:"新闻动态",
			path:"news.html",
			data:"news.json",
			dataKey:".data",
			js:[
				"https://cdn.bootcss.com/jquery/3.4.1/jquery.js",
				"https://cdn.bootcss.com/jquery/2.0.1/jquery.js"
			],
		},
		"article":{
			title:"文章详情",
			path:"article.html",
			preview:true
		},
		"job":{
			title:"工作机会",
			path:"job.html",
			jump:"connect"
		},
		"connect":{
			title:"联系我们",
			path:"connect.html"
		},
	},
	
	auth:{
		state:false,
		pagenName:"auth",
		success:function(){
		},
		outRule:[
			"404",
		]
	},
	
	cache:{
		"page":true,
		"data":false
	},

	loading:{
		start:function(pageName){
			ByClass('bux-loading').className='bux-loading';
			ByClass('bux-loading').style.display='';
			ByClass('bux-loading-title').innerHTML='加载中';
			ByClass('bux-loading-icon').style.display='';
			ByClass('bux-loading-erroricon').style.display='none';
		},
		close:function(pageName){
			setTimeout(function(){
				ByClass('bux-loading').className+=' bux-loading-hidden';
				setTimeout(function(){
					ByClass('bux-loading').style.display='none';
				},400);
			},600)
		},
		failed:function(pageName){
			setTimeout(function(){
				ByClass('bux-loading-title').innerHTML='加载失败';
				ByClass('bux-loading-icon').style.display='none';
				ByClass('bux-loading-erroricon').style.display='';
				setTimeout(function(){
					vr.config.loading.close();
				},1000);
			},600)
		}
	},
	
	action:{
		next:function(pageName){},
		last:function(pageName){}
	}
};
```

# Promise兼容

IE10/11不支持Promise，因此无法通过axios进行Ajax操作。

需要使用bluebird，并加上如下代码：
```js
if(!!window.ActiveXObject||"ActiveXObject" in window){
	var scriptElement=document.createElement('script');
	scriptElement.type='text/javaScript';
	scriptElement.src='js/bluebird.min.js';
	document.getElementsByTagName('head')[0].appendChild(scriptElement);
}
```

该代码的要在引入axios的script标签之前。