const ENTRIES = [
  'LeBron James','James Cameron','Cameron Diaz','Nate Diaz','Nate Bargatze',
  'Taylor Swift','Swift Current','Current Events','Event Horizon','Horizon Zero','Zero Dark','Dark Knight','Knight Rider',
  'Burger King','King James','James Harden','Harden Volumes','Jordan Peele','Michael Jordan','Jordan Peterson','Peterson Academy',
  'Tom Brady','Brady Bunch','Bunch Johnson','Johnson Controls','Dwayne Johnson','Magic Johnson','Johnson City',
  'New York','York College','Boston College','Boston Celtics','Celtics Pride','Pride Rock','Rock Hudson','Hudson River',
  'Jurassic Park','Park Avenue','Avenue Q','Q Tip','Tip ONeill','Shaquille ONeal','Neal Brennan','Brennan Lee',
  'Harry Potter','Potter Stewart','Stewart Little','Little Mermaid','Mermaid Man','Spider Man','Man United','United States',
  'Star Wars','Wars End','End Game','Game Theory','Theory Eleven','Eleven Madison','Madison Square','Square Enix',
  'Bill Gates','Gates Foundation','Foundation Series','Series Finale','Final Fantasy','Fantasy Island','Island Records',
  'Apple Music','Music Man','Man City','City Lights','Northern Lights','Lights Out','Out Kast','Kast Kings',
  'Elon Musk','Musk Ox','Ox Baker','Baker Mayfield','Mayfield Kentucky','Kentucky Derby','Derby County',
  'Tiger Woods','Woods Hole','Hole Foods','Whole Foods','Foods Market','Market Street','Street Fighter',
  'Oprah Winfrey','Winfrey Show','Show Time','Time Magazine','Magazine Dreams','Dreams Come','Come Away',
  'Will Smith','Smith College','College Football','Football Manager','Manager Mode','Mode Seven','Seven Samurai',
  'Morgan Freeman','Freeman Dyson','Dyson Sphere','Sphere Las Vegas','Vegas Golden','Golden State','State Farm',
  'Kobe Bryant','Bryant Park','Park Place','Place Vendome','Vendome Column','Column Five',
  'Stephen King','King Kong','Kong Skull','Skull Island','Island Boys','Boys Town',
  'Ryan Reynolds','Reynolds Wrap','Wrap Battle','Battle Bots','Botswana Flag','Flag Day',
  'Chris Rock','Rock Star','Star Trek','Trek Bikes','Bikes Direct',
  'Blue Bloods','Blood Diamond','Diamond Dallas','Dallas Cowboys','Cowboys Stadium',
  'Family Guy','Guy Fieri','Fieri Foods','Food Network','Network Solutions',
  'Breaking Bad','Bad Bunny','Bunny Hop','Hop Scotch','Scotch Tape',
  'South Park','Park Bench','Bench Press','Press Box','Box Office',
  'Times Square','Square One','One Direction','Direction Home','Home Depot',
  'Grand Canyon','Canyon Ranch','Ranch Dressing','Dressing Room','Room Service',
  'Mount Everest','Everest College','College Board','Board Walk','Walk Hard',
  'Serena Williams','Williams Sonoma','Sonoma County','County Fair','Fair Play',
  'Lion King','King Arthur','Arthur Ashe','Ashe Stadium','Stadium Goods',
  'Ninja Turtles','Turtles All','All Star','Star Bucks','Starbucks Reserve',
  'Minecraft Movie','Movie Star','Star Lord','Lord Byron','Byron Bay'
];

const PUZZLES = [
  { start: 'LeBron James', target: 'Nate Bargatze', path: ['LeBron James','James Cameron','Cameron Diaz','Nate Diaz','Nate Bargatze'] },
  { start: 'Taylor Swift', target: 'Burger King', path: ['Taylor Swift','Swift Current','Current Events','Event Horizon','Horizon Zero','Zero Dark','Dark Knight','Knight Rider','Burger King'] },
  { start: 'Jurassic Park', target: 'Home Depot', path: ['Jurassic Park','Park Place','Place Vendome','Vendome Column','Column Five','Five Guys','Guy Fieri','Food Network','Network Solutions','Home Depot'] },
  { start: 'Michael Jordan', target: 'Nate Bargatze', path: ['Michael Jordan','Jordan Peele','LeBron James','James Cameron','Cameron Diaz','Nate Diaz','Nate Bargatze'] },
  { start: 'Star Wars', target: 'Square Enix', path: ['Star Wars','Wars End','End Game','Game Theory','Theory Eleven','Eleven Madison','Madison Square','Square Enix'] }
];

// Add entries that are used in paths but not in the main list yet.
for (const p of PUZZLES) for (const e of p.path) if (!ENTRIES.includes(e)) ENTRIES.push(e);

let currentPuzzle = PUZZLES[0];
let chain = [currentPuzzle.start];

const $ = (id) => document.getElementById(id);
const words = (entry) => entry.toLowerCase().split(/\s+/);
function sharedWords(a, b) {
  const aw = words(a), bw = words(b);
  return aw.filter(w => bw.includes(w));
}
function isLegalMove(from, to) {
  return from !== to && sharedWords(from, to).length === 1;
}
function render() {
  $('startName').textContent = currentPuzzle.start;
  $('targetName').textContent = currentPuzzle.target;
  $('moveCount').textContent = Math.max(0, chain.length - 1);
  $('chain').innerHTML = chain.map(x => `<li>${x}</li>`).join('');
  $('guessInput').value = '';
  $('suggestions').innerHTML = '';
  $('message').textContent = '';
  const won = chain[chain.length - 1] === currentPuzzle.target;
  $('winBox').classList.toggle('hidden', !won);
  if (won) $('winBox').textContent = `You solved it in ${chain.length - 1} moves!`;
}
function newPuzzle() {
  currentPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  chain = [currentPuzzle.start];
  render();
}
function addMove(entry) {
  const current = chain[chain.length - 1];
  if (!isLegalMove(current, entry)) {
    $('message').textContent = `${entry} does not share exactly one word with ${current}.`;
    return;
  }
  chain.push(entry);
  render();
}
function showSuggestions() {
  const q = $('guessInput').value.trim().toLowerCase();
  const current = chain[chain.length - 1];
  const matches = ENTRIES
    .filter(e => e.toLowerCase().includes(q))
    .filter(e => isLegalMove(current, e))
    .slice(0, 8);
  $('suggestions').innerHTML = matches.map(e => `<button class="suggestion" data-entry="${e}">${e}</button>`).join('');
}
$('newPuzzle').addEventListener('click', newPuzzle);
$('guessInput').addEventListener('input', showSuggestions);
$('suggestions').addEventListener('click', (e) => {
  if (e.target.dataset.entry) addMove(e.target.dataset.entry);
});
$('hintBtn').addEventListener('click', () => {
  const next = currentPuzzle.path[chain.length];
  $('message').textContent = next ? `Try: ${next}` : 'No hint available.';
});
$('undoBtn').addEventListener('click', () => {
  if (chain.length > 1) chain.pop();
  render();
});
$('revealBtn').addEventListener('click', () => {
  chain = [...currentPuzzle.path];
  render();
});
render();
