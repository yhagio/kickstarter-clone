### Project Todo

- [X] Initial Setup
- [X] Projects - User can create projects, form, save into db (Basic)
- [X] Projects - Create project (Edge case * Checking user inputs)
- [X] Projects - List projects, project page (Basic)
- [X] Projects - Better Date/Time picker UI
- [X] Authentication - User Singup (Check user inputs)
- [X] Authentication - User Login / Logout
- [X] Authentication - User Forgot password / Issue new password
- [X] Authentication - User can update profile (Name, Email, Bio, Password)
- [X] Email - Mailgun Integration (Forgot password)
- [X] Payment - Verify user's funding account
- [X] Social - User can comment
- [X] Social - User can delete comment
- [X] Profile - Public accessible profile page
- [X] 404 Page (Basic)
- [X] Category - Category page with list
- [X] Social - User can share (Twitter and Facebook)
- [X] Projects - Create Rewards, Display Rewards Page
- [X] Payment - User can back projects (Select rewards)
- [X] Search - Search projects with Elasticsearch
- [X] Pagination - Fetch project list with limit & skip
- [X] Pagination - Fetch project list at category page with limit & skip
- [X] Pagination - Fetch comments list with limit & skip
- [X] Search - Heroku x Bonsai
- [X] Projects - Progress Bar
- [X] Projects - Expiration (Disable Payment)

- [ ] Sorting improvement (expired projects)
- [ ] Mobile Web friendly (Responsive)
- [ ] Minimize file sizes, image sizes
- [ ] Pagespeed insights check

- [ ] Expired project - funding success or unsuccess tag
- [ ] Projects - Video integration instead of cover photos
- [ ] Projects - Announcement tabs
- [ ] Projects - Comment - reply to someone, creator tag

- [ ] Email - Mailgun Integration (After back a project)

- [ ] Limit - rewards items
- [ ] Check over publishing data to client
- [ ] Profile - Admin area (Projects created, Manage)

- [ ] Projects - Real time countdown

Maybe:
- [] Social - Inline editable comment (contentEditable)
- [ ] Authentication - User can delete account
- [ ] Stripe / Payment account update (Credit Card info)


### Notes
Stripe Connect authentication for project creator with Passport-OAuth2Strategy <br />
Attempt code: https://gist.github.com/yhagio/451b0fe564980a0374ddcf9d254d9163

#### Side notes
- Profile Update - Password, Email, Name
- Multiple rewards options (create them & payment options)
- Limit / Skip fetching of Projects from databse
- Search Projects
- Progress Bar of funding
- Expiration of funding / Countdown update
- Commenting (Fetch comments at Profile, ProjectPage - Skip / Limit)
- Share (Facebook, Twitter, Email, Linkedin, etc)