function load_post() {
  document.write(`<tr>
    <td class="post_date">${post.date}</td>
    <td class="post_title"><a href="${post.link}">${post.title}</a></td>
    <td class="post_id">${post.id}</td>
    <td class="iv_link"><input type="button" class="iv_link_button" value="Copy" data-clipboard-text="${post.iv_link}" data-clipboard-action="copy"></td>
  </tr>`);
}

function load_post_mobile() {
  document.write(`<tr>
    <td>
      <span class="post_date">${post.date}</span>
      <span> </span>
      <span class="post_title"><a href="${post.link}">${post.title}</a></span>
    </td>
  </tr>`);
}

const version = '1.4.2';

const blog_link = 'https://zurg3.github.io/jekyll-blog/';

const current_url = new URL(window.location);
const params = Object.fromEntries(current_url.searchParams.entries());

const xmlhttp = new XMLHttpRequest();
const parser = new DOMParser();

new ClipboardJS('.iv_link_button');

xmlhttp.open('GET', blog_link, false);
xmlhttp.send();

const blog = parser.parseFromString(xmlhttp.responseText, 'text/html');
const blog_posts = blog.getElementsByClassName('post-list')[0].children;
let post_counter = 0;

const post = {
  title: '',
  date: '',
  id: '',
  link: '',
  iv_link: ''
};

const iv_rhash = 'e779dfb8ed6d71';

const begin_year = parseInt(blog_posts[blog_posts.length - 1].children[0].innerText.split('.')[2], 10);
const end_year = parseInt(blog_posts[0].children[0].innerText.split('.')[2], 10);

document.write(`<h1 align="center">zurg3's blog</h1>`);
document.write(`<p class="years" ${is_mobile() ? '' : 'align="center"'}>`);
document.write(`${!current_url.search ? '<b>All</b>' : '<a href="index.html">All</a>'}`);
for (let i = end_year; i >= begin_year; i--) {
  if ((current_url.search && params.year) && (parseInt(params.year, 10) === i)) {
    document.write(` | <b>${i}</b>`);
  }
  else if ((!current_url.search) || ((current_url.search && params.year) && (parseInt(params.year, 10) !== i))) {
    document.write(` | <a href="index.html?year=${i}">${i}</a>`);
  }
}
document.write(`</p>`);
document.write(`<p id="post_counter" ${is_mobile() ? '' : 'align="center"'}>...</p>`);
document.write(`<br>`);
document.write(`<table ${is_mobile() ? '' : 'align="center"'}>`);
if (!is_mobile()) {
  document.write(`<tr>
    <th align="left">Date</th>
    <th align="left" width="500">Title</th>
    <th align="left">ID</th>
    <th align="left" title="Telegram Instant View link">IV link</th>
  </tr>`);
}
for (let i = 0; i < blog_posts.length; i++) {
  post.title = blog_posts[i].children[1].children[0].innerText.trim();
  post.date = blog_posts[i].children[0].innerText;
  post.id = blog_posts[i].children[1].children[0].getAttribute('href').split('/')[2];
  post.link = `${blog_link}${post.id}`;
  post.iv_link = `https://t.me/iv?url=${post.link}&rhash=${iv_rhash}`;

  if (!current_url.search) {
    !is_mobile() ? load_post() : load_post_mobile();
    post_counter++;
  }
  else if ((current_url.search && params.year)) {
    if (params.year === blog_posts[i].children[0].innerText.split('.')[2]) {
      !is_mobile() ? load_post() : load_post_mobile();
      post_counter++;
    }
  }
}
document.write(`</table>`);

document.getElementById('post_counter').innerText = `${post_counter} ${post_counter === 1 ? 'post' : 'posts'}`;

if (post_counter === 0) {
  document.getElementsByTagName('table')[0].remove();
  document.getElementsByTagName('br')[0].remove();
}

document.write(``);
document.write(`<br><p align="center" id="version"><i>v${version}</i></p>`);
