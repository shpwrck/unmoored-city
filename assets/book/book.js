/* Presentation-only enhancement. Source paragraphs and rules are moved, never rewritten. */
(()=>{'use strict';
const assetVersions={css:new URL(document.querySelector('link[href*="book.css"]')?.href||'book.css',location.href).search,js:new URL(document.currentScript?.src||'book.js',location.href).search};
// A section URL should keep its named target when reloaded at a new viewport width.
if(location.hash&&'scrollRestoration' in history)history.scrollRestoration='manual';
const characters=[['brannik','Brannik Stonewake','Barbarian'],['lio','Lio Bellweather','Bard'],['calder','Calder Ash','Cleric'],['veya','Veya Reed','Druid'],['mara','Mara Venn','Fighter'],['tamsin','Tamsin Vale','Monk'],['oren','Oren Valebright','Paladin'],['neris','Neris Moss','Ranger'],['ilyra','Ilyra Quill','Rogue'],['nyra','Nyra Cinderglass','Sorcerer'],['edrik','Edrik Fen','Warlock'],['thea','Thea Flint','Wizard']];
const elem=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e};
function cardText(container,text){
let start=0;
for(const match of text.matchAll(/<[^>\n]*>/g)){
container.append(document.createTextNode(text.slice(start,match.index)));
const cue=elem('span','card-placeholder');
cue.append(elem('span','placeholder-delimiter','<'),document.createTextNode(match[0].slice(1,-1)),elem('span','placeholder-delimiter','>'));
container.append(cue);start=match.index+match[0].length;
}
container.append(document.createTextNode(text.slice(start)));
}
function referenceCards(content){
for(const source of [...content.querySelectorAll('pre')]){
const text=source.textContent,lines=text.split('\n');
// Only the known gameplay form is a reference card. Spatial diagrams keep alignment.
if(!/^ROUND\s+(?:N|\d+)\s*$/.test(lines[0]))continue;
const card=elem('section','reference-card');
card.setAttribute('aria-label','Round reference card');
if(source.dataset.sourceIndex!==undefined)card.dataset.sourceIndex=source.dataset.sourceIndex;
card.dataset.cardType='round';
const title=elem('h3','reference-card-title',lines[0]);card.append(title);
const fields=elem('div','reference-card-fields');card.append(fields);
for(const line of lines.slice(1)){
fields.append(document.createTextNode('\n'));
const row=elem('div','card-field');const colon=line.indexOf(':');
if(colon>=0){row.dataset.cardKey=line.slice(0,colon);row.append(elem('strong','card-field-label',line.slice(0,colon+1)));const value=elem('span','card-field-value');cardText(value,line.slice(colon+1));row.append(value);}
else cardText(row,line);
fields.append(row);
}
source.replaceWith(card);
}
}
function enhance(){
const root=document.querySelector('meta[name="book-assets"]')?.content;if(!root)return;
const content=document.querySelector('.content');if(!content||content.dataset.illustrated)return;content.dataset.illustrated='true';
[...content.children].forEach((node,index)=>node.dataset.sourceIndex=String(index));
const role=document.querySelector('meta[name="book-role"]')?.content||'players';
const sceneRoot=document.querySelector('meta[name="book-scenes"]')?.content||root+'scenes/';
const hasPrivateScenes=!!document.querySelector('meta[name="book-scenes"]');
referenceCards(content);
const cover=elem('header','book-cover');const ci=elem('img');ci.src=root+'scenes/01-borrowed-road.png';ci.alt='A stone causeway crosses a mist-filled ravine toward an ancient fantasy city.';ci.width=1672;ci.height=941;ci.fetchPriority='high';cover.append(ci);const ct=elem('div','cover-title');ct.append(elem('p','eyebrow',role==='dm'?"The Dungeon Master’s Volume":'The Player’s Companion'));ct.append(elem('div','display-title','The Unmoored City'));ct.append(elem('p','cover-deck','An ancient city. A borrowed future. A home worth returning to.'));cover.append(ct);content.prepend(cover);
const tools=elem('div','book-tools');tools.append(elem('span','',role==='dm'?'Behind the screen · Illustrated edition':'Level 3 · Twelve adventurers'));const print=elem('button','','Print this guide');print.type='button';print.addEventListener('click',()=>window.print());tools.append(print);cover.after(tools);
const skip=elem('a','skip-link','Skip to the guide');skip.href='#book-content';content.id='book-content';document.body.prepend(skip);
const nav=document.querySelector('nav.rail');if(nav){const list=nav.querySelector('.navlist');if(list&&!list.closest('details')){const details=elem('details');details.open=window.matchMedia('(min-width:951px)').matches;details.append(elem('summary','','Contents'));list.before(details);details.append(list);}}
let cards=[];
for(const [id,name,job]of characters){const h=[...content.querySelectorAll('h2')].find(e=>e.textContent.trim()===name);if(!h)continue;cards.push([id,name,job,h.id]);const box=elem('section','character-block');box.setAttribute('aria-label',name+' character sheet');h.before(box);let cur=h;while(cur){const next=cur.nextElementSibling;if(cur!==h&&(cur.tagName==='H1'||cur.tagName==='H2'||(cur.tagName==='H3'&&/private motive cards/i.test(cur.textContent))||cur.tagName==='HR'))break;box.append(cur);cur=next;}const fig=elem('figure','character-portrait');const im=elem('img');im.src=root+'characters/'+id+'.png';im.alt=name+', '+job.toLowerCase()+' — original fantasy character illustration';im.loading='lazy';im.width=768;im.height=1024;im.addEventListener('error',()=>fig.hidden=true);fig.append(im);fig.append(elem('figcaption','',name+' · '+job));box.insertBefore(fig,h.nextSibling);for(const t of box.querySelectorAll('table'))if(t.querySelector('th')?.textContent.trim()==='Ability')t.classList.add('ability-table');}
if(cards.length){const gallery=elem('section','portrait-gallery');gallery.id='choose-your-adventurer';gallery.append(elem('h2','','Choose your adventurer'));gallery.append(elem('p','art-note','Twelve level-3 characters. Portraits are illustrative; the sheets below govern equipment and abilities.'));const filter=elem('div','gallery-filter');const label=elem('label','','Find a character');label.htmlFor='character-filter';const search=elem('input');search.id='character-filter';search.type='search';search.placeholder='Name or class';const status=elem('span','','12 characters');status.setAttribute('role','status');filter.append(label,search,status);const hall=elem('figure','recruitment-art');const hallImage=elem('img');hallImage.src=root+'scenes/03-recruitment-hall.png';hallImage.alt='A welcoming fantasy recruitment hall with blank folios and lantern light.';hallImage.loading='lazy';hall.append(hallImage);gallery.append(hall,filter);const grid=elem('div','gallery-grid');for(const[id,name,job,anchor]of cards){const a=elem('a','portrait-card');a.href='#'+anchor;a.dataset.search=(name+' '+job).toLowerCase();a.append(elem('strong','',name),elem('small','',job));grid.append(a);}gallery.append(grid);search.addEventListener('input',()=>{let n=0;for(const c of grid.children){c.hidden=!c.dataset.search.includes(search.value.trim().toLowerCase());if(!c.hidden)n++;}status.textContent=n+' character'+(n===1?'':'s');});const roster=content.querySelector('#roster-at-a-glance');(roster||tools).after(gallery);}
if(role==='dm'){
let inStats=false;for(const h of [...content.querySelectorAll('h1,h2,h3')]){if(h.tagName==='H1'||h.tagName==='H2')inStats=h.id==='stat-blocks';if(inStats&&h.tagName==='H3'){const box=elem('section','monster-block');h.before(box);let cur=h;while(cur){const next=cur.nextElementSibling;if(cur!==h&&/^H[123]$/.test(cur.tagName))break;box.append(cur);cur=next;}for(const label of box.querySelectorAll('p>strong')){if(!['AC','Initiative','HP','Speed'].includes(label.textContent.trim()))label.before(elem('br','stat-separator'));}for(const p of box.querySelectorAll('p')){for(const node of [...p.childNodes]){if(node.nodeType!==Node.TEXT_NODE)continue;const match=node.textContent.match(/Str [0-9]+ .*?Cha [0-9]+ \([^)]+\)\./);if(!match)continue;const before=node.textContent.slice(0,match.index),after=node.textContent.slice(match.index+match[0].length);const span=elem('span','monster-abilities',match[0]);node.replaceWith(document.createTextNode(before),span,document.createTextNode(after));}}}}
for(const h of [...content.querySelectorAll('h3')].filter(e=>/private motive cards/i.test(e.textContent))){const box=elem('aside','private-motives');box.setAttribute('aria-label','DM only: private motives');h.before(box);let cur=h;while(cur){const next=cur.nextElementSibling;if(cur!==h&&(/^H[123]$/.test(cur.tagName)||cur.tagName==='HR'))break;box.append(cur);cur=next;}}
}
const scenes=[['part-2-the-world','02-unmoored-city-square.png','The city square — your recurring home.'],['the-premise-the-players-know','02-unmoored-city-square.png','The Unmoored City, glimpsed through the Mist.']];
if(hasPrivateScenes)scenes.push(['cf-01-counterweight-foundry-surveyor-s-lens','03-counterweight-foundry.png','Counterweight Foundry'],['fc-02-floodglass-cistern-refuge-gate','04-floodglass-cistern.png','Floodglass Cistern'],['ek-03-emberglass-kiln-handwork-forge','05-emberglass-kiln.png','Emberglass Kiln'],['ea-04-echo-archive-witness-bell','06-echo-archive.png','Echo Archive'],['mo-05-meridian-orrery-meridian-spire','07-meridian-orrery.png','Meridian Orrery'],['part-9-reclamation','08-reclamation.png','Reclamation']);
for(const[id,file,caption]of scenes){if(role==='dm'&&id==='the-premise-the-players-know')continue;const h=document.getElementById(id);if(!h)continue;const figure=elem('figure','scene-art');const img=elem('img');img.src=sceneRoot+file;img.alt=caption+' — painterly fantasy scene; positions and controls are illustrative.';img.loading='lazy';img.width=1672;img.height=941;figure.append(img,elem('figcaption','',caption+' · Atmospheric art, not a battle map.'));h.after(figure);}
if(location.hash){const scrollToHash=()=>{const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)target.scrollIntoView({behavior:'instant',block:'start'});};requestAnimationFrame(scrollToHash);window.addEventListener('load',()=>requestAnimationFrame(scrollToHash),{once:true});window.addEventListener('pageshow',()=>requestAnimationFrame(scrollToHash),{once:true});}
}
function prepare(html,root){const doc=new DOMParser().parseFromString(html,'text/html');for(const[name,value]of [['book-assets',root],['book-role','dm'],['viewport','width=device-width, initial-scale=1']]){let m=doc.querySelector('meta[name="'+name+'"]');if(!m){m=doc.createElement('meta');m.name=name;doc.head.append(m);}m.content=value;}const css=doc.createElement('link');css.rel='stylesheet';css.href=root+'book.css'+assetVersions.css;doc.head.append(css);const js=doc.createElement('script');js.src=root+'book.js'+assetVersions.js;js.defer=true;doc.head.append(js);return '<!doctype html>\n'+doc.documentElement.outerHTML;}
window.BookEdition={enhance,prepare,characters};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();
