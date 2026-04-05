const testCors = async () => {
    try {
        const response = await fetch("https://indianmart.onrender.com/api/auth/login", {
            method: "OPTIONS",
            headers: {
                "Origin": "https://indianmart1.netlify.app"
            }
        });
        console.log("Status:", response.status);
        console.log("Allow Origin:", response.headers.get("access-control-allow-origin"));
    } catch(e) {
        console.error(e);
    }
}
testCors();
