var remind=angular.module("remind",[]);
remind.controller("mianCtrl",["$scope",function($scope){
	$scope.color=[
		{theme:"c1",selecte:false},
		{theme:"c2",selecte:false},
		{theme:"c3",selecte:false},
		{theme:"c4",selecte:false},
		{theme:"c5",selecte:false},
		{theme:"c6",selecte:false},
		{theme:"c7",selecte:false}
	]
	if(localStorage.remind){
		$scope.remind=JSON.parse(localStorage.remind)
	}else{
		$scope.remind=[];
	}
	function colorLinstin(){
		var theme;
		for(var i=0;i<$scope.remind.length;i++){
			if($scope.remind[i].selecte===true){
				theme=$scope.remind[i].theme;
			}
		}
		for(var i=0;i<$scope.color.length;i++){
			if($scope.color[i].theme==theme){
				$scope.color[i].selecte=true;
			}
		}
	}
	colorLinstin();
	$scope.saveData=function(){
		localStorage.remind=JSON.stringify($scope.remind)
	}
	function maxid(){
		var max=1000;
		for(var i=0;i<$scope.remind.length;i++){
			if(i.id>max){
				max=i.id;
			}
		}
		return max;
	}
	$scope.addRemind=function(){
		var v={
			id:maxid,
			title:"新列表"+($scope.remind.length+1),
			theme:"c"+($scope.remind.length%7+1),
			unfinished:[],
			completed:[],
			selecte:false
		}
		$scope.remind.push(v);
		$scope.saveData();
	}
	$scope.choseSelect=function(index){
		for(var i=0;i<$scope.remind.length;i++){
			$scope.remind[i].selecte=false;
		}
		$scope.remind[index].selecte=true;
		$scope.saveData();
	}
	$scope.obtain=function(){
		for(var i=0;i<$scope.remind.length;i++){
			if($scope.remind[i].selecte===true){
				return i;
			}
		}
	}
	$scope.deleteR=function(){
		if($scope.remind.length>1){
			var index=$("#left .list .selecte").index();
			$scope.remind.splice(index,1);
			$scope.remind[0].selecte=true;
			$scope.saveData();
		}
		$("#right .options .hiden").hide();
	}
	$scope.completedR=function(){
		var theme;
		var title=$("#right .content .hiden .top input").val();
		for(var i=0;i<$scope.color.length;i++){
			if($scope.color[i].selecte===true){
				theme=$scope.color[i].theme;
			}
		}
		for(var n=0;n<$scope.remind.length;n++){
			if($scope.remind[n].selecte===true){
				$scope.remind[n].theme=theme;
				var oldtitle=$scope.remind[n].title;
				if(title){
					$scope.remind[n].title=title;
				}else{
					$scope.remind[n].title=oldtitle;
				}
			}
		}
		$scope.saveData();
		$("#right .options .hiden").hide();
		console.table($scope.remind)
	}
	$scope.cancleR=function(){
		var x=$scope.obtain();
		for(var i =0 ;i<$scope.color.length;i++){
			$scope.color[i].selecte=false;
			if($scope.color[i].theme==$scope.remind[x].theme){
				$scope.color[i].selecte=true;
			}
		}
		$("#right .options .hiden").hide();
	}
	$scope.returnData=function(index){
		var i=$scope.obtain();
		var down=$scope.remind[i].completed.splice(index,1)[0];
		$scope.remind[i].unfinished.push(down);
		$scope.saveData();
	}
	$scope.clearDown=function(){
		var i=$scope.obtain();
		$scope.remind[i].completed=[];
		$scope.saveData();
	}
	$scope.Date=function(){
		var date=new Date();
		var obtainDate={};
		obtainDate.year=date.getFullYear();
		obtainDate.month=date.getMonth()+1;
		obtainDate.date=date.getDate();
		obtainDate.day=date.getDay();
		return obtainDate;
	}
	$scope.dateDay=function(){
		var date=$scope.Date().day;
		var obj;
		switch(date){
			case 1:
			obj= "星期一";
			break;
			case 2:
			obj= "星期二";
			break;
			case 3:
			obj= "星期三";
			break;
			case 4:
			obj= "星期四";
			break;
			case 5:
			obj= "星期五";
			break;
			case 6:
			obj= "星期六";
			break;
			case 7:
			obj= "星期日";
			break;
		}
		return obj;
	}
}])
remind.directive("ngSelecte",[function(){
	return {
		restrict:"A",
		replace:true,
		transclude:true,
		template:"<ul class='list'><div ng-transclude></div></ul>",
		link:function($scope,el){
			$(document).on("keyup",function(e){
				if(e.keyCode==8||e.keyCode==46){
					if($scope.remind.length>1){
						var index=$("#left .list .selecte").index();
						$scope.$apply(function(){
							$scope.remind.splice(index,1);
							$scope.remind[0].selecte=true;
						})
						$scope.saveData();
					}
				}
			})
			$(document).on("keyup",":input",false);
			$(el).on("dblclick","input",function(){
				$(this).removeAttr("readonly");
				$(this).focus();
			})
			$(el).on("keyup","input",function(e){
				if(e.keyCode==13){
					$(this).blur();
				}
			})
			$(el).on("blur","input",function(){
				var title=$(this).val();
				var index=$(this).closest('li').index();
				if(title){
					$scope.$apply(function(){
						$scope.remind[index].title=title;
						$scope.saveData();
					})
					$(this).attr("readonly","readonly");
				}else{
					$(this).val($scope.remind[index].title);
				}
			})
		}
	}
}])
remind.directive("ngOptain",[function(){
	return {
		restrict:"A",
		link:function($scope,el){
			$(el).on("click","h4.right",function(){
				$(this).next(".hiden").toggle();
				return false;
			})
			$(document).on("click",function(){
				$("#right .options .hiden").hide();
			})
			$(el).on("click",".hiden",false);
			$(el).find(".color-list").on("click","li",function(){
				var index=$(this).index();
				var listindex=$scope.obtain();
				for(var i=0;i<$scope.color.length;i++){
					$scope.color[i].selecte=false;
				}
				$scope.$apply(function(){
					$scope.color[index].selecte=true;
				})
			})
		}
	}
}])
remind.directive("ngCompleted",[function(){
	return {
		restrict:"A",
		link:function($scope,el){
			$(el).on("click",".left-click",function(){
				$(this).toggleClass('icon-toggle');
				$(el).find("h4.clear").toggle();
				$(el).find("div.hiden").toggle();
			})
			$(el).on("click","h4.text",function(){
				$(el).find("div.left-click").toggleClass('icon-toggle');
				$(el).find("h4.clear").toggle();
				$(el).find("div.hiden").toggle();
			})
		}
	}
}])
remind.directive("ngRemind",[function(){
	return {
		restrict:"A",
		link:function($scope,el){
			$(el).on("keyup","input",function(e){
				if(e.keyCode==13){
					$(this).blur();
				}
			})
			$(el).on("blur","input",function(){
				var val=$(this).val();
				for(var i=0;i<$scope.remind.length;i++){
					if($scope.remind[i].selecte){
						var index=$(this).closest("li").index();
						if(val==""){
							$scope.$apply(function(){
								$scope.remind[i].unfinished.splice(index,1);
							})
						}else{
							$scope.$apply(function(){
								$scope.remind[i].unfinished[index]=val;
							})
						}
					}
				}
				$scope.saveData();
			})
			$(el).on("click",".left-icon",function(){
				var index=$(this).closest('li').index();
				var i=$scope.obtain();
				$scope.$apply(function(){
					var down=$scope.remind[i].unfinished.splice(index,1)[0];
					$scope.remind[i].completed.push(down);
				})
				$scope.saveData();
			})
			$(el).on("click","li",function(){
				$(this).parent().find(".chose").removeClass('chose');
				$(this).find(".zhe").addClass('chose').closest('li').addClass('chose');
			})
		}
	}
}])
remind.directive("ngAddevent",[function(){
	return {
		restrict:"A",
		link:function($scope,el){
			$(el).on("click",function(){
				$scope.$apply(function(){
					for(var i=0;i<$scope.remind.length;i++){
						if($scope.remind[i].selecte){
							var newunfinished="";
							$scope.remind[i].unfinished.push(newunfinished);
						}
					}
				})
				$("#right").find(".remind-event").find(".chose").removeClass("chose");
				$("#right").find(".remind-event").find("li").last().addClass('chose').find(".zhe").addClass('chose').end().find("input").focus();
			})
		}
	}
}])