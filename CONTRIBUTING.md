# Contributing

Hey there, knight! Thanks for thinking about helping Horace, one of KOA's Discord bots, become the best he can be for Knights of Academia. Horace will become much better because of you, and we're glad you can contribute. 
If you want more information, check out our [README file](README.md) and more about KOA [here](https://knightsofacademia.org/start-here/about-knights-of-academia/).

## Table of Contents
- [Reporting Issues](#report)
- [Feature Suggestion](#feats)
- [Getting Started With Development](#development)
  - [Setting Up Your Environment](#setup)
  - [Questions, Comments, Concerns](#questions)
- [Pull Request Guidelines](#pullreqguide)
  - [Commit Message Guidelines](#cmtmsg)
  - [Merging a PR](#mergepr)
- [Frequently Asked Questions](#faq)

## Reporting Issues<a name = "report"></a>

Is Horace appearing a bit under the weather? Head on over to our [Issue Tracker](https://github.com/Knights-Of-Academia/horace/issues) and see if it's been reported. If it has, add some details about your experience with the issue, and if it hasn't, go ahead and open a new issue. The more information about your issue, the more we can work with, so don't be afraid to get _detailed!_ 

If you're the kind of person who wants to tackle the issue, check out [Getting Started With Development](#development). We'd love to have you on board.

## Feature Suggestion<a name = "feats"></a>

To suggest features, you can head on over to the [Issue Tracker](https://github.com/Knights-Of-Academia/horace/issues) and see if someone has requested a similar feature. If they haven't, go ahead and open up an issue and explain Horace's next upgrade.

### Want to contribute the feature yourself?

- **If your feature is a big one,** you can create an issue carefully detailing your idea so that we can coordinate the effort and get you on board.
- **If your feature is small,** you can open up a [Pull Request](https://github.com/Knights-Of-Academia/horace/pulls)

## Getting Started With Development<a name = "development"></a>

### Setting Up Your Environment<a name = "setup"></a>
Some setup is required in order to start contributing to Horace.

#### Node JS

Horace is based on [NodeJS](https://nodejs.org/en/), which is required to run it. If you haven't already, you'll need to go ahead and download it.

#### Installing Dependencies

Horace borrows functionality from multiple dependencies. You can go ahead and install these dependencies by running `npm install` in the root directory _after installing NodeJS_.

#### Discord API Usage

If you haven't already noticed, Horace is a Discord bot. If you haven't already, go ahead and visit the [Discord Developers Section](https://discordapp.com/developers) in order to create an application for developing bots. This will generate an **API key** for you to use. Connect this API key into the **config.json** file. This file is created by copying the content of the example file **config.json.example** into a new file named **config.json***.  (This will be further explained in a second.)
This step is needed to connect the bot authentication to your instance of the bot.
<br>_Friendly reminder to keep API keys secret to you. Always remove them from your code, or add them to a .gitignore, before submitting your work._

To test Horace, you'll need to invite the bot to your development server. Copy and paste the following link, replacing **XXXX** with the **client_id** of your bot. The client ID can be found on the [Developers Section](https://discordapp.com/developers). `https://discordapp.com/oauth2/authorize?client_id=XXXX&scope=bot`

#### The configuration file explained

The file named **config.json.example** contains the environment variables that should be set for the bot to work. _Make sure you have all these variables in your **config.json** with the proper values.
It requires your Discord API token, COTW channel, Champion Role, and Manager Role. _Don't know what these are?_ Check out the [KOA Discord Server](https://discordapp.com/invite/EYX7XGG) to see how these are set up and what they're each meant to do.

KOA is heavily involved in [Habitica](http://www.habitica.com/), and your Habitica API Key will be required for working on Habitica related features. You can find [your Habitica API here](https://habitica.com/user/settings/api), just don't forget you'll need to log in.
In addition to this, it requires your Habitica token, to be able to fetch the COTW information from the Habitica API.
<br>_Another friendly reminder to keep API keys secret to you. Always remove them from your code, or add them to a .gitignore, before submitting your work._

#### Ready to test your modifications to Horace?

In your root directory, go ahead and run ```npm start```, and you're ready to go.

#### We have a linter for NodeJS

We use [eslinter](https://eslint.org/) for code checkups. To run the linter, go ahead and run ```npm run pretest```.

#### Questions, Comments, Concerns <a name = "questions"></a>

- **General questions about KOA or Horace?** Head on over to the [KOA Discord Server](https://discordapp.com/invite/EYX7XGG) for any sort of discussion. If you're looking to discuss development or features, we'd recommend the #computer-science channel.
- **Development questions** or code problems? Search up your question on Stack Overflow or find general forums if your questions are related specifically to code, but no harm in asking other #computer-science sectorians for discussions, or pinging someone from the KOA engineering team.
- **Check out the FAQ** [below!](#faq)

## Pull Request Guidelines <a name = "pullreqguide"></a>

_Please adhere to the following guidelines._ We want to avoid duplicate issues, reports, features, etc. 

1. Search the [Issue Tracker](https://github.com/Knights-Of-Academia/horace/issues) for any relevant threads to what you're looking to create a PR for.
2. Keep it detailed. We want to know your vision, and the more you give us the better discussion we can have!
3. Please make sure you have read the [license agreement](LICENSE.md). We're using the [MIT License](https://opensource.org/licenses/MIT)- it's only 3 paragraphs!  
_The following will need to become more detailed over time_
4. Make a new branch to fork your changes from
5. Make sure to test your bot on a local/personal testing Discord server
6. Make sure your branch is updated with the master branch before sending your pull request, in case other changes have been made
7. Send your pull request to the [develop branch](https://github.com/Knights-Of-Academia/horace/tree/develop)

### Merging a PR <a name = "mergepr"></a> _KOA Team Only_
- Passes our CL (changelist) guidelines [here](TBW)
- It has been approved by two team members
- It is up to date with the development branch
- PR must be from the `develop` branch, so don't forget the merge should be into the `develop` branch

## Frequently Asked Questions <a name = "faq"></a>
None yet! :)
