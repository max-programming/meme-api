const puppeteer = require('puppeteer');
const fastify = require('fastify')({ logger: true });

async function getAllMemes() {
  const URL = 'https://www.memedroid.com/memes/tag/programming';

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(URL);

  const allImages = await page.$$eval('div.item-aux-container img[src]', imgs =>
    imgs.map(img => {
      if (
        img.getAttribute('src').startsWith('http') &&
        img.getAttribute('src').endsWith('jpeg')
      )
        return img.getAttribute('src');
    })
  );

  const imgs = allImages.filter(img => img !== null);
  await browser.close();
  return imgs;
}

fastify.get('/', async (request, reply) => {
  const memes = await getAllMemes();
  const randomNumber = Math.round(Math.random() * memes.length);
  reply.send(memes[randomNumber]);
});

const start = async () => {
  try {
    await fastify.listen(5555);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
