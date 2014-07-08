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
        iniCost : 10,
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
        iniCost : 25,
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
        iniCost : -1,
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
        iniCost : 1000,
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
        iniCost : 10,
        cost : 10,
        quantity : 1,
        rent : 0,
        active : true,
        scale  : 0
    },
    basicGun : {
        name : "Gun",
        type : "equip",
        value : 0,
        iniCost : 100,
        cost : 100,
        quantity : 0,
        rent : 0,
        active : false,
        scale : 0.60
    },
    policeUniform : {
        name : "Police Uniform",
        type : "equip",
        value : 0,
        iniCost : 150,
        cost : 150,
        quantity : 0,
        rent : 0,
        active : false,
        scale : 0.85
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
            moneyToGain += options.useEnslavedKids.checked ? objects.enslavedKid.quantity * objects.enslavedKid.value : 0;
            moneyToGain = parseInt(moneyToGain * getRandom(0.90,1.10));

            while (objects.clothes.quantity < objects.kid.quantity && (10) && objects.kid.quantity && options.useChildren.checked) {
                addContentToTerminal("A kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(10) && objects.enslavedKid.quantity && options.useEnslavedKids.checked) {
                addContentToTerminal("A slaved kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(7)) {
                addContentToTerminal("You found a kid on the street, now you'll give him a proper live.");
                objects.kid.quantity++;
                objects.kid.active = true;
            }

            if (isAppening(10)) {
                addContentToTerminal("You found a gun in the belongings of one of your victims");
                objects.basicGun.quantity++;
            }

            if (isAppening(4)) {
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

            addContentToTerminal("You pickpoketed " + moneyToGain + " coins");
        }
    },
    rob : {
        name   : "Rob",
        value  : 8,
        repercussion : -6,
        active : false,
        special : function(key) {
            var moneyToGain = options.useChildren.checked ? objects.kid.quantity * objects.kid.value + actions[key].value : actions[key].value;
            moneyToGain += options.useEnslavedKids.checked ? objects.enslavedKid.quantity * objects.enslavedKid.value : 0;
            moneyToGain = parseInt(moneyToGain * getRandom(0.90,1.10));

            while (objects.clothes.quantity < objects.kid.quantity && (10) && objects.kid.quantity && options.useChildren.checked) {
                addContentToTerminal("A kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(10) && objects.enslavedKid.quantity && options.useEnslavedKids.checked) {
                addContentToTerminal("A slaved kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(7)) {
                addContentToTerminal("You found a kid on the street, now you'll give him a proper life. Maybe you should dress him..");
                objects.kid.quantity++;
                objects.kid.active = true;
            }

            if (isAppening(10)) {
                addContentToTerminal("You found a gun in the belongings of one of your victims");
                objects.basicGun.quantity++;
            }

            if (isAppening(10)) {
                addContentToTerminal("Someone sees you robing and calls the police.");
                if (objects.policeUniform.quantity && options.usePoliceUniform.checked) {
                    if (isAppening(40)) {
                        addContentToTerminal("The police officer confuses you with one of his mates");
                    } else {
                        addContentToTerminal("The police officer recognizes you as a robber and fights you.");
                        if (isAppening(20 + pointsPerObjects())) {
                            addContentToTerminal("You fight the police officer and kill him. You take his gun and his uniform.");
                            objects.policeUniform.quantity++;
                            objects.basicGun.quantity++;
                        } else{
                            addContentToTerminal("You fight the police officer and he arrests you. You go to jail.");
                            loseEverything();
                            money = 0;
                            moneyToGain = 0;
                            toJail(getRandomInt(5,10));
                        }

                    }
                } else if (isAppening(20 + pointsPerObjects())) {
                    addContentToTerminal("You fight the police officer and kill him. You take his gun and his uniform.");
                    objects.policeUniform.quantity++;
                    objects.basicGun.quantity++;
                } else {
                    addContentToTerminal("You fight the police officer and he arrests you. You go to jail.");
                    loseEverything();
                    money = 0;
                    moneyToGain = 0;
                    toJail(getRandomInt(2,5));
                }
            }
            if (isAppening(6)) {
                addContentToTerminal("Someone sees you robing and attacks you. You kill him and take his money.");
                moneyToGain += 10;
            }

            if (moneyToGain > baseCapacity + objects.bag.quantity * objects.bag.value) {
                addContentToTerminal("You can't carry all the money you stole. You left " + (moneyToGain - (baseCapacity + objects.bag.quantity * objects.bag.value)) + " on the ground");
                money += baseCapacity + objects.bag.quantity * objects.bag.value;
            } else {
                money += moneyToGain;
            }

            addContentToTerminal("You robbed " + moneyToGain + " coins");
        }
    },
    beg: {
        name : 'Beg',
        value : 1,
        repercussion : 1,
        active : true,
        special : function(key) {
            var moneyToGain = options.useChildren.checked ? objects.kid.quantity * objects.kid.value + actions[key].value : actions[key].value;
            moneyToGain += options.useEnslavedKids.checked ? objects.enslavedKid.quantity * objects.enslavedKid.value : 0;
            moneyToGain = parseInt(moneyToGain * getRandom(0.90,1.10));

            while (objects.clothes.quantity < objects.kid.quantity && (10) && objects.kid.quantity && options.useChildren.checked) {
                addContentToTerminal("A kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(10) && objects.enslavedKid.quantity && options.useEnslavedKids.checked) {
                addContentToTerminal("A slaved kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(7)) {
                addContentToTerminal("You found a kid on the street, now you'll give him a proper life. Maybe you should dress him.");
                objects.kid.quantity++;
                objects.kid.active = true;
            }

            if (isAppening(10)) {
                addContentToTerminal("Someone sees you begging and gives you one extra coin.");
                moneyToGain += 1;
            }

            if (money > 300 && isAppening(60)){
                addContentToTerminal("A stranger asks you if you want a job. He says that he could look for a job suitable for you for the price of 300 coins");
                actions.postForJob.active = true;
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

            addContentToTerminal("You begged " + moneyToGain + " coins");
        }
    },
    helpElders : {
        name   : 'Help elders',
        value  : 3,
        repercussion : 4,
        active : false,
        special : function(key) {
            var moneyToGain = options.useChildren.checked ? objects.kid.quantity * objects.kid.value + actions[key].value : actions[key].value;
            moneyToGain += options.useEnslavedKids.checked ? objects.enslavedKid.quantity * objects.enslavedKid.value : 0;
            moneyToGain = parseInt(moneyToGain * getRandom(0.90,1.10));

            while (objects.clothes.quantity < objects.kid.quantity && (10) && objects.kid.quantity && options.useChildren.checked) {
                addContentToTerminal("A kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(10) && objects.enslavedKid.quantity && options.useEnslavedKids.checked) {
                addContentToTerminal("A slaved kid was taken by the police. Those heartless bastards.");
                objects.kid.quantity--;
            }
            while (isAppening(7)) {
                addContentToTerminal("You found a kid on the street, now you'll give him a proper life. Maybe you should dress him..");
                objects.kid.quantity++;
                objects.kid.active = true;
            }

            if (money > 300 && isAppening(60)){
                addContentToTerminal("A stranger asks you if you want a job. He says that he could look for a job suitable for you for only 300 coins");
                actions.postForJob.active = true;
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

            addContentToTerminal("You earned " + moneyToGain + " coins");
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
            objects.enslavedKid.quantity++;
        }
    },
    postForJob : {
        name : "Post for job",
        value : 0,
        repercussion : 10,
        active : false,
        special : function () {
            if (money >= 300) {
                money -= 300;
                if (isAppening(70)) {
                    var time = getRandomInt(4,8),
                        cost = getRandomInt(1,3);
                    addContentToTerminal('The man tells you that he has a job for you, you can do it for at least ' + time + ' weeks and in shifts of ' + cost + ' parts of the day.');
                    addJobToActions(time, cost);
                } else {
                    addContentToTerminal('The man tells you that he has no jobs for you');
                }
            } else {
                addContentToTerminal("You don't have enough money.");
            }
        }
    },
    jobs : []
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
    },
    useWeapons : {
        name : "Use weapons",
        activate : false,
        checked : false
    },
    usePoliceUniform : {
        name : "Use police uniform if necesary",
        activate : false,
        checked : false
    }
};
var timeOfDayName = ['morning', 'midday', 'afternoon', 'night'];
