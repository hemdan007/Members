const MemberItem = {
    props: ['member'],

    template: `
        <li class="list-group-item">
            <strong>Id:</strong> {{ member.id }}
            |
            <strong>Name:</strong> {{ member.name }}
            |
            <strong>Address:</strong> {{ member.address }}
            |
            <strong>Birth Year:</strong> {{ member.birthYear }}
        </li>
    `
}
const app = Vue.createApp({
    components: {
        MemberItem
    },
    data() {
        return {
            members: [],
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
                    //this.getAll(); // Fetch members immediately after successful login
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
                return;
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
            if (!id) {
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
                this.deleteId = "";
                await this.getAll();
            } catch (error) {
                this.deleteMessage = "Error deleting member - it may not exist or you don't have permission";
                console.error(error);
            }
        },

    }
})

app.mount("#app")