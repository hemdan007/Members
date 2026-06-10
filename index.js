const MemberItem = { // Component to display individual member details
    props: ['member'], // Accepts a 'member' object as a prop

    // Template for displaying member details in a list item
    template: ` 
        <li class="list-group-item">
            <strong>Id:</strong> {{ member.id }} <!-- bngib value mn Vue w n/to fl HTML -->
            |
            <strong>Name:</strong> {{ member.name }}
            |
            <strong>Address:</strong> {{ member.address }}
            |
            <strong>Birth Year:</strong> {{ member.birthYear }}
        </li>
    `
}
const app = Vue.createApp({ //laver Vue app
    components: { // Register the MemberItem component so it can be used in this app
        MemberItem
    },
    data() { 
        return {
            members: [], // empty Array to hold member data from the API
            baseUrl: "http://localhost:5279/api/members",
            authurl: "http://localhost:5279/api/auth/login",
            adddata: { 
                name: "",
                address: "",
                birthYear: ""
            },
            auth: {
                username: "",
                password: ""
            },
            authMessage: "",
            jwtToken: "", 
            role: null,
            loggedIn: false, 
            message: "",
            updateData: { 
                id: "",
                name: "",
                address: "",
                birthYear: ""
            },
            updateMessage: "",
            deleteId: "",
            deleteMessage: ""

        }
    },
    methods: { 
        login() {
            axios.post(this.authurl, this.auth) 
                .then(response => {                                                                                                              
                    this.jwtToken = response.data.token; 
                    this.role = response.data.role; 
                    this.loggedIn = true;
                    this.authMessage = "Authentication successful"
                }).catch(ex => { 
                    this.authMessage = "Authentication failed - " + ex.message;
                });
        },
        logout() { 
            this.jwtToken = null;
            this.role = null;
            this.loggedIn = false;
            this.auth = { username: "", password: "" };
            this.members = [];
            this.message = null;
            this.authMessage = "Logged out successfully";
        },




        // Get all members
        async getAll() { 
            try {
                const config = {}; 
                if (this.jwtToken) { 
                    config.headers = {
                        'Authorization': `Bearer ${this.jwtToken}` 
                    };
                }
                const response = await axios.get(this.baseUrl, config);  
                this.members = response.data; 
            }
            catch (error) {
                console.error(error);
                alert("Error retrieving members!!");
            }
        },            //add method
        async add() {  
            try {
                const config = {}; 
                if (this.jwtToken) {
                    config.headers = {
                        'Authorization': `Bearer ${this.jwtToken}`
                    };
                }
                await axios.post(this.baseUrl, this.adddata, config);
                this.adddata = {
                    name: "",
                    address: "",
                    birthYear: ""
                };
                this.getAll(); // Refresh the list after adding
            }
            catch {
                alert("error!")
            }
        },
        // Update method
        async update() {
            if (!this.updateData.id || !this.updateData.name || !this.updateData.address || !this.updateData.birthYear) {
                alert("Please fill in all fields.");
                return; //y3ni etl3 mn el function
            }
            const url = this.baseUrl + "/" + this.updateData.id;
            try {
                const config = {};
                if (this.jwtToken) {
                    config.headers = {
                        'Authorization': `Bearer ${this.jwtToken}`
                    };
                }
                await axios.put(url, this.updateData, config);
                this.updateData.id = "";
                this.updateData.name = "";
                this.updateData.address = "";
                this.updateData.birthYear = "";
                await this.getAll(); // Refresh the list after updating
                this.updateMessage = "Member updated successfully!";
            }
            catch {
                alert("error!")
            }
        },

        // Delete method
        async deleteMember(id) {
            if (!id) { // Check if ID is provided
                this.deleteMessage = "Please enter a valid member ID";
                return;
            }

            try {
                const config = {};
                if (this.jwtToken) {
                    config.headers = {
                        'Authorization': `Bearer ${this.jwtToken}`
                    };
                }
                await axios.delete(`${this.baseUrl}/${id}`, config);
                this.deleteMessage = "Member deleted successfully";
                this.deleteId = ""; // Clear the input field after deletion
                await this.getAll(); // Refresh the list after deletion
            } catch (error) {
                this.deleteMessage = "Error deleting member - it may not exist or you don't have permission";
                console.error(error);
            }
        },

    }
})

app.mount("#app") // Mount the Vue app to the element with id "app" in the HTML