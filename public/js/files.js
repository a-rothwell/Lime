var allexpenses = document.getElementById('allexpenses');

$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

firebase.auth().onAuthStateChanged(function (user) {
    // console.log(user.id);
    return firebase.database().ref('/UserInfo/' + user.uid + '/UserBudgets/').once('value').then(function (snapshot) {
        // console.log(snapshot.val());
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
        console.log("Values", values);
        var str = "";
        var dt = new Date();
        for (bug of values) {
            str = str + "<hr><h4>" + bug.name + " " + "<a id=\"share\"name=\"" + bug.BID + "\"><button type=\"button\" class=\"btn btn-sm btn-outline-default waves-effect\">Share</button></a>" +
                "</button><a href=\"message.html?BID=" + bug.BID + "\"><button type=\"button\" class=\"btn btn-sm btn-outline-success waves-effect\">Chat</button></a>" +
                "<button type=\"button\" class=\"btn btn-sm btn-outline-warning waves-effect\">Remove</button>" +
                "</h4>"
            str = str + "<table class=\"table table-bordered\"><thead>" +
                "<tr>" + "<th>Remove</th>" +
                "<th>Categories</th>" +
                "<th>Amount spent</th>" +
                "<th>Location</th>" +
                "<th>Date</th>" +
                "</tr></thead>"
            // console.log(bug)
            if (bug.Expenses == null || bug.Expenses[dt.getFullYear()] == null) {
                str = str + "</table>"
            } else {
                console.log("Bug", bug.Expenses)
                console.log("Bug", bug.Expenses[dt.getFullYear()])
                console.log(dt.getMonth())
                console.log("Bug", bug.Expenses[dt.getFullYear()][dt.getMonth()][22])
                for (d in bug.Expenses[dt.getFullYear()][dt.getMonth()]) {

                    console.log("Date", bug.Expenses[dt.getFullYear()][dt.getMonth()][d])
                    for (exp in bug.Expenses[dt.getFullYear()][dt.getMonth()][d]) {
                        if (d == "categories") {
                            break;
                        }
                        str = str +
                            "<tbody><tr>" + "<td><img src=\"../img/removeE.png\" style=\"width:3em;\"" +
                            "</td><td>";
                        console.log("Exp", bug.Expenses[dt.getFullYear()][dt.getMonth()][d][exp])

                        for (cat of bug.Expenses[dt.getFullYear()][dt.getMonth()][d][exp].categories) {
                            // console.log(cat)
                            str = str + cat + " "
                        }
                        str = str + "</td>" +
                            "<td>$" + bug.Expenses[dt.getFullYear()][dt.getMonth()][d][exp].moneyamt + "</td>" +
                            "<td>" + bug.Expenses[dt.getFullYear()][dt.getMonth()][d][exp].streetaddr + "</td>" +
                            "<td>" + bug.Expenses[dt.getFullYear()][dt.getMonth()][d][exp].date + "</td>" +
                            "</tr></tbody>"
                        // console.log(cat)
                        // console.log(bug.categories[cat])
                    }
                }
                // console.log(bug.categories)
                // console.log(bug.name)
                str = str + "</table>"

                console.log(bug.name);
                // console.log(bug.Expenses)
            }
        }
        allexpenses.innerHTML = str
        var share = document.getElementById('share');
        share.onclick = function () {
            console.log(this);
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
            console.log($('#share').attr('name'))
            toastr.info("<input id=\"shareLink\" value=\"https://lime-4e46e.firebaseapp.com/share.html?budget=" + this.name + "\" readonly>" +
                "</input><br><button class=\"btn btn-danger\"onclick=\"copyFunction()\">Copy to Clipboard</button>", "Share Link")

        }
    });
});