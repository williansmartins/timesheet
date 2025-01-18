const pug = require('pug');
const fs = require('fs');
const path = require('path');

const srcFolder = './src';
const distFolder = './dist';
const jsonFile = path.join(srcFolder, 'data.json');
const cssFile = path.join(srcFolder, 'styles', 'styles.css');

// Função para compilar os arquivos PUG
function compilePug() {
    const viewsPath = path.join(srcFolder, 'views');
    const outputPath = distFolder;

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    fs.readdirSync(viewsPath).forEach(file => {
        if (path.extname(file) === '.pug') {
            const compiled = pug.renderFile(path.join(viewsPath, file));
            const outputFileName = path.join(outputPath, file.replace('.pug', '.html'));
            fs.writeFileSync(outputFileName, compiled);
            console.log(`Compilado: ${outputFileName}`);
        }
    });
}

// Função para copiar arquivos
function copyFile(src, dest) {
    if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        console.log(`Arquivo copiado: ${dest}`);
    } else {
        console.warn(`Arquivo não encontrado: ${src}`);
    }
}

// Executa o build completo
function build() {
    compilePug();
    copyFile(jsonFile, path.join(distFolder, 'data.json'));
    copyFile(cssFile, path.join(distFolder, 'styles', 'styles.css'));
}

build();
