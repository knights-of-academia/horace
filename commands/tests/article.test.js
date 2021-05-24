const article = require('../article.js');
const Parser = require('rss-parser');
const MockMessage = require('../../stub/MockMessage.js');

jest.mock('rss-parser');

beforeAll(() => {
	jest.spyOn(Parser.prototype, 'parseURL').mockImplementation((link) => {
		if(link == 'https://knightsofacademia.org/category/articles/feed')
		{
			return {
				items: [
					{
						creator: 'Amy KOA',
						title: 'Banish Procrastination With The Five Second Rule.',
						link: 'https://knightsofacademia.org/banish-procrastination-with-the-five-second-rule/?utm_source=rss&utm_medium=rss&utm_campaign=banish-procrastination-with-the-five-second-rule',
					},
					{
						creator: 'Amy KOA',
						title: 'How Do I Start Meditating',
						link: 'https://knightsofacademia.org/how-do-i-start-meditating/?utm_source=rss&utm_medium=rss&utm_campaign=how-do-i-start-meditating',
					},
					{
						creator: 'Knights of Academia',
						title: 'Knowledge is Power, Execution is Royalty (and Perception is Noteworthy)',
						link: 'https://knightsofacademia.org/knowledge-is-power/?utm_source=rss&utm_medium=rss&utm_campaign=knowledge-is-power',
					}
				],
				feedUrl: 'https://knightsofacademia.org/category/articles/feed/'
			};
		}
	});
});

afterAll(() => {
	jest.restoreAllMocks();
});

test('Sends correct response with no arguments', async() => {
	const message = new MockMessage();
	const responseMessage = await article.execute(null, message, []);
	const expectedStart = 'Here\'s a random article from KOA titled';
	expect(responseMessage).toMatch(new RegExp(`^${expectedStart}`));
});

test('Sends correct response when home page is requested', async() => {
	const message = new MockMessage();
	const responseMessage = await article.execute(null, message, ['home']);
	const expectedStart = 'KOA Article Archive:';
	expect(responseMessage).toMatch(new RegExp(`^${expectedStart}`));
});

test('Sends correct response when latest article is requested', async() => {
	const message = new MockMessage();
	const responseMessage = await article.execute(null, message, ['latest']);
	const expectedStart = 'The latest article from KOA is';
	expect(responseMessage).toMatch(new RegExp(`^${expectedStart}`));
});

test('Sends correct response when incorrect argument is passed', async() => {
	const message = new MockMessage();
	const responseMessage = await article.execute(null, message, ['abcd']);
	const expectedStart = '`abcd` is not a valid argument. Use `!help article` for more information.';
	expect(responseMessage).toMatch(new RegExp(`^${expectedStart}`));
});
