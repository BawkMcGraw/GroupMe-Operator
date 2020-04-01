This add the much missing @all @everyone functionality to groupme. While there are pre-existing solutions, this one is targetted towards simplicity and being lightweight. Unlike other versions, this one also supports multiple groups, so you can create one app/instance in heroku and add the bot to as many groups as you want!

I also did my best to make this as readable as possible for anyone who wants to learn how it works and wants some insight into the groupme api since it's documentation is horrendous.

##SETUP OVERVIEW##
1. I would recommend to connect this branch to your account as it will make heroku deployment as simple as possible.
2. Upload to heroku by fetching from this branch attached to your github account.
3. Make a bot in GroupMe called "Operator" (it must be called Operator to prevent the bot from triggering itself on accident and spamming the chat.)
4. 3 IMPORTANT VALUES MUST BE SET in heroku's config variables:
    a. TOKEN = [this will be your access token you can retrieve from dev.groupme.com]
    b. BOTID = [this will be your bot's id you get after you make the bot in dev.groupme.com]
    c. GROUPID = [this will be the groupid that you added your bot to, which can be seen in the same panel in dev.groupme.com]

4a. IF YOU HAVE MULTIPLE GROUPS: When you add your BOTID and GROUPID, you need to add a number to the end of both names and they must match. Example: "BOTID1 = asdf1234" would be the botid for posting in "GROUPID1 = 12345678". If you don't match these up with numbers, the bot will post to the wrong group. The number must be numerical (not word form), and must be at the beginning or end of the name (not in the middle).





##ADDING THIS TO YOUR GITHUB##
1. if you don't have a github account, create one
2. login (if needed)
3. click 'Fork'
4. We're done with github, go to MAKING A HEROKU APP
--------------------------------------------------------------------------------


##MAKING A HEROKU APP##
If you're unfamilair with how to make a heroku app, I'll explain.
1. go to heroku.com
2. create an account if you do not have one. If does not have to be the same information you use for groupme.
3. click "new" > "create new app"
4. type in any app name you would like.
5. click "create app"
6. click "Open App" at the top
7. copy the URL and go to the MAKING A GROUPME BOT SECTION in this readme
*--------------------------------------------------------------------------------*
8. go back to heroku.com
9. click the app you previously made
10. click the "Deploy" tab
11. next to Deployment Method, click "Github"
12. below that, click "Connect to Github"
13. login to github (if needed)
13a. "authorize heroku"
114. in the box that says "repo-name", type Groupme-Operator
14a. click "Search"
15. you should see it popup below the search box, click "Connect"
16. below that you should see a Deploy Branch button. click it.
17. click "Settings" at the top
18. click "Reveal Config Vars"
19. insert the following case sensitive data: (format KEY = VALUE -> click add)
    TOKEN = (the Access Token you copied [a1b2c3d4...])
    GROUPID1 = (the Group Id you copied [12345678...])
    BOTID1 = (the Bot Id you copied [a1b2c3d4...])
20. add new GROUPID and BOTID for as many groups as you want to add, MAKE SURE TO NUMBER THEM 1,2,3 ETC. IF YOU DONT THE BOT WILL POST TO THE WRONG GROUP.
21. You're done! You can now enjoy your new bot!
--------------------------------------------------------------------------------


##MAKING A GROUPME BOT##
If you're unfamiliar with how to make a groupme bot, I'll explain.
1. go to https://dev.groupme.com
2. click login in the top right, and login with your normal groupme credentials
3. click Bots in the top navigation bar (or in the top right drop down if no top navigation bar exists)
4. click 'Create Bot'
5. Name = Operator
6. callback URL = [paste the app.heroku url from the app you created to run your bot]
7. (optional) avatar url = https://i.groupme.com/665x636.jpeg.c8c37002a44941b5b5c16b0d9592b157 [if you want a different image you'll have to learn how to use the groupme image service at dev.groupme.com]
8. click submit
9. click on the bot you just created
10. in a text file, copy and paste the Group Id and the Bot Id
11. click on Access Token in the top navigation bar on dev.groupme.com
12. copy that key to your text file
13. head back to the MAKING A HEROKU APP section in this readme
--------------------------------------------------------------------------------