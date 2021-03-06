var budgetSummary = document.getElementById('budgetSummary');

firebase.auth().onAuthStateChanged(function (user) {
    if (window.location.pathname == '/home.html') {
        return firebase.database().ref('/UserInfo/' + user.uid + '/UserBudgets/').once('value').then(function (snapshot) {
            var reads = [];
            snapshot.forEach(function (childSnapshot) {
                var id = childSnapshot.key;
                // console.log(id);
                var promise = firebase.database().ref('/Budgets/' + id).once('value').then(function (snap) {
                    return snap.val();
                    // The Promise was fulfilled.
                }, function (error) {
                    console.error(error);
                });
                // console.log(promise);
                reads.push(promise);
            });
            return Promise.all(reads);
        }, function (error) {
            console.error(error);
        }).then(function (values) {
            var str = ''
            for (var bug of values) {
                str = str + "<hr><h4>" + 
                        bug.name + " " + 
                        "<a id=\"share\"name=\"" + bug.BID +
                         "\"><button type=\"button\" onclick=\"share(" + "\'" + bug.BID +"\'" + ")\" class=\"btn btn-sm btn-outline-default waves-effect\">Share</button></a>" +
                        "</button><a href=\"message.html?BID=" + bug.BID + "\"><button type=\"button\" class=\"btn btn-sm btn-outline-success waves-effect\">Chat</button></a>" +
                    "</h4>"
                str = str + "<table width=\"90%\" style=\"width:90%;\" class=\"table table-bordered\"><thead>" +
                        "<tr>" +
                        "<th>Category</th>" +
                        "<th>Left</th>" +
                        "<th>Total</th>" +
                    "</tr></thead>"
                var dt = new Date();
                var year = String(dt.getFullYear());
                var month = String(dt.getMonth());
                if (bug.Expenses == null) {
                    for (var cat in bug.categories) {
                        // console.log("Cat", cat)
                        str = str +
                            "<tbody><tr>" +
                            "<td>" + cat + "</td>" +
                            "<td>$" + 0 + "</td>" +
                            "<td>$" + bug.categories[cat].total + "</td>" +
                            "</tr></tbody>"
                    }
                    str = str + "</table>"
                } else {
                    // console.log("Budget", bug.Expenses[year][month])

                    // console.log(bug.Expenses[dt.getFullYear()][dt.getMonth()][cat])
                    // console.log("BUG CATS", bug.categories)
                    for (var cat in bug.categories) {
                        // console.log("Cat", cat)
                        var spent;
                        if (bug.Expenses[dt.getFullYear()][dt.getMonth()].categories[cat] == undefined) {
                            spent = 0
                        } else {
                            spent = bug.Expenses[dt.getFullYear()][dt.getMonth()].categories[cat].spent
                        }
                        str = str +
                            "<tbody><tr>" +
                            "<td>" + cat + "</td>" +
                            "<td>$" + (bug.categories[cat].total - spent) + "</td>" +
                            "<td>$" + bug.categories[cat].total + "</td>" +
                            "</tr></tbody>"
                    }
                    str = str + "</table>"
                }
            }
            budgetSummary.innerHTML = str;
        });
    }
});

function share(button) {
    console.log(button.toString());
    
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": 0,
        "extendedTimeOut": 0,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    }
    // console.log($('#share').attr('name'))
    toastr.info("<input id=\"shareLink\" value=\"https://lime-4e46e.firebaseapp.com/share.html?budget=" + button.toString() + "\" readonly>" +
        "</input><br><button class=\"btn btn-danger\"onclick=\"copyFunction()\">Copy to Clipboard</button>", "Share Link")
    
    }