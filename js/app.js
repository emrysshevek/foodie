angular.module('Bacon', ['ui.router'])
    .factory('topic', function() {
        var value = 'FOODIE';

        function getUpper() {
            return value.toUpperCase();
        }

        function getLower() {
            return value.toLowerCase();
        }

        function setValue(newTopic) {
            value = newTopic;
        }

        return { value: value, getUpper: getUpper, getLower: getLower, setValue: setValue }
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
                    $scope.title = topic.getUpper();
                    if ($scope.title === 'BACON') {
                        $("body").addClass("secretBaconMode");
                        // $("#secretBacon").play();
                        // $(".header").add('<audio id="secretBacon" autoplay loop><source src="../bacon_song.mp3" type="audio/mpeg"></audio>');
                    }
                    else {
                        $("body").removeClass("secretBaconMode");
                        // $("#secretBacon").remove();
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
        function($scope, $http, topic) {
            $scope.recipes = []


            $scope.getRecipes = function() {
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
        'topic',
        function($scope, $http, topic) {
            $scope.gifs = [];

            var key = "Q0e1pWbSF67lDIHC2vbCLnD63cYU4I4V";
            var search = topic.getLower();

            $scope.getGifs = function() {
                var url = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + key + "&limit=20";
                console.log(url);
                $http.get(url).then(function(response) {
                    console.log(response);
                });

                $http.get(url).then(function(response) {
                    console.log(response);
                    var responseGifs = response.data.data;
                    console.log(responseGifs);
                    for (i in responseGifs) {
                        console.log(responseGifs[i]);
                        $scope.gifs.push({ source: responseGifs[i].images.original.url });
                    }
                });
            }
        }
    ]);
