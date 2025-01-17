const bs = require('browser-sync').create(); // Importa o Browsersync
const pug = require('pug'); // Importa o PUG
const fs = require('fs'); // Importa o módulo de sistema de arquivos
const path = require('path'); // Importa o módulo de manipulação de caminhos

// Define os diretórios de origem e destino
const srcFolder = './src';
const distFolder = './dist';
const jsonFile = './src/data.json'; // Caminho do arquivo JSON de origem

// Função para compilar arquivos PUG
function compilePug() {
    const viewsPath = path.join(srcFolder, 'views'); // Diretório dos arquivos PUG
    const outputPath = path.join(distFolder); // Diretório de saída dos arquivos HTML

    // Certifica-se de que o diretório de saída existe
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // Lê os arquivos no diretório de views e compila cada arquivo .pug
    fs.readdirSync(viewsPath).forEach((file) => {
        if (path.extname(file) === '.pug') {
            const compiled = pug.renderFile(path.join(viewsPath, file)); // Compila o PUG
            const outputFileName = path.join(outputPath, file.replace('.pug', '.html')); // Define o nome do arquivo HTML
            fs.writeFileSync(outputFileName, compiled); // Salva o HTML compilado no disco
            console.log(`Compilado: ${outputFileName}`);
        }
    });

    // Copia o arquivo data.json para o diretório de destino
    if (fs.existsSync(jsonFile)) {
        const destJsonPath = path.join(distFolder, 'data.json');
        fs.copyFileSync(jsonFile, destJsonPath); // Copia o arquivo JSON
        console.log('Arquivo data.json copiado para o diretório de destino');
    } else {
        console.log('Arquivo data.json não encontrado!');
    }
}

// Configura o Browsersync para servir os arquivos no diretório de saída
bs.init({
    server: {
        baseDir: distFolder, // Define o diretório de saída como raiz do servidor
    },
    files: [`${srcFolder}/**/*.pug`, `${srcFolder}/styles/**/*.css`], // Monitora mudanças em arquivos PUG e CSS
    notify: false, // Remove notificações de Browsersync no navegador
    open: true, // Abre o navegador automaticamente
});

// Observa mudanças nos arquivos de origem e recompila quando necessário
fs.watch(srcFolder, { recursive: true }, (eventType, filename) => {
    if (filename.endsWith('.pug')) {
        compilePug(); // Recompila os arquivos PUG
        bs.reload(); // Atualiza o navegador
    }
    if (filename.endsWith('.css')) {
        bs.reload('*.css'); // Atualiza o navegador para mudanças em arquivos CSS
    }
});

// Mensagem inicial no terminal
console.log('Live reload ativado! Observando mudanças em arquivos PUG e CSS...');
