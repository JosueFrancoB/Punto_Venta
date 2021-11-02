const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async(idToken = '')=> {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    // Al desestructurar un objeto se le puede cambiar el nombre de las variables
    // Por ejemplo vienen en inglés pero yo las quiero en español porque así están en la base de datos
    const {name: nombre, 
        picture: img, 
        email: correo} = ticket.getPayload();

    
    return {nombre, img, correo};
}

module.exports = {
    googleVerify
}