const app = angular.module('memoryApp', []);

app.controller('MemoryController', function($scope, $http) {
  $scope.memories = [];
  $scope.memory = {};

  // Ambil semua kenangan
  $http.get('http://localhost:5000/api/memories').then((response) => {
    $scope.memories = response.data;
  });

  // Tambah kenangan baru
  $scope.addMemory = function() {
    const formData = new FormData();
    formData.append('photo', $scope.memory.photo);
    formData.append('caption', $scope.memory.caption);

    $http.post('http://localhost:5000/api/memories', formData, {
      headers: { 'Content-Type': undefined }
    }).then((response) => {
      $scope.memories.unshift(response.data);
      $scope.memory = {}; // Reset form
    });
  };

  // Hapus kenangan
  $scope.deleteMemory = function(id) {
    $http.delete(`http://localhost:5000/api/memories/${id}`).then(() => {
      $scope.memories = $scope.memories.filter((memory) => memory._id !== id);
    });
  };

  // Edit caption kenangan
  $scope.editMemory = function(memory) {
    memory.editing = true; // Menampilkan form edit
    memory.originalCaption = memory.caption; // Simpan caption asli untuk batal
  };

  // Simpan perubahan caption
  $scope.saveMemory = function(memory) {
    const updatedMemory = { caption: memory.caption };
    
    $http.put(`http://localhost:5000/api/memories/${memory._id}`, updatedMemory)
      .then((response) => {
        memory.editing = false; // Sembunyikan form edit
        memory.caption = response.data.caption; // Perbarui caption
      });
  };

  // Batalkan pengeditan
  $scope.cancelEdit = function(memory) {
    memory.editing = false; // Sembunyikan form edit
    memory.caption = memory.originalCaption; // Kembalikan caption asli
  };
});

// Directive untuk file upload
app.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      const model = $parse(attrs.fileModel);
      const modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);
