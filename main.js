
var money = 25,
    karma = 0,
    day   = 0,
    timeOfDay = 0,
    maxChildrenUsed = 0,
    totalChildrenUses = 0;


function insertObject (key) {
    var html = "";

    html += "<div class='object' value='"+key+"'>"+objects[key].name+" x " + objects[key].quantity;
    if (objects[key].cost > 0) html += " | <span class='buy'> Buy one for " + parseInt(objects[key].cost) + "</span>";
    if (objects[key].quantity > 0 && objects[key].cost > 0) html += "<span class='sell'> | Sell one for " + parseInt(objects[key].cost*0.65) +" </span>";

    if (objects[key].rent > 0) html += " | Rent of " + objects[key].rent + " per day ";
    html += "</div>";

    return html;
}

function insertAction (key) {
    var html = "";

    html += "<div class='action' value='"+key+"'>"+actions[key].name + "</div>";

    return html;
}

function insertOption (key) {
    var html = "";

    if (options[key].checked) {
        html += "<div class='action' value='"+key+"'><input type='checkbox' checked='checked'>"+options[key].name + "</div>";
    } else {
        html += "<div class='action' value='"+key+"'><input type='checkbox'>"+options[key].name + "</div>";
    }


    return html;
}

function addContentToTerminal(text) {
    if(text === "") return;
    text = "<b>Day " + day + " " + timeOfDayName[timeOfDay] + ": </b>" + text;
    var numberOfMessages = Math.ceil(text.length/LINE_SIZE);
    for (var i = 0; i < numberOfMessages; i++) {
        $("#messages").prepend("<div>" + text.substring(i*LINE_SIZE,i*LINE_SIZE+LINE_SIZE) + "</div>");
        if($("#messages").find('div').last().position().top > $("#messages").position().top + $("#messages").height() ) $("#messages").find('div').last().remove();
    }
}

function callADay() {
    // Pay rents
    var totalRent = 0;
    $.each(objects, function(key, value) {
        totalRent += value.rent*value.quantity;
    });

    if (totalRent > 0 ) {
        addContentToTerminal("You pay a total of " + totalRent + " in maintenance costs.");
        money -= totalRent;
    } else if (totalRent < 0) {
        addContentToTerminal("You receive a total of " + totalRent + " in total benefits.");
        money -= totalRent;
    }
}

function checkActions () {
    if (karma > -50 && karma < -15) {
        actions.rob.active = true;
        actions.helpElders.active = false;
    } else if ( karma < 50 && karma > 15) {
        actions.rob.active = false;
        actions.helpElders.active = true;
    }

    if (objects.kid.quantity > 0) {
        actions.enslaveKid.active = true;
        actions.giveKidToAdoption.active = true;
    } else {
        actions.enslaveKid.active = false;
        actions.giveKidToAdoption.active = false;
    }
}

function checkOptions () {
    if (objects.kid.quantity > 0) {
        options.useChildren.active = true;
    } else {
        options.useChildren.active = false;
    }

    if (objects.enslavedKid.quantity > 0) {
        options.useEnslavedKids.active = true;
    } else {
        options.useEnslavedKids.active = false;
    }
}

function updateObjects () {
    $.each(objects, function(key, value) {
        if (value.quantity > 0) value.active = true;
    });
}

function update () {
    if (money < 0) $("#money").css("color","red");
    else $("#money").css("color","white");

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

    // list options

    checkOptions();
    checkActions();

    selector = $("#options").html("");
    $.each(options, function(key, value) {
        if (options[key].active) selector.append(insertOption(key));
    });

    // update top bar

    timeOfDay++; // update day
    if (timeOfDay > 3) {
        timeOfDay = 0;
        day++;
        callADay();
    }
    $("#day").html(day);
    $("#timeOfDay").html(timeOfDayName[timeOfDay]);

    $("#money").html(money); // update money

    if ( day === 100) end();

    // update children uses

    maxChildrenUsed = maxChildrenUsed < objects.kid.quantity ? maxChildrenUsed = objects.kid.quantity : maxChildrenUsed;
    if (options.useChildren.checked) totalChildrenUses += objects.kid.quantity;
}

function perform(key) {
    //money += actions[key].value;
    karma += actions[key].repercussion;

    actions[key].special(key);
}
function end () {
    showToast("YOU DIEDED");
}

function buy (value, howMany) {

    objects[value].quantity += howMany;
    money -= objects[value].cost;
    objects[value].cost += parseInt(objects[value].cost*objects[value].scale);

    update();
}
function sell (value, howMany) {
    objects[value].quantity -= howMany;
    money += parseInt(objects[value].cost*objects[value].scale);
    objects[value].cost -= parseInt(objects[value].cost*objects[value].scale);

    update();
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

    $(document).on('click', '#objects .buy', function() {
        var key = $(this).parent().attr('value');
        if (objects[key].cost <= money) buy(key, 1);
        else showToast('Not enough Money');
        update();
    });

    $(document).on('click', '#objects .sell', function() {
        var key = $(this).parent().attr('value');
        sell(key, 1);
        update();
    });

    $(document).on('click', '#options div input', function() {
        var key = $(this).parent().attr('value');
        options[key].checked ? options[key].checked = false : options[key].checked = true;
    });


    $(document).on('click', '#actions div', function() {
        perform($(this).attr('value'));

        if(objects.bookOfAutomation.active=false) {
            if (isAppening(5)) {
                objects.bookOfAutomation.active=true;
                objects.bookOfAutomation.quantity = 1;
                addContentToTerminal("You find a book named Book of Automation, you read it and you learn how to do " +
                    "things automatically. You will need the book in order to don't forget this knowledge");
            }
        }
        update();
    });

    $(document).keypress(function(e){
        if (e.keyCode === 32) { // space key

            return false;
        }

        return true;
    });
});