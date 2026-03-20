import { test, expect } from '@playwright/test';

import { App } from '../src/pages/app.page';

import { UserBuilder } from '../src/helpers/builders/index';


test.only('Пользователь может зарегистрироваться используя email и пароль page object', async ({ page }) => {
//arrange
    const app = new App(page);

    const user = new UserBuilder().withEmail().withPassword().withUsername().build(); 
    await app.main.open();

    //act 
    await app.main.gotoRegister();
    await app.register.signup(user);
    
    //assert
    await expect(app.yourfeed.profileName).toContainText(user.username);
    await expect(app.yourfeed.getProfileName()).toContainText(user.username);

});
