// Script to check and clear localStorage authentication data
console.log("Checking localStorage for authentication data...");

const authKeys = ['user', 'token', 'role'];
let hasAuthData = false;

authKeys.forEach(key => {
  const value = localStorage.getItem(key);
  if (value) {
    console.log(`Found ${key}:`, value);
    hasAuthData = true;
  } else {
    console.log(`No ${key} found in localStorage`);
  }
});

if (hasAuthData) {
  console.log("\nAuthentication data found in localStorage. This might be causing the navbar to show logged-in state.");
  console.log("To clear this data, run: localStorage.clear() in browser console");
} else {
  console.log("\nNo authentication data found in localStorage.");
}
