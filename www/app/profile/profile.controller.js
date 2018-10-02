(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$state', '$rootScope', '$localStorage', 'NotificationService', '$filter','DataService','CameraService', 'UploadService', '$http', 'API_URL'];
  /* @ngInject */
  function ProfileController($state, $rootScope, $localStorage, NotificationService, $filter, DataService, CameraService, UploadService, $http, API_URL) {
    var vm = this;
    vm.word_for_delete = "hackAIR";
    activate();

    function activate(){         

      angular.extend(vm, {
        profile:            getProfile(),
        locationChanged:    locationChanged,
        getOptionsSelected: getOptionsSelected,
        getPhoto:           getPhoto,
        updateProfile:      updateProfile,
        togglePrivacy:      togglePrivacy,
        toggleNotificationEmails: toggleNotificationEmails,
        toggleNewsletter: toggleNewsletter,
        cancel:             cancel,
        goBackToEdit:       goBackToEdit,
        changePassword:     changePassword,
        onCloseOptions:     onCloseOptions,
        onSecondaryCloseOptions: onSecondaryCloseOptions,
        deleteAccount:      deleteAccount
      });

      angular.extend(vm, {
        years:              getYears(),
        genders:            getGenders(),
        languages:          getLanguages()
        // outdoor_activities: getOutdoorActivities(),
        // sensitivities:      getSensitivities(),
      }); 

      getOptions();
      // getSecondaryProfile();
    }

    function locationChanged(location){
      console.log('locationChanged FIRED ONCE!');
      vm.profile.place_id = location.place_id;
    }    

    function getSecondaryProfile() {
      if (!vm.profile.secondary_profile) {
        vm.profile.secondary_profile = {
          show: false,
          details: {
            gender: null,
            year_of_birth: null,
            selectedActivities: [],
            selectedSensitivities: [],
            firstname: null,
            lastname: null
          }
        }
        angular.extend(vm, {
          secondary_profile_years: getSecondaryProfileYears(),
          secondary_profile_genders: getSecondaryProfileGenders(),
        });
        getSecondaryProfileOptions();
      } else {
        angular.extend(vm, {
          secondary_profile_years: getSecondaryProfileYears(),
          secondary_profile_genders: getSecondaryProfileGenders(),
        });
        getSecondaryProfileOptions();
      }
    }

    function getOptions(){
      return $http.get(API_URL + '/content/recommendations')
      .then(function(response) {
        vm.outdoor_activities = response.data.data.activities; // Which activities exist on the backend?
        vm.sensitivities = response.data.data.groups;
        vm.secondary_profile_outdoor_activities = angular.copy(vm.outdoor_activities); // Which activities exist on the backend?
        vm.secondary_profile_sensitivities = angular.copy(vm.sensitivities);

        angular.extend(vm, {
          selectedActivities: [],
          selectedSensitivities: []
        });

        vm.outdoor_activities.forEach(function(activity){
          var filter = vm.profile.outdoor_activities.filter(function(myActivity){
            return activity.id == myActivity.id
          });
          if (filter.length){
            activity.selected = true;
            vm.selectedActivities.push(activity);
          } else {
            return;
          }
        });

        vm.selectedActivitiesJoined = getJoined(vm.selectedActivities);

        vm.sensitivities.forEach(function(sensitivity){
          var filter = vm.profile.groups.filter(function(mySensitivity){
            return sensitivity.id == mySensitivity.id
          });
          if (filter.length){
            sensitivity.selected = true;
            vm.selectedSensitivities.push(sensitivity);
          } else {
            return;
          }
        });

        vm.selectedSensitivitiesJoined = getJoined(vm.selectedSensitivities);
        getSecondaryProfile();

      });
    }

    function getSecondaryProfileOptions() {
      angular.extend(vm, {
        secondaryProfileSelectedActivities: [],
        secondaryProfileSelectedSensitivities: []
      });

      if (vm.profile.secondary_profile.details !== {}) {
        vm.secondary_profile_outdoor_activities.forEach(function(activity){
          var filter = vm.profile.secondary_profile.details.selectedActivities.filter(function(myActivity){
            return activity.id == myActivity.id
          });
          if (filter.length){
            activity.selected = true;
            vm.secondaryProfileSelectedActivities.push(activity);
          } else {
            return;
          }
        });
      }

      vm.secondaryProfileSelectedActivitiesJoined = getJoined(vm.secondaryProfileSelectedActivities);

      if (vm.profile.secondary_profile.details !== {}) {
        vm.secondary_profile_sensitivities.forEach(function(sensitivity){
          var filter = vm.profile.secondary_profile.details.selectedSensitivities.filter(function(mySensitivity){
            return sensitivity.id == mySensitivity.id
          });
          if (filter.length){
            sensitivity.selected = true;
            vm.secondaryProfileSelectedSensitivities.push(sensitivity);
          } else {
            return;
          }
        });
      }

      vm.secondaryProfileSelectedSensitivitiesJoined = getJoined(vm.secondaryProfileSelectedSensitivities);

    }

    function getJoined (obj){
      var result = obj.map(function(val) {
        return val.name;
      }).join(', ');
      return result;
    }

    function onCloseOptions(){
      vm.selectedActivities = [];
      vm.selectedSensitivities = [];

      vm.outdoor_activities.forEach(function(activity){
        if (activity.selected){
          vm.selectedActivities.push(activity);
        }
      });

      vm.selectedActivitiesJoined = getJoined(vm.selectedActivities);

      vm.sensitivities.forEach(function(sensitivity){
        if (sensitivity.selected) {
          vm.selectedSensitivities.push(sensitivity);
        }

      });
      vm.selectedSensitivitiesJoined = getJoined(vm.selectedSensitivities);

    }

    function onSecondaryCloseOptions() {
      vm.secondaryProfileSelectedActivities = [];
      vm.secondaryProfileSelectedSensitivities = [];

      vm.secondary_profile_outdoor_activities.forEach(function(activity){
        if (activity.selected){
          vm.secondaryProfileSelectedActivities.push(activity);
        }
      });

      vm.secondaryProfileSelectedActivitiesJoined = getJoined(vm.secondaryProfileSelectedActivities);

      vm.secondary_profile_sensitivities.forEach(function(activity){
        if (activity.selected){
          vm.secondaryProfileSelectedSensitivities.push(activity);
        }
      });

      vm.secondaryProfileSelectedSensitivitiesJoined = getJoined(vm.secondaryProfileSelectedSensitivities);
    }

    function getProfile(){
      var profile = angular.copy($localStorage.user);
      // calculating user's age

      profile.age = null;
      if (profile.year_of_birth != null){
         profile.age = parseInt(new Date().getFullYear()) - profile.year_of_birth;
      }
      angular.extend(profile, {
        groupsString: profile.groups.map(function(e){return e.name}).join(','),
        outdoorActivitiesString: profile.outdoor_activities.map(function(e){return e.name}).join(',')
      });

      return profile;
    }

    function updateProfile(){
      var User = DataService.Users.one($localStorage.user.id);
      var updatedProfile = transformViewModel(vm.profile);
      if (!updatedProfile.name) { updatedProfile.name = '' }
      if (!updatedProfile.surname) { updatedProfile.surname = '' }      
      var secondary_profile = getUpdatedSecondaryProfile(vm.profile.secondary_profile);
      updatedProfile.profile_picture = undefined;
      updatedProfile.secondary_profile = secondary_profile;
      if (vm.profile.secondary_profile.show === false) {
        updatedProfile.secondary_profile.details = {};
      }

      angular.extend(User, updatedProfile);

      User.put()
      .then(function(response){
        $localStorage.user = response.data;
        vm.profile = getProfile();
        NotificationService.show('Your profile has been updated')
        .then(function(){
            $state.go('profile.view');
        });
      })
      .catch(function(response){
        NotificationService.show(response.data.message)
        .then(function(){
          console.error(response);
        });
      });

    }

    function getUpdatedSecondaryProfile(obj) {
      var newObj = {

      }
      for (var key in obj){
        if (obj[key] !== null && obj[key] !== "" && obj[key] !== 0){
          newObj[key] = obj[key];
        }
      }
      newObj.details = {
        firstname: obj.details.firstname,
        lastname: obj.details.lastname
      };
      angular.extend(newObj.details, {
        selectedActivities: $filter('filter')(vm.secondary_profile_outdoor_activities, getSelected),
        selectedSensitivities:             $filter('filter')(vm.secondary_profile_sensitivities, getSelected),
        gender:             $filter('filter')(vm.secondary_profile_genders, getSelected).length ? $filter('filter')(vm.secondary_profile_genders, getSelected)[0].value : '',
        year_of_birth:      $filter('filter')(vm.secondary_profile_years, getSelected).length   ? $filter('filter')(vm.secondary_profile_years, getSelected)[0].value : ''
      });

      return newObj;
    }


    function transformViewModel(obj){
      var newObj = {

      };

      for (var key in obj){
        if (obj[key] !== null && obj[key] !== "" && obj[key] !== 0){
          newObj[key] = obj[key];
        }
      }
      angular.extend(newObj, {
        outdoor_activities: $filter('filter')(vm.outdoor_activities, getSelected),
        groups:             $filter('filter')(vm.sensitivities, getSelected),
        gender:             $filter('filter')(vm.genders, getSelected).length ? $filter('filter')(vm.genders, getSelected)[0].value : '',
        language:           $filter('filter')(vm.languages, getSelected).length ? $filter('filter')(vm.languages, getSelected)[0].value : '',
        year_of_birth:      $filter('filter')(vm.years, getSelected).length   ? $filter('filter')(vm.years, getSelected)[0].value : ''
      });

      return newObj;
    }

    function toggleNotificationEmails(){
      vm.profile.notify_email = !vm.profile.notify_email;
      $localStorage.user.notify_email = vm.profile.notify_email;
      console.log(vm.profile.notify_email);

      DataService.Profile.toggleNotificationEmails()
      .then(function(res){
        console.log(res.data.data);
        NotificationService.show('Your notification settings have been saved');
      })
      .catch(function(res){
        NotificationService.show('There was an error saving your notification settings');
        console.error(res);
      });

    }

    function toggleNewsletter(){
      vm.profile.accept_newsletters = !vm.profile.accept_newsletters;
      $localStorage.user.accept_newsletters = vm.profile.accept_newsletters;
      console.log(vm.profile.accept_newsletters);

      DataService.Profile.toggleNewsletter()
      .then(function(res){
        console.log(res.data.data);
        NotificationService.show('Your newsletter settings have been saved');
      })
      .catch(function(res){
        NotificationService.show('There was an error saving your newsletter settings');
        console.error(res);
      });

    }          

    function togglePrivacy(){
      vm.profile.private = !vm.profile.private;
      $localStorage.user.private = vm.profile.private;

      DataService.Profile.togglePrivacy($localStorage.user.id)
      .then(function(res){
        NotificationService.show('Your privacy settings have been saved')
        .then(function(){
          //
        });
      })
      .catch(function(res){
        NotificationService.show('There was an error saving your privacy settings')
        .then(function(){
          //
        });
      });
    }

    function getSelected(option) {
      return option.selected == true;
    }

    function getOutdoorActivities(){
      $http.get(API_URL + '/content/recommendations')
      .then(function(response) {
        vm.outdoor_activities = response.data.data.activities;
      });
      vm.secondary_profile_outdoor_activities = angular.copy(vm.outdoor_activities);
    }

    function getYears(){
      var years = [];
      var start = 1950;
      var span  = 100;

      for (var i = 0; i <= span; i ++) {
        var val = start + i;
        years.push({
          id: i, name: val,
          value: val,
          selected: val == vm.profile.year_of_birth ? true : false}
        );
      }

      return years;
    }

    function getSecondaryProfileYears(){
      var years = [];
      var start = 1950;
      var span  = 50;

      for (var i = 0; i <= span; i ++) {
        var val = start + i;
        years.push({
          id: i, name: val,
          value: val,
          selected: val == vm.profile.secondary_profile.details.year_of_birth ? true : false}
        );
      }

      return years;
    }

    function getGenders(){
      var genders = [
          {
            id: 1, name: 'Male', value: 'male', selected: false
          },
          {
            id: 2, name: 'Female', value: 'female', selected: false
          },
          {
            id: 3, name: 'Other', value: 'other', selected: false
          }
        ];

        genders.forEach(function(el){
          if (el.value == vm.profile.gender){
            el.selected = true;
          }
        });

        return genders;
    }

    function getLanguages(){
      var languages = [
          {
            id: 1, name: 'English', value: 'english', selected: false
          },
          {
            id: 2, name: 'German', value: 'german', selected: false
          },
          {
            id: 3, name: 'Norwegian', value: 'norwegian', selected: false
          }
        ];

        languages.forEach(function(el){
          if (el.value == vm.profile.language){
            el.selected = true;
          }
        });

        return languages;
    }    

    function getSecondaryProfileGenders(){
      var genders = [
          {
            id: 1, name: 'Male', value: 'male', selected: false
          },
          {
            id: 2, name: 'Female', value: 'female', selected: false
          },
          {
            id: 3, name: 'Other', value: 'other', selected: false
          }
        ];

        genders.forEach(function(el){
          if (el.value == vm.profile.secondary_profile.details.gender){
            el.selected = true;
          }
        });

        return genders;
    }

    function getSensitivities(){
      $http.get(API_URL + '/content/recommendations')
      .then(function(response) {
        vm.sensitivities = response.data.data.groups;
      });
    }

    function getOptionsSelected (option, valueProperty, selectedProperty){
      if (vm[option] != undefined){
        return vm[option].filter(function(o){
          return o[selectedProperty] == true;
        })
        .map(function(group){
          return group[valueProperty];
        }).join(", ");
      } else {
        console.log('zonk')
      }
    }


    function getPhoto(){
        return CameraService.openCameraAvatar()
        .then(uploadPhoto);
    }

    function uploadPhoto(image_uri){
        vm.uploading = true;
        UploadService.uploadAvatar(image_uri, vm.photoData)
        .then(function uploadSuccess(res){
            NotificationService.show('Your profile picture has been uploaded!')
            .then(function(){
                vm.uploading = false;
                var response = JSON.parse(res.response);
                vm.profile.profile_picture = response.data.profile_picture;

                console.log('Uploaded file!', res);
            });

        }, function uploadFailure(err){
            NotificationService.show('Your profile picture failed to upload!')
            .then(function(){
                vm.uploading = false;
                console.error(':( Upload failed!', err);
            });
        }, function updateProgress(progress){
            vm.progress = Math.round(progress.loaded * 100 / progress.total);
            vm.progressStyle = {width: vm.progress + '%'};
        }).catch(function uploadFailure(err){
            NotificationService.show('Your profile picture failed to upload!')
            .then(function(){
                vm.uploading = false;
                console.error(':( Upload failed!', err);
            });
        });
    }

    function logout(){
      NotificationService
      .show('Successfully logged out')
      .then(function(){
        $localStorage.credentials = null;

        console.info('Successfully logged out');
        $rootScope.loggedIn = false;
        $state.go('auth');
      });
    }

    function cancel(){
      $state.go('profile.view');
    }

    function goBackToEdit(){
      $state.go('profile.edit');
    }

    function changePassword() {
      $http.post(API_URL + "/users/" + vm.profile.id + "/password", {
          old_password: vm.user.current_password,
          password: vm.user.new_password,
          confirm: vm.user.confirm_password
      })
      .then(function(response) {
        NotificationService
        .show('Your password has been updated')
        .then(function() {
          $state.reload();
        })
      })
      .catch(function(response) {
        NotificationService
        .show('Oops, something went wrong')
        .then(function() {
          $state.reload();
        });
      });
    }

    function deleteAccount() {
      if (vm.delete_word === 'hackAIR') {
        $http.delete(API_URL + "/users/" + vm.profile.id)
        .then(function(response) {
          NotificationService
          .show('Your account has been successfully deleted')
          .then(function() {
            // Clear $localStorage
            delete($localStorage.credentials);
            delete($localStorage.user);
            delete($localStorage.firstPhoto);
            delete($rootScope.loggedIn);
            $state.go('about');
          });
        })
        .catch(function(error) {
          NotificationService
          .show('Oops, something went wrong')
          .then(function() {
            $state.reload();
          });
        });
      }
    }

  }
})();
