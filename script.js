//database fetch functions
//Create the structure for the user data as specified.
//Use async functions to fetch data from three different databases.
//Execute the fetch operations concurrently to meet the time constraint.
//Ensure the function handles invalid IDs and other potential errors.


const fetchUserData = (id) => new Promise(resolve => setTimeout(() => resolve({ id, name: `User${id}`, username: `user${id}`, email: `user${id}@example.com` }), 100));
const fetchAddressData = (id) => new Promise(resolve => setTimeout(() => resolve({ street: `Street ${id}`, suite: `Suite ${id}`, city: `City ${id}`, zipcode: `Zip${id}`, geo: { lat: `${id}0.0`, lng: `${id}0.0` } }), 100));
const fetchCompanyData = (id) => new Promise(resolve => setTimeout(() => resolve({ name: `Company ${id}`, catchPhrase: `CatchPhrase ${id}`, bs: `BS ${id}` }), 100));

async function getUserData(id) {
    // Validate ID
    if (typeof id !== 'number' || id < 1 || id > 10) {
        throw new Error('Invalid ID');
    }

    // Fetch data concurrently
    try {
        const [userData, addressData, companyData] = await Promise.all([
            fetchUserData(id),
            fetchAddressData(id),
            fetchCompanyData(id)
        ]);

        // Assemble the final object
        const result = {
            id: userData.id,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            address: {
                street: addressData.street,
                suite: addressData.suite,
                city: addressData.city,
                zipcode: addressData.zipcode,
                geo: {
                    lat: addressData.geo.lat,
                    lng: addressData.geo.lng
                }
            },
            phone: `Phone${id}`, // Mocked as not provided
            website: `website${id}.com`, // Mocked as not provided
            company: {
                name: companyData.name,
                catchPhrase: companyData.catchPhrase,
                bs: companyData.bs
            }
        };

        return result;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}

// Test the function
(async () => {
    try {
        const user = await getUserData(1);
        console.log(user);
    } catch (error) {
        console.error(error.message);
    }
})















//In this code:
//We define the getUserData function that fetches data from the central database to determine which database to access, then fetches user information from that database and the vault.The function constructs the final user data object and returns it.
//We also define a testUserData function to test the getUserData function with various user IDs, including valid and invalid ones.
//We call the testUserData function to execute the tests.
//Let's write the code for this:
import { central, db1, db2, db3, vault } from "./databases.js";

const dbs = {
    db1: db1,
    db2: db2,
    db3: db3,
};


// Define the function to fetch user data
const getUserData = async (id) => {
    try {
        // Fetch the database identifier from the central database
        const databaseName = await central(id);

        // Fetch user basic information from the appropriate database
        const basicInfo = await dbs[databaseName](id);

        // Fetch user personal information from the vault
        const vaultInfo = await vault(id);

        // Construct the final user data object
        const userData = {
            id,
            name: vaultInfo.name,
            username: basicInfo.username,
            email: vaultInfo.email,
            address: vaultInfo.address,
            phone: vaultInfo.phone,
            website: basicInfo.website,
            company: basicInfo.company,
        };

        return userData;
    } catch (error) {
        // Handle errors from individual databases
        return Promise.reject(`Error retrieving data: ${error}`);
    }
};

// Test the function
const testUserData = async () => {
    try {
        // Test with valid user IDs (1 to 10)
        for (let id = 1; id <= 10; id++) {
            console.log(`Fetching data for user with ID ${id}:`);
            const userData = await getUserData(id);
            console.log(userData);
        }

        // Test with invalid user IDs
        console.log(`Fetching data for user with invalid ID (-1):`);
        await getUserData(-1); // This should reject

        console.log(`Fetching data for user with invalid ID (11):`);
        await getUserData(11); // This should reject
    } catch (error) {
        console.error(error);
    }
};

// Call the test function
testUserData();