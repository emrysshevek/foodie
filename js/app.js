angular.module('Bacon', ['ui.router'])
    .factory('topic', function() {
        var value = 'FOODIE';

        var gSynced = true;
        var rSynced = true;
        var vSynced = true;

        function getUpper() {
            return value.toUpperCase();
        }

        function getLower() {
            return value.toLowerCase();
        }

        function setValue(newTopic) {
            value = newTopic;
        }

        function unsync() {
            gSynced = false;
            rSynced = false;
            vSynced = false;
            console.log("unsynced sections");
        }

        function gifsSynced() {
            return gSynced;
        }

        function syncGifs() {
            gSynced = true;
        }

        function recipesSynced() {
            return rSynced;
        }

        function syncRecipes() {
            rSynced = true;
        }

        function videosSynced() {
            return vSynced;
        }

        function syncVideos() {
            vSynced = true;
        }

        return {
            value: value,
            recipesSynced: recipesSynced,
            videosSynced: videosSynced,
            getUpper: getUpper,
            getLower: getLower,
            setValue: setValue,
            unsync: unsync,
            syncGifs: syncGifs,
            gifsSynced: gifsSynced,
            syncRecipes: syncRecipes,
            recipesSynced: recipesSynced,
            syncVideos: syncVideos,
            videosSynced: videosSynced
        }
    })
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'HomeCtrl'
                })
                .state('gifs', {
                    url: '/gifs',
                    templateUrl: '/gifs.html',
                    controller: 'GifsCtrl'
                })
                .state('videos', {
                    url: '/videos',
                    templateUrl: '/videos.html',
                    controller: 'VideosCtrl'
                })
                .state('recipes', {
                    url: '/recipes',
                    templateUrl: '/recipes.html',
                    controller: 'RecipesCtrl'
                });

            $urlRouterProvider.otherwise('home');
        }
    ])
    .controller('MainCtrl', [
        '$scope',
        'topic',
        function($scope, topic) {
            $scope.title = topic.getUpper();

            $scope.setTopic = function() {
                var search = $scope.searchContent;
                if (search != '') {
                    topic.setValue(search);
                    topic.unsync();
                    console.log("gifs status: " + topic.gifsSynced());
                    $scope.title = topic.getUpper();
                    if ($scope.title === 'BACON') {
                        $("body").addClass("secretBaconMode");
                        document.getElementById("secretBaconMusic").play();
                        // $("#secretBacon").play();
                        // $(".header").add('<audio class="secretBaconMusic" autoplay loop><source src="../bacon_song.mp3" type="audio/mpeg"></audio>');
                    }
                    else {
                        $("body").removeClass("secretBaconMode");
                        document.getElementById("secretBaconMusic").pause();
                        // $(".secretBaconMusic ").pause();
                        // $(".secretBaconMusic").remove();
                    }
                    $scope.searchContent = "";
                }
            }
        }
    ])
    .controller('HomeCtrl', [
        '$scope',
        function($scope) {

        }
    ])
    .controller('RecipesCtrl', [
        '$scope',
        '$http',
        'topic',
        '$interval',
        function($scope, $http, topic, $interval) {
            $scope.recipes = []

            $scope.getRecipes = function() {
                $scope.recipes = [];

                var key = '437e4d8ac9d7dec6e9a99ba5683f32b3';
                var search = topic.getLower();
                var url = "https://www.food2fork.com/api/search?key=" + key + "&q=" + search;

                $http.get(url).then(function(response) {
                    console.log(response);
                    var responseRecipes = response.data.recipes;
                    for (recipe in responseRecipes) {
                        console.log(responseRecipes[recipe]);
                        $scope.recipes.push({ title: responseRecipes[recipe].title, img: responseRecipes[recipe].image_url, link: responseRecipes[recipe].source_url });
                    }
                });
            };

            $interval(function() {
                if (!topic.recipesSynced()) {
                    console.log("status: " + topic.recipesSynced());
                    topic.syncRecipes();
                    $scope.getRecipes();
                }
            }, 1000);

        }
    ])
    .controller('VideosCtrl', [
        '$scope',
        '$http',
        '$sce',
        'topic',
        function($scope, $http, $sce, topic) {
            $scope.video = "";
            // alert(curTopic.getLower());
            $scope.getRandomVideo = function() {

                var key = "AIzaSyCJxc0uYD6_XuEZ_m_s3cu111O8XfmNHoM";
                var search = topic.getLower();
                var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=" + search + "&key=" + key;
                $http.get(url).then(function(response) {
                    var randID = Math.floor(Math.random() * response.data.items.length);
                    var videoId = response.data.items[randID].id.videoId;
                    $scope.video = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + videoId);
                    console.log(response);
                    console.log(randID);
                    console.log($scope.video);
                });
            };

        }
    ])
    .controller('GifsCtrl', [
        '$scope',
        '$http',
        '$interval',
        'topic',
        function($scope, $http, $interval, topic) {
            $scope.gifs = [];

            var key = "Q0e1pWbSF67lDIHC2vbCLnD63cYU4I4V";

            $scope.getGifs = function() {
                $scope.gifs = [];
                var search = topic.getLower();
                var url = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + key + "&limit=20";
                console.log(url);

                $http.get(url).then(function(response) {
                    console.log(response);
                    var responseGifs = response.data.data;
                    for (i in responseGifs) {
                        $scope.gifs.push({ source: responseGifs[i].images.original.url });
                    }
                });
            }

            $interval(function() {
                if (!topic.gifsSynced()) {
                    console.log("status: " + topic.gifsSynced());
                    topic.syncGifs();
                    $scope.getGifs();
                }
            }, 1000);

        }
    ]);
