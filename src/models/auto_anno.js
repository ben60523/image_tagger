const { spawn } = require('child_process');
const path = require('path');

const DRAW_RECTANGLE = 'DRAW_RECTANGLE';

const createTag = (area) => {
	const taggedArea = {
		left: area.x,
		top: area.y,
		width: area.w,
		height: area.h,
	};

	const generateKey = () => (`${taggedArea.left}${taggedArea.top}${taggedArea.width}${taggedArea.height}`)

	return {
		type: DRAW_RECTANGLE,
		...taggedArea,
		label: "030f833e31bd8ea574a4935b5bc89b1983e78083a67ce8ba17d3080f1713754c",
		key: generateKey(area),
		hide: false,
	}
};

const autoAnno = (image) => {
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
						
						let newTags = annotationParse(result).map(createTag);

            resolve({
							...image,
							tags: newTags
						});
        })
    })
}

module.exports = {
    autoAnno,
}