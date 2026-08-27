const {parse_data, is_mobile, append_html, copy_text} = lib;

const version = '1.5';

async function load_blog() {
  const current_url = new URL(window.location);
  const params = Object.fromEntries(current_url.searchParams.entries());

  const blog_link = 'https://zurg3.github.io/jekyll-blog/';
  const iv_rhash = 'e779dfb8ed6d71';

  const blog = await parse_data(blog_link, 'html');
  const blog_posts = Array.from(blog.querySelector('.post-list').children);
  let post_counter = 0;

  const post = {
    title: '',
    date: '',
    year: '',
    id: '',
    link: '',
    iv_link: ''
  };

  const years = [];

  const table = [];
  const table_header = [
    '<tr>',
      '<th>Date</th>',
      '<th width="500">Title</th>',
      '<th>ID</th>',
      '<th title="Telegram Instant View link">IV link</th>',
    '</tr>'
  ];
  const table_data = [];

  const first_year = parseInt(blog_posts.at(-1).children[0].innerText.split('.')[2], 10);
  const last_year = parseInt(blog_posts.at(0).children[0].innerText.split('.')[2], 10);

  for (let year = last_year; year >= first_year; year--) {
    if (params.year && parseInt(params.year, 10) === year) {
      years.push(` | <b>${year}</b>`);
    }
    else {
      years.push(` | <a href="index.html?year=${year}">${year}</a>`);
    }
  }

  for (let i = 0; i < blog_posts.length; i++) {
    post.title = blog_posts[i].children[1].children[0].innerText.trim();
    post.date = blog_posts[i].children[0].innerText;
    post.year = post.date.split('.')[2];
    post.id = blog_posts[i].children[1].children[0].getAttribute('href').split('/')[2];
    post.link = `${blog_link}${post.id}`;
    post.iv_link = `https://t.me/iv?url=${post.link}&rhash=${iv_rhash}`;

    if (!params.year || (params.year && params.year === post.year)) {
      table_data.push('<tr>');
      if (!is_mobile()) {
        table_data.push(
          `<td class="post_date">${post.date}</td>`,
          `<td class="post_title"><a href="${post.link}">${post.title}</a></td>`,
          `<td class="post_id">${post.id}</td>`,
          `<td class="iv_link"><input type="button" class="iv_link_button" value="Copy" onclick="copy_text('${post.iv_link}')"></td>`
        );
      }
      else {
        table_data.push(
          `<td>`,
            `<span class="post_date">${post.date}</span>`,
            `<span> </span>`,
            `<span class="post_title"><a href="${post.link}">${post.title}</a></span>`,
          `</td>`
        );
      }
      table_data.push('</tr>');

      post_counter++;
    }
  }

  if (post_counter >= 1) {
    table.push(
      '<br>',
      '<table>',
        `${!is_mobile() ? table_header.join('') : ''}`,
        table_data.join(''),
      '</table>'
    );
  }

  append_html(document.body,
    `<h1 id="title">zurg3's blog</h1>`,
    '<p id="years">',
      `${!params.year ? '<b>All</b>' : '<a href="index.html">All</a>'}`,
      years.join(''),
    '</p>',
    `<p id="post_counter">${post_counter} ${post_counter === 1 ? 'post' : 'posts'}</p>`,
    table.join(''),
    '<br>',
    `<p id="version"><i>v${version}</i></p>`
  );
}

load_blog();
