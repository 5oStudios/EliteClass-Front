# EliteClass - LMS — Phase Two Rollout Plan
  
### Pre-Deployment Checklist (0800HRS **-** 0900HRS)

 - [ ] Take backup of Preview branch on Frontend
 - [ ] Take backup of Preview branch on Backend
 - [ ] Take backup of Production branch on Frontend
 - [ ] Take backup of Production branch on Backend
 - [ ] Create PR — **preview &rarr; production** on Frontend
 - [ ] Create PR — **preview &rarr; production** on Backend


  ---
### Checklist for deployment (0900HRS **-** 1030HRS)

 - [ ] Text them on WhatsApp *(That we are taking it down)*
 - [ ] Turn down LMS FE at 0900HRS
 - [ ] Turn down LMS BE at 0900HRS
 - [ ] Scale Server up *(CPU with Harddisk increase to 160GB)*
 - [ ] Let BE Team resolve the merge conflicts in PR on Backend
 - [ ] Let FE Team resolve the merge conflicts in PR on Frontend
 - [ ] Merge Frontend and Backend PR once conflicts are resolved
 - [ ] Take a pull of the code on the production server for Backend and Frontend
 
---
 **Backend**
 - [ ] Update seeder **&rarr;** Role has permissions
 - [ ] Run Migrations
 - [ ] Run manual update queries 
 - [ ] Purge Cache with the automated script

---
**Frontend (Only perform this step after you are done with Backend)**
 - [ ] Run the following command : `yarn && yarn build && pm2 restart all`


---

### Post Deployment

 - [ ] Fire up the LMS 🚀 
 - [ ] Text them on WhatsApp that it is done

---



