/**
 * Created by humberto.gomez on 07/07/2014.
 */

var objects = [{
    name     : 'bag',
    type     : 'capacity',
    value    : 10,
    cost     : 10,
    quantity : 0,
    active   : true
},{
    name     : 'kid',
    type     : 'income',
    value    : 10,
    cost     : 25,
    quantity : 0,
    active   : true
}];

var actions = [{
    name   : "Pickpocket",
    value  : 1,
    repercussion : -1,
    active : true,
    special : function() {
        return true;
    }
},
{
    name   : "Rob",
    value  : 5,
    repercussion : -6,
    active : false,
    special : function() {
        return true;
    }
},
{
    name : 'Beg',
    value : 1,
    repercussion : 1,
    active : true,
    special : function() {
        return true;
    }
},
{
    name   : 'Help elders',
    value  : 3,
    repercussion : 4,
    active : false,
    special : function() {
        return true;
    }
}];


var timeOfDayName = ['morning', 'midday', 'afternoon', 'night'];
