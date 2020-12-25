/*
  Vuer路由模块
  
  https://github.com/userofjack/Vuer
  
  ©2017-2021 Bux. All rights reserved.
  
  遵循Apache开源协议。

  V1.1.0
*/

Vuer=function (config){
	if(!arguments[0]){
		console.log('%c<Vuer> No config.','color:red');
		return false;
	}
	
	this.config=config;

	this.ajaxLock={
		"page":{
			"state":false,
			"name":"",
			"ajaxToken":null,
			"query":{}
		},
		"data":{
			"state":false,
			"name":"",
			"ajaxToken":null
		}
	}
	
	this.nowPage=this.config.default;
	this.cache={
		html:null,
		data:false,
	}
	this.bridge=false;
	this.bigBridge={};
	this.vue=null;
	
	Vuer.prototype.byId=function(idName,closeError){
		var closeError=arguments[1] || false;
		if(!document.getElementById(idName)){
			if(this.config.debug&&!closeError){
				console.log('%cById(\''+idName+'\') Error','color:red');
			}
			return false;
		}
		return document.getElementById(idName);
	}
	
	Vuer.prototype.open=function(href){
		if(!arguments[0]){
			return false;
		}
		if(href.indexOf("?")!=-1){
			var pageName=href.replace(/^(\/|\\)/ig,'').split("?")[0];
		}
		else{
			var pageName=href;
		}
		return this.load(pageName,this.getRequest(href));
	}
	
	Vuer.prototype.isSet=function(value){
		if(typeof value != 'undefined'){
			return true;
		}
		return false;
	}
	Vuer.prototype.isEmpty=function(value){
		if(typeof value=='undefined'||value==''||value==null){
			return true;
		}
		return false;
	}
	
	Vuer.prototype.queryToStr=function(query){
		var queryStr='';
		var start=true;
		for(var key in query){
			if(!start){
				queryStr+='&';
			}
			else{
				start=false;
			}
			queryStr+=key;
			if(!this.isEmpty(query[key])){
				queryStr+='='+query[key];
			}
		}
		return queryStr;
	}

	Vuer.prototype.getQuery=function(fieldName){
		var reg=new RegExp("(^|&)"+fieldName+"=([^&]*)(&|$)","i");
		var value=window.location.search.substr(1).match(reg);
		if(value!=null){
			return unescape(value[2]);
		}
		return false;
	}

	Vuer.prototype.getRequest=function(url) {
		var url=arguments[0] || location.search;
		var result=new Object();
		if(url.indexOf("?")!=-1){
			url=url.substr(url.indexOf("?")+1);
			var query= url.split("&");
			for(var i=0;i<query.length;i++){
				if(this.isSet(query[i].split("=")[1])){
					result[query[i].split("=")[0]]=unescape(query[i].split("=")[1]);
				}
				else{
					result[query[i].split("=")[0]]='';
				}
			}
			return result;
		}
		else{
			return false
		}
	}
	
	Vuer.prototype.getCookie=function(fieldName){ 
		var result=null;
		var reg=new RegExp('(^| )'+fieldName+'=([^;]*)(;|$)');
		result=document.cookie.match(reg);
		if(result){
			return unescape(result[2]); 
		}
		else{
			return null; 
		}
	}

	Vuer.prototype.setCache=function(url,pageName,type){
		var NowTime=(new Date().getTime()/1000);
		if(url.indexOf("?")!=-1){
			try{
				var value=eval('this.config.pages.'+pageName+'.cache.'+type);
			}
			catch(e){}
			if(this.isSet(value)){
				if(this.config.pages[pageName].cache[type]){
					return url;
				}
				else{
					return url+='?vuer_no_cache='+NowTime;
				}
			}
			else if(this.config.cache[type]){
				return url;
			}
			else{
				return url+='?vuer_no_cache='+NowTime;
			}
		}
		else{
			return url+='?vuer_no_cache='+NowTime;
		}
	}

	
	Vuer.prototype.setTitle=function(pageTitle,siteName){
		var pageTitle=arguments[0] || this.config.pages[this.nowPage].title;
		if(!this.isSet(arguments[1])){
			var siteName=this.config.siteName;
		}
		document.title=pageTitle+siteName;
	}

	Vuer.prototype.fillHTML=function(dom,html){
		var route_scriptCode='';
		dom.innerHTML=html;
		[].forEach.call(dom.querySelectorAll("script"), function(element){　
			route_scriptCode+=element.innerHTML+';';
			element.outerHTML='';
		});
		if(route_scriptCode.replace(/(\s)/,'')!=''){
			var runtime=document.createElement("script");
			runtime.id='VuerRuntime';
			runtime.innerHTML=route_scriptCode;
			document.body.appendChild(runtime);
		}
		
	}
		
	Vuer.prototype.ajaxClose=function(ajaxToken){
		if(ajaxToken!==null&&typeof ajaxToken !='undefined'&&this.isSet(ajaxToken['cancel'])){
			ajaxToken.cancel();
		}
		this.ajaxLock.page.ajaxToken=null;
		this.ajaxLock.data.ajaxToken=null;
	}
	
	Vuer.prototype.run=function(method,pageName){
		
		try{
			var obj=eval('this.config.pages["'+pageName+'"].'+method);
		}
		catch(e){}
		
		if(typeof obj === "function"){
			return obj(pageName);
		}
		else{
			return eval('this.config.'+method+'("'+pageName+'")');
		}
	}

	Vuer.prototype.appendData=function(){
		var dataObj={};
		if(!this.isEmpty(this.config.pages[this.nowPage].dataKey)){
			try{
				dataObj=eval('this.cache.data'+this.config.pages[this.nowPage].dataKey);
			}
			catch(e){
				console.log('%c<Vuer> Data "'+this.config.pages[this.nowPage].dataKey+'" does not exist.','color:red');
				if(!this.isSet(this.config.pages[this.nowPage].loading)||this.config.pages[this.nowPage].loading){
					this.run('loading.failed',this.nowPage);
				}
				return false;
			}
		}
		else{
			dataObj=this.cache.data;
		}
		if(this.vue!=null){
			for(var key in dataObj){
				this.vue[key]=dataObj[key];
			}
			this.vue.$mount('#'+this.config.content);
		}
		
		if(this.isEmpty(this.config.pages[this.nowPage].preview)||(!this.isEmpty(this.config.pages[this.nowPage].preview)&&!this.config.pages[this.nowPage].preview)){
			this.run('loading.close',this.nowPage);
		}
	}
	
	Vuer.prototype.dataDeal=function(jsonObj,ajaxToken){
		if(ajaxToken!==this.ajaxLock.data.ajaxToken){
			return false;
		}

		this.ajaxLock.data.ajaxToken=null;
		this.ajaxLock.data.name='';
		this.ajaxLock.data.state=true;

		if(Object.prototype.toString.call(jsonObj)==='[object Object]'){
			this.cache.data=jsonObj;
		}
		else{
			if(!this.isSet(this.config.pages[this.nowPage].loading)||this.config.pages[this.nowPage].loading){
				this.run('loading.failed',this.nowPage);
			}
			return false;
		}
		if(this.ajaxLock.page.state){
			this.appendData();
		}
	}

	Vuer.prototype.pageDeal=function(htmlCode,ajaxToken){
		var ajaxToken=arguments[1] || null;
		if(arguments[0]&&ajaxToken!==this.ajaxLock.page.ajaxToken){
			return false;
		}
		var pageQuery='';
		pageQuery='?'+this.queryToStr(this.ajaxLock.page.query);
		var htmlCode=arguments[0] || this.cache.html;
		this.nowPage=this.ajaxLock.page.name;
		this.ajaxLock.page.ajaxToken=null;
		this.ajaxLock.page.name='';
		this.ajaxLock.page.state=true;

		this.cache.html=htmlCode;
		
		if(this.isSet(this.config.pages[this.nowPage].js)&&typeof this.config.pages[this.nowPage].js =='object'){
			var scriptNumber=0;
			for(var key in this.config.pages[this.nowPage].js){
				var scriptPath=this.config.pages[this.nowPage].js[key];
				var scriptElement=document.createElement('script');
				scriptElement.type='text/javaScript';
				scriptElement.src=script3;
				scriptElement.id='VuerRuntime_js_'+scriptNumber;
				document.getElementsByTagName('head')[0].appendChild(scriptElement);
				scriptNumber++;
			}

		}

		this.fillHTML(this.byId(this.config.content),htmlCode);
		
		scroll(0,0);

		if(!this.config.debug){
			console.clear();
		}

		if(this.vue!=null){
			for(var key in this.bigBridge){
				this.vue[key]=this.bigBridge[key];
			}
			
			if(this.bridge){
				for(var key in this.bridge){
					this.vue[key]=this.bridge[key];
				}
			}

		}
		this.bridge=false;

		if(this.isSet(this.config.pages[this.nowPage].fulltitle)&&this.config.pages[this.nowPage].fulltitle){
			this.setTitle(this.config.pages[this.nowPage].title,'');
		}
		else{
			this.setTitle();
		}
		history.pushState(null,'',pageQuery);
		if(!this.isEmpty(this.config.pages[this.nowPage].preview)&&this.config.pages[this.nowPage].preview){
			if(!this.isSet(this.config.pages[this.nowPage].loading)||this.config.pages[this.nowPage].loading){
				this.run('loading.close',this.nowPage);
			}
		}

		if(this.isEmpty(this.config.pages[this.nowPage].data)||this.ajaxLock.data.state){
			this.appendData();
		}
	}
	
	Vuer.prototype.load=function(pageName,query){
		if(this.isEmpty(pageName)){
			return false;
		}
		pageName=pageName.replace(/[^a-zA-Z0-9\-_\.\/]/g, '');
		if(this.isEmpty(pageName)){
			return false;
		}
		if(this.run('action.leave',this.nowPage)==false){
			return false;
		}
		if(this.run('action.next',pageName)==false){
			return false;
		}
		var pagePath='';
		var query=arguments[1] || {};
		var pageQuery='';
		this.ajaxClose(this.ajaxLock.page.ajaxToken);
		this.ajaxClose(this.ajaxLock.data.ajaxToken);
		this.ajaxLock.data.state=false;
		this.ajaxLock.page.state=false;
		
		if(typeof this.config.aliases[pageName]!='undefined'){
			if(!this.isEmpty(this.config.aliases[pageName].path)){
				this.open(this.config.aliases[pageName].path);
			}
			else if(!this.isEmpty(this.config.aliases[pageName].url)){
				window.location.href=this.config.aliases[pageName].url;
			}
			return false;
		}
		else if(typeof this.config.pages[pageName]=='undefined'){
			pageName='404';
		}


		if(this.vue!=null){
			this.vue.$destroy();
			this.vue=null;
		}
		if(this.byId('VuerRuntime',true)){
			document.body.removeChild(this.byId('VuerRuntime'));
		}
		var scriptNumber=0;
		while(true){
			if(this.byId('VuerRuntime_js_'+scriptNumber,true)){
				document.getElementsByTagName('head')[0].removeChild(this.byId('VuerRuntime_js_'+scriptNumber));
				scriptNumber++;
			}
			else{
				break;
			}
		}

		if(!this.isSet(this.config.pages[pageName].loading)||this.config.pages[pageName].loading){
			this.run('loading.start',pageName);
		}
		if(this.config.auth.state&&this.getCookie('AuthToken')==null&&this.config.auth.outRule.indexOf(pageName)==-1){
			this.load(this.config.auth.start,query);
			return false;
		}
		else if(this.isEmpty(this.config.pages[pageName].path)){
			pagePath=this.config.templatePath+pageName+'.html';
		}
		else{
			pagePath=this.config.templatePath+this.config.pages[pageName].path;
		}
		this.config.action.next(pageName);
		this.ajaxLock.page.name=pageName;
		this.ajaxLock.page.query={};
		query.space=pageName;
		this.ajaxLock.page.query=query;
		pageQuery='?'+this.queryToStr(query);
		
		var cancelToken=axios.CancelToken;
		if(pageName==this.nowPage&&this.cache.html!=null&&this.isEmpty(this.config.pages[pageName].data)){
			this.pageDeal();
		}
		else{
			this.ajaxLock.page.ajaxToken=cancelToken.source();
			var that=this;

			axios
			.get(this.setCache(pagePath+pageQuery,pageName,'page'),{
				cancelToken:this.ajaxLock.page.ajaxToken.token
			})
			.then(function(response){
				that.pageDeal(response.data,that.ajaxLock.page.ajaxToken)
			})
			.catch(function (e) {
				
				if(that.config.debug){
					console.log(e);
				}
				if(!that.isSet(that.config.pages[pageName].loading)||that.config.pages[pageName].loading){
					that.run('loading.failed',pageName);
				}
			});		
		}
		if(!this.isEmpty(this.config.pages[pageName].data)){
			this.ajaxLock.data.name=pageName;
			this.ajaxLock.data.ajaxToken=cancelToken.source();
			var that=this;

			axios
			.get(this.setCache(this.config.dataPath+this.config.pages[pageName].data+pageQuery,pageName,'data'),{
				cancelToken:this.ajaxLock.data.ajaxToken.token
			})
			.then(function(response){
				that.dataDeal(response.data,that.ajaxLock.data.ajaxToken)
			})
			.catch(function (e) {
				if(that.config.debug){
					console.log(e);
				}
				if(!that.isSet(that.config.pages[pageName].loading)||that.config.pages[pageName].loading){
					that.run('loading.failed',pageName);
				}
			});		
		}
		return true;
	}

	Vuer.prototype.initial=function(){
		if(!this.config.auth.state||this.getCookie('VuerAuthToken')!=null){
			this.config.auth.success();
		}

		if(!this.getQuery(this.config.field)){
			this.load(this.config.default,this.getRequest());
		}
		else{
			this.load(this.getQuery(this.config.field),this.getRequest());
		}
		var that=this;
		setTimeout(function(){
			window.addEventListener("popstate",function(){
				if(that.run('action.last',that.nowPage)==false){
					return false;
				}
				that.load(that.getQuery(that.config.field),that.getRequest());
			},false);
		},100);
		Vue.prototype.open=window.open=function(href){
			if(!arguments[0]){
				return false;
			}
			that.open(href);
		};
		Vue.prototype.setTitle=window.setTitle=function(pageTitle,siteName){
			var pageTitle=arguments[0] || that.config.pages[that.nowPage].title;
			var siteName=arguments[1] || that.config.siteName;
			that.setTitle(pageTitle,siteName);
		};
		Vue.prototype.bridge=window.bridge=function(obj){
			if(!arguments[0]){
				that.bridge={};
			}
			that.bridge=obj;
		};
		Vue.prototype.bigBridge=window.bigBridge=function(obj){
			if(!arguments[0]){
				that.bigBridge={};
			}
			that.bigBridge=obj;
		};
	}
	
	this.initial();
}