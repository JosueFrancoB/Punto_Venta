const path = require('path');
const {v4: uuidv4} = require('uuid');

// Si no mando parametros de las extensiones esas están por defecto
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '')=>{

    return new Promise((resolve, reject)=>{

        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
        // Validar extensiones permitidas
        if(!extensionesValidas.includes(extension)){
            return reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`);
        }
    
        // con el uuidv4 se le da un nombre aleatorio siempre
        const nobreTemp  = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nobreTemp);
    
        archivo.mv(uploadPath, (err)=> {
            if (err) {
                return reject(err);
            }
            resolve(nobreTemp);
        });
    });
}


module.exports = {
    subirArchivo
}