const app = angular.module("wishlistApp", []);

app.controller("wishlistController", function ($scope, $http) {
  $scope.rooms = []; // Data kamar
  $scope.wishlist = []; // Wishlist pengguna

  const userId = "101"; // ID pengguna (simulasi login)

  // Ambil data kamar
  $scope.getRooms = function () {
    $scope.rooms = [
      { _id: "1", name: "Deluxe Room", price: 1200000 },
      { _id: "2", name: "Suite Room", price: 1800000 },
    ];
  };

  // Ambil wishlist pengguna
  $scope.getWishlist = function () {
    $http.get(`http://localhost:4000/api/wishlist/${userId}`).then((response) => {
      $scope.wishlist = response.data;
    });
  };

  // Tambahkan kamar ke wishlist
  $scope.addToWishlist = function (room) {
    const wishlistItem = {
      userId: userId,
      roomId: room._id,
      roomName: room.name,
    };
    $http.post("http://localhost:4000/api/wishlist", wishlistItem).then((response) => {
      $scope.wishlist.push(response.data);
    });
  };

  // Edit wishlist
  $scope.editWishlist = function (wishlistItem) {
    const updatedRoomName = prompt("Masukkan nama baru untuk kamar:", wishlistItem.roomName);
    if (updatedRoomName) {
      $http.put(`http://localhost:4000/api/wishlist/${wishlistItem._id}`, { roomName: updatedRoomName })
        .then((response) => {
          const index = $scope.wishlist.findIndex((item) => item._id === wishlistItem._id);
          if (index !== -1) {
            $scope.wishlist[index] = response.data;
          }
        })
        .catch((error) => {
          console.error("Error updating wishlist item:", error);
          alert("Gagal mengupdate nama kamar.");
        });
    }
  };

  // Hapus kamar dari wishlist
  $scope.removeFromWishlist = function (id) {
    $http.delete(`http://localhost:4000/api/wishlist/${id}`).then(() => {
      $scope.wishlist = $scope.wishlist.filter((item) => item._id !== id);
    });
  };

  // Inisialisasi
  $scope.getRooms();
  $scope.getWishlist();
});
