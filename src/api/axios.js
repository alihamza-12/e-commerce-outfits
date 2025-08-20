// import axios from "axios";
// export default axios.create({
//   baseURL: "https://your-api-url.com",
//   // ...other config
// });

// Dummy axios for local development
export default {
    post(url, data) {
        // Simulate a successful login/signup and store token in localStorage
        if (url === "/login") {
            localStorage.setItem("Token", "dummy_token");
            return Promise.resolve({ data: { data: { access_token: "dummy_token" } } });
        }
        if (url === "/register") {
            // Simulate registration
            return Promise.resolve({ data: { message: "Registered" } });
        }
        return Promise.reject(new Error("Unknown endpoint"));
    }
};

// const response = await axios.post("/login", { email, password, role });
// localStorage.setItem("Token", response.data.access_token); // Store real JWT