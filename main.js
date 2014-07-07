
var money = 0,
    karma = 0,
    day   = 0,
    timeOfDay = 0;


function insertObject (key) {
    var html = "";

    html += "<div class='object' value='"+key+"'>"+objects[key].name+" x " + objects[key].quantity + " | Buy one for " + parseInt(objects[key].cost) + "</div>";

    return html;
}

function insertAction (key) {
    var html = "";

    html += "<div class='action' value='"+key+"'>"+actions[key].name + "</div>";

    return html;
}

function update () {
    // list objects
    var selector = $("#objects").html("");
    $.each(objects, function(key, value) {
        if (objects[key].active) selector.append(insertObject(key));
    });

    // list actions
    selector = $("#actions").html("");
    $.each(actions, function(key, value) {
        if (actions[key].active) selector.append(insertAction(key));
    });

    // update top bar

    timeOfDay++; // update day
    if (timeOfDay > 3) {
        timeOfDay = 0;
        day++;
    }
    $("#day").html(day);
    $("#timeOfDay").html(timeOfDayName[timeOfDay]);

    $("#money").html(money); // update money

    if ( day === 100) end();

}

function perform(key) {
    money += actions[key].value;
    karma += actions[key].repercussion;

    actions[key].special();
}
function end () {
    showToast("YOU DIEDED");
}

function buy (value, howMany) {
    objects[value].quantity += howMany;
    objects[value].cost += objects[value].cost*0.1
}

function hideToast () {
    $("#toastMessage").fadeOut();
}
function showToast(message) {
    $("#toastMessage").html(message).center().fadeIn();
    var timeout = message.split(" ").length*260;
    setTimeout(hideToast, timeout < 8000 ? timeout : 8000 );
}

$(document).ready(function(){
    update();

    $('#objects').on('click', 'div', function() {
        var key = $(this).attr('value');
        if (objects[key].cost <= money) buy(key, 1);
        else showToast('Not enough Money');
        update();
    });

    $('#actions').on('click', 'div', function() {
        perform($(this).attr('value'));
        update();
    });
});