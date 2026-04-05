const testRegister = async () => {
    try {
        const response = await fetch("https://indianmart.onrender.com/api/auth/register", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({name:"test2", email:"test2@test.com", password:"password"})
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch(e) {
        console.error(e);
    }
}
testRegister();
