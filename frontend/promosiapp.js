const app = angular.module('promotionApp', []);

app.controller('PromotionController', function ($scope, $http) {
    $scope.promotions = [];
    $scope.newPromotion = {};
    $scope.editing = false;
    $scope.editPromotionData = {};

    // Fetch Promotions
    $scope.fetchPromotions = function () {
        $http.get('http://localhost:7000/promotions').then(
            function (response) {
                $scope.promotions = response.data;
            },
            function (error) {
                console.error('Error fetching promotions:', error);
            }
        );
    };

    // Add Promotion
    $scope.addPromotion = function () {
        $http.post('http://localhost:7000/promotions', $scope.newPromotion).then(
            function (response) {
                $scope.promotions.push(response.data);
                $scope.newPromotion = {};
            },
            function (error) {
                console.error('Error adding promotion:', error);
            }
        );
    };

    // Edit Promotion
    $scope.editPromotion = function (promotion) {
        $scope.editing = true;
        $scope.editPromotionData = angular.copy(promotion);
    };

    // Update Promotion
    $scope.updatePromotion = function () {
        $http.put(`http://localhost:7000/promotions/${$scope.editPromotionData._id}`, $scope.editPromotionData).then(
            function (response) {
                $scope.fetchPromotions();
                $scope.editing = false;
            },
            function (error) {
                console.error('Error updating promotion:', error);
            }
        );
    };

    // Delete Promotion
    $scope.deletePromotion = function (id) {
        $http.delete(`http://localhost:7000/promotions/${id}`).then(
            function (response) {
                $scope.fetchPromotions();
            },
            function (error) {
                console.error('Error deleting promotion:', error);
            }
        );
    };

    // Initialize Promotions
    $scope.fetchPromotions();
});
