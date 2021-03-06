/*UPDATES*/
var myApp = angular.module("myAppControllers",[]);
myApp.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

function findTime($scope, $rootScope) {
 var date = new Date();
 var hours = date.getHours();
 //var ampm = hours >= 12 ? 'pm' : 'am';
  console.log('time'+hours);
 if( hours>=7 && hours <= 17)
 {	
 	$("html,body").css({'background-color':"#1F4979"});
 	$("#bs-example-navbar-collapse-1.navbar-collapse.collapse.in").css({'background-color':"#1F4979"});
 	$(".overlay").css({'background-color':"rgba(31,73,121,0.3)"});
 	$(".contactCircle").attr("src","images/contact_day.png");
 	less.modifyVars({
        '@border-main': "rgb(242,165,4)",
        '@border-right': "rgb(209,31,1)",'@border-bottom': "rgb(159,20,0)",
        '@border-left':"rgb(209,31,1)",
        '@border-top':"rgb(239,70,7)",
        '@small-border-main': "#A66C25",
        '@small-border-top': "rgb(254,175,13)",
        '@small-border-right': "rgb(253,128,22)",
        '@small-border-left': "rgb(253,128,22)",
        '@small-border-bottom': "rgb(245,102,15)",
        '@font-color':"#EDFEB0",
        '@font-color-hover':"#EDFEC9",
        '@line-color':"#aa6625",
        '@line-progres':"#ffa639"

    });
 }
 else
 {	$("html,body").css({'background-color':"rgb(0,7,32)"});
	}
$("html,body").animate({'scrollTop':"0px"});
}

myApp.controller('updateController',['$rootScope','$scope','$http','$timeout' , '$auth','$route','cfpLoadingBar','Account','$location','SAAccessFac','$cookieStore',
					function($rootScope,$scope,$http,$timeout,$auth,$route, cfpLoadingBar, Account,$location,SAAccessFac, $cookieStore){
findTime();
$scope.updates = [];
$scope.isLoggedin = $auth.isAuthenticated();


$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/updates.json'}).success(function(data)
				   {
				    jsonstr = data; // response data 
				   //	console.log("updates"+jsonstr.length);
				   	
				   	// $timeout(function(){$scope.dataLoaded = true;},1000);
				   	
				   	for(var i=0;i<jsonstr.length;i++)
				   		{
				   			$scope.updates[i] = jsonstr[i]['title'];
				   		}
				   $(function(){
				    $(".update-box p").typed({
				      strings:$scope.updates,
				      typeSpeed: 40,
				      loop: true,
				      backDelay: 1500,
				      contentType: 'text',
				      loopCount: false,
				      cursorChar: " |"
				    });
				  });

				   });
$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/sponsordata.json'}).success(function(data)
				   {
				    	$scope.sponsors = data['sponsors'];
//sponsorin
$(".sponsor-box img").animate({'opacity':"0"},0);
sponsorin();
function sponsorin()
	{
timetot = 0;
 $(".sponsor-box img").each(function(i){
      var elem = $(this);
      timetot += (i+1)*1800;
     	$timeout(function(){
        $(elem).animate({'opacity':"1"},500,'easeInOutSine');
      },(i+1)*1800);
  });
$timeout(sponsorout,timetot);
	}
function sponsorout()
	{
		timetot = 0;
 $(".sponsor-box img").each(function(i){
      var elem = $(this);
      timetot += (i+1)*1800;
     	$timeout(function(){
        $(elem).animate({'opacity':"0"},500,'easeInOutSine');
      },(i+1)*1800);
  });
$timeout(sponsorin,timetot);
	}
});
   $scope.authenticate = function(provider) {
    	
var now = new Date();
var exp = new Date(now.getFullYear()+1,now.getMonth(),now.getDate()+5);
//console.log(exp);
      $auth.authenticate(provider)
        .then(function(response) {
                            toastr.options.closeButton = true;
                            toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            toastr.options.extendedTimeOut = 1500;               //redirect user to home if it does not have permission.
          
       //   console.log(response.data.kid);
        //  console.log(response.data.name);
         // console.log(response.data.sa_id);
          $scope.sa_id = response.data.sa_id;
          $scope.kid = response.data.kid;
          $scope.name = response.data.name;	
          toastr.success('Signed in successfully','Welcome '+$scope.name);
          $cookieStore.put('name',$scope.name,{expires: exp});
          $cookieStore.put('sa_id',$scope.sa_id,{expires: exp});
          $cookieStore.put('kid',$scope.kid,{expires: exp});
          $scope.isLoggedin = true;
        $route.reload();
SAAccessFac.getPermission();
        })
        .catch(function(response) { toastr.options.closeButton = true;
                            toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            toastr.options.extendedTimeOut = 1500; 
                              toastr.error("Error Signing in",response.status);
       });
    };

    $scope.logout = function(showToast) {
    showToast = showToast !== false;
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
                           if(showToast){
                            toastr.options.closeButton = true;
                            toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            toastr.options.extendedTimeOut = 1500; 
                              toastr.info("Logged out successfully"); }
                           $scope.isLoggedin = false;
              $cookieStore.remove('name');
              $cookieStore.remove('kid');
       $location.path('/');
       		  $route.reload();
      	
      });
   };
if($scope.isLoggedin)
{
$scope.name = $cookieStore.get('name');
$scope.kid = $cookieStore.get('kid');
if(!$scope.name){
$scope.logout(false);
}
SAAccessFac.getPermission();
}
else
{
SAAccessFac.removePermission();
}
 

}]);

/*EVENTS*/
myApp.controller('eventsController',['$scope','$http','$location','$timeout','$sce','cfpLoadingBar',function($scope,$http,$location,$timeout,$sce, cfpLoadingBar){
findTime();
$scope.events = [];
$scope.tabs = [];
$scope.eventName;
var path = $location.path();
path = '/'+path.substr(8,path.length);
$scope.category = path.substr(1,path.length).toUpperCase()+" EVENTS";
$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/categories'+path+'.json'}).success(function(data)
				   {
				    jsonstr = data['category']['events']; // response data 
				   	for(i=0;i<jsonstr.length;i++)
				   		{
				   			$scope.events[i] = jsonstr[i];
				   			//console.log($scope.events[i]);
				   		}
				   		$(".home-event-circle").find(".circle-icon").removeClass("selectedNavElem");
						$(".home-event-circle").removeClass("removeBB");
						$("#eventNav").find(".circle-icon").addClass("selectedNavElem");
						$("#eventNav").addClass("removeBB");
                                                
                                                
	
				   });
$scope.getEvent = function(eventname){
       
	$(".imagebox").each(function(){
      var elem = $(this);
      setTimeout(function(){
        $(elem).animate({'opacity':"0",'margin-left':"30px"},70);
      },i*50+50);
    });
    $(".footer").hide(0);
	$scope.eventName = eventname;
	eventname = eventname.toLowerCase().replace(/[ ']/g,'-').replace('!','-').replace(/\-\-+/g, '-') ;
	 $('html,body').delay(100).animate({'scrollTop':"100px"},1500,'easeOutSine');
function init(){
        $(".tabContent li").hide();
	$(".tabContent").find("li.0").show();
	$(".tabContainer li.tab:eq(0)").addClass("tabActive");
	
}
$scope.tabs = [];
	$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/events/'+eventname+'.json'}).success(function(data)
				   {
				    jsonstr = data['event']['tabs']; // response data 
				   	for(i=0;i<jsonstr.length;i++)
				   		{
			   			$scope.tabs[i] = jsonstr[i];
				   			$scope.tabs[i]['id']=i;
				   		}
					$(".left").animate({'marginLeft':"0px"},500,'easeOutSine');
				   	$timeout(init, 10);
});
}
$scope.toTrustedHTML = function( html ){
    return $sce.trustAsHtml( html );
}
$scope.showTab = function(tabtitle)
{
	$(".tabContent").show();
	$(".tabContent").find("li").hide();
	$(".tabContent").find("."+tabtitle).show();
	$(".tabContainer li.tab").removeClass("tabActive");
	$(".tabContainer li.tab:eq("+tabtitle+")").addClass("tabActive");
	 $('html,body').delay(100).animate({'scrollTop':"500px"},1500,'easeOutSine');

};
}]);
/*WORKSHOPS*/
myApp.controller('wkshopsController',['$scope','$http','$location','$timeout','cfpLoadingBar',function($scope,$http,$location,$timeout,cfpLoadingBar){
findTime();
$scope.events = [];
$scope.tabs = [];
$scope.eventName;
var path = $location.path();
path = '/'+path.substr(11,path.length);
$scope.category = path.substr(1,path.length).toUpperCase()+" WORKSHOPS";
$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/workshopcategories'+path+'.json'}).success(function(data)
				   {
				    jsonstr = data['workshopcategory']['workshops']; // response data 
				   	for(i=0;i<jsonstr.length;i++)
				   		{
				   			$scope.events[i] = jsonstr[i];
				   		}
				   			$(".home-event-circle").find(".circle-icon").removeClass("selectedNavElem");
	$(".home-event-circle").removeClass("removeBB");
	$("#wkshopNav").find(".circle-icon").addClass("selectedNavElem");
	$("#wkshopNav").addClass("removeBB");

				   });
$scope.getEvent = function(eventname){
	$(".imagebox").each(function(){
      var elem = $(this);
      $(".footer").hide(0);
      setTimeout(function(){
        $(elem).animate({'opacity':"0",'margin-left':"30px"},70);
      },i*50+50);
    });
	$scope.eventName = eventname;
	eventname = eventname.toLowerCase().replace(/[ ']/g,'-').replace('!','');
		 $('html,body').delay(100).animate({'scrollTop':"100px"},1500,'easeOutSine');
	// $scope.$apply();

function init(){
$(".tabContent li").hide();
	$(".tabContent").find("li.0").show();
	$(".tabContainer li.tab:eq(0)").addClass("tabActive");
}
	$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/workshops/'+eventname+'.json'}).success(function(data)
				   {
				    jsonstr = data['workshop']['tabs']; // response data 
				   	for(i=0;i<jsonstr.length;i++)
				   		{
			   			$scope.tabs[i] = jsonstr[i];
				   			$scope.tabs[i]['id']=i;
				   		}
					$(".left").animate({'marginLeft':"0px"},500,'easeOutSine');
				   	$timeout(init, 10);

});
}
$scope.showTab = function(tabtitle)
{
	$(".tabContent").show();
	$(".tabContent").find("li").hide();
	$(".tabContent").find("."+tabtitle).show();
	 $('html,body').delay(100).animate({'scrollTop':"500px"},1500,'easeOutSine');
};
}]);

/*HOSPI*/
myApp.controller('hospiController',['$scope','$document','$http','cfpLoadingBar',function($scope,$document,$http,cfpLoadingBar){
findTime();
$scope.nodes = [
{
	title:'Introduction',
	icon:'fa fa-info hospi_icon',
	url:'intro',
	mclass:'margin-left:-10px',
	id:1
},
{
	title:'Instructions',
	icon:'fa fa-file hospi_icon',
	url:'instr',
	mclass:'margin-left:-10px',
	id:2
},
{
	title:'Accommodation',
	icon:'fa fa-suitcase hospi_icon',
	url:'accom',
	mclass:'margin-left:-10px',
	id:3
},
{
	title:'Reaching CEG',
	icon:'fa fa-map-marker hospi_icon',
	url:'reachceg',
	mclass:'margin-left:-5px',
	id:4
},
{
	title:'FAQs',
	icon:'fa fa-question hospi_icon',
	url:'faq',
	mclass:'margin-left:2px',
	id:5
},
{
	title:'Contact',
	icon:'fa fa-mobile hospi_icon',
	url:'contact',
	mclass:'margin-left:2px',
	id:6
}
];
$scope.clickedNode = '';
$scope.nodeData = '';
$scope.clickedID = ''; 
$scope.nodeInfo = [];

	$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/hospitalities.json'}).success(function(data)
				   {	
						var jsonstr = data['hospitalities'];
						for(var i=0; i<jsonstr.length;i++)
							{
							$scope.nodeInfo[i] = jsonstr[i];
							$scope.nodeInfo[i]['id'] = i+1;
							//console.log($scope.nodeInfo[i]['title']);
							}
							init();
							var top = $("#hospi_content").scrollTop()+580;
							$('html,body').delay(100).animate({'scrollTop':top+"px"},1500,'easeOutSine');
							// $scope.$apply();
					});
	function init()
	{
		$scope.nodeData = $scope.nodeInfo[0]['desc'];
		$scope.clickedNode = "Introduction";
		$scope.clickedID = "1";
  		$(".longer-line").css({'width':"10%"});
  		setTimeout(function(){$(".hospi_content").addClass("hospi_animated");
		$("#1").addClass("node-active");
  		},500);
	}
	$scope.tohospi = function(clicked,clickedid) {
      $scope.clickedNode = clicked;
      $scope.clickedID = clickedid-1;
     $scope.nodeData = $scope.nodeInfo[$scope.clickedID]['desc'];
     var top = $("#hospi_content").scrollTop()+580;
	$('html,body').delay(100).animate({'scrollTop':top+"px"},1500,'easeOutSine');
					
    };
}]);
// guestlectures
myApp.controller('glController',['$scope','$http','$timeout','cfpLoadingBar',function($scope,$http,$timeout,cfpLoadingBar){
findTime();
$scope.nodes =[];
function init(){
	setTimeout(function(){
	$(".glpage1").removeClass("glpageanim1");},500);
    $(".glpage2").removeClass("glpageanim2");
	$(".glContainer #1").addClass("glBigBorder");
	var id = 0; 
	$scope.clickedName = $scope.nodes[id]['title'];
	$scope.date = $scope.nodes[id]['date'];
	$scope.Time = $scope.nodes[id]['time'];
	$scope.venue = $scope.nodes[id]['venue'];
	$scope.desc = $scope.nodes[id]['desc'];
	$scope.about = $scope.nodes[id]['about'];
}
	$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/gls.json'}).success(function(data)
				   {	
						var jsonstr = data['gls'];
						for(var i=0; i<jsonstr.length;i++)
							{
							$scope.nodes[i] = jsonstr[i];
							$scope.nodes[i]['id'] = i+1;
							//console.log($scope.nodes[i]['title']);
							}
				   		$timeout(init, 10);
$(".home-event-circle").find(".circle-icon").removeClass("selectedNavElem");
$(".home-event-circle").removeClass("removeBB");
$("#gl").addClass("selectedNavElem");
$("#gl").parent().parent().addClass("removeBB");

				   		var top = $(".anno").scrollTop()+450;
					   $('html,body').animate({'scrollTop':top+"px"},1500,'easeOutSine');
					    $scope.$apply();
					});

$scope.clickedName = '';
$scope.date = '';
$scope.Time = '';
$scope.venue = '';
$scope.desc = '';
$scope.about = '';
$scope.clicked = function(name,id)
{	
	if($scope.clickedName == name)
		return;
	$(".glpage1").addClass("glpageanim1");
	setTimeout(function(){$(".glpage1").removeClass("glpageanim1");},500);
    $(".glpage2").removeClass("glpageanim2");
	$scope.clickedName = name;
	id = id-1;
	$scope.date = $scope.nodes[id]['date'];
	$scope.Time = $scope.nodes[id]['time'];
	$scope.venue = $scope.nodes[id]['venue'];
	$scope.desc = $scope.nodes[id]['desc'];
	$scope.about = $scope.nodes[id]['about'];
	var top = $(".glContent").scrollTop()+450;
	$('html,body').animate({'scrollTop':top+"px"},500,'easeOutSine');
	$scope.$apply();

};

}]);

//karnival
myApp.controller('karnivalController',['$scope','$http','$timeout','cfpLoadingBar',function($scope,$http,$timeout,cfpLoadingBar){
findTime();
$scope.nodes =[];

//select node
$(".home-event-circle").find(".circle-icon").removeClass("selectedNavElem");
$(".home-event-circle").removeClass("removeBB");
$("#karnival").addClass("selectedNavElem");
$("#karnival").parent().parent().addClass("removeBB");

	$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/karnivals.json'}).success(function(data)
				   {	
						var jsonstr = data['karnivals'];
						for(var i=0; i<jsonstr.length;i++)
							{
							$scope.nodes[i] = jsonstr[i];
							$scope.nodes[i]['id'] = i+1;
							//console.log($scope.nodes[i]['title']);
							}
					});
$(".home-event-circle").find(".circle-icon").removeClass("selectedNavElem");
$(".home-event-circle").removeClass("removeBB");
$("#karnival").addClass("selectedNavElem");
$("#karnival").parent().parent().addClass("removeBB");

$scope.clickedName = '';
$scope.date = '';
$scope.Time = '';
$scope.venue = '';
$scope.desc = '';
$scope.clicked = function(name,id)
{	
	$scope.clickedName = name;
	$scope.date = $scope.nodes[id]['date'];
	$scope.Time = $scope.nodes[id]['time'];
	$scope.venue = $scope.nodes[id]['venue'];
	$scope.desc = $scope.nodes[id]['desc'];
	setClose = 0;

$(".navbar-toggle").click(function(){
  closeall();
});


$(".karCircle").click(function(){

if( $(window).width() >= 600)
{
    popOut();
    setTimeout(function(){  
      moveKarsUp();},200*6);
    setClose = 1;
}
//mobile effects
else
{
    mpopOut();
    setTimeout(function(){
      moveKarsUp();},200*6);

    setClose = 1; 
}
  });

$(".closeme").click(function(){
  moveKarsDown();
  popIn();
  
});
$(document).keyup(function(e) {
     if (e.keyCode == 27) { 
         moveKarsDown();
  		 popIn();

    }
});

  var anims = ['flyLeft','flyRight'];
  var index = 0;
  function popOut(){
  $(".karCircle").each(function(i){
      var ele = $(this);
      index = (index+1)%2;
      var currentanim = anims[index];
      setTimeout(function(){ $(ele).addClass(currentanim).fadeOut(100*i+100);},100*i+100);
  });
}

//mobile popOut effects -- reduced
  function mpopOut(){
  $(".karCircle").each(function(i){
      var ele = $(this);
      setTimeout(function(){ $(ele).addClass("flyLeft").fadeOut(100*i+100);},100*i+100);
  });
}
function popIn(){

  $(".karCircle").each(function(i){
      var ele = $(this);
      setTimeout(function(){ $(ele).removeClass("flyLeft").removeClass("flyRight").removeClass("flyTop").removeClass("flyBottom").fadeIn(i*175);},200*i+100);
  });
}

function closeall(){
    moveKarsDown();
    popIn();  
}

function moveKarsUp(){
  $(".topPage").addClass("zoomIn");
}

function moveKarsDown(){
  $(".topPage").removeClass("zoomIn");
}
};

}]);
/*ABOUT*/
myApp.controller('aboutController',['$scope',function($scope){
findTime();
$scope.nodes = [
{
	title:'INTRODUCTION',
	icon:'fa fa-info hospi_icon',
	url:'intro',
	mclass:'margin-left:-25px',
	id:1
},
{
	title:'CEG',
	icon:'fa fa-graduation-cap hospi_icon',
	url:'ceg',
	mclass:'margin-left:1px',
	id:2
},
{
	title:'CTF',
	icon:'fa fa-shield hospi_icon',
	url:'ctf',
	mclass:'margin-left:2px',
	id:3
},
{
	title:'CYCLOTRON',
	icon:'fa fa-empire hospi_icon',
	url:'logo',
	mclass:'margin-left:-20px',
	id:4
},
{
	title:'UNESCO',
	icon:'fa fa-bank hospi_icon',
	url:'unesco',
	mclass:'margin-left:-8px',
	id:5
},
{
	title:'KURUKSHETRA',
	icon:'fa fa-diamond hospi_icon',
	url:'kuruk',
	mclass:'margin-left:-28px',
	id:6,
}
];

$scope.nodeInfo=[
{
	id:1,
	desc:'Be it the battles in the mythology or of history, they have always been fought with a cause. Greed of land, resources and supremacy were always the intention. In an age devoid of the need for those, the next battle, it is said, would be for water. Against all odds, we believe that the battle of the brains is a more indispensable battle for our generation. As Student Directors of CTF, we welcome you to this battle, where wits need to be as sharp as swords and the mind as ready as ever to engage in the battle. We at CTF believe that Kurukshetra is the platform for events that will put to test the versatile ability of logic and smart thinking, hands-on workshops and enthralling experiences through guest lecture series. Make your way to CEG during Kurukshetra and leave a bit smarter, a bit more accomplished and proud of yourselves.'
},
{
	id:2,
	desc:'From being a Survey school in 1794 to a Civil Engineering college in 1858 and finally College of Engineering, Guindy in 1859, the college always strives for excellence in academia and in enriching the students with experience. With the pride of being one of the oldest engineering colleges in India, CEG continues in the path of inspiring engineers to excel at any endeavour.'
},
{
	id:3,
	desc:'CEG Tech Forum, the student run organisation, established in the year 2006, has become the technical hub of our college. The Student Directors of CTF work towards uniting the technical activities of CEG under this forum, to nurture and give direction to any student. Through collaborations with industries and academia, we aim to bring out the technological and research curiosity in our students. CTF\â€™s activities also include its flagship event, Kurukshetra.'
},
{
	id:4,
	desc:'The Cyclotron symbolizes the celebration of the indomitable spirit of engineering and innovation. It represents the ever expanding pursuit of knowledge. Just as a cyclotron accelerates a charged particle using high frequency, Kurukshetra provides that extra impetus for the engineer to excel.'
},
{
	id:5,
	desc:'The UNESCO patronage is the highest form of support granted by the organization, as a moral endorsement of exceptional activity which has a real impact on education, science, cultural or communication. Kurukshetra is the first event of its kind to receive this recognition. This recognition puts Kurukshetra in league with some of the most prestigious endeavors in the world..'
},
{
	id:6,
	desc:'Kurukshetra, an International Techno-Management Festival organized by CEG Tech Forum, has embarked on its journey of tenth edition. From its inception in 2007, it aimed at bringing together talents from varied engineering and management domains. Kurukshetra has evolved to act as an effective medium of interface between the academia and the industry. The fest with a vision for future to motivate, to provide opportunity and to identify and analyze societal problems, thereby provides tools to the current generation to solve it.'
	
}];
$scope.clickedName = 'INTRODUCTION';
$scope.information = $scope.nodeInfo[0]['desc'];
$(".longer-line").css({'width':"10%"});
setTimeout(function(){$(".hospi_content").addClass("hospi_animated");
$("#1").addClass("node-active");
},500);
 var top = $("#hospi_content").scrollTop()+580;
$('html,body').delay(100).animate({'scrollTop':top+"px"},1500,'easeOutSine');
	
$scope.clicked = function(clickedid)
{
	$scope.clickedName = $scope.nodes[clickedid-1]['title'];
	$scope.information = $scope.nodeInfo[clickedid-1]['desc']; 
	var top = $("#hospi_content").scrollTop()+580;
    $('html,body').animate({'scrollTop':top+"px"},500,'easeOutSine');
    //$scope.$apply();
};

}]);
/*CONTACTS*/
/*WORKSHOPS*/
myApp.controller('contactsController',['$scope','$http','$location','$timeout','cfpLoadingBar',function($scope,$http,$location,$timeout,cfpLoadingBar){
findTime();
$scope.buckets = [];
$scope.members = [];
$scope.bucketname = '';
$scope.bucketemail = '';
var pushclass = [];
$scope.push = '';
$http({method: 'GET', url: 'http://www.kurukshetra.org.in/teams.json'}).success(function(data)
				   {
				    jsonstr = data['teams'];
				   	for(i=0;i<jsonstr.length;i++)
				   		{
				   			$scope.buckets[i] = jsonstr[i];
				   			$scope.buckets[i]['id'] = i;
				   			if(jsonstr[i]['members'].length == 2)
				   				pushclass[i]= 'col-md-push-4';
				   			else if(jsonstr[i]['members'].length == 3)
				   				pushclass[i] = 'col-md-push-3';
				   			else if(jsonstr[i]['members'].length == 1)
				   				pushclass[i] = 'col-md-push-5';
				   			else
				   				pushclass[i] = 'col-md-push-2';
				   		}
				   });
$scope.getBucket = function(bname,id){
//function
$(".navbar-toggle").click(function(){
  closeall();
});
$(".bucketCircle").click(function(){
    popOut($(this));
    $("html,body").animate({'scrollTop':"100px"},1000);
    $scope.$apply();
    $(".left").animate({'marginLeft':"0px"},500,'easeOutSine');
  });
$(".close").click(function(){
  closeall();
});
$(document).keyup(function(e) {
     if (e.keyCode == 27) { 
      closeall();
    }
});    
function popOut(thisele){
  $(thisele).addClass("popOutFast");
  $(".bucketCircle").each(function(i){
  var ele = $(this);
  $timeout(function(){ if(!$(ele).hasClass("popOut")) $(ele).addClass("popOut"); }, i*75);
  });
}
function popIn(){
  $(".bucketCircle").each(function(i){
      var ele = $(this);
      $timeout(function(){ $(ele).removeClass("popOut").removeClass("popOutFast");
       }, i*80+60);
  });
}
function closeall(){
    $(".left").animate({'marginLeft':"100%"},500,'easeOutSine');
    popIn();
}
	$scope.bucketname = bname;
	$scope.bucketemail = $scope.buckets[id]['email'];
	$scope.members = $scope.buckets[id]['members'];
	$scope.push = pushclass[id];
	};

}]);
/*PROJECTS*/
myApp.controller('projectsController',['$scope','$http','$location','$timeout','cfpLoadingBar',function($scope,$http,$location,$timeout, cfpLoadingBar){
findTime();
$scope.events = [];
$scope.tabs = [];
$scope.eventName;
var path = '/engineering';
//path = '/'+path.substr(8,path.length);
$scope.category = 'PROJECTS';
$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/categories'+path+'.json'}).success(function(data)
				   {
				    jsonstr = data['category']['events']; // response data 
				   	for(i=0;i<jsonstr.length;i++)
				   		{
				   			$scope.events[i] = jsonstr[i];
				   			//console.log($scope.events[i]);
				   		}
				  
				   });
$scope.getEvent = function(eventname){
	$(".imagebox").each(function(){
      var elem = $(this);
      setTimeout(function(){
        $(elem).animate({'opacity':"0",'margin-left':"30px"},70);
      },i*50+50);
    });
	$scope.eventName = eventname;
	eventname = eventname.toLowerCase().replace(/[ ']/g,'-').replace('!','');
function init(){
	$(".tabContent li").hide();
	$(".tabContent").find("li:eq(0)").show();
}
	$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/events/'+eventname+'.json'}).success(function(data)
				   {
				    jsonstr = data['event']['tabs']; // response data 
				   	for(i=0;i<jsonstr.length;i++)
				   		{
			   			$scope.tabs[i] = jsonstr[i];
				   			$scope.tabs[i]['id']=i;
				   		}
					$(".left").animate({'marginLeft':"0px"},500,'easeOutSine');
				   	$timeout(init, 10);
});
}
$scope.showTab = function(tabtitle)
{
	$(".tabContent").show();
	$(".tabContent").find("li").hide();
	$(".tabContent").find("."+tabtitle).show();
	 $('html,body').delay(100).animate({'scrollTop':"500px"},1500,'easeOutSine');
	 $scope.$apply();

};

}]);
/*XCEED*/
myApp.controller('xceedController',['$scope','$http','$location','$timeout','cfpLoadingBar',function($scope,$http,$location,$timeout, cfpLoadingBar){
findTime();
$scope.events1 = [];
$scope.events2 = [];
$scope.events3 = [];
$scope.events4 = [];
$scope.tabs = [];
$scope.eventName = '';
$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/xceeds.json'}).success(function(data)
				   {
				   	 for(var i=0;i<data.length;i++)
				   		{	//a'bad
				   			if(data[i]['city_id'] == 5)
				   				$scope.events1.push(data[i]['name']);
							//blore
				   			if(data[i]['city_id'] == 6)
				   				$scope.events4.push(data[i]['name']);
                                                        //new xceed
				   			if(data[i]['city_id'] == 6)
				   				$scope.events3.push(data[i]['name']);

				   		console.log(data[i]['name']);
				   		}
				   		console.log($scope.events1.length);
				   });
$scope.getEvent = function(eventname){
	$(".place").fadeOut(100);
	$(".footer").fadeOut(0);
	$scope.eventName = eventname;
	eventname = eventname.toLowerCase().replace(/[ ']/g,'-').replace('!','');
function init(){
	$(".tabContent li").hide();
	$(".tabContent").find("li:eq(0)").show();
}
	$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/xceeds/'+eventname+'.json'}).success(function(data)
				   {
				    jsonstr = data['xceed']['tabs']; // response data 
				   	for(i=0;i<jsonstr.length;i++)
				   		{
			   			$scope.tabs[i] = jsonstr[i];
				   			$scope.tabs[i]['id']=i;
				   		}
					$(".left").animate({'opacity':"1",'marginLeft':"-15px",'margin-top':"16%"},500,'easeOutSine');
				   	$timeout(init, 10);
});
}
$scope.showTab = function(tabtitle)
{
	$(".tabContent").show();
	$(".tabContent").find("li").hide();
	$(".tabContent").find("."+tabtitle).show();
	$('html,body').delay(100).animate({'scrollTop':"500px"},1500,'easeOutSine');
};
}]);

myApp.controller('ProfileCtrl', ['$rootScope','$http','$location','$scope','$auth', 'Account',function($rootScope,$http,$location,$scope, $auth, Account) {
    
$http({method: 'GET', url: 'http://www.kurukshetra.org.in/colleges.json'}).success(function(data)
				   {
				     $scope.colleges = data;
				   });
$http({method: 'GET', url: 'http://www.kurukshetra.org.in/courses.json'}).success(function(data)
				   {
				     $scope.courses = data;
				   });
$http({method: 'GET', url: 'http://www.kurukshetra.org.in/degrees.json'}).success(function(data)
				   {
				     $scope.degrees = data;
				   });
    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
       //   console.log(response.data.message, response.status);
        });
    };
    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
        flag = 0;
        type = $("input[name=student]:checked").val();
       
	if( type == 'college' )
	{
		yr = $("#student-year").val();
		college = $("#student-college").val();
		course = $("#student-course").val();
                
                if( yr == '' || college == '' || course == '' )//not selected reqd fields!
                 {flag = 0;
                            toastr.options.closeButton = true;
                            //toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            //toastr.options.extendedTimeOut = 1500; 
                            toastr.error("Fill in Year, College and Course");
                            flag = 1;
                    
                 }
                
                   
	}

         else if( type == 'school' )
	{flag = 0;
		name = $("#school-name").val();
		grade = $("#school-grade").val();
		
                
                if( name == '' || grade == '' )//not selected reqd fields!
                 {
                            toastr.options.closeButton = true;
                            //toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            //toastr.options.extendedTimeOut = 1500; 
                            toastr.error("Fill in School Name and Grade!");
                            flag = 1;
                    
                 }
                   
	}
        
        else if( type == 'working' )
	{flag = 0;
		name = $("#company-name").val();
		des = $("#company-des").val();
		
                
                if( name == '' || des == '' )//not selected reqd fields!
                 {
                            toastr.options.closeButton = true;
                            //toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            //toastr.options.extendedTimeOut = 1500; 
                            toastr.error("Fill in Company Name and Designation!");
                            flag = 1;
                    
                 }
                   
	}
        
        if( flag == 0 )
        {
                            toastr.options.closeButton = true;
                            toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            toastr.options.extendedTimeOut = 1500; 
                            toastr.success('Booyah! Profile has been updated!',"Success");
        
        }


        })
        .catch(function(response) {
                            toastr.options.closeButton = true;
                            toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            toastr.options.extendedTimeOut = 1500; 
                            toastr.error("Error in updating", response.status);
        });
    };
    if(!$auth.isAuthenticated()){
    	$location.path('#');
    }
    $scope.getProfile();
  }]);
/*SPONSORS*/
myApp.controller('sponsorsController',['$scope','$http','$location','$timeout','$sce','cfpLoadingBar',function($scope,$http,$location,$timeout,$sce, cfpLoadingBar){
findTime();
$scope.levels = [];
$scope.sponsors = [];
$http({method: 'GET', url: 'http://cms.kurukshetra.org.in/levels.json'}).success(function(data)
				   {
				    	jsonstr = data['levels'];
				    	for(i=0;i<jsonstr.length;i++)
				    	{
				    		$scope.levels[i] = jsonstr[i];
				    	}
				   });

}]);


myApp.controller('SAInfoController',['$scope','$auth','$cookieStore',function($scope,$auth,$cookieStore){

if($auth.isAuthenticated()){
$scope.isSa = false;
$scope.sa_id = $cookieStore.get('sa_id');
if(!$scope.sa_id){
   $scope.isSa = false; 
  // console.log("no");
}
else{
   $scope.isSa = true;
//   console.log("yes "+$scope.sa_id);
   
}
}

}]);
myApp.controller('SAController', ['$rootScope','$http','$location','$scope','$auth', 'Account','$cookieStore',function($rootScope,$http,$location,$scope, $auth, Account,$cookieStore) {
    
$http({method: 'GET', url: 'http://www.kurukshetra.org.in/colleges.json'}).success(function(data)
				   {
				     $scope.colleges = data;
				   });
$http({method: 'GET', url: 'http://www.kurukshetra.org.in/courses.json'}).success(function(data)
				   {
				     $scope.courses = data;
				   });
$http({method: 'GET', url: 'http://www.kurukshetra.org.in/degrees.json'}).success(function(data)
				   {
				     $scope.degrees = data;
				   });
$scope.getProfile = function() {
//console.log("Gowtham : profile fetch");
      Account.getProfile()
        .then(function(response) {
          $scope.user1 = response.data;
$scope.user={};
$scope.user.name=$scope.user1.displayName;

$scope.user.phno=$scope.user1.contact;
$scope.user.college=$scope.user1.college;
$scope.user.contact_email=$scope.user1.email;
$scope.user.course=$scope.user1.course;

//console.log("Gowtham",$scope.user);
        })
        .catch(function(response) {
          console.log(response.data.message, response.status);
        });
    };
 $scope.registerSa = function() {
 		$scope.user.k_id = $rootScope.kid;
 	    Account.registerSa($scope.user)
        .then(function(response) {
                            
var now = new Date();
var exp = new Date(now.getFullYear()+1,now.getMonth(),now.getDate()+5);
                            console.log("response "+ response);
                            $cookieStore.put('sa_id',response.data.sa_id,{expires: exp});
                            toastr.clear();
                            toastr.options.closeButton = true;
                            toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            toastr.options.extendedTimeOut = 1500;               //redirect user to home if it does not have permission.
                            toastr.success('You have registered as Student Ambassador','Success');
                             $location.path('/sa');
        })
        .catch(function(response) {
console.log("error", $scope.user);
                            toastr.options.closeButton = true;
                            toastr.options.timeOut =3000 ; // How long the toast will display without user interaction
                            toastr.options.extendedTimeOut = 1500;               //redirect user to home if it does not have permission.
          
                           toastr.info(response.data.message, response.status);
        });
 };
$scope.getProfile();
  }]);											
