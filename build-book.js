'use strict';

const fs = require('fs');
const path = require('path');
const pug = require('pug');
const md = require('markdown-it')();
const stylus = require('stylus');

const secSep = '\n<!--###################################################-->\n';

fs.readFile('styles.styl', 'utf8', (err, content) => {
  fs.writeFile('build/styles.css', stylus.render(content), 'utf8', (err) => {
    if (err) throw err;
  });
});

let book = '';

[
  'frontcover.pug',
  'dedication.pug'
].forEach((file) => {
  book += pug.renderFile('book/' + file, { pretty: true }) + secSep;
});

const recipes = fs.readdirSync('book/recipes/');

const recipesTitles = recipes
  .map((file) => fs.readFileSync('book/recipes/' + file, 'utf8').split('\n')[0].slice(2));

book += pug.renderFile('book/toc.pug',
                       { recipesTitles: recipesTitles, pretty: true }
                      ) + secSep;

const layoutFn = pug.compileFile('book/layout.pug', { pretty: true });
recipes.forEach((file) => {
  book += layoutFn({
    recipe: md.render(fs.readFileSync('book/recipes/' + file, 'utf8'))
  }) + secSep;
});

fs.writeFileSync(
  'build/index.html',
  pug.renderFile('book/index.pug', {book: book, pretty: true}), 
  'utf8'
);
