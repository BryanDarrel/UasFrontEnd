const app = angular.module("couponApp", []);

app.controller("CouponController", function ($scope, $http) {
  const API_URL = "http://localhost:5000/coupons";

  $scope.coupons = [];
  $scope.newCoupon = {};
  $scope.isModalOpen = false;

  // Fetch all coupons
  $scope.getCoupons = function () {
    $http.get(API_URL).then((response) => {
      $scope.coupons = response.data;
    });
  };

  // Open and close modal
  $scope.openModal = function () {
    $scope.isModalOpen = true;
    $scope.newCoupon = {}; // Reset form
  };

  $scope.closeModal = function () {
    $scope.isModalOpen = false;
  };

  // Add new coupon
  $scope.addCoupon = function () {
    $http.post(API_URL, $scope.newCoupon).then((response) => {
      $scope.coupons.push(response.data); // Update table
      $scope.closeModal();
    });
  };

  // Open Edit Modal
  $scope.openEditModal = function (coupon) {
    $scope.isEditModalOpen = true;
    $scope.selectedCoupon = angular.copy(coupon); // Copy data to avoid direct binding
  };

  // Close Edit Modal
  $scope.closeEditModal = function () {
    $scope.isEditModalOpen = false;
  };

  // Update Coupon
  $scope.updateCoupon = function () {
    const url = `${API_URL}/${$scope.selectedCoupon._id}`;
    $http.put(url, $scope.selectedCoupon).then((response) => {
      const index = $scope.coupons.findIndex(
        (c) => c._id === response.data._id
      );
      $scope.coupons[index] = response.data; // Update data in the table
      $scope.closeEditModal(); // Close modal
    });
  };

  // Delete Coupon
  $scope.deleteCoupon = function (id) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (confirmDelete) {
      const url = `${API_URL}/${id}`;
      $http.delete(url).then(() => {
        $scope.coupons = $scope.coupons.filter((coupon) => coupon._id !== id); // Remove from table
      });
    }
  };

  // Initialize
  $scope.getCoupons();
});
