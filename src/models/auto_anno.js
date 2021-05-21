const { spawn } = require('child_process');
const path = require('path');

const autoAnno = async (image) => {
    return new Promise((resolve, reject) => {
        console.log("Start Auto Annotation", image.src);
        const imgAnno = spawn(path.join(__dirname, "../../extra_res/bin/", "image_annotation_anoscope.exe"), [image.src]);
    
        let result = '';
    
        const annotationParse = (msg) => {
            let rectArr = []
    
            msg.split('@').forEach(rect => {
                if(rect.includes('{')) {
                    rectArr.push(JSON.parse(rect));
                }
            });
    
            return rectArr;
        }
    
        imgAnno.stdout.on('data', (data) => {
            result += data;
        })
    
        imgAnno.stderr.on('data', (data) => {
            reject(`stderr: ${data}`);
        })
    
        imgAnno.on('close', (code) => {
            console.log(`result ${JSON.stringify(annotationParse(result))}`)
            resolve(annotationParse(result));
        })
    })
}

module.exports = {
    autoAnno,
}