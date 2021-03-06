var budgetSelect = document.getElementById('budgetSelect');
var catogoriesSelect = document.getElementById('catogoriesSelect');
var moneyamt = document.getElementById("moneyamt");
var streetaddr = document.getElementById("streetaddr");
var newExpenseButton = document.getElementById("newExpenseButton");

newExpenseButton.onclick = function () {
    var foo = $('#budgetSelect');
    var bar = $('#catogoriesSelect').val();
    console.log(foo.val(), foo.text(), bar)
    console.log(moneyamt.value);
    console.log(streetaddr.value);
    var rv = {}
    for (var i = 0; i < bar.length; ++i) {
        rv[i] = bar[i];
    }
    var dt = new Date();
    console.log(rv);
    var expense = {
        streetaddr: streetaddr.value,
        moneyamt: moneyamt.value,
        categories: rv,
        date: dt.toUTCString()
    }
    var expenseID = firebase.database().ref().child('/Budgets/' + foo.val() + '/Expenses/' + dt.getFullYear() + '/' + dt.getMonth() + '/' + dt.getDate()).push().key;
    var updates = {};

    for (let cat in rv) {
        console.log(rv[cat]);
        firebase.database().ref('/Budgets/' + foo.val() + '/categories/' + rv[cat] + '/spent').once('value').then(function (snap) {
            console.log(rv[cat]);
            console.log("Current Value", parseInt(snap.val()));
            console.log("New Value", parseInt(snap.val()) + parseInt(moneyamt.value));

            updates['/Budgets/' + foo.val() + '/Expenses/' + dt.getFullYear() + '/' + dt.getMonth() + '/' +'/categories/' + rv[cat] + '/spent'] = parseInt(snap.val()) + parseInt(moneyamt.value);
            // updates['/Budgets/' + foo.val() + '/categories/' + rv[cat] + '/spent'] = parseInt(snap.val()) + parseInt(moneyamt.value);
            updates['/Budgets/' + foo.val() + '/Expenses/' + dt.getFullYear() + '/' + dt.getMonth() + '/' + dt.getDate() + '/' + expenseID] = expense;

            return firebase.database().ref().update(updates);
        }, function (error) {
            console.error(error);
        }).then(() => {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": false,
                "positionClass": "toast-bottom-center",
                "preventDuplicates": false,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
              toastr.success("Submitted");
              moneyamt.value = '';
              streetaddr.value = '';
        });
    }
}

$(document).ready(function () {
    $('.js-example-basic-single').select2();
    $('.js-example-basic-multiple').select2();
});

$("#budgetSelect").on('change', function () {
    console.log(budgetSelect.value)
    var user = firebase.auth().currentUser;
    return firebase.database().ref('/UserInfo/' + user.uid + '/UserBudgets/').once('value').then(function (snapshot) {
        var reads = [];
        snapshot.forEach(function (childSnapshot) {
            var id = childSnapshot.key;
            console.log(id);
            var promise = firebase.database().ref('/Budgets/' + id).once('value').then(function (snap) {
                return snap.val();
                // The Promise was fulfilled.
            }, function (error) {
                console.error(error);
            });
            console.log(promise);
            reads.push(promise);
        });
        return Promise.all(reads);
    }, function (error) {
        console.error(error);
    }).then(function (values) {
        console.log(values);
        var i = 0;
        for (var bug of values) {
            if (bug.name == $('#budgetSelect option:selected').text()) {
                break;
            }
            i++;
        }
        console.log(i);
        var str1 = ''
        for (var cat in values[i].categories) {
            console.log(cat)
            str1 = str1 + "<option value=\"" + cat + "\">" + cat + "</option>"
        }

        catogoriesSelect.innerHTML = str1;
    });
});

firebase.auth().onAuthStateChanged(function (user) {
    return firebase.database().ref('/UserInfo/' + user.uid + '/UserBudgets/').once('value').then(function (snapshot) {
        var reads = [];
        snapshot.forEach(function (childSnapshot) {
            var id = childSnapshot.key;
            console.log(id);
            var promise = firebase.database().ref('/Budgets/' + id).once('value').then(function (snap) {
                return snap.val();
                // The Promise was fulfilled.
            }, function (error) {
                console.error(error);
            });
            console.log(promise);
            reads.push(promise);
        });
        return Promise.all(reads);
    }, function (error) {
        console.error(error);
    }).then(function (values) {
        console.log(values);
        var str = ''
        for (var bug of values) {
            str = str + "<option value=\"" + bug.BID + "\">" + bug.name + "</option>"
        }
        console.log(values[0]);
        var str1 = ''
        for (var cat in values[0].categories) {
            console.log(cat)
            // console.log(bug.categories[cat])
            str1 = str1 + "<option value=\"" + cat + "\">" + cat + "</option>"
        }

        console.log(str);
        budgetSelect.innerHTML = str;
        catogoriesSelect.innerHTML = str1;
    });
});

function simulateData() {
    moneyamt.value = 12;
    streetaddr.value = "305 N University St, West Lafayette, IN 47907";
}