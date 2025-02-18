const pug = require('pug');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcFolder = './src';
const distFolder = './dist';
const jsonFile = path.join(srcFolder, 'data.json');
const cssFile = path.join(srcFolder, 'styles', 'styles.css');

// Função para gerar hash de um arquivo
function generateFileHash(filePath) {
    if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(fileBuffer).digest('hex').substring(0, 10);
    }
    return '';
}

// Função para copiar e renomear o CSS com hash
function processCSS() {
    const hash = generateFileHash(cssFile);
    const newCssFileName = `styles.${hash}.css`;
    const newCssPath = path.join(distFolder, 'styles', newCssFileName);

    if (!fs.existsSync(path.dirname(newCssPath))) {
        fs.mkdirSync(path.dirname(newCssPath), { recursive: true });
    }

    fs.copyFileSync(cssFile, newCssPath);
    console.log(`Arquivo CSS copiado com hash: ${newCssFileName}`);

    return newCssFileName;
}

// Função para compilar Pug e passar variáveis
function compilePug(cssFileName) {
    const viewsPath = path.join(srcFolder, 'views');
    const outputPath = distFolder;

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    fs.readdirSync(viewsPath).forEach(file => {
        if (path.extname(file) === '.pug') {
            const compiled = pug.renderFile(path.join(viewsPath, file), { cssFileName });
            const outputFileName = path.join(outputPath, file.replace('.pug', '.html'));
            fs.writeFileSync(outputFileName, compiled);
            console.log(`Compilado: ${outputFileName}`);
        }
    });
}

// Executa o build completo
function build() {
    const cssFileName = processCSS();
    compilePug(cssFileName);
    copyFile(jsonFile, path.join(distFolder, 'data.json'));
}

function copyFile(src, dest) {
    if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        console.log(`Arquivo copiado: ${dest}`);
    } else {
        console.warn(`Arquivo não encontrado: ${src}`);
    }
}

build();
