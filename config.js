var RouterConfig={
	debug:true,
	siteName:" - 站点名称",
	field:"space",
	default:"index",
	context:"主元素的id",
	templatePath:"/template/",
	dataPath:"/api/",
	
	pages:{
		"index":{
			title:"主页",
			path:"index.html"
		},
		"404":{
			title:"页面不存在",
			path:"404.html",
		}
	},
	
	aliases:{
		"test":{
			path:"",
			url:""
		}
	},
	
	auth:{
		state:false,
		pagenName:"login",
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
		start:function(pageName){},
		close:function(pageName){},
		failed:function(pageName){}
	},
	
	action:{
		next:function(pageName){},
		last:function(pageName){}
	}
};