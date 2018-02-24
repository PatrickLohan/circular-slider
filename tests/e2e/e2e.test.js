module.exports = {
  'step one' : function (browser) {
    browser
      .url('http://localhost:3000/')
      .waitForElementVisible('body', 1000)
        
      .end();
  },

  // 'step two' : function (browser) {
  //   browser
  //     .click('button[name=btnG]')
  //     .pause(1000)
  //     .assert.containsText('#main', 'Night Watch')
  //     .end();
  // }
};
