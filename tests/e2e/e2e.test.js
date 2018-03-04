module.exports = {
    'test that exactly one root SVG is created': function (browser) {
        browser.url('http://localhost:3000/').pause(1000);
        browser.expect.element('body').to.be.present.before(1000);
        browser.expect.element('#sliderRootSVG').to.be.a('svg');
        browser.expect.element('#slider > #sliderRootSVG:nth-of-type(2)').to.not.be.present;
    },

    'test that legend is displayed for all 5 sliders': function (browser) {
        browser.expect.element('#legend').to.be.present;

        browser.expect.element('#transportation .title').text.to.contain('Transport');
        browser.expect.element("#transportation #purple").to.be.present;

        browser.expect.element('#food .title').text.to.contain('Food');
        browser.expect.element("#food #blue").to.be.present;

        browser.expect.element('#insurance .title').text.to.contain('Insurance');
        browser.expect.element("#insurance #green").to.be.present;

        browser.expect.element('#entertainment .title').text.to.contain('Entertainment');
        browser.expect.element("#entertainment #orange").to.be.present;

        browser.expect.element('#health-care .title').text.to.contain('Health care');
        browser.expect.element("#health-care #red").to.be.present;
    },

    'test that 5 sliders is composed of 20 svg circles': function(browser) {
        browser.expect.element('#sliderRootSVG > circle:nth-of-type(20)').to.be.present;
        browser.expect.element('#sliderRootSVG > circle:nth-of-type(21)').to.not.be.present;
    },

    'test that sliders are initialized to correct values': function (browser) {
        // only checking for a rounded value is enough
        browser.pause(1000);
        browser.expect.element('#handleslider180').to.have.attribute('style').which.contains('rotate(179.9');
        browser.expect.element('#handleslider150').to.have.attribute('style').which.contains('rotate(288');
        browser.expect.element('#handleslider120').to.have.attribute('style').which.contains('rotate(275');
        browser.expect.element('#handleslider90').to.have.attribute('style').which.contains('rotate(216');
        browser.expect.element('#handleslider60').to.have.attribute('style').which.contains('rotate(89');
    },
    
    'test that sliders callback sent correct values': function (browser) {
        browser.expect.element('#transportation .amount').text.to.contain('$500');
        browser.expect.element('#food .amount').text.to.contain('$18');
        browser.expect.element('#insurance .amount').text.to.contain('$7000');
        browser.expect.element('#entertainment .amount').text.to.contain('$20');
        browser.expect.element('#health-care .amount').text.to.contain('$1');
        
    },
    
    'test that slider can be moved to next position and that value is changed as well': function(browser) {
        browser.expect.element('#handleslider120').to.have.attribute('style').which.contains('rotate(275');
        browser.moveToElement('circle', 520, 300).mouseButtonClick(0);
        browser.pause(3000);
        browser.expect.element('#handleslider120').to.have.attribute('style').which.contains('rotate(84');
        browser.expect.element('#insurance .amount').text.to.contain('$2500');
    },
    
    'test that slider is not moved if clicking the same step': function(browser) {
        browser.expect.element('#handleslider180').to.have.attribute('style').which.contains('rotate(179.9');
        // move to top position
        browser.moveToElement('circle', 70, 100).mouseButtonClick(0);
        browser.pause(3000);
        // make sure position has been changed
        browser.expect.element('#handleslider180').to.have.attribute('style').which.contains('rotate(359');
        // click again to move to the same step but different position
        browser.moveToElement('circle', 80, 80).mouseButtonClick(0);
        browser.pause(3000);
        // make sure position is still the same
        browser.expect.element('#handleslider180').to.have.attribute('style').which.contains('rotate(359');
        browser.expect.element('#transportation .amount').text.to.contain('$1000');
        browser.end();
    }
};
