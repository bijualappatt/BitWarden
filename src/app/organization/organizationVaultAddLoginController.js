﻿angular
    .module('bit.vault')

    .controller('organizationVaultAddLoginController', function ($scope, apiService, $uibModalInstance, cryptoService,
        cipherService, passwordService, $analytics, orgId) {
        $analytics.eventTrack('organizationVaultAddLoginController', { category: 'Modal' });
        $scope.login = {};
        $scope.hideFolders = $scope.hideFavorite = true;

        $scope.savePromise = null;
        $scope.save = function (model) {
            model.organizationId = orgId;
            var login = cipherService.encryptLogin(model);
            $scope.savePromise = apiService.logins.postAdmin(login, function (loginResponse) {
                $analytics.eventTrack('Created Organization Login');
                var decLogin = cipherService.decryptLogin(loginResponse);
                $uibModalInstance.close(decLogin);
            }).$promise;
        };

        $scope.generatePassword = function () {
            if (!$scope.login.password || confirm('Are you sure you want to overwrite the current password?')) {
                $analytics.eventTrack('Generated Password From Add');
                $scope.login.password = passwordService.generatePassword({ length: 12, special: true });
            }
        };

        $scope.clipboardSuccess = function (e) {
            e.clearSelection();
            selectPassword(e);
        };

        $scope.clipboardError = function (e, password) {
            if (password) {
                selectPassword(e);
            }
            alert('Your web browser does not support easy clipboard copying. Copy it manually instead.');
        };

        function selectPassword(e) {
            var target = $(e.trigger).parent().prev();
            if (target.attr('type') === 'text') {
                target.select();
            }
        }

        $scope.close = function () {
            $uibModalInstance.dismiss('close');
        };
    });
