let TownRoadmap = [
    "Pet Shop-Farm", "Pet Shop-Grete's House", "Pet Shop-School",
    "School-Ernie's House",
    "Grete's House-Farm", "Grete's House-Shop", "Grete's House-Ernie's House",
    "Ernie's House-Daria's House",
    "Shop-Marketplace", "Shop-Town Hall",
    "Farm-Warehouse", "Farm-Marketplace",
    "Marketplace-Post Office", "Marketplace-Town Hall",
    "Town Hall-Bob's House", "Town Hall-Daria's House",
    "Daria's House-Bus Stop",
    "Warehouse-Restaurant", "Warehouse-Post Office",
    "Post Office-Alice's House",
    "Restaurant-Park", "Restaurant-Alice's House",
    "Alice's House-Cabin", "Alice's House-Bob's House",
    "Bob's House-Chris' House", "Bob's House-Bus Stop",
    "Bus Stop-Chris' House",
    "Park-Castle", "Park-Cabin",
    "Cabin-Forest", "Cabin-Chris' House",
    "Castle-Forest"
];

let NumberOfDeliveryRuns;
let NumberOfPackages;

let TownLocations = Object.create(null);
let Packages = [];

let ActivityLog = document.getElementById("robot-activity-log");

class Package {
    constructor(PickupLocation, DeliveryDestination) {
        this.pickupAt = PickupLocation;
        this.deliverTo = DeliveryDestination;
    }
}

function AssignConditions() {
    SetDeliveryNumber();
    SetPackageNumber();
    ActivityLog.innerHTML = "<h1>Hi! I'm the delivery robot, Robi! Here is my activity log!</h1>";
    ActivityLog.innerHTML += "<hr>";
}

function ResetConditions() {
    var DeliveryInput = document.getElementById("numberOfDeliveryRuns");
    var PackageInput = document.getElementById("numberOfPackages");

    DeliveryInput.value = 1;
    PackageInput.value = 5;

    NumberOfDeliveryRuns = DeliveryInput.value;
    NumberOfPackages = PackageInput.value;

    ActivityLog.innerHTML = "<h1>Hi! I'm the delivery robot, Robi! Here is my activity log!</h1>";
    ActivityLog.innerHTML += "<hr>";

    console.log("Number of deliveries reset to : " + NumberOfDeliveryRuns);
    console.log("Number of packages reset to : " + NumberOfPackages);
}

function SetPackageNumber() {
    var PackageInput = document.getElementById("numberOfPackages");

    NumberOfPackages = PackageInput.value;
    // console.log("Number of packages set to : " + NumberOfPackages);
}

function SetDeliveryNumber() {
    var DeliveryInput = document.getElementById("numberOfDeliveryRuns");

    NumberOfDeliveryRuns = DeliveryInput.value;
    console.log("Number of deliveries set to : " + NumberOfDeliveryRuns);
}

function CreateTownLocations(Roadmap) {
    // Reset the object
    TownLocations = Object(null);

    function AddLocation(from, to) {
        // If object doesn't exist create it, otherwise push a value to it
        if (TownLocations[from] == null) {
            TownLocations[from] = [to];
        } else {
            TownLocations[from].push(to);
        }
    }

    // Split each path of roadmap and try adding those objects
    for (let [from, to] of Roadmap.map(x => x.split("-"))) {
        AddLocation(from, to);
        AddLocation(to, from)
    }

    console.log(TownLocations);
}

function GetRandomNumber(ValueMultiplier) {
    return Math.floor(Math.random() * ValueMultiplier);
}

function CreatePackages(numberOfPackages) {
    // Reset the array
    Packages = [];

    // Settings
    let TownLocationKeys = Object.keys(TownLocations);
    let TownLocationsNumber = TownLocationKeys.length;
    let AssignedLocations = []; // Tracks locations with a package so they can't get another one
    let tempPickup, tempDestination;

    for (let i = 0; i < numberOfPackages; i++) {
        // Pick a random pickup location
        do {
            tempPickup = TownLocationKeys[GetRandomNumber(TownLocationsNumber)];
        } while (AssignedLocations.includes(tempPickup)); // If location was already picked, pick again

        AssignedLocations.push(tempPickup);


        // Pick a random delivery location
        do {
            tempDestination = TownLocationKeys[GetRandomNumber(TownLocationsNumber)];
        } while (tempPickup == tempDestination); // if equal to pickup location, pick again


        Packages.push(new Package(tempPickup, tempDestination));
        //ActivityLog.innerHTML += "<h3>Package No." + Packages.length + " Generated! </h3>";
    }

    console.log("Created packages : ");
    console.log(Packages);
    ActivityLog.innerHTML += "<h2>" + Packages.length + " packages ready!</h2>";
}

function BeginDelivery() {
    // Initialise State
    AssignConditions();
    CreateTownLocations(TownRoadmap);

    for (let j = 0; j < NumberOfDeliveryRuns; j++) {

        CreatePackages(NumberOfPackages);

        // Trackers 
        let CurrentLocation = "Post Office"; // Starting location
        let PackageArray = Packages; // Utility array, prevents data loss
        let CollectedPackagesArray = []; // Tracks collected packages
        let StepsCollecting = 0; // Tracks steps taken by robot to collect
        let StepsDelivering = 0; // Tracks steps taken by robot to deliver

        ActivityLog.innerHTML += "<h1>Robi : \"I'm going out to collect packages!\"</h1>";
        ActivityLog.innerHTML += "<hr>";


        console.log("Package Number : " + Packages.length);

        // Package Pickup 
        while (CollectedPackagesArray.length < Packages.length) {
            AvailableLocationsNumber = TownLocations[CurrentLocation].length; // Number of locations from the current location
            CurrentLocation = TownLocations[CurrentLocation][GetRandomNumber(AvailableLocationsNumber)];
            StepsCollecting++;

            for (let package of PackageArray) { // Loop through available packages
                if (CurrentLocation == package.pickupAt) { // If at location with a package, pick it up
                    ActivityLog.innerHTML += "<h3>Robi : \"Package picked up at " + package.pickupAt + " destination at " + package.deliverTo + "\"</h3>"

                    CollectedPackagesArray.push(package); // Memorise collected package.
                    PackageArray = PackageArray.filter(x => x != package); // Remove collected package from utility array
                }
            }
        }

        ActivityLog.innerHTML += "<hr>";
        ActivityLog.innerHTML += "<h1>Robi : \"All packages collected in " + StepsCollecting + " steps!\"</h1>";
        ActivityLog.innerHTML += "<hr>";

        //console.log(CollectedPackagesArray);

        ActivityLog.innerHTML += "<h1>Robi : \"I'm going to start delivering packages!\"</h1>";
        ActivityLog.innerHTML += "<hr>";

        while (CollectedPackagesArray.length > 0) {
            for (let package of CollectedPackagesArray) {
                if (CurrentLocation == package.deliverTo) {
                    ActivityLog.innerHTML += "<h3>Robi : \"Package delivered to " + package.deliverTo + " from " + package.pickupAt + "\"</h3>"

                    CollectedPackagesArray = CollectedPackagesArray.filter(x => x != package);
                }
            }

            AvailableLocationsNumber = TownLocations[CurrentLocation].length;
            CurrentLocation = TownLocations[CurrentLocation][GetRandomNumber(AvailableLocationsNumber)];
            StepsDelivering++;
        }

        ActivityLog.innerHTML += "<hr>";
        ActivityLog.innerHTML += "<h1>Robi : \"All packages delivered in " + StepsDelivering + " steps!\"</h1>";
        ActivityLog.innerHTML += "<hr>";
        ActivityLog.innerHTML += "<h1 class=\"task-complete\">Robi : \"Task completed in " + (StepsCollecting + StepsDelivering) + " steps!\"</h1>";
        ActivityLog.innerHTML += "<hr>";
        ActivityLog.innerHTML += "<hr>";
    }
}