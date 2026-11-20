'use strict';

const campaignTokens = new Set([
  'reddit', 'instagram', 'tiktok', 'taipei-qr', 'youtube', 'website',
  'discord', 'facebook', 'forumosa', 'hacking-chinese',
]);

const incomingToken = new URLSearchParams(window.location.search).get('ct');
const campaignToken = campaignTokens.has(incomingToken) ? incomingToken : 'website';
const appStoreURL = new URL('https://apps.apple.com/app/apple-store/id6828745593');
appStoreURL.search = new URLSearchParams({ pt: '120207506', ct: campaignToken, mt: '8' });

document.querySelectorAll('[data-store-link]').forEach((link) => {
  link.href = appStoreURL.href;
});

const pictures = {
  fire: 'Fire',
  water: 'Water',
  mountain: 'Mountain',
  tea: 'A cup of tea',
  fish: 'Fish',
  cat: 'Cat',
};

const rounds = [
  { character: '水', pinyin: 'shuǐ', meaning: 'water', choices: ['fire', 'water', 'mountain'] },
  { character: '茶', pinyin: 'chá', meaning: 'tea', choices: ['tea', 'fish', 'cat'] },
  { character: '魚', pinyin: 'yú', meaning: 'fish', choices: ['cat', 'tea', 'fish'] },
];

const demo = document.querySelector('[data-demo]');
const character = demo.querySelector('[data-character]');
const choices = Array.from(demo.querySelectorAll('[data-choice]'));
const feedback = demo.querySelector('[data-feedback]');
const gameActions = demo.querySelector('[data-game-actions]');
const nextRound = demo.querySelector('[data-next]');

let roundIndex = 0;
let answered = false;

function showRound() {
  const round = rounds[roundIndex];
  character.textContent = round.character;
  feedback.textContent = 'Pick the matching picture.';
  gameActions.hidden = true;
  answered = false;

  choices.forEach((button, index) => {
    const picture = round.choices[index];
    const image = button.querySelector('img');
    button.dataset.choice = picture;
    delete button.dataset.result;
    button.removeAttribute('aria-disabled');
    button.removeAttribute('tabindex');
    button.querySelector('.choice-mark').textContent = '';
    image.src = 'funnel-assets/' + picture + '.svg';
    image.alt = pictures[picture];
  });
}

function answer(button) {
  if (answered) return;

  answered = true;
  const round = rounds[roundIndex];
  const correct = button.dataset.choice === round.meaning;

  choices.forEach((choice) => {
    choice.setAttribute('aria-disabled', 'true');
    choice.tabIndex = -1;

    if (choice.dataset.choice === round.meaning) {
      choice.dataset.result = 'correct';
      choice.querySelector('.choice-mark').textContent = 'Answer';
    } else if (choice === button) {
      choice.dataset.result = 'missed';
      choice.querySelector('.choice-mark').textContent = 'Your pick';
    }
  });

  const word = document.createElement('b');
  word.lang = 'zh-Hant';
  word.textContent = round.character;
  feedback.replaceChildren(
    correct ? 'Correct. ' : '',
    word,
    ' (' + round.pinyin + ') means ' + round.meaning + '.',
  );
  gameActions.hidden = false;
}

choices.forEach((button) => button.addEventListener('click', () => answer(button)));

nextRound.addEventListener('click', () => {
  roundIndex = (roundIndex + 1) % rounds.length;
  showRound();
  character.focus();
});

showRound();
demo.hidden = false;
