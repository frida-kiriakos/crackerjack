
/* // This specific setup allows the "database" to pull the data of a user VERY easily. For example,
 * // to pull up my user account information under my login username "jmovius", use the following:
 * // var database = require("./database.js");
 * // var user = database.users.jmovius; // same as: var user = database.users["jmovius"];
 * // if(inputPassword === user.password) { console.log("Password check passed!"); } else { console.log("Password check failed."); }
 * // Check if the user pulled actually exists: if(!user) { "true if user exists" } else { "false if user does not exist" }
 * users: {
 *      "username": {
 *          username: "",
 *          password: "",
 *          email: "",
 *          groupList: [],
 *          submitted: 0, // Number of potential tweets submitted.
 *          published: 0 // Number of tweets that were published by this user.
 *      }
 * },
 * // To pull up a group's information under "CrackerJack473", use the following:
 * // var group = database.groups.CrackerJack473; // same as: var user = database.users["CrackerJack473"];
 * // group.groupDisplayName // -> "CPSC 473 - Web Design Group"
 * groups: {
 *      "groupname": {
 *          groupname: "",
 *          displayname: ""
 *          // Any other item that would be required to define a group and log into the associated twitter account.
 *      }
 *  }
 */

module.exports = {

    users: {},
    groups: {},

    createGroup: function(gName,gDisplayName) {
        // Since the groupname is also the twittername, this checks if a group already exists with a specific twitter name.
        // Could also implement logic here to check if the groupname is actually a live twitter account.
        if(!this.groups[gName]) {
            this.groups[gName] = {
                groupname: gName,
            	displayname: gDisplayName
            };
        } else {
            console.log("Group already exists!");
        }
    },
    
    createUser: function(un,pw,em,gl) {
        if(!this.users[un]) {
            this.users[un] = {
                username: un,
                password: pw,
                email: em,
                groupList: gl,
                submitted: 0,
                published: 0
            };
        } else {
            console.log("User already exists!");
        }
    }
};