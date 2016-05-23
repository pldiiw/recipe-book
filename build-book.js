'use strict';

const fs = require('fs');
const path = require('path');
const pug = require('pug');
const md = require('markdown-it')();

const index =
'doctype html\n' +
'html\n' +
'  head\n' +
'    script.\n' +
'      location = "book/cover-front.html";\n' +
'  body';

fs.writeFileSync(
  'build/index.html',
  pug.render(index),
  'utf8'
);

fs.readFile('styles.css', 'utf8', (err, content) => {
  fs.writeFile('build/styles.css', content, 'utf8', (err) => {
    if (err) throw err;
  });
});

[
  'cover-front.pug',
  'first-page.pug'
].forEach((file) => {
  fs.writeFileSync(
    'build/book/' + path.basename(file, '.pug') + ".html",
    pug.renderFile('book/' + file, { pretty: true }),
    'utf8'
  );
});

const recipes = fs.readdirSync('book/recipes/');

const recipesTitles = recipes
  .map((file) => fs.readFileSync('book/recipes/' + file, 'utf8').split('\n')[0].slice(2));

fs.writeFileSync(
  'build/book/table-of-contents.html',
  pug.renderFile(
    'book/table-of-contents.pug',
    { recipesTitles: recipesTitles, pretty: true }
  ),
  'utf8'
);

const layoutFn = pug.compileFile('book/layout.pug', { pretty: true });
recipes.forEach((file) => {
  fs.writeFile(
    'build/book/recipes/' + path.basename(file, '.md') + '.html',
    layoutFn({
      recipe: md.render(fs.readFileSync('book/recipes/' + file, 'utf8'))
    })
  );
});
