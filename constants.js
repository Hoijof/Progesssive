/**
 * Created by humberto.gomez on 07/07/2014.
 */

var baseCapacity = 10,
    LINE_SIZE = 150;

var objects = {
    bag: {
        name     : 'bag',
        type     : 'capacity',
        value    : 10,
        cost     : 10,
        quantity : 0,
        rent     : 0,
        active   : true,
        scale  : 0.15
    },
    kid : {
        name     : 'kid',
        type     : 'income',
        value    : 3,
        cost     : 25,
        quantity : 0,
        rent     : 1,
        active   : false,
        scale  : 0.15
    },
    enslavedKid : {
        name : 'Enslaved Kid',
        type : 'income',
        value : 10,
        cost  : -1,
        quantity : 0,
        rent : 2,
        active : false,
        scale : 0
    },
    bookOfAutomation : {
        name : "Book of automation",
        type : "special",
        value: 0,
        cost : 1000,
        quantity : 0,
        rent     : 0,
        active : false,
        scale  : 0.25
    },
    clothes : {
        name : "Clothes",
        type : "equip",
        value: 0,
        cost : 10,
        quantity : 1,
        rent : 0,
        active : true,
        scale  : 0
    }
};

var actions = {
    pickpocket : {
        name   : "Pickpocket",
        value  : 3,
        repercussion : -2,
        active : true,
        special : function(key) {
            var moneyToGain = options.useChildren.checked ? objects.kid.quantity * objects.kid.value + actions[key].value : actions[key].value;

            while (objects.clothes.quantity < objects.kid.quantity && (10) && objects.kid.quantity && options.useChildren.checked) {
                addContentToTerminal("A kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(7)) {
                addContentToTerminal("You found a kid on the street, now you'll give him a proper live.");
                objects.kid.quantity++;
                objects.kid.active = true;
            }

            if (isAppening(5)) {
                addContentToTerminal("Someone sees you stealing and calls the police. You lose all your money.");
                moneyToGain = 0;
                money = 0;
            }
            if (isAppening(10)) {
                addContentToTerminal("Someone sees you stealing and attacks you. You lose all the money you stole.");
                moneyToGain = 0;
            }

            if (moneyToGain > baseCapacity + objects.bag.quantity * objects.bag.value) {
                addContentToTerminal("You can't carry all the money you stole. You left " + (moneyToGain - (baseCapacity + objects.bag.quantity * objects.bag.value)) + " on the ground");
                money += baseCapacity + objects.bag.quantity * objects.bag.value;
            } else {
                money += moneyToGain;
            }
        }
    },
    rob : {
        name   : "Rob",
        value  : 8,
        repercussion : -6,
        active : false,
        special : function(key) {
            var moneyToGain = options.useChildren.checked ? objects.kid.quantity * objects.kid.value + actions[key].value : actions[key].value;

            if (moneyToGain > baseCapacity + objects.bag.quantity * objects.bag.value) {
                addContentToTerminal("You can't carry all the money you stole. You left " + (moneyToGain - (baseCapacity + objects.bag.quantity * objects.bag.value)) + " on the ground");
                money += baseCapacity + objects.bag.quantity * objects.bag.value;
            } else {
                money += moneyToGain;
            }
        }
    },
    beg: {
        name : 'Beg',
        value : 1,
        repercussion : 1,
        active : true,
        special : function(key) {
            var moneyToGain = options.useChildren.checked ? objects.kid.quantity * objects.kid.value + actions[key].value : actions[key].value;

            while (isAppening(10) && objects.kid.quantity && options.useChildren.checked) {
                addContentToTerminal("A kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(7)) {
                addContentToTerminal("You found a kid on the street, now you'll give him a proper live.");
                objects.kid.quantity++;
                objects.kid.active = true;
            }

            if (isAppening(10)) {
                addContentToTerminal("Someone sees you begging and gives you one extra coin.");
                moneyToGain += 1;
            }
            if (isAppening(3)) {
                addContentToTerminal("Someone sees you begging and attacks you. You lose all the money you earned.");
                moneyToGain = 0;
            }

            if (moneyToGain > baseCapacity + objects.bag.quantity * objects.bag.value) {
                addContentToTerminal("You can't carry all the money the people gave you. You left " + (moneyToGain - (baseCapacity + objects.bag.quantity * objects.bag.value)) + " on the ground");
                money += baseCapacity + objects.bag.quantity * objects.bag.value;
            } else {
                money += moneyToGain;
            }
        }
    },
    helpElders : {
        name   : 'Help elders',
        value  : 3,
        repercussion : 4,
        active : false,
        special : function(key) {
            var moneyToGain = options.useChildren.checked ? objects.kid.quantity * objects.kid.value + actions[key].value : actions[key].value;

            while (isAppening(10) && objects.kid.quantity && options.useChildren.checked) {
                addContentToTerminal("A kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(7)) {
                addContentToTerminal("You found a kid on the street, now you'll give him a proper live.");
                objects.kid.quantity++;
                objects.kid.active = true;
            }

            if (isAppening(10)) {
                addContentToTerminal("Someone sees you helping the elders and gives you two extra coin.");
                moneyToGain += 1;
            }
            if (isAppening(3)) {
                addContentToTerminal("Someone sees you helping the elders and robs you. You lose all the money you earned.");
                moneyToGain = 0;
            }

            if (moneyToGain > baseCapacity + objects.bag.quantity * objects.bag.value) {
                addContentToTerminal("You can't carry all the money the elders gave you. You left " + (moneyToGain - (baseCapacity + objects.bag.quantity * objects.bag.value)) + " on the ground");
                money += baseCapacity + objects.bag.quantity * objects.bag.value;
            } else {
                money += moneyToGain;
            }
        }
    },
    giveKidToAdoption : {
        name : 'Give kid to adoption',
        value : 0,
        repercussion : 10,
        active : false,
        special : function(key) {
            objects.kid.quantity--;
        }
    },
    enslaveKid : {
        name : 'Enslave kid',
        value : 0,
        repercussion : -15,
        active : false,
        special : function (key) {
            objects.kid.quantity--;
            objects.kid.enslavedKid++;
        }
    }
};

var options = {
    useChildren : {
        name    : "Use children",
        active  : false,
        checked : false
    },
    useEnslavedKids : {
        name : "Use enslaved kids",
        activate : false,
        checked : false
    }
};
var timeOfDayName = ['morning', 'midday', 'afternoon', 'night'];
